// === discord.js — Webhook & Discord Logik ===

async function sendToDiscord(webhookUrl, allModulesReport, buttonElement) {

  // --- Nachricht aufbauen ---

  let listMarkdown = "";
  allModulesReport.forEach(function (item) {
    listMarkdown += "### 📘 " + item.name + "\n**Frist:** " + item.deadline + "\n";
  });

  const payload = {
    embeds: [{
      title: "🚀 Übersicht der nächsten Abgaben",
      description: "Hier ist der aktuelle Stand deiner ILIAS-Module:\n\n" + listMarkdown,
      color: 34174,
      footer: { text: "ILIAS Deadline Checker" },
      timestamp: new Date().toISOString()
    }]
  };

  // --- Senden ---

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      buttonElement.innerText = "✅ Gesendet!";
      buttonElement.style.backgroundColor = "#34c759";
    } else {
      buttonElement.innerText = "❌ Fehler beim Senden";
      buttonElement.style.backgroundColor = "#ff3b30";
    }
  } catch (error) {
    console.error("Discord Fehler:", error);
    buttonElement.innerText = "❌ Fehler beim Senden";
    buttonElement.style.backgroundColor = "#ff3b30";
  }

  // --- Button zurücksetzen ---

  setTimeout(function () {
    buttonElement.innerText = "Übersicht an Discord senden";
    buttonElement.style.backgroundColor = "#5865F2";
  }, 3000);
}