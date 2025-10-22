# Real-Time Audio Spectrum Analyzer & Pitch Detector

This is a "buildless" web application that performs real-time audio analysis directly in the browser. It uses the Web Audio API to capture microphone input, visualizes the frequency spectrum on an HTML Canvas, and implements the **Harmonic Product Spectrum (HPS)** algorithm for robust musical pitch detection.

This project is built with a modular, scalable architecture, separating the UI, application logic, and core DSP (Digital Signal Processing) utilities.

## 🚀 Live Demo

**(https://swarsaga.netlify.app/)**

## ✨ Features

* **Real-Time Spectrum Analyzer:** A smooth, live visualization of the audio frequency spectrum.
* **Accurate Pitch Detection:** Uses the Harmonic Product Spectrum (HPS) algorithm, which is more robust against noise and overtones than simple peak detection.
* **Musical Note Display:** Converts the detected frequency into the closest musical note (e.g., `C#4`).
* **Precision Tuner:** Shows tuning deviation in "cents" (e.g., `-10.5` cents flat or `+8.2` cents sharp) with color-coded feedback (Red/Flat, Yellow/Sharp, Green/In-Tune).
* **Secure & Serverless:** Uses Firebase for anonymous user authentication.
* **Zero Dependencies:** A "buildless" project that requires no `npm install` or build step.

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
* **Core Audio:** Web Audio API (`AudioContext`, `AnalyserNode`)
* **Styling:** Tailwind CSS (via CDN)
* **Backend:** Firebase (for Anonymous Authentication)
* **Algorithm:** Harmonic Product Spectrum (HPS) for pitch detection.

## ⚙️ How to Set Up & Configure

To run this project, you must connect it to your own Firebase project for authentication.

### 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Register a new **Web App** (click the `</>` icon).
4.  Give it a nickname (e.g., "Audio Analyzer") and register the app.
5.  Firebase will show you a `firebaseConfig` object. **Copy this object.**

### 2. Add Credentials to Your Code

1.  Open the `firebase-config.js` file.
2.  Paste your `firebaseConfig` object, replacing the placeholder values:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

### 3. Enable Anonymous Authentication

1.  In your Firebase project dashboard, go to **Authentication**.
2.  Click the **Sign-in method** tab.
3.  Find **"Anonymous"** in the list, click it, and **Enable** it.

## 🚀 How to Deploy

This project is a static site and can be deployed for free in seconds.

### 1. Deploy Your Site

You can use any static site host. The easiest are:

* **GitHub Pages:**
    1.  Go to your repo's **Settings > Pages**.
    2.  Deploy from the `main` branch and the `/ (root)` folder.
* **Netlify:**
    1.  Sign up with your GitHub account.
    2.  Import your repository.
    3.  Click "Deploy". (Leave all build settings blank).

### 2. Authorize Your Live Domain in Firebase

**THIS STEP IS CRITICAL. Your app will not work until you do this.**

1.  Go back to your Firebase project's **Authentication** section.
2.  Click the **Settings** tab.
3.  Go to the **"Authorized domains"** list.
4.  Click **"Add domain"**.
5.  Add the domain of your live site (e.g., `your-username.github.io` or `your-app-name.netlify.app`).

## 📋 How to Use the App

1.  Open your live website URL.
2.  Click the **"Start Analysis"** button.
3.  Your browser will ask for **microphone permission**. Click **"Allow"**.
4.  Sing, hum, or play an instrument into your microphone.
5.  Watch the analyzer display the live spectrum, detected note, and tuning information.
6.  Click **"Stop Analysis"** to turn off the microphone.

## 📁 Project Structure

/
├── 📄 index.html
│   └── The main HTML structure, UI elements, and script links.
├── 🎨 styles.css
│   └── Custom styles that complement Tailwind CSS.
├── 🚀 app.js
│   └── The main application "brain." Handles DOM, event listeners,
│       and the Web Audio API setup. Manages the animation loop.
├── 🎵 audio-utils.js
│   └── All core DSP logic. Contains the pure functions for pitch
│       detection (HPS), frequency-to-note conversion, and canvas drawing.
└── 🔥 firebase-config.js
└── Handles Firebase initialization and anonymous authentication.
