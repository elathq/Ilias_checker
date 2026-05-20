// === storage.js — Deadline-Speicher ===

// --- Gespeicherte Deadlines laden ---

function loadStoredDeadlines(callback) {
  chrome.storage.local.get(['storedDeadlines'], function (data) {
    const deadlines = data.storedDeadlines ? data.storedDeadlines : {};
    callback(deadlines);
  });
}

// --- Einzelne Deadline speichern ---

function saveDeadline(storedDeadlines, url, name, deadlineDate) {
  storedDeadlines[url] = {
    name: name,
    deadline: deadlineDate.toISOString()
  };
}

// --- Alle Deadlines auf einmal in den Speicher schreiben ---

function persistDeadlines(storedDeadlines) {
  chrome.storage.local.set({ storedDeadlines: storedDeadlines });
}

// --- Prüfen ob eine Deadline abgelaufen ist ---

function isDeadlineExpired(storedDeadline, now) {
  if (!storedDeadline || !storedDeadline.deadline) {
    return true;
  }
  
  const deadlineDate = new Date(storedDeadline.deadline);
  
  // Reiner Datumsvergleich auf Tagesbasis (Stunden/Minuten/Sekunden werden genullt)
  const dDate = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  const nDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Der Cache läuft erst ab, wenn der Abgabetag kalendarisch in der Vergangenheit liegt (gestern oder früher)
  return dDate < nDate;
}

// --- Alle gespeicherten Deadlines löschen ---

function clearStoredDeadlines() {
  chrome.storage.local.remove('storedDeadlines');
}
