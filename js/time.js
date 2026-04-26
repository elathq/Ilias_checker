// === js/time.js ===
// Zeit- und Datumsfunktionen

async function getNetworkTime() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/Berlin');
    const data = await response.json();
    return new Date(data.datetime);
  } catch (error) {
    return new Date();
  }
}

function createAbsoluteDate(deadlineText, now) {
  if (!deadlineText || deadlineText.includes("Keine Frist")) {
    return null;
  }
  const text = deadlineText.toLowerCase();

  const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
  let hours = 23;
  let minutes = 59;
  
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
  }

  if (text.includes("heute")) {
    let target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    return target;
  }
  if (text.includes("morgen")) {
    let target = new Date(now);
    target.setDate(target.getDate() + 1);
    target.setHours(hours, minutes, 0, 0);
    return target;
  }

  const dateMatch = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
  if (dateMatch) {
    let year = parseInt(dateMatch[3], 10);
    if (year < 100) year += 2000;
    return new Date(year, parseInt(dateMatch[2], 10) - 1, parseInt(dateMatch[1], 10), hours, minutes, 0, 0);
  }

  const months = ["jan", "feb", "mär", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "dez"];
  for (let i = 0; i < months.length; i++) {
    if (text.includes(months[i])) {
      const dayMatch = text.match(/(\d{1,2})\./);
      const yearMatch = text.match(/\d{4}/);
      if (dayMatch && yearMatch) {
        return new Date(parseInt(yearMatch[0], 10), i, parseInt(dayMatch[1], 10), hours, minutes, 0, 0);
      }
    }
  }

  let totalMs = 0;
  let isFound = false;
  const rules = [
    { regex: /(\d+)\s*woch/g, ms: 604800000 },
    { regex: /(\d+)\s*tag/g,  ms: 86400000 },
    { regex: /(\d+)\s*stund/g, ms: 3600000 },
    { regex: /(\d+)\s*minut/g, ms: 60000 }
  ];
  
  rules.forEach(rule => {
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
      totalMs = totalMs + (parseInt(match[1], 10) * rule.ms);
      isFound = true;
    }
  });

  if (isFound) return new Date(now.getTime() + totalMs);
  return null;
}

function createCountdownText(targetDate, now) {
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return "Frist abgelaufen";
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  let timeParts = [];
  if (days > 0) timeParts.push(days + " tag(e)");
  if (hours > 0) timeParts.push(hours + " std");
  timeParts.push(minutes + " min");
  
  return "noch " + timeParts.join(", ");
}