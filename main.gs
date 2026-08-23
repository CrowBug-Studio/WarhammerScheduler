//useful Variables
const today = new Date(); //Get Today's Date
const currentDay = today.getDate(); //Get the current day (1-31) from "today" constant
const currentMonth = today.getMonth(); //Get the current month (0-11) from "today" constant
const currentYear = today.getFullYear(); //Get the current year from "today" constant
const url = ""; //Hidden for security
var hasID = false; //If the user submitted a username that has a connected id
var outputServer; //Message to send to the server
var outputUser; //Message to send to the user

var eventDetailsObject = { //An object to store data about the event
  Name: "",
  Description: "",
  Location: "",
  Date: "",
  Username: ""
};


function create_keys(dateEvent) { //1
  var scriptProperties = PropertiesService.getScriptProperties(); //Defines the global property store
  const length = 5; //Set the key length

  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; //Key alphabet

  for (let i = 0; i < length; i++) { //Generate random characters until sequence is equal to length constant
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
  }

  var values = scriptProperties.getProperty(result);

  if (result == values) { //Check if the generated key already exists
    console.warn("Key already exists");
    return createKeys(today);
  } else {

  }

  var saveData = { //Set the key and its expiration date
    payload: result,
    expirationTimestamp: dateEvent
  };

  scriptProperties.setProperty(result, JSON.stringify(saveData)); //Convert object to string

  console.log("Key produced [1]");
  console.info(result, "[1]");
  return result; //Log and return the generated key
}

function form_submission(form) { //2
  const entireForm = FormApp.getActiveForm(); //Creates a variable storing the form
  const formResponses = entireForm.getResponses(); //Creates a variable storing the responses

  const latestResponse = formResponses[formResponses.length - 1];
  const itemResponses = latestResponse.getItemResponses(); //Get the newest submission and its responses

  console.log("Checking Fields [2]");

  for (let i = 0; i < itemResponses.length; i++) { //Loop through the questions and get their answers
    let itemResponse = itemResponses[i];
    let title = itemResponse.getItem().getTitle();
    let answer = itemResponse.getResponse();

    console.info(title, answer, "[2]");

    if (title == "Discord Username") {
      var discordUsername = answer;
      switch (discordUsername) { //check some default usernames for better compatibility
        case "sandwichthepilot": //Nathan
          eventDetailsObject.Username = "776934045531504660";
          hasID = true;
          break;
        case "zombieboy2010._77531": //Gavin
          eventDetailsObject.Username = "1137436970868539494";
          hasID = true;
          break;
        case "traumatized_individual": //Seth
          eventDetailsObject.Username = "1357806417435820092";
          hasID = true;
          break;
        case "rowlet0966": //Ben
          eventDetailsObject.Username = "1528859249609019544";
          hasID = true;
          break;
        case "voyager9696": //Aiden
          eventDetailsObject.Username = "799440285926293534";
          hasID = true;
          break;
        case "fieldmarshalluke_42402": //Luke
          eventDetailsObject.Username = "1235319817897246794";
          hasID = true;
          break;
        case "dannyplayz_.": //Danny
          eventDetailsObject.Username = "1344875281894080642";
          hasID = true;
          break;
        default:
          eventDetailsObject.Username = discordUsername;
          hasID = false;
      }
    }

    if (title === "Event Name") {
      var eventName = answer;
      eventDetailsObject.Name = answer;
    }

    if (title === "Event Description") {
      var eventDescription = answer;
      eventDetailsObject.Description = answer;
    }

    //Location Section
    if (title === "Online or In-Person") {
      var eventLocationType = answer;
    }

    if (title === "Discord Chat Id (Use the link above for common options)") {
      var onlineChannelID = answer;
      eventDetailsObject.Location = answer;
    }

    if (title === "Location") {
      var localLocation = answer;
      eventDetailsObject.Location = answer;
    }

    if (eventLocationType === "Online") {
      location = "Discord"; //Placeholder to be changed later
    } else if (eventLocationType === "In Person") {
      location = eventDetailsObject.Location;
    }

    //Date Section
    if (title === "Year") {
      var year = Number(answer);

      if (year < currentYear) {
        console.warn("Year is passed [2]");
        year = currentYear;
        //If the year entered is in the past, set the year to be the current year
      }
    }

    if (title === "Month") {
      var month = answer;

      switch (month) { //Set the month (Zero indexed)
        case "January":
          month = 0;
          break;
        case "February":
          month = 1;
          break;
        case "March":
          month = 2;
          break;
        case "April":
          month = 3;
          break;
        case "May":
          month = 4;
          break;
        case "June":
          month = 5;
          break;
        case "July":
          month = 6;
          break;
        case "August":
          month = 7;
          break;
        case "September":
          month = 8;
          break;
        case "October":
          month = 9;
          break;
        case "November":
          month = 10;
          break;
        case "December":
          month = 11;
          break;
      }
    }

    if (title === "Day") {
      var day = Number(answer); //Make the answer a number

      if (day < 1) {
        console.warn("Day is less than 1 [2]");
        day = 1;
        //If the day is less than the 1st, set the day to be the 1st
      } else if ((month == 3 || month == 5 || month == 8 || month == 10) && day > 30) {
        console.warn("Day is greater than 30 in month with 30 days. [2]");
        day -= 30;
        month += 1;
        //If the month is April, June, September, or November and the user inputs more than 30, 30 is subtracted and 1 month is advanced (June 48 --> July 18)
      } else if (month == 1 && day > 28) {
        if ((((year % 4) == 0) && ((year % 100) == 0) && ((year % 400) == 0) || ((year % 4) == 0) && ((year % 100) != 0)) && day > 29) {
          //Checks if the currentYear is a leap year (Check Github for more info)
          console.warn("Day is greater than 29 in month with 29 days. [2]");
          day -= 29;
          month += 1;
          //If the month is February (and a leap year) and the user inputs more than 29, 29 is subtracted and 1 month is advanced (February 30 --> March 1)
        } else {
          console.warn("Day is greater than 28 in month with 28 days. [2]");
          day -= 28;
          month += 1;
          //If the month is February (and not a leap year) and the user inputs more than 28, 28 is subtracted and 1 month is advanced (February 30 --> March 2)
        }
      } else if ((month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 ||month == 11) && day > 31) {
        console.warn("Day is greater than 31 in month with 31 days. [2]");
        day -= 31;
        month += 1;
        //If the month is January, March, May, July, August, October, or December and the user inputs more than 31, 31 is subtracted and 1 month is advanced (July 48 --> August 17)
      }

      if ((year <= currentYear && month <= currentMonth) && day < currentDay) {
        day = currentDay;
        //If the day is in the past set it to be the currentDay
      } else if (year == currentYear && month < currentMonth) {
        month = currentMonth;
        //If the month is in the past set it to be the currentMonth
      }
    }

    if (title === "Start Time") { //Gets the start time and seperates it into hours and minutes
      var start = new Date(answer);
      var timeOnly24 = Utilities.formatDate(start, Session.getScriptTimeZone(), 'HH:mm');
      var timeParts = answer.split(":");
      var hours = Number(timeParts[0]);
      var minutes = Number(timeParts[1]);
    }
  }

  console.log("Fields checked [2]");
  var eventDate = new Date(year, month, day, hours, minutes); //Sets the gathered variables into one date
  var time = `${day}/${month+1}/${year} at ` + `${hours}:${minutes}`;
  eventDetailsObject.Date = time;
  var specificKey = create_keys(eventDate); //Generates the key
  upload_calendar(eventName, eventDescription, location, eventDate, specificKey, discordUsername, eventLocationType);
}


function upload_calendar(evntName, evntDescription, evntLocation, evntDate, key, username, eventLocationType) { //3
  console.log("Adding event [3]")
  var options = { //Options for the event
    location: evntLocation,
    description: evntDescription
  };

  var calendar = CalendarApp.getDefaultCalendar();
  event = calendar.createEvent(evntName, evntDate, evntDate, options); //Create the event object
  //Set the key and discord username of the creator to be metadata tags in the event
  event.setTag('key', key);
  event.setTag('username', username);

  console.info(event.getTag('key'), event.getTag('username'), "[3]");

  if (eventLocationType === "Online") {
    send_message(eventDetailsObject.Location);
  } else {
    send_message()
  }
}


function build_string(eventObject = eventDetailsObject) { //Create the messages about the event to send on discord
  outputServer = `# ${eventObject.Name} \n**${eventObject.Description}** \nHosted on ${eventObject.Date} by <@${eventObject.Username}>`;
  outputUser = `# ${eventObject.Name} \n**${eventObject.Description}** \nHosted on ${eventObject.Date} by you.`;

  return;
}


function send_message(channel = "1539452822628597780") { //6
  build_string();
  let payload;
  
  if (hasID == true) {
    payload = {
    "channelId": channel,
    "userId": eventDetailsObject.Username,
    "contentServer": outputServer,
    "contentClient": outputUser
    };
  } else {
    payload = {
    "channelId": channel,
    "userId": "776934045531504660",
    "contentServer": outputServer,
    "contentClient": outputUser
    };
  }

  console.log(payload);

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  console.log(response.getContentText());
}
