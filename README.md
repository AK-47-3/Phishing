# Facebook Lite Demo

This is a simple Facebook Lite-like login page demonstration, built with React and Tailwind CSS, and uses Firebase Firestore to store user inputs for demonstration purposes.

## Features:
-   Basic login page UI
-   Simulated login (any credentials work)
-   Stores entered credentials in Firebase Firestore (🚨 for demo only, not secure for production!)
-   A separate "viewer" page to see all stored inputs (requires a secret password)
-   Anonymous Firebase Authentication for data access.

## Setup:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/facebook-lite-demo.git](https://github.com/your-username/facebook-lite-demo.git)
    cd facebook-lite-demo
    ```
    (If you are directly uploading, skip this step and upload the files to your GitHub repo)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Firebase Configuration:**
    Ensure your Firebase project is set up and configured correctly in `src/App.jsx`.
    -   Firestore Database must be created and enabled.
    -   Firestore Security Rules must allow `read, write` for authenticated users (e.g., `allow read, write: if request.auth != null;`).

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    This will start the development server, usually at `http://localhost:5173`.

## Firebase Firestore Data Structure:

Data is stored in Firestore under the path:
`artifacts/{appId}/public/data/userInputs/{documentId}`

Where `{appId}` is `"my-facebook-lite-demo-data"` as defined in `src/App.jsx`.

## Viewer Page Access:

To access the viewer page and see stored inputs, click on "English (US)" on the login page and select "Español".
On the viewer page, enter the password: `ILOVEORIONEX` to view the stored data.

## Security Warning:

**THIS DEMO STORES PASSWORDS IN PLAIN TEXT IN FIRESTORE.**
**DO NOT USE THIS CODE IN A REAL PRODUCTION ENVIRONMENT.**
In a real application, passwords should always be hashed and never stored directly. Proper authentication and authorization mechanisms should be implemented.