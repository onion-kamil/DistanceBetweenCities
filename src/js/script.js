const myLatLng = {
    lat: 51.5,
    lng: -0.1
};

const mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

const map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

const directionsService = new google.maps.DirectionsService();
const directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);

function calcRoute() {
    const request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    directionsService.route(request, function(result, status){
        if(status == google.maps.DirectionsStatus.OK) {
            $("#output").html("<div class='alert alert-success'>From: "+ document.getElementById("from").value+"<br />To: "+document.getElementById("to").value+"<br />Draving distance: "+result.routes[0].legs[0].distance.text+"<br />Duration: "+result.routes[0].legs[0].duration.text+"</div>");

            directionsDisplay.setDirections(result);
        } else {
            directionsDisplay.setDirections({routes: []});
            map.setCenter(myLatLng);
            $("#output").html("<div class='alert alert-danger'>Could not retrieve driving distance.</div>")
        }
    })
}

var options = {
    types: ['(cities)']   
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);

const submit = $("#submit");
submit.click(calcRoute);