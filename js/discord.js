// === js/discord.js ===
// Webhook & Discord Logik

function sendToDiscord(webhookUrl, allModulesReport, buttonElement) {
  let listMarkdown = "";
  
  allModulesReport.forEach(item => {
    // \u200B ist ein unsichtbares Zeichen. 
    // Es zwingt Discord dazu, den doppelten Zeilenumbruch wirklich anzuzeigen
    listMarkdown += `## ${item.name}\n### ❗ ${item.deadline}\n\n\u200B\n`;
  });

  const payload = {
    embeds: [{
      title: "🚀 Ilias-Fristen-Übersicht",
      description: "Die Fristen deiner Abgaben sind:\n\n" + listMarkdown,
      color: 5763719,
      footer: { text: "ILIAS Checker Automatisierung" },
      timestamp: new Date().toISOString() 
    }]
  };

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(response => {
    if (response.ok) {
      buttonElement.innerText = "✅ Gesendet!";
      buttonElement.style.backgroundColor = "#27ae60";
    } else {
      buttonElement.innerText = "❌ Fehler";
      buttonElement.style.backgroundColor = "#d73a49";
    }
    setTimeout(() => {
      buttonElement.innerText = "Übersicht an Discord senden";
      buttonElement.style.backgroundColor = "#5865F2";
    }, 3000);
  }).catch(error => {
    console.error("Discord Fehler:", error);
    buttonElement.innerText = "❌ Fehler";
    setTimeout(() => {
      buttonElement.innerText = "Übersicht an Discord senden";
      buttonElement.style.backgroundColor = "#5865F2";
    }, 3000);
  });
}