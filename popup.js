// (c) 2026 elathq, MIT License
document.addEventListener('DOMContentLoaded', function() {
  
  // === 1. ZUWEISUNGEN (ELEMENTE HOLEN) ===
  const hauptAnsicht         = document.getElementById('main-view');
  const einstellungenAnsicht = document.getElementById('settings-view');
  const listenContainer      = document.getElementById('deadline-list');
  const modulesContainer     = document.getElementById('modules-container');
  
  const speicherButton       = document.getElementById('btn-save');
  const einstellungenButton  = document.getElementById('btn-settings');
  const zurueckButton        = document.getElementById('btn-back');
  const hinzufuegenButton    = document.getElementById('btn-add');


  // === 2 . HAUPT-LOGIK ===
  // prüft sofort den Speicher und entscheiden, was passiert
  chrome.storage.local.get(['iliasModules'], function(gespeicherteDaten) {
    const meineModule = gespeicherteDaten.iliasModules;

    if (meineModule && meineModule.length > 0) {
      // Fall A: Daten vorhanden -> Fristen abfragen
      fristenAbfragen(meineModule);
    } else {
      // Fall B: Keine Daten -> Hinweis anzeigen
      listenContainer.innerHTML = "Keine Module hinterlegt. Bitte Einstellungen öffnen.";
    }
  });


  // === FUNKTIONEN ===
  function fristenAbfragen(modulListe) {
    listenContainer.innerHTML = "Laden von ILIAS...";
    let fertigesHTML = "";
    let anzahlVerarbeitet = 0;

    modulListe.forEach(function(einzelnesModul) {
      fetch(einzelnesModul.url)
        .then(function(antwort) { 
          // PRÜFUNG: Wenn die URL "login.php" oder "shibboleth" enthält, sind wir ausgeloggt
          if (antwort.url.includes("login.php") || antwort.url.includes("shibboleth")) {
            throw new Error("LOGIN_REQUIRED");
          }
          return antwort.text(); 
        })
        .then(function(seitenQuelltext) {
          const parser = new DOMParser(); 
          const htmlDokument = parser.parseFromString(seitenQuelltext, 'text/html');
          
          const alleEigenschaften = htmlDokument.querySelectorAll('.il_ItemProperty');
          let fristText = "Keine Frist gefunden.";

          alleEigenschaften.forEach(function(eigenschaft) {
            if (eigenschaft.innerText.includes("Nächste Abgabefrist:")) {
              fristText = eigenschaft.innerText.replace("Nächste Abgabefrist:", "").trim();
            }
          });

          fertigesHTML += '<div class="deadline-item">' +
                            '<div class="course-name">' + (einzelnesModul.name) + '</div>' +
                            '<div class="date">' + fristText + '</div>' +
                          '</div>';
        })
        .catch(function(error) {
          // Smarter Login-Hinweis statt einfachem Fehlertext
          fertigesHTML += '<div class="deadline-item">' +
                            '<div class="course-name">' + einzelnesModul.name + '</div>' +
                            '<div class="date" style="font-size: 14px; margin-top: 5px;">' + 
                              '<a href="https://www.ili.fh-aachen.de/login.php?cmd=force_login" target="_blank" style="color: #d73a49; text-decoration: underline; font-family: sans-serif; font-weight: bold;">ILIAS Login erneuern</a>' + 
                            '</div>' +
                          '</div>';
        })
        .finally(function() {
          anzahlVerarbeitet++;
          if (anzahlVerarbeitet === modulListe.length) {
            listenContainer.innerHTML = fertigesHTML;
          }
        });
    });
  }

  // Hilfsfunktion: Baut ein einzelnes Eingabefeld (Reihe) dynamisch auf
  function erstelleEingabeFeld(name = "", url = "") {
    const group = document.createElement('div');
    group.className = 'input-group';
    
    group.innerHTML = `
      <input type="text" class="input-name" placeholder="Name" value="${name}">
      <input type="text" class="input-url" placeholder="ILIAS Link" value="${url}">
      <button class="btn-delete" title="Modul entfernen">X</button>
    `;

    // Löschen-Funktion für diese spezifische Reihe
    group.querySelector('.btn-delete').onclick = function() {
      group.remove();
    };

    modulesContainer.appendChild(group);
  }


  // === EVENT-LISTENER ===

  // Button für neues Modul: fügt eine leere Reihe in den Einstellungen hinzu
  hinzufuegenButton.onclick = function() {
    erstelleEingabeFeld(); 
  };

  // Speichern-Button: daten einsammeln und speichern
  speicherButton.onclick = function() {
    const neueModulListe = [];
    // Alle aktuell sichtbaren Input-Gruppen auslesen
    const alleGruppen = modulesContainer.querySelectorAll('.input-group');
    
    alleGruppen.forEach(function(gruppe) {
      const nameVal = gruppe.querySelector('.input-name').value.trim();
      const urlVal  = gruppe.querySelector('.input-url').value.trim();
      
      if (urlVal !== "") {
        neueModulListe.push({ name: nameVal, url: urlVal });
      }
    });

    chrome.storage.local.set({iliasModules: neueModulListe}, function() {
      location.reload(); 
    });
  };

  // Einstellungen-Button: gespeicherte Felder füllen und Ansicht wechseln
  einstellungenButton.onclick = function() {
    // Container leeren, um Duplikate beim wiederholten Öffnen zu vermeiden
    modulesContainer.innerHTML = "";

    chrome.storage.local.get(['iliasModules'], function(daten) {
      if(daten.iliasModules && daten.iliasModules.length > 0) {
        // Für jedes gespeicherte Modul eine Reihe generieren
        daten.iliasModules.forEach(function(modul) {
          erstelleEingabeFeld(modul.name, modul.url);
        });
      } else {
        // Mindestens ein leeres Feld anzeigen, wenn noch nichts gespeichert ist
        erstelleEingabeFeld();
      }
      hauptAnsicht.style.display = 'none';
      einstellungenAnsicht.style.display = 'block';
    });
  };

  // Back-Button: Ansicht wechseln
  zurueckButton.onclick = function() {
    einstellungenAnsicht.style.display = 'none';
    hauptAnsicht.style.display = 'block';
  };

});