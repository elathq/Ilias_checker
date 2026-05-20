// === render.js — DOM-Rendering ===

// --- Deadline-Karte erstellen ---

function createDeadlineCard(name, dateString, countdownLabel, colorClass) {
  const item = document.createElement('div');
  item.className = 'deadline-item';
  item.style.textAlign = 'center';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'course-name';
  nameDiv.style.fontStyle = 'italic';
  nameDiv.textContent = name;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.textContent = dateString;

  const countdownDiv = document.createElement('div');
  countdownDiv.className = colorClass;
  countdownDiv.style.fontSize = '13px';
  countdownDiv.style.fontWeight = 'bold';
  countdownDiv.textContent = "(" + countdownLabel + ")";

  item.appendChild(nameDiv);
  item.appendChild(dateDiv);
  item.appendChild(countdownDiv);
  return item;
}

// --- Fehler-Karte erstellen (Login abgelaufen) ---

function createErrorCard(name, url) {
  const item = document.createElement('div');
  item.className = 'deadline-item';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'course-name';
  nameDiv.textContent = name;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.style.fontSize = '14px';

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.style.color = '#d73a49';
  link.textContent = 'LOGIN ERNEUERN';

  dateDiv.appendChild(link);
  item.appendChild(nameDiv);
  item.appendChild(dateDiv);
  return item;
}

// --- Farb-Klasse basierend auf Restzeit ermitteln ---

function getColorClass(hoursLeft) {
  if (hoursLeft <= 24) {
    return "time-red";
  }
  if (hoursLeft <= 72) {
    return "time-orange";
  }
  return "time-green";
}
