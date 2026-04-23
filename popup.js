// (c) 2026 elathq, MIT License
document.addEventListener('DOMContentLoaded', function() {
  
  // === 1. ZUWEISUNGEN (ELEMENTE HOLEN) ===
  const hauptAnsicht         = document.getElementById('main-view');
  const einstellungenAnsicht = document.getElementById('settings-view');
  const listenContainer      = document.getElementById('deadline-list');
  
  const speicherButton       = document.getElementById('btn-save');
  const einstellungenButton  = document.getElementById('btn-settings');
  const zurueckButton        = document.getElementById('btn-back');


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
        .then(function(antwort) { return antwort.text(); })
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
        .catch(function() {
          fertigesHTML += '<div class="deadline-item">' +
                            '<div class="course-name">' + einzelnesModul.name + '</div>' +
                            '<div class="date">Fehler beim Laden</div>' +
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


  // === EVENT-LISTENER ===

  // Speichern-Button: daten einsammeln und speichern
  speicherButton.onclick = function() {
    const neueModulListe = [];
    for (let i = 1; i <= 5; i++) {
      const nameVal = document.getElementById('name' + i).value;
      const urlVal  = document.getElementById('url' + i).value;
      
      if (urlVal !== "") {
        neueModulListe.push({ name: nameVal, url: urlVal });
      }
    }

    chrome.storage.local.set({iliasModules: neueModulListe}, function() {
      location.reload(); 
    });
  };

  // Einstellungen-Button: gespeicherte Felder füllen und Ansicht wechseln
  einstellungenButton.onclick = function() {
    chrome.storage.local.get(['iliasModules'], function(daten) {
      if(daten.iliasModules) {
        daten.iliasModules.forEach(function(modul, index) {
          document.getElementById('name' + (index + 1)).value = modul.name;
          document.getElementById('url' + (index + 1)).value = modul.url;
        });
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