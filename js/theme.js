// === theme.js — Theme-Steuerung (Default: Light Mode) ===

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('theme-toggle');

  // --- Gespeichertes Theme laden ---

  chrome.storage.local.get(['theme'], function (data) {
    if (data.theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  });

  // --- Theme umschalten ---

  toggleBtn.onclick = function () {
    const isDark = document.body.classList.toggle('dark-mode');
    const selectedTheme = isDark ? 'dark' : 'light';
    chrome.storage.local.set({ theme: selectedTheme });
  };
});
