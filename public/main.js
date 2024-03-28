// Function to handle the menu toggle
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    menuToggle.addEventListener("click", function () {
        nav.classList.toggle("collapsed");
        menuToggle.classList.toggle("active");
    });
});

// Function to handle search button click and display output section
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector('.btn');
    const outputSection = document.getElementById('output');
    const touristicPlacesList = document.getElementById('touristic-places-list');

    searchButton.addEventListener('click', async function () {
        outputSection.style.display = 'block'; // Show the output section when search button is clicked

        // Call function to calculate route and fetch nearby places
        await calculateRouteAndDisplayTouristicPlaces();

        // Show only the touristic-places-list after places are fetched
        touristicPlacesList.style.display = 'block';

        // Add event listener for each list item to trigger OpenAI interaction when clicked
        const nearbyPlaces = document.querySelectorAll('.nearby-place');
        nearbyPlaces.forEach(listItem => {
            listItem.addEventListener('click', function () {
                // Extract the name of the place from the list item
                const placeName = this.textContent;

                // Call function to interact with OpenAI, passing the name of the place
                interactWithOpenAI(placeName);
            });
        });
    });
});
async function interactWithOpenAI(placeName) {
    try {
        // Make a POST request to the server-side endpoint for OpenAI interaction
        const response = await fetch('/openai-interaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: `Would you like more information about ${placeName}?`
            })
        });

        const data = await response.json();
        // Display the response from OpenAI to the user
        displayOpenAIResponse(data.response);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayOpenAIResponse(response) {
    // Display the response from OpenAI to the user, e.g., in a popup message or modal.. to be implemented!!

    alert(response); //gets undefined at the moment.
}

// Define global variables for map and directions
let map, directionsService, directionsRenderer;

// Define function to initialize Google Map
function initMap() {
    // Initialize DirectionsService and DirectionsRenderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // Create a new map centered at a specific location (Example: London)
    map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 7,
        center: { lat: 51.509865, lng: -0.118092 } // Example: London
    });

    // Set the DirectionsRenderer to render directions on the map
    directionsRenderer.setMap(map);

    // Initialize autocomplete for origin input field - restricted to the UK
    const originInput = document.getElementById("from");
    const originAutocomplete = new google.maps.places.Autocomplete(originInput, {
        types: ['geocode'],
        componentRestrictions: { country: "uk" }
    });

    // Initialize autocomplete for destination input field - restricted to the UK
    const destinationInput = document.getElementById("to");
    const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
        types: ['geocode'],
        componentRestrictions: { country: "uk" }
    });
}

// Define function to load Google Maps API
async function loadGoogleMapsAPI() {
    try {
        // Fetch Google Maps API key
        const response = await fetch('http://localhost:3000/api/maps-api-key');
        const data = await response.json();
        const apiKey = data.apiKey;

        // Create script element to load Google Maps API with key
        const script = document.createElement('script');
        const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.src = url;
        script.async = true;
        script.defer = true;

        // Append script element to document head
        document.head.appendChild(script);
    } catch (error) {
        console.error("Failed to load the Google Maps API key.", error);
    }
}


async function fetchNearbyPlaces(location, radius) {
    try {
        // Add class to map container
        const mapContainer = document.getElementById('googleMap');
        mapContainer.classList.add('map-fixed');

        // Get coordinates by location
        console.log("Fetching nearby places for location:", location);
        const coordinates = await getCoordinatesByLocation(location);
        if (!coordinates) return; // If coordinates are null, exit the function

        // Construct the request URL with latitude, longitude, types, and other parameters
        const { lat, lng } = coordinates;
        console.log("Latitude:", lat, "Longitude:", lng);

        // Append a unique parameter to bypass caching
        const uniqueParam = new Date().getTime(); // Current timestamp
        const url = `http://localhost:3000/places?location=${lat},${lng}&type=museum&radius=${radius}&unique=${uniqueParam}`;
        console.log(url);

        // Fetch nearby places from server
        const res = await fetch(url);
        const data = await res.json(); // Parse response data as JSON
        console.log("Nearby places:", data);

        // Clear previous list items
        const placesList = document.getElementById("touristic-places-list");
        placesList.innerHTML = "";

        // Iterate through the nearby places and create list items
        data.results.forEach(place => {
            const listItem = document.createElement("li");
            listItem.textContent = place.name;
            listItem.classList.add("nearby-place"); // Add nearby-place class
            placesList.appendChild(listItem);

            listItem.addEventListener("click", function () {
                // Remove any existing popup messages
                const existingPopupMessages = document.querySelectorAll('.popup-message');
                existingPopupMessages.forEach(message => message.remove());

                // Create a new popup message
                const popupMessage = document.createElement('div');
                popupMessage.classList.add('popup-message');
                popupMessage.textContent = `For more info about ${place.name}, click here`;

                // Append the popup message as a child of the clicked list item
                listItem.appendChild(popupMessage);

                // Remove the popup message after 3 seconds
                setTimeout(function () {
                    popupMessage.remove();
                }, 3000);
            });
        });

        // Show the touristic-places section
        document.getElementById("touristic-places").style.display = "block";
    } catch (error) {
        console.error("Failed to fetch nearby places:", error);
        // Handle error, e.g., show a message to the user
        // Throw the error again if you want to propagate it further!!
        throw error;
    }
}


// Call function to fetch nearby places after its definition
fetchNearbyPlaces("London", 10000); // Example call with default location and radius
// fetchNearbyPlaces(location, radius);


// Define function to get coordinates by location using server-side endpoint
async function getCoordinatesByLocation(location) {
    try {
        // Make a request to the server-side endpoint to fetch coordinates
        const response = await fetch(`http://localhost:3000/api/geocode?location=${encodeURIComponent(location)}`);
        const data = await response.json();

        if (response.ok) {
            console.log("Coordinates:", data.lat, data.lng);
            return { lat: data.lat, lng: data.lng }; // Return coordinates as an object
        } else {
            console.error("Failed to fetch coordinates:", data.error);
            throw new Error("Failed to fetch coordinates");
        }
    } catch (error) {
        console.error("Failed to get coordinates by location:", error);
        return null; // Return null if there's an error
    }
}


// Function to calculate route and fetch nearby places
async function calculateRouteAndDisplayTouristicPlaces() {
    await calcRoute(); // Calculate route
    const origin = document.getElementById("from").value; // Get origin value
    const destination = document.getElementById("to").value; // Get destination value
    const radius = 10000; // Example radius (adjust as needed)
    await fetchNearbyPlaces(destination, radius); // Fetch nearby places using destination
}


// Function to calculate route
async function calcRoute() {
    const origin = document.getElementById("from").value;
    const destination = document.getElementById("to").value;
    const output = document.querySelector('#output');

    const request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            const route = result.routes[0].legs[0];
            output.innerHTML = `<div class='alert-info'>From: ${origin}.<br />To: ${destination}.<br />Driving distance <i class='fas fa-road'></i> : ${route.distance.text}.<br />Duration <i class='fas fa-hourglass-start'></i> : ${route.duration.text}.</div>`;
        } else {
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not display the map route.</div>";
        }
    });
}

// Call function to load Google Maps API
loadGoogleMapsAPI();