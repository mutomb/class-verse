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
  stripe_test_secret_key: process.env.STRIPE_SECRET || 'YOUR_stripe_test_mode_secret_key', //On the server side: Must be secret and stored securely (such as in an environment variable or credential management system) to call Stripe APIs. Don’t expose or embed it in application.
  stripe_test_api_key: process.env.STRIPE_TEST_PUBLISHABLE || 'YOUR_stripe_test_mode_publishable_key', //On the client side: Can be publicly accessible in your web or mobile app’s client-side code (such as checkout.js) to securely collect payment information, such as with Stripe Elements. By default, Stripe Checkout securely collects payment information.
  admin: process.env.ADMINISTRATOR_EMAIL || 'YOUR_admin_email_address',
  serverUrl: process.env.BASEURL || 'http://localhost:3000'
}
export default config
