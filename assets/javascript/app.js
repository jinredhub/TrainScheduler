    	var config = {
		    apiKey: "AIzaSyA-143MQQsB75aYzr2-JV4eeFi_j60Z9_Q",
		    authDomain: "trainscheduler-d3a50.firebaseapp.com",
		    databaseURL: "https://trainscheduler-d3a50.firebaseio.com",
		    projectId: "trainscheduler-d3a50",
		    storageBucket: "",
		    messagingSenderId: "13218449554"
		  };
		  firebase.initializeApp(config);

		  var database = firebase.database();

		  $("#submit-btn").on("click", function(event){
		  	event.preventDefault();

		  	var name = $("#name-input").val().trim();
		  	var destination = $("#destination-input").val().trim();
		  	var firstTrainTime = moment($("#firstTrainTime-input").val().trim(), "HH:mm").format("X");
		  	var frequency = parseInt($("#frequency-input").val().trim());
		  	console.log(moment(firstTrainTime, "X").format("HH:mm"));

		  	database.ref().push({
		  		name: name,
		  		destination: destination,
		  		firstTrainTime: firstTrainTime,
		  		frequency: frequency,
		  	});

		  	$("#name-input").val("");
		  	$("#destination-input").val("");
		  	$("#firstTrainTime-input").val("");
		  	$("#frequency-input").val("");
		  });

		  database.ref().on("child_added", function(childSnapshot, prevChildKey){
		  	console.log(childSnapshot.val());

		  	var name = childSnapshot.val().name;
		  	var destination = childSnapshot.val().destination;
		  	var frequency = childSnapshot.val().frequency;
		  	var firstTrainTimeUnix = childSnapshot.val().firstTrainTime;

		  	// use momennt.unix(seconds) to create moment from a unix timestamp
		  	firstTrainTimeUnix = moment.unix(firstTrainTimeUnix);
		  	firstTrainTimeUnixMinusYear = moment(firstTrainTimeUnix).subtract(1, "years");

		  	console.log("firstTrainTime: " + moment(firstTrainTimeUnixMinusYear).format("HH:mm"));
		  	var currentTime = moment();
		  	console.log("currentTIme: " + moment(currentTime).format("HH:mm"));
		  	var diffTime = moment().diff(moment(firstTrainTimeUnixMinusYear), "minutes");
		  	console.log("time difference: " + diffTime);
		  	var timeRemainder = diffTime % frequency;
		  	console.log("frequency: " + frequency);
		  	console.log(timeRemainder);
		  	var timeMinuesTillTrain = frequency - timeRemainder;
		  	console.log("time minues till train: " + timeMinuesTillTrain);
		  	var nextArrival = moment().add(timeMinuesTillTrain, "minutes");
		  	var nextArrivalConverted = moment(nextArrival).format("HH:mm");
		  	console.log("next arrival: " + nextArrivalConverted);



		  	$(".trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrivalConverted + "</td><td>" + timeMinuesTillTrain + "</td></tr>" );
		  });
