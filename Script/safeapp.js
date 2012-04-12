var crime = { "CrimeTypeID": "", "DateEntered": "", "Description": "", "GeoLocation": "", "ID": "", "Location": "", "State": "", "StateID": "" };
var feedback = { "StateID": "", "Date": "", "Description": "", "GeoLocationLat": "", "GeoLocationLog": "", "ID": "", "Location": "", "State": "", "Subject": "" }
var baseCrimeAddress = "http://localhost:54978/api/crime/";
var baseFeedBackAddress = "http://localhost:54978/api/ApiFeedBack";
var baseTipsAddress = "http://localhost:54978/api/ApiTips";

function getCurrentLocationAndMap() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {

    navigator.notification.alert(position.coords.latitude)
    navigator.notification.alert(position.coords.longitude);
    alert(position.coords.latitude);
    alert(position.coords.longitude);
    $("#station-map").attr("src", function () {
        return "http://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=11&size=300x300&sensor=false"
    });

  
}

// onError Callback receives a PositionError object
//
function onError(error) {
    navigator.notification.alert(error.message);
    alert(error.message);
}



function loadview(id) {

    $.mobile.changePage("#ViewDetails", { transition: "flip" });
    $.getJSON(baseTipsAddress + "/" + id,
        function (data) {

            $('#ViewDetails-title').text(data.Title);
            $('#ViewDetails-content').text(data.Description);
            $('#ViewDetails-source').text(data.Source);


        });
}

function getTips() {

    $.getJSON(baseTipsAddress,
        function (data) {

            $('#Tips-List li').remove();
            $('#Tips-List').append('<li data-role="list-divider">Security Tips</li>');
            var tips = data;
            $.each(tips, function (index, tip) {

                $('#Tips-List').append('<li><a href="#" onclick="loadview(' + tip.ID + ')">' +
					'<p>' + tip.Title + '</p>' +
					'</a></li>');
            });
            $('#Tips-List').listview('refresh');

        });

}

function postReport(data) {

    $.ajax({
        url: baseCrimeAddress,
        type: "POST",
        dataType: 'json',
        accept: "application/json",
        data: data
    })
      .done(function (data) {
          navigator.notification.alert('Thank you we have received your report, Appropriate action will be taken');
          $("#select-choice-state").prop('selectedIndex', 0);
          $("#location").val('');
          $("#select-choice-crime").prop('selectedIndex', 0);
          $("#crimeDetails").val('');

      }).fail(function (e) {
          alert(e.statusText);
      }).always(function () { });
}

function postFeedBack(data) {

    $.ajax({
        url: baseFeedBackAddress,
        type: "POST",
        dataType: 'json',
        accept: "application/json",
        data: data
    })
      .done(function (data) {
          navigator.notification.alert('Thank you we have received your feedback, Appropriate action will be taken');
          $("#select-choice-feedback-state").prop('selectedIndex', 0);
          $("#feedback-location").val('');
          $("#feedback-subject").val('');
          $("#feedback-crimeDetails").val('');

      }).fail(function (e) {
          alert(e.statusText);
      }).always(function () { });
}

$("#Crime").live('pageinit', function (evt) {

    $("#crimeSubmit").click(function () {
        crime.StateID = $("#select-choice-state").val();
        crime.Location = $("#location").val();
        crime.CrimeTypeID = $("#select-choice-crime").val();
        crime.Description = $("#crimeDetails").val();
        crime.DateEntered = '2011-05-18 17:15:45';
        postReport(crime);
    });
});

$("#Tips").live('pageinit', function (evt) {

    $("#Button1").click(function () {
        getTips();
    });
    getTips();
});
$("#Station").live('pageinit', function (evt) {

    $("#Button2").click(function () {
        getCurrentLocationAndMap();
    });
    getCurrentLocationAndMap();
});
$("#FeedBack").live('pageinit', function (evt) {

    $("#FeedBack-Submit").click(function () {
        feedback.StateID = $("#select-choice-feedback-state").val();
        feedback.Date = '2011-05-18 17:15:45';
        feedback.Description = $("#feedback-crimeDetails").val();
        feedback.Location = $("#feedback-location").val();
        feedback.Subject = $("#feedback-subject").val();
        postFeedBack(feedback);
    });
});