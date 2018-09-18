
//display current time on page
$(document).ready(nowTime()); 

function nowTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $('#clock').html(h + ":" + m + ":" + s);
    var t = setTimeout(nowTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

// Initialize Firebase
var config = {
apiKey: "AIzaSyA7e_8bxyF9dvu1ivTo-0oYG95PVtFdCrs",
authDomain: "train-schedule-602af.firebaseapp.com",
databaseURL: "https://train-schedule-602af.firebaseio.com",
projectId: "train-schedule-602af",
storageBucket: "train-schedule-602af.appspot.com",
messagingSenderId: "1064466041244"
};
firebase.initializeApp(config);

var database = firebase.database();

  // Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest= $("#destination-input").val().trim();
    var trainFreq = $("#frequency-input").val();
    var trainOne = $("#first-train-input").val();    
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDest,
      frequency: trainFreq,
      firstTrain: trainOne,
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-inpu").val("");
    $("#frequency-input").val("");
    $("#first-train-input").val("");
});
  
// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainOne = childSnapshot.val().firstTrain;
    var trainFreq = childSnapshot.val().frequency;
  
    //Train schedule calculation (function?)

    // Assumptions
    var tFrequency = trainFreq;
    var firstTime = trainOne;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");


    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td style='text-align:center;'>").text(trainFreq),
      $("<td>").text(moment(nextTrain).format("HH:mm")),
      $("<td>").text(tMinutesTillTrain)
    );

  
    // Append the new row to the table
    $("#train-table-body").append(newRow);
  });

