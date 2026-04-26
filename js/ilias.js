// === js/ilias.js ===
// ILIAS Webscraping

async function scrapeIliasModule(url) {
  try {
    const response = await fetch(url);
    if (response.url.includes("login.php") || response.url.includes("shibboleth")) {
      return { error: "LOGIN_REQUIRED" };
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const propertyElements = Array.from(doc.querySelectorAll('.il_ItemProperty'));
    const deadlineElement = propertyElements.find(e => e.innerText.includes("Nächste Abgabefrist:"));

    let deadlineText = "Keine Frist gefunden.";
    if (deadlineElement) {
      deadlineText = deadlineElement.innerText.replace("Nächste Abgabefrist:", "").trim();
    }

    if (deadlineText.includes("Minuten")) {
      deadlineText = deadlineText.split("Minuten")[0] + "Minuten";
    }
    deadlineText = deadlineText.replace(/(\d{1,2}:\d{2}):\d{2}/g, '$1');

    return { deadline: deadlineText };
  } catch (error) {
    return { error: "NETZWERK_FEHLER" };
  }
}