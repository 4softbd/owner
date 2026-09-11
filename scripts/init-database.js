const fs=require('fs')
const path=require('path')
const bcrypt=require('bcryptjs')
const {Pool}=require('pg')

if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false})
const slug=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

async function main(){
  await pool.query(fs.readFileSync(path.join(__dirname,'../db/schema.sql'),'utf8'))
  const categories=[
    ['Streaming','Netflix, Prime Video, HBO Max and Disney+',1],['Music','Spotify Premium',2],
    ['AI Tools','ChatGPT and Claude',3],['Adobe','Adobe Creative Cloud products',4],
    ['VPN','Premium VPN services',5],['Gift Cards','Apple and Steam gift cards',6],
    ['Games','Steam and Epic Games titles',7],['Game Top-Ups','Mobile and PC game currency',8]
  ]
  for(const [name,description,sort] of categories) await pool.query('INSERT INTO categories(name,slug,description,sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(slug) DO NOTHING',[name,slug(name),description,sort])
  const products=[
    ['Streaming','Netflix Premium',399,'Digital'],['Music','Spotify Premium',199,'Digital'],
    ['Streaming','Amazon Prime Video',249,'Digital'],['Streaming','HBO Max',299,'Digital'],
    ['Streaming','Disney+ Premium',299,'Digital'],['AI Tools','ChatGPT Plus',1499,'Digital'],
    ['AI Tools','Claude Pro',1599,'Digital'],['Adobe','Adobe Creative Cloud',949,'PC Software'],
    ['VPN','Premium VPN',349,'Digital'],['Gift Cards','Apple Gift Card',1190,'Apple'],
    ['Gift Cards','Steam Wallet Code',620,'Steam'],['Game Top-Ups','PUBG Mobile UC',110,'Mobile']
  ]
  let sort=1
  for(const [category,name,price,platform] of products) await pool.query(`INSERT INTO products(category_id,name,slug,description,platform,plans,featured,best_seller,sort_order)
    SELECT id,$1,$2,$3,$4,$5::jsonb,$6,$7,$8 FROM categories WHERE name=$9 ON CONFLICT(slug) DO NOTHING`,[name,slug(name),`${name} with verified access and BuyFinix support.`,platform,JSON.stringify([{label:'Standard',price}]),sort<=6,sort<=4,sort++,category])
  if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD){
    const hash=await bcrypt.hash(process.env.ADMIN_PASSWORD,12)
    await pool.query('INSERT INTO admins(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash',[process.env.ADMIN_EMAIL.toLowerCase(),hash])
  }
  console.log('BuyFinix database initialized')
}

main().finally(()=>pool.end())
