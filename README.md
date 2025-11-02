function initCode() {
  const codeRef = ref(db, "currentCode");

  onValue(codeRef, snapshot => {
    const data = snapshot.val();
    if (data && data.code) {
      correctCode = data.code;
      document.querySelector(".sticky-note").innerText = `today's code: ${correctCode}`;
    } else {
      // No code exists yet — generate one
      setNewCode();
    }
  });
}
