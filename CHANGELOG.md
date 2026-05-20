# Changelog - ILIAS Deadline Checker

Vollständiger Vergleich zwischen der Vorversion (aus `release_chrome_web`) und der aktuellen Version (in `src`).

## [1.4.0] - Modern UI & UX Update

### 📁 Architektur & Code-Struktur
* **Modularisierungs-Refactoring:**
  * Auslagerung der DOM-Generierung in eine eigenständige `render.js`.
  * Auslagerung des Speicher-Managements in `storage.js`.
  * Hinzufügen der Theme-Umschaltlogik in `theme.js`.
  * Konsolidierung der mathematischen Datums- und Countdown-Funktionen in `time.js`.

### 🎨 UI & UX (Design & Themes)
* **Dynamisches Theme-System (Light/Night Mode):**
  * Einführung von CSS-Variablen (`--bg-color`, `--text-color` etc.) zur nativen Unterstützung beider Themes.
  * **Light Theme:** Kontrastreiche Slate-Töne (`#0f172a`/`#334155`) auf hellgrauem Hintergrund (`#f1f5f9`). Wird als Standard (CSS-Baseline) geladen, um visuelles Flackern beim Laden zu verhindern.
  * **Night Theme:** Glassmorphismus (`backdrop-filter`) mit radialem Dunkelblau-Verlauf (`#141b2d` bis `#090d16`) und Neon-Glow-Rändern.
  * **Umschalter (Toggle):** Absolut positionierter Button oben rechts (`top: 12px`, bündig zur Baseline der Überschrift) mit automatisch einfärbenden SVG-Icons (Sonne/Mond). Status wird in `chrome.storage.local` gespeichert.
* **Layout & Hover-Optimierungen:**
  * Deaktivierung von Hover-Effekten auf statischen, nicht anklickbaren Fristen-Karten.
  * Entfernung der physischen Button-Verschiebung (`translateY(-1px)`) und von farbigen Leuchteffekten bei Button-Hovern zur Stabilisierung der Anzeige.
  * Angleichung aller Schriftstärken (`600` für Buttons) und Abstände (`1px` bei Überschriften) zur Eliminierung von Layout-Sprüngen ("Flackern") beim Wechseln der Ansicht.

### ⚡ Caching & Performance
* **Tagesbasiertes Caching:** Umstellung des Cache-Ablaufs in `storage.js` von Millisekunden-Prüfung auf einen reinen Kalenderdatumsvergleich (`dDate < nDate`). Dies verhindert wiederholtes, mehrfaches Scraping am Tag des Fristablaufs nach Überschreiten der Uhrzeit.

### ⚙️ Bugfixes & Zuverlässigkeit
* **Uhrzeit-Kompensation:** Berechnete Fristzeiten zwischen 23:00 und 23:59 Uhr (hervorgerufen durch das minutenlose Abrunden von ILIAS) werden starr auf `23:59 Uhr` korrigiert. Andere Uhrzeiten bleiben präzise erhalten.
* **Box-Shadow-Syntax:** Korrektur einer fehlenden `px`-Angabe im CSS-Schatten des Dark Modes, um Darstellungsfehler im Browser zu beheben.

### 💬 Discord-Integration
* **Webhook-Live-Erkennung:** Aktualisierte Webhook-URLs werden ohne Neustart der Erweiterung direkt im Popup-Prozess registriert.
* **UX-Ausgabe:** Strukturierung und farbliche Anpassung der Chat-Nachrichten an das Design der Erweiterung.
* **Dynamischer Button-Zustand:** Der Sende-Button ist standardmäßig blass (`opacity: 0.35`) und gesperrt. Er aktiviert sich erst, sobald eine syntaktisch korrekte Webhook-URL (`https://discord.com/api/webhooks/`) im Input-Feld erkannt wird (geprüft live bei Eingabe sowie beim Laden gespeicherter Einstellungen).
