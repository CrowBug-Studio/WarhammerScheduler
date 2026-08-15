//For Record Keeping
function create_keys() { //1
  const length = 5;

  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
  }
  console.log("Key produced [1]");
  console.info(result, "[1]");
  return result;
}

//Submissions
function form_submission(form) { //2
  const entireForm = FormApp.getActiveForm();
  const formResponses = entireForm.getResponses();

  const latestResponse = formResponses[formResponses.length - 1];
  const itemResponses = latestResponse.getItemResponses();

  console.log("Checking Fields [2]");

  for (let i = 0; i < itemResponses.length; i++) {
    let itemResponse = itemResponses[i];
    let title = itemResponse.getItem().getTitle();
    let answer = itemResponse.getResponse();

    console.info(title, answer, "[2]");

    if (title == "Discord Username") {
      var discordUsername = answer;
    }

    if (title === "Event Name") {
      var eventName = answer;
    }

    if (title === "Event Description") {
      var eventDescription = answer;
    }

    if (title === "Location (ex: Discord Server)") {
      var location = answer;
    }

    //Date Section
    if (title === "Year") {
      var year = Number(answer);

      if (year < 2026) {
        console.warn("Year is passed [2]");
        year = 2026;
      }
    }

    if (title === "Month") {
      var month = answer;

      switch (month) {
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
      var day = Number(answer);

      if (day < 1) {
        console.warn("Day is less than 1 [2]");
        day = 1;
      } else if ((month == 3 || month == 5 || month == 8 || month == 10) && day > 30) {
        console.warn("Day is greater than 30 in month with 30 days. [2]");
        month += 1;
        day -= 30;
      } else if (month == 1 && day > 28) {
        console.warn("Day is greater than 28 in month with 28 days. [2]");
        month += 1;
        day -= 28;
      } else if ((month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 ||month == 11) && day > 31) {
        console.warn("Day is greater than 31 in month with 31 days. [2]");
        month += 1;
        day -= 31;
      }
    }

    if (title === "Start Time") {
      var start = new Date(answer);
      var timeOnly24 = Utilities.formatDate(start, Session.getScriptTimeZone(), 'HH:mm');
      var timeParts = answer.split(":");
      var hours = Number(timeParts[0]);
      var minutes = Number(timeParts[1]);
    }
  }

  console.log("Fields checked [2]");
  eventDate = new Date(year, month, day, hours, minutes);
  specificKey = create_keys();
  upload_calendar(eventName, eventDescription, location, eventDate, specificKey, discordUsername);
}

function upload_calendar(evntName, evntDescription, evntLocation, evntDate, key, username) { //3
  console.log("Adding event [3]")
  var options = {
    location: evntLocation,
    description: evntDescription
  };

  var calendar = CalendarApp.getDefaultCalendar();
  event = calendar.createEvent(evntName, evntDate, evntDate, options);
  event.setTag('key', key);
  event.setTag('username', username);

  console.info(event.getTag('key'), event.getTag('username'), "[3]");
}

/*
  ToDo:
    - Console Mode
      - View and edit events
      - View keys
*/
