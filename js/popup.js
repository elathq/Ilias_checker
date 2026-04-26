// === js/popup.js ===
// Hauptsteuerung & Anzeige

document.addEventListener('DOMContentLoaded', async function() {
  // Einstellungen initialisieren
  initSettings();

  const listContainer = document.getElementById('deadline-list');
  const sendDiscordBtn = document.getElementById('btn-send-discord');
  const networkNow = await getNetworkTime();

  // Globale Variablen für den manuellen Versand
  let currentReportData = [];
  let currentWebhookUrl = "";

  chrome.storage.local.get(['iliasModules', 'discordWebhook'], async function(data) {
    const modules = data.iliasModules || [];
    currentWebhookUrl = data.discordWebhook;

    if (modules.length === 0) {
      listContainer.innerHTML = "Keine Module konfiguriert.";
      return;
    }

    listContainer.innerHTML = "Synchronisiere..."; 
    let htmlContent = ""; 

    for (const module of modules) {
      let targetDate = null; 

      // Datum beschaffen (Manuell oder Scraper)
      if (module.isManual && module.manualDate) {
        targetDate = new Date(module.manualDate);
      } else if (!module.isManual && module.url) {
        const result = await scrapeIliasModule(module.url);
        if (result.error) {
          htmlContent += `<div class="deadline-item"><div class="course-name">${module.name}</div><div class="date" style="font-size:14px;"><a href="${module.url}" target="_blank" style="color:#d73a49;">LOGIN ERNEUERN</a></div></div>`;
          continue; 
        }
        targetDate = createAbsoluteDate(result.deadline, networkNow);
      }

      let dateString = "Keine Frist aktiv";
      let countdownLabel = "-";
      let colorClass = "time-green";

      if (targetDate) {
        dateString = targetDate.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        countdownLabel = createCountdownText(targetDate, networkNow);
        
        const hoursLeft = (targetDate - networkNow) / 3600000;
        if (hoursLeft <= 24) {
          colorClass = "time-red";
        } else if (hoursLeft <= 72) {
          colorClass = "time-orange";
        } else {
          colorClass = "time-green";
        }
      }

      // Für den manuellen Report speichern
      currentReportData.push({ name: module.name, deadline: dateString });

      htmlContent += `
        <div class="deadline-item" style="text-align: center;">
          <div class="course-name" style="font-style: italic;">${module.name}</div>
          <div class="date">${dateString}</div>
          <div class="${colorClass}" style="font-size: 13px; font-weight: bold;">(${countdownLabel})</div>
        </div>`;
    }
    
    listContainer.innerHTML = htmlContent;

    // --- Manueller Discord Versand ---
    if (currentWebhookUrl && currentWebhookUrl.startsWith('http')) {
      sendDiscordBtn.onclick = () => {
        sendDiscordBtn.innerText = "Sende...";
        sendToDiscord(currentWebhookUrl, currentReportData, sendDiscordBtn);
      };
    } else {
      sendDiscordBtn.disabled = true;
      sendDiscordBtn.style.opacity = "0.5";
      sendDiscordBtn.title = "Bitte erst eine Webhook URL eingeben und speichern.";
    }
  });
});