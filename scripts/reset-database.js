const {Pool}=require('pg')

if(process.env.CONFIRM_RESET!=='BUYFINIX_RESET_ALL') throw new Error('Set CONFIRM_RESET=BUYFINIX_RESET_ALL to erase the BuyFinix database')
if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false})

async function main(){
  await pool.query('DROP TABLE IF EXISTS orders, customers, products, categories, admins CASCADE')
  console.log('BuyFinix database reset complete. Run npm run db:init next.')
}

main().finally(()=>pool.end())
