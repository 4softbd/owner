const path=require('path')
const fs=require('fs')
const express=require('express')
const helmet=require('helmet')
const session=require('express-session')
const PgStore=require('connect-pg-simple')(session)
const bcrypt=require('bcryptjs')
const {Pool}=require('pg')

if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
const app=express()
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false})
const query=(text,params=[])=>pool.query(text,params)
const port=Number(process.env.PORT||3000)
const dist=path.join(__dirname,'dist')

app.set('trust proxy',1)
app.use(helmet({contentSecurityPolicy:false}))
app.use(express.json({limit:'1mb'}))
app.use(session({
  name:'buyfinix.sid',secret:process.env.SESSION_SECRET||'change-this-secret',resave:false,saveUninitialized:false,
  store:new PgStore({pool,createTableIfMissing:true}),cookie:{httpOnly:true,sameSite:'lax',secure:'auto',maxAge:1000*60*60*12}
}))

const customerOnly=(req,res,next)=>req.session.customerId?next():res.status(401).json({error:'Customer login required'})
const adminOnly=(req,res,next)=>req.session.adminId?next():res.status(401).json({error:'Admin login required'})
const cleanPhone=value=>String(value||'').replace(/\D/g,'').replace(/^88(?=01)/,'')

app.get('/api/health',async(_req,res)=>{await query('SELECT 1');res.json({ok:true})})
app.get('/api/categories',async(_req,res)=>res.json((await query('SELECT id,name,slug,description FROM categories WHERE active=true ORDER BY sort_order,name')).rows))
app.get('/api/products',async(_req,res)=>res.json((await query(`SELECT p.*,c.name category_name,c.slug category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.active=true ORDER BY p.sort_order,p.id`)).rows))
app.get('/api/products/:slug',async(req,res)=>{const row=(await query(`SELECT p.*,c.name category_name,c.slug category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.slug=$1 AND p.active=true`,[req.params.slug])).rows[0];row?res.json(row):res.status(404).json({error:'Product not found'})})

app.post('/api/customer/register',async(req,res)=>{try{const {name,email,password}=req.body,phone=cleanPhone(req.body.phone);if(!name||phone.length<11||String(password||'').length<8)throw Error('Name, valid phone and 8+ character password are required');const hash=await bcrypt.hash(password,12);const row=(await query('INSERT INTO customers(name,phone,email,password_hash) VALUES($1,$2,$3,$4) RETURNING id,name,phone,email',[name.trim(),phone,email?.trim().toLowerCase()||null,hash])).rows[0];req.session.customerId=row.id;res.status(201).json({customer:row})}catch(error){res.status(400).json({error:error.code==='23505'?'Phone or email already registered':error.message})}})
app.post('/api/customer/login',async(req,res)=>{const phone=cleanPhone(req.body.phone),row=(await query('SELECT * FROM customers WHERE phone=$1 AND active=true',[phone])).rows[0];if(!row||!await bcrypt.compare(String(req.body.password||''),row.password_hash))return res.status(401).json({error:'Invalid phone or password'});req.session.customerId=row.id;res.json({customer:{id:row.id,name:row.name,phone:row.phone,email:row.email}})})
app.post('/api/customer/logout',(req,res)=>req.session.destroy(()=>res.json({ok:true})))
app.get('/api/customer/me',customerOnly,async(req,res)=>res.json((await query('SELECT id,name,phone,email FROM customers WHERE id=$1',[req.session.customerId])).rows[0]))
app.get('/api/customer/orders',customerOnly,async(req,res)=>res.json((await query('SELECT * FROM orders WHERE customer_id=$1 ORDER BY created_at DESC',[req.session.customerId])).rows))

app.post('/api/orders',async(req,res)=>{try{const {customer_name,email,items,payment_method,transaction_id,notes}=req.body,phone=cleanPhone(req.body.phone);if(!customer_name||phone.length<11||!Array.isArray(items)||!items.length)throw Error('Customer, phone and order items are required');let subtotal=0,verified=[];for(const item of items){const product=(await query('SELECT id,name,slug,plans,in_stock FROM products WHERE id=$1 AND active=true',[item.product_id])).rows[0];if(!product||!product.in_stock)throw Error('A selected product is unavailable');const plan=product.plans.find(value=>String(value.label)===String(item.plan))||product.plans[0];if(!plan)throw Error('A selected plan is unavailable');const qty=Math.max(1,Math.min(10,Number(item.qty)||1)),price=Number(plan.price);subtotal+=price*qty;verified.push({product_id:product.id,name:product.name,slug:product.slug,plan:plan.label,price,qty})}const orderNo=`BF${Date.now().toString().slice(-10)}`;const row=(await query(`INSERT INTO orders(order_no,customer_id,customer_name,phone,email,items,subtotal,total,payment_method,transaction_id,notes) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$7,$8,$9,$10) RETURNING *`,[orderNo,req.session.customerId||null,customer_name.trim(),phone,email?.trim()||null,JSON.stringify(verified),subtotal,payment_method||'manual',transaction_id||'',notes||''])).rows[0];res.status(201).json(row)}catch(error){res.status(400).json({error:error.message})}})

app.post('/api/admin/login',async(req,res)=>{const row=(await query('SELECT * FROM admins WHERE email=$1',[String(req.body.email||'').toLowerCase()])).rows[0];if(!row||!await bcrypt.compare(String(req.body.password||''),row.password_hash))return res.status(401).json({error:'Invalid admin login'});req.session.adminId=row.id;res.json({ok:true})})
app.get('/api/admin/dashboard',adminOnly,async(_req,res)=>{const [products,orders,customers,revenue]=await Promise.all([query('SELECT COUNT(*) count FROM products'),query('SELECT COUNT(*) count FROM orders'),query('SELECT COUNT(*) count FROM customers'),query("SELECT COALESCE(SUM(total),0) total FROM orders WHERE payment_status='paid'")]);res.json({products:+products.rows[0].count,orders:+orders.rows[0].count,customers:+customers.rows[0].count,revenue:+revenue.rows[0].total})})
app.get('/api/admin/orders',adminOnly,async(_req,res)=>res.json((await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500')).rows))
app.patch('/api/admin/orders/:id',adminOnly,async(req,res)=>res.json((await query('UPDATE orders SET status=COALESCE($1,status),payment_status=COALESCE($2,payment_status),notes=COALESCE($3,notes),updated_at=NOW() WHERE id=$4 RETURNING *',[req.body.status||null,req.body.payment_status||null,req.body.notes??null,req.params.id])).rows[0]))

app.use(express.static(dist,{index:false,maxAge:process.env.NODE_ENV==='production'?'1d':0}))
app.use((req,res)=>{const file=path.join(dist,'index.html');fs.existsSync(file)?res.sendFile(file):res.status(503).send('Build missing. Run npm run build.')})
app.use((error,_req,res,_next)=>{console.error(error);res.status(500).json({error:'Unexpected server error'})})

app.listen(port,'0.0.0.0',()=>console.log(`BuyFinix v2 running on ${port}`))
