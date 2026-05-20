// === settings.js — Einstellungs-UI ===

function initSettings() {
  const webhookInput = document.getElementById('discord-webhook');
  const sendDiscordBtn = document.getElementById('btn-send-discord');

  function updateDiscordButtonState() {
    const url = webhookInput.value.trim();
    if (url.startsWith('https://discord.com/api/webhooks/')) {
      sendDiscordBtn.classList.add('active');
    } else {
      sendDiscordBtn.classList.remove('active');
    }
  }

  if (webhookInput) {
    webhookInput.addEventListener('input', updateDiscordButtonState);
  }

  // --- Einstellungen öffnen ---

  document.getElementById('btn-settings').onclick = function () {
    const container = document.getElementById('modules-container');
    container.textContent = "";

    chrome.storage.local.get(['iliasModules', 'discordWebhook'], function (data) {
      const savedModules = data.iliasModules ? data.iliasModules : [{}];
      savedModules.forEach(function (module) {
        createModuleRow(container, module);
      });

      webhookInput.value = data.discordWebhook ? data.discordWebhook : "";
      updateDiscordButtonState();

      document.getElementById('main-view').style.display = 'none';
      document.getElementById('settings-view').style.display = 'block';
    });
  };

  // --- Neues Modul hinzufügen ---

  document.getElementById('btn-add').onclick = function () {
    const container = document.getElementById('modules-container');
    createModuleRow(container, { name: "", url: "", isManual: false, manualDate: "" });
  };

  // --- Speichern & gespeicherte Deadlines zurücksetzen ---

  document.getElementById('btn-save').onclick = function () {
    const modulesToSave = [];

    document.querySelectorAll('.input-group').forEach(function (row) {
      const name = row.querySelector('.input-name').value.trim();
      const url = row.querySelector('.input-url').value.trim();
      const date = row.querySelector('.input-date').value;
      const isManual = row.dataset.isManual === "true";

      if (name && (url || date)) {
        modulesToSave.push({ name: name, url: url, isManual: isManual, manualDate: date });
      }
    });

    chrome.storage.local.set({
      iliasModules: modulesToSave,
      discordWebhook: document.getElementById('discord-webhook').value,
      storedDeadlines: {}
    }, function () {
      location.reload();
    });
  };

  // --- Zurück ---

  document.getElementById('btn-back').onclick = function () {
    location.reload();
  };
}

// --- Modul-Zeile erstellen ---

function createModuleRow(container, module) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'input-group';
  rowDiv.dataset.isManual = module.isManual ? "true" : "false";

  const toggleIcon = module.isManual ? "🔗" : "📅";

  const inputName = document.createElement('input');
  inputName.type = 'text';
  inputName.className = 'input-name';
  inputName.placeholder = 'Name';
  inputName.value = module.name ? module.name : '';

  const inputUrl = document.createElement('input');
  inputUrl.type = 'text';
  inputUrl.className = 'input-url';
  inputUrl.placeholder = 'Link';
  inputUrl.value = module.url ? module.url : '';
  inputUrl.style.display = module.isManual ? 'none' : 'block';

  const inputDate = document.createElement('input');
  inputDate.type = 'datetime-local';
  inputDate.className = 'input-date';
  inputDate.value = module.manualDate ? module.manualDate : '';
  inputDate.style.display = module.isManual ? 'block' : 'none';

  const btnToggle = document.createElement('button');
  btnToggle.className = 'btn-toggle';
  btnToggle.textContent = toggleIcon;

  const btnDelete = document.createElement('button');
  btnDelete.className = 'btn-delete';
  btnDelete.textContent = 'X';

  rowDiv.appendChild(inputName);
  rowDiv.appendChild(inputUrl);
  rowDiv.appendChild(inputDate);
  rowDiv.appendChild(btnToggle);
  rowDiv.appendChild(btnDelete);

  btnToggle.onclick = function () {
    const isNowManual = rowDiv.dataset.isManual === "true";
    if (isNowManual) {
      rowDiv.dataset.isManual = "false";
      inputUrl.style.display = 'block';
      inputDate.style.display = 'none';
      btnToggle.textContent = '📅';
    } else {
      rowDiv.dataset.isManual = "true";
      inputUrl.style.display = 'none';
      inputDate.style.display = 'block';
      btnToggle.textContent = '🔗';
    }
  };

  btnDelete.onclick = function () {
    rowDiv.remove();
  };

  container.appendChild(rowDiv);
}