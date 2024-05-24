import 'dotenv/config' // Pulls keys and values defined in your `.env` file into into `process.env`
/**
 * Express OpenID Connect(OIDC) library provides auth router to attach authentication routes express.
 * Router configs:
 * baseURL - The URL where the application is served
 * secret - A long, random string
 * issuerBaseURL - The Domain as a secure URL found in your Application settings
 * clientID - The Client ID found in your Application settings
**/
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000/', //process.env.BASEURL is not work
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL
};

export default config;