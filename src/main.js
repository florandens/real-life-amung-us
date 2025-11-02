import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyB53VMFobs85t3RDhuUbSu-cuMa1WfLU1I",
  authDomain: "amongus-keypad.firebaseapp.com",
  projectId: "amongus-keypad",
  storageBucket: "amongus-keypad.firebasestorage.app",
  messagingSenderId: "423442843433",
  appId: "1:423442843433:web:6ad65f08602f11d75ed938",
  measurementId: "G-MMWG4R9TTC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentCode = "";
let correctCode = "";

// Generate a random 5-digit code
function generateCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Set new code in Firebase
function setNewCode() {
  correctCode = generateCode();
  set(ref(db, "currentCode"), { code: correctCode });
}

// Submit user input
window.submitCode = function () {
  if (currentCode === correctCode) {
    const result = computeResult(currentCode);
    set(ref(db, "adminCode"), { code: currentCode, result });
    alert(`✅ Correct! Result: ${result}`);
    setNewCode(); // Generate and sync new code
    clearDisplay();
  } else {
    alert("❌ Wrong code!");
    clearDisplay();
  }
};

// Display logic
window.press = function (num) {
  currentCode += num;
  document.getElementById("display").innerText = currentCode;
};

window.clearDisplay = function () {
  currentCode = "";
  document.getElementById("display").innerText = "";
};

// Simple result logic (sum of digits)
function computeResult(code) {
  return code.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Listen for current code updates
onValue(ref(db, "currentCode"), snapshot => {
  const data = snapshot.val();
  if (data) {
    correctCode = data.code;
    document.querySelector(".sticky-note").innerText = `today's code: ${correctCode}`;
  }
});

// Initialize code if none exists
onValue(ref(db, "currentCode"), snapshot => {
  if (!snapshot.exists()) {
    setNewCode();
  }
});