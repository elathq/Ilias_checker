// === popup.js — Hauptsteuerung ===

document.addEventListener('DOMContentLoaded', async function () {
  initSettings();

  const listContainer = document.getElementById('deadline-list');
  const sendDiscordBtn = document.getElementById('btn-send-discord');
  const networkNow = await getNetworkTime();

  let currentReportData = [];
  let currentWebhookUrl = "";

  chrome.storage.local.get(['iliasModules', 'discordWebhook', 'storedDeadlines'], function (data) {
    const modules = data.iliasModules ? data.iliasModules : [];
    currentWebhookUrl = data.discordWebhook;
    const storedDeadlines = data.storedDeadlines ? data.storedDeadlines : {};

    if (modules.length === 0) {
      listContainer.textContent = "Keine Module konfiguriert.";
      return;
    }

    listContainer.textContent = "Synchronisiere...";

    const results = new Array(modules.length);
    let completedCount = 0;

    // --- Einzelnes Modul prüfen & laden ---

    async function checkAndScrape(module, index) {
      const stored = storedDeadlines[module.url];
      const expired = isDeadlineExpired(stored, networkNow);

      if (!module.isManual && module.url && expired) {
        const result = await scrapeIliasModule(module.url);
        results[index] = result;
      } else {
        results[index] = null;
      }

      completedCount = completedCount + 1;

      // Sobald alle Module verarbeitet wurden, wird die Liste gezeichnet
      if (completedCount === modules.length) {
        renderAll(modules, results, storedDeadlines);
      }
    }

    // --- Alle Ladevorgänge gleichzeitig starten ---

    modules.forEach(function (module, index) {
      checkAndScrape(module, index);
    });

    // --- DOM aufbauen ---

    function renderAll(modulesList, scrapeResults, savedDeadlines) {
      const fragment = document.createDocumentFragment();
      const updatedDeadlines = Object.assign({}, savedDeadlines);

      for (let i = 0; i < modulesList.length; i++) {
        const module = modulesList[i];
        let targetDate = null;

        if (module.isManual && module.manualDate) {
          targetDate = new Date(module.manualDate);

        } else if (!module.isManual && module.url) {
          const result = scrapeResults[i];

          if (result) {
            // Modul wurde frisch aus dem Internet geladen
            if (result.error) {
              fragment.appendChild(createErrorCard(module.name, module.url));
              continue;
            }

            targetDate = createAbsoluteDate(result.deadline, networkNow);

            if (targetDate) {
              saveDeadline(updatedDeadlines, module.url, module.name, targetDate);
            }
          } else {
            // Modul war noch aktuell und wurde aus dem lokalen Speicher geladen
            const stored = savedDeadlines[module.url];
            if (stored && stored.deadline) {
              targetDate = new Date(stored.deadline);
            }
          }
        }

        let dateString = "Keine Frist aktiv";
        let countdownLabel = "-";
        let colorClass = "time-green";

        if (targetDate) {
          dateString = targetDate.toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });
          countdownLabel = createCountdownText(targetDate, networkNow);
          colorClass = getColorClass((targetDate - networkNow) / 3600000);
        }

        currentReportData.push({ name: module.name, deadline: dateString });
        fragment.appendChild(createDeadlineCard(module.name, dateString, countdownLabel, colorClass));
      }

      persistDeadlines(updatedDeadlines);
      listContainer.textContent = '';
      listContainer.appendChild(fragment);
    }

    // --- Discord Versand ---

    sendDiscordBtn.onclick = function () {
      const inputUrl = document.getElementById('discord-webhook').value.trim();
      const urlToUse = inputUrl ? inputUrl : currentWebhookUrl;

      if (urlToUse && urlToUse.startsWith('https://discord.com/api/webhooks/')) {
        sendDiscordBtn.innerText = "Sende...";
        sendToDiscord(urlToUse, currentReportData, sendDiscordBtn);
      } else {
        alert("Bitte gib eine gültige Discord Webhook URL (beginnend mit https://discord.com/api/webhooks/) ein.");
      }
    };
  });
});