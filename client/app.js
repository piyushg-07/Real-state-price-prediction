// Function to get the number of bathrooms from selected radio buttons
function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Return -1 if no value is selected
}

// Function to get the number of BHK from selected radio buttons
function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Return -1 if no value is selected
}

// Function triggered when the 'Estimate Price' button is clicked
function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations").value;
    var estPrice = document.getElementById("uiEstimatedPrice");

    if (!sqft.value || isNaN(parseFloat(sqft.value)) || bhk === -1 || bathrooms === -1 || !location) {
        estPrice.innerHTML = "<h2>Please provide valid input values.</h2>";
        console.error("Invalid input values detected.");
        return;
    }

    var url = "http://127.0.0.1:5000/predict_home_price"; // Ensure this matches your backend endpoint

    
    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location
    })
    .done(function(data, status) {
        console.log("Response received:", data);
        if (data && data.estimated_price) {
            estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
        } else {
            estPrice.innerHTML = "<h2>Unable to estimate the price. Please try again later.</h2>";
            console.error("Unexpected response format:", data);
        }
        console.log("Status:", status);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error during request:", textStatus, errorThrown);
        estPrice.innerHTML = "<h2>Error while estimating the price. Please check the console for details.</h2>";
    });
}

// Function to load the location names on page load
function onPageLoad() {
    console.log("Document loaded");
    var url = "http://127.0.0.1:5000/get_location_names"; // Replace with your backend URL if needed

    $.get(url)
    .done(function(data) {
        console.log("Got response for get_location_names request", data);
        if (data && Array.isArray(data.locations) && data.locations.length > 0) {
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            $('#uiLocations').append(new Option("Choose a Location", "", true, true)); // Default option
            data.locations.forEach(function(location) {
                $('#uiLocations').append(new Option(location));
            });
        } else {
            console.error("No valid locations found in response.");
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error during location request:", textStatus, errorThrown);
    });
}

// Load locations when the window is loaded
window.onload = onPageLoad;
