import firebase from 'firebase/app';
import 'firebase/auth'; // for authentication
import 'firebase/storage'; // for storage
import 'firebase/database'; // for realtime database
import 'firebase/firestore'; // for cloud firestore
const firebaseConfig = {
apiKey: process.env.API_KEY,
authDomain: process.env.AUTH_DOMAIN,
projectId: process.env.PROJECT_ID,
storageBucket: process.env.STORAGE_BUCKET,
messagingSenderId: process.env.MESSAGING_SENDER_ID,
appId: process.env.APP_ID
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const google_Auth_provider = new firebase.auth.GoogleAuthProvider()
export { auth, google_Auth_provider }
export default db
