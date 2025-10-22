// NOTE: Replace with your actual Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// This is a placeholder configuration.
// For a real application, you would get this from your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyCL_F0xgZz24pF1OmHrlhBFPXM95c8MyrE",
  authDomain: "swar-bd897.firebaseapp.com",
  projectId: "swar-bd897",
  storageBucket: "swar-bd897.firebasestorage.app",
  messagingSenderId: "415460007089",
  appId: "1:415460007089:web:f66b2473cb9f2d1acf5690",
  measurementId: "G-WV1NRCDMCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle anonymous authentication
const signIn = async () => {
    try {
        await signInAnonymously(auth);
    } catch (error) {
        console.error("Anonymous sign-in failed:", error);
        // Handle error, maybe show a message to the user
    }
};

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in anonymously.
        console.log("User signed in with UID:", user.uid);
    } else {
        // User is signed out.
        console.log("User is signed out.");
    }
});


// Automatically sign in when the module loads
signIn();

export { app, auth };

