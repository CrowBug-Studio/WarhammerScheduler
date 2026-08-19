const webhookURL = "https://canary.discord.com/api/webhooks/1539453304277307482/urWoOzmXIVj4__7CC3jezabEtisVoVZryShmO5SDEfmOBzCU8eKoe3WH5uZjMyJWhytF";

function send_message(text) {
  const payload = {
    "content": text
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  UrlFetchApp.fetch(webhookURL, options);
}
