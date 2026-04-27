# Privacy Policy for "ILIAS Deadline Checker"
*(Deutsche Version unten)*

**Last updated: April 2026**

This privacy policy explains how the Chrome extension "ILIAS Deadline Checker" handles your data. Protecting your privacy is our highest priority. Therefore, the extension is designed to ensure that **no** personal data is sent to the developer or uninvolved third parties.

## 1. Data Collection and Local Storage
The extension stores settings and configurations **exclusively locally on your device** using the `chrome.storage.local` API. This data includes:
- The module names you entered.
- The URLs to your ILIAS courses.
- Manually entered deadlines.
- Your optional Discord webhook URL.

This data never leaves your device (with the exception of the user-configured Discord integration, see point 3) and cannot be viewed, collected, or analyzed by us.

## 2. Fetching Website Content (ILIAS)
To determine the upcoming deadlines, the extension fetches the source code (HTML) of the ILIAS course URLs you provided. This happens locally in your browser using your active ILIAS session.
- **No login credentials (passwords, usernames) or cookies** are read, stored, or transmitted by the extension.
- The fetched website content is only searched locally for a fraction of a second to extract the date and is immediately discarded afterwards.

## 3. Data Transfer to Discord (Optional)
If you voluntarily provide a Discord webhook URL in the settings, the extension will transmit the determined module names and their deadlines to this URL when you click "Übersicht an Discord senden" (Send overview to Discord).
- This transmission occurs exclusively between your browser and Discord's servers.
- No data is routed through our servers. Discord's privacy policy applies to this process.

## 4. Sharing Data with Third Parties
Since we do not collect your data or store it on our own servers, we logically **do not share any data with third parties**. There is no tracking, no analytics, and no advertising evaluation.

## 5. Contact
If you have any questions regarding this privacy policy or the extension, you can contact me here:
- **Developer:** elathq | Younes
- **Contact:** contacts.elathq@gmail.com or https://github.com/elathq

---
---

# Datenschutzerklärung für "ILIAS Deadline Checker"

**Stand: April 2026**

Diese Datenschutzerklärung informiert dich darüber, wie die Chrome-Erweiterung "ILIAS Deadline Checker" mit deinen Daten umgeht. Der Schutz deiner Daten hat höchste Priorität. Deshalb ist die Erweiterung so konzipiert, dass **keine** persönlichen Daten an den Entwickler oder unbeteiligte Dritte gesendet werden.

## 1. Datenerhebung und lokale Speicherung
Die Erweiterung speichert Einstellungen und Konfigurationen **ausschließlich lokal auf deinem Gerät** über die `chrome.storage.local` API. Zu diesen Daten gehören:
- Die von dir eingegebenen Namen der Module.
- Die URLs zu deinen ILIAS-Kursen.
- Manuell eingetragene Fristen.
- Deine optionale Discord-Webhook-URL.

Diese Daten verlassen deinen Rechner nicht (mit Ausnahme der von dir selbst eingerichteten Discord-Integration, siehe Punkt 3) und können von uns weder eingesehen, noch gesammelt oder ausgewertet werden.

## 2. Abruf von Website-Inhalten (ILIAS)
Um die nächsten Abgabefristen zu ermitteln, ruft die Erweiterung den Quelltext (HTML) der von dir hinterlegten ILIAS-Kurs-URLs ab. Dies geschieht lokal in deinem Browser unter Verwendung deiner aktiven ILIAS-Sitzung. 
- Es werden **keine Anmeldedaten (Passwörter, Benutzernamen) oder Cookies** von der Erweiterung ausgelesen, gespeichert oder übertragen. 
- Der abgerufene Website-Content wird nur für den Bruchteil einer Sekunde lokal durchsucht, um das Datum zu extrahieren, und anschließend sofort verworfen.

## 3. Datenübertragung an Discord (Optional)
Wenn du in den Einstellungen freiwillig eine Discord-Webhook-URL hinterlegst, überträgt die Erweiterung bei einem Klick auf "Übersicht an Discord senden" die ermittelten Modulnamen und deren Abgabefristen an diese URL.
- Diese Übertragung findet ausschließlich zwischen deinem Browser und den Servern von Discord statt. 
- Es werden keine Daten über unsere Server geleitet. Es gelten hierfür die Datenschutzbestimmungen von Discord.

## 4. Weitergabe von Daten an Dritte
Da wir keine deiner Daten erheben oder auf eigenen Servern speichern, geben wir logischerweise auch **keinerlei Daten an Dritte** weiter. Es finden kein Tracking, keine Analysen und keine Werbe-Auswertungen statt.

## 5. Kontakt
Wenn du Fragen zu dieser Datenschutzerklärung oder der Erweiterung hast, kannst du mich hier kontaktieren:
- **Entwickler:** elathq | Younes
- **Kontakt:** contacts.elathq@gmail.com oder https://github.com/elathq
