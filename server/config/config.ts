import 'dotenv/config'
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost')  + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/greenorangesquare',
  stripe_connect_test_client_id: process.env.STRIPE_TEST_CLIENT_ID || 'YOUR_stripe_connect_test_client',
  stripe_test_secret_key: process.env.SECRET || 'YOUR_stripe_test_secret_key',
  stripe_test_api_key: process.env.STRIPE_TEST_API_KEY || 'YOUR_stripe_test_api_key',
  admin: process.env.ADMINISTRATOR_EMAIL || 'YOUR_admin_email_address',
  serverUrl: process.env.serverUrl || 'http://localhost:3000'
}
export default config
