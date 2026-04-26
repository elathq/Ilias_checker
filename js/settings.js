// === js/settings.js ===
// UI-Logik für Einstellungen

function initSettings() {
  document.getElementById('btn-settings').onclick = () => {
    const container = document.getElementById('modules-container');
    container.innerHTML = ""; 
    
    chrome.storage.local.get(['iliasModules', 'discordWebhook'], data => {
      let savedModules = data.iliasModules || [{}];
      savedModules.forEach(module => createModuleRow(container, module));
      document.getElementById('discord-webhook').value = data.discordWebhook || "";
      document.getElementById('main-view').style.display = 'none';
      document.getElementById('settings-view').style.display = 'block';
    });
  };

  document.getElementById('btn-add').onclick = () => {
    const container = document.getElementById('modules-container');
    createModuleRow(container, { name: "", url: "", isManual: false, manualDate: "" });
  };

  document.getElementById('btn-save').onclick = () => {
    const modulesToSave = []; 
    document.querySelectorAll('.input-group').forEach(row => {
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
        discordWebhook: document.getElementById('discord-webhook').value
    }, () => location.reload());
  };

  document.getElementById('btn-back').onclick = () => location.reload();
}

function createModuleRow(container, module) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'input-group';
  rowDiv.dataset.isManual = module.isManual ? "true" : "false";
  
  let urlStyle = module.isManual ? "display:none;" : "display:block;";
  let dateStyle = module.isManual ? "display:block;" : "display:none;";
  let toggleIcon = module.isManual ? "🔗" : "📅";
  
  rowDiv.innerHTML = `
    <input type="text" class="input-name" placeholder="Name" value="${module.name || ''}">
    <input type="text" class="input-url" placeholder="Link" value="${module.url || ''}" style="${urlStyle}">
    <input type="datetime-local" class="input-date" value="${module.manualDate || ''}" style="${dateStyle}">
    <button class="btn-toggle">${toggleIcon}</button>
    <button class="btn-delete">X</button>`;
    
  rowDiv.querySelector('.btn-toggle').onclick = (event) => {
    const isNowManual = rowDiv.dataset.isManual === "true";
    if (isNowManual) {
      rowDiv.dataset.isManual = "false";
      rowDiv.querySelector('.input-url').style.display = 'block';
      rowDiv.querySelector('.input-date').style.display = 'none';
      event.target.innerText = '📅';
    } else {
      rowDiv.dataset.isManual = "true";
      rowDiv.querySelector('.input-url').style.display = 'none';
      rowDiv.querySelector('.input-date').style.display = 'block';
      event.target.innerText = '🔗';
    }
  };
  rowDiv.querySelector('.btn-delete').onclick = () => rowDiv.remove();
  container.appendChild(rowDiv);
}