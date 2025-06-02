# Facebook Lite Demo

This is a simplified demo of a Facebook-like login page and a data viewer, built with React, Vite, Tailwind CSS, and Firebase.

**Features:**

* **Login Page:** A basic login form (email/password) that simulates a successful login.
* **Data Storage (Firebase Firestore):** User-submitted login credentials (for demo purposes only, highly insecure for real apps) and general text inputs are saved to a Firebase Firestore database.
* **Data Viewer:** A separate page to view all submitted data.
* **Viewer Password:** Access to the data viewer is protected by a simple hardcoded password.
* **Firebase Authentication:** Uses Firebase Anonymous Authentication for simplicity, allowing users to submit data without explicit sign-up.
* **Responsive Design:** Built with Tailwind CSS for a mobile-first approach.

## Setup and Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/facebook-lite-demo.git](https://github.com/YOUR_USERNAME/facebook-lite-demo.git)
    cd facebook-lite-demo
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a Firebase Project:**
    * Go to [Firebase Console](https://console.firebase.google.com/).
    * Create a new project.
    * Add a Web App to your project and copy your Firebase configuration (apiKey, authDomain, projectId, etc.).
4.  **Update `src/App.jsx`:**
    * Open `src/App.jsx`.
    * Replace `YOUR_FIREBASE_CONFIG` with your actual Firebase configuration.
    * Ensure the `appId` variable is `const appId = "my-facebook-lite-demo-data";` for consistent data storage/retrieval.
5.  **Set up Firestore Security Rules:**
    * In Firebase Console, go to `Firestore Database` > `Rules` tab.
    * Set the rules to allow read/write for authenticated users (as provided in the `App.jsx` comments or detailed setup guide).
    * **Publish** the rules.
6.  **Run the development server:**
    ```bash
    npm run dev
    ```
7.  Open your browser to `http://localhost:5173` (or the URL provided in your terminal).

## How to use the Demo

1.  **Login Page:**
    * Enter any email/password (e.g., `test@example.com`, `12345`).
    * Click "Log in". You'll see a "Login successful!" message. The credentials are saved to Firestore.
2.  **Accessing the Data Viewer:**
    * On the login page, click on "English (US)" at the top.
    * From the language modal, select "Español". This will navigate you to the data viewer page.
    * Enter the password `ILOVEORIONEX` in the input field and click "জমা দিন" (Submit).
3.  **Submitting General Input (from Viewer Page):**
    * Once in the viewer, you can type any text in the "এখানে আপনার ইনপুট লিখুন" (Enter your input here) textarea and click "জমা দিন" (Submit). This text will also be saved to Firestore.
4.  **Viewing Data:** Both login attempts and general inputs will be displayed below the input submission form.

## Important Security Note (for Demo Purposes)

This project stores login passwords in plain text in Firestore. **This is highly insecure and is done purely for demonstration purposes to fulfill the explicit request.** In a real-world application, you should **NEVER** store sensitive information like passwords directly. Always use Firebase Authentication's built-in methods or a secure backend system with proper hashing and encryption.
