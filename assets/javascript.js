

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCy-mvwvb0sI_nATjFkLsQLco4ygn3D8w8",
    authDomain: "train-schedule-afab1.firebaseapp.com",
    databaseURL: "https://train-schedule-afab1.firebaseio.com",
    projectId: "train-schedule-afab1",
    storageBucket: "",
    messagingSenderId: "264815020188"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

//   Button adding trains to the list

$("#addTrainButton").on("click", function(event) {
    event.preventDefault();

    // user input 
    var trainName = $("#trainInput").val().trim();
    var destinationInput = $("#destinationInput").val().trim();
    var timeInput = $("#timeInput").val().trim();
    var frequencyInput = $("#frequencyInput").val().trim();

    // create temporary object for local storage

    var newTrain = {
        train: trainName,
        destination: destinationInput,
        time: timeInput,
        frequency: frequencyInput
    };
    // upload the new train data to local storage (firebase)
    database.ref().push(newTrain);

    console.log(newTrain.train);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    // alert("Train Successfully Added");

    // Clear all the input values
    $("#trainInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(childSnapShot, preventChildKey) {

    console.log(childSnapShot.val());

    var trainName = childSnapShot.val().train;
    var destinationName = childSnapShot.val().destination;
    var time = childSnapShot.val().time;
    var frequency = childSnapShot.val().frequency;

    //  Train Information
    console.log(trainName);
    console.log(destinationName);
    console.log(time);
    console.log(frequency);

    // Assumptions
    var tFrequency = 3;

    // Time is 3:30 AM
    var firstTime = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //current time 
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm:ss"));

    // format time entered correctly
    var timePretty = moment.unix(timeInput).format("hh:mm");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var minAway = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train
    var nextTrain = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainInput + "</td><td>" + destinationInput + "</td><td>" +
        timeInput + "</td><td>" + nextTrain + "</td><td>" + minAway + "</td></tr>");
}) 