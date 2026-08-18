function clean_old_keys() { //4
  console.log("Clearing old keys [4]");

  var scriptProperties = PropertiesService.getScriptProperties(); //Defines the global property store
  var entries = scriptProperties.getProperties(); //Gets all stored data

  for (var key in entries) { //Checks each saved key
    try {
      var saveData = Json.parse(entries[key]);

      if (saveData.expirationTimestamp && today > saveData.expirationTimestamp) { //If the expiration is passed then delete the key
        console.info("Cleared:", key);
        scriptProperties.deleteProperty(key);
      }
    } catch(e) {
      console.warn("Non-JSON property");
    }
  }
}
