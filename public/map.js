let map;
let service;
let infowindow;
let autocompleteService;
<<<<<<< HEAD
let directionsService;
let directionsRenderer;
let currentLocation; // Store the user's current location
let routeVisible = false; // Track whether the route is currently visible
let currentLocationMarker; // Store the current location marker
let currentLocationVisible = false; // Track whether the current location marker is visible
let eventMarkers = []; // Array to store event markers
let eventLocationsVisible = false; // Track whether event locations are visible

=======
let currentMarker;
let directionsService;
let directionsRenderer;
let currentLocation;
let routeVisible = false; 
let currentLocationMarker; 
let currentLocationVisible = false; 
let eventMarkers = []; 
let eventLocationsVisible = false; 

//Set MHC as center of map
>>>>>>> susan_dev
window.initMap = function () {
    const MHC = { lat: 42.2550, lng: -72.5770 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: MHC,
        zoom: 17,
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    autocompleteService = new google.maps.places.AutocompleteService();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

<<<<<<< HEAD
    // Automatically show current location on map load
    showCurrentLocation();

    // Add event listener for the search input
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function () {
        const query = searchInput.value;
        if (query) {
            getAutocompleteSuggestions(query);
        } else {
            clearAutocompleteList();
        }
    });

    // Add event listener for the show/hide route button
    document.getElementById("show-route").addEventListener("click", function () {
        if (routeVisible) {
            hideRoute();
        } else {
            showRoute();
        }
    });

    // Add event listener for the show/hide current location button
=======
    showCurrentLocation();

>>>>>>> susan_dev
    document.getElementById("show-current").addEventListener("click", function () {
        if (currentLocationVisible) {
            hideCurrentLocation();
        } else {
            showCurrentLocation();
        }
    });
<<<<<<< HEAD

    // Add event listener for the show/hide event locations button
    document.getElementById("show-event").addEventListener("click", function () {
        if (eventLocationsVisible) {
            hideEventLocations();
        } else {
            showEventLocations();
        }
    });
};

function getAutocompleteSuggestions(query) {
=======
};

//add search boxes for location input 
document.addEventListener('DOMContentLoaded', function () {
    initializeAutocomplete("search-input", "autocomplete-list");
    initializeAutocomplete("start-location", "autocomplete-list2");
    initializeAutocomplete("destination", "autocomplete-list3");
    document.getElementById("show-route").addEventListener("click", toggleRoute);
});

function initializeAutocomplete(inputId, listId) {
    const inputField = document.getElementById(inputId);
    const autocompleteList = document.getElementById(listId);

    inputField.addEventListener("input", function () {
        const query = inputField.value;
        if (query) {
            getAutocompleteSuggestions(query, autocompleteList, inputField);
        } else {
            clearAutocompleteList(inputField);
        }
    });

    autocompleteList.addEventListener("click", function (event) {
        if (event.target && event.target.matches("div")) {
            const placeId = event.target.getAttribute("data-place-id");
            const inputId = inputField.id;
            selectPlaceById(placeId, autocompleteList, inputId); 
        }
    });
}

function getAutocompleteSuggestions(query, list, inputField) {
>>>>>>> susan_dev
    const request = {
        input: query,
    };

    autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
<<<<<<< HEAD
            displayAutocompleteList(predictions);
        } else {
            clearAutocompleteList();
=======
            displayAutocompleteList(predictions, list, inputField);
        } else {
            clearAutocompleteList(list);
>>>>>>> susan_dev
        }
    });
}

<<<<<<< HEAD
function displayAutocompleteList(predictions) {
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = ''; // Clear previous suggestions
    autocompleteList.style.display = 'block'; // Show the list

    predictions.forEach(prediction => {
        const listItem = document.createElement("div");
        listItem.textContent = prediction.description;
        listItem.style.cursor = "pointer";
        listItem.onclick = () => {
            selectPlace(prediction);
        };
        autocompleteList.appendChild(listItem);
    });
}

function clearAutocompleteList() {
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = ''; // Clear suggestions
    autocompleteList.style.display = 'none'; // Hide the list
}

function selectPlace(prediction) {
    const placeId = prediction.place_id;

    // Get place details
    service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Center the map on the selected place
            map.setCenter(place.geometry.location);
            // Optionally, add a marker or show an info window
            const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
            });
            infowindow.setContent(place.name);
            infowindow.open(map, marker);
            clearAutocompleteList(); // Clear suggestions after selection

            // Store the selected place location
            const destination = place.geometry.location;

            // Get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    // Center the map on the user's location
                    map.setCenter(currentLocation);
                }, () => {
                    console.error("Geolocation service failed.");
                });
            } else {
                console.error("Your browser doesn't support geolocation.");
            }
=======
function displayAutocompleteList(predictions, list) {
    list.innerHTML = ''; 
    list.style.display = 'block'; 

    predictions.forEach(prediction => {
        const item = document.createElement("div");
        item.textContent = prediction.description; 
        item.setAttribute("data-place-id", prediction.place_id); 
        list.appendChild(item);
    });
}

function clearAutocompleteList(list) {
    list.innerHTML = ''; 
}

function selectPlaceById(placeId,autocompleteList, inputId) {
    const service = new google.maps.places.PlacesService(map);

    service.getDetails({ placeId: placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(place.geometry.location);

            if (currentMarker) {
                currentMarker.setMap(null); 
            }

            currentMarker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
            });

            infowindow.setContent(place.name);
            infowindow.open(map, currentMarker); 
            clearAutocompleteList(autocompleteList);
            document.getElementById(inputId).value = place.name;
        } else {
            console.error('Error fetching place details:', status);
>>>>>>> susan_dev
        }
    });
}

function showRoute() {
<<<<<<< HEAD
    if (!currentLocation) {
        alert("Please select a place first.");
        return;
    }

    // Create a Directions request
    const request = {
        origin: currentLocation,
        destination: map.getCenter(), // Use the last selected place's location
        travelMode: google.maps.TravelMode.WALKING // Change to WALKING, BICYCLING, etc. as needed
    };

    // Calculate and display the route
    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            routeVisible = true; // Set route visibility to true
            document.getElementById("show-route").textContent = "Hide route"; // Change button text
        } else {
            console.error('Directions request failed due to ' + status);
=======
    const startLocation = document.getElementById("start-location").value;
    const destination = document.getElementById("destination").value;

    if (!startLocation || !destination) {
        alert("Please enter both start location and destination.");
        return;
    }
    getPlaceCoordinates(startLocation)
        .then(startCoords => {
            return getPlaceCoordinates(destination).then(destinationCoords => {
                calculateRoute(startCoords, destinationCoords);
            });
        })
        .catch(error => {
            console.error(error);
            alert("Could not find one of the locations. Please check your input.");
        });

    routeVisible=true;
    document.getElementById("show-route").textContent = "Hide route";
}

function calculateRoute(startCoords, destinationCoords) {
    const request = {
        origin: startCoords,
        destination: destinationCoords,
        travelMode: google.maps.TravelMode.WALKING 
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert('Directions request failed due to ' + status);
>>>>>>> susan_dev
        }
    });
}

<<<<<<< HEAD
function hideRoute() {
    directionsRenderer.setMap(null); // Hide the route
    routeVisible = false; // Set route visibility to false
    document.getElementById("show-route").textContent = "Show route"; // Change button text
}

=======

function hideRoute() {
    directionsRenderer.setMap(null); 
    routeVisible = false;
    document.getElementById("show-route").textContent = "Show route"; // Change button text
}

function toggleRoute() {
    if (routeVisible) {
        hideRoute();
    } else {
        showRoute(); 
    }
}


>>>>>>> susan_dev
function showCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

<<<<<<< HEAD
            // Create a red marker for the current location
=======
>>>>>>> susan_dev
            currentLocationMarker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: "Current location!",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "red",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "white"
                }
            });

<<<<<<< HEAD
            // Center the map on the user's current location
=======
>>>>>>> susan_dev
            infoWindow = new google.maps.InfoWindow({
                content: `
                <div style="width: 120px">
                    <p>You are here!</p>
                </div> 
            `});
            infoWindow.open(map, currentLocationMarker);
            map.setCenter(currentLocation);
<<<<<<< HEAD
            currentLocationVisible = true; // Set visibility to true
            document.getElementById("show-current").textContent = "Hide"; // Change button text
=======
            currentLocationVisible = true; 
            document.getElementById("show-current").textContent = "Hide"; 
>>>>>>> susan_dev
        }, () => {
            console.error("Geolocation service failed.");
        });
    } else {
        console.error("Your browser doesn't support geolocation.");
    }
}

function hideCurrentLocation() {
    if (currentLocationMarker) {
<<<<<<< HEAD
        currentLocationMarker.setMap(null); // Remove the marker from the map
    }
    currentLocationVisible = false; // Set visibility to false
    document.getElementById("show-current").textContent = "Show"; // Change button text
=======
        currentLocationMarker.setMap(null); 
    }
    currentLocationVisible = false; 
    document.getElementById("show-current").textContent = "Show"; 
>>>>>>> susan_dev
}

function getPlaceCoordinates(placeName) {
    return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(map);
        service.findPlaceFromQuery({
            query: placeName,
            fields: ['geometry']
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
                const location = results[0].geometry.location;
<<<<<<< HEAD
                resolve(location); // Resolve the Promise with the location
            } else {
                reject('Place not found: ' + status); // Reject the Promise if not found
=======
                resolve(location); 
            } else {
                reject('Place not found: ' + status); 
>>>>>>> susan_dev
            }
        });
    });
}

const events = [
<<<<<<< HEAD
    {
        name: "Meeting at Blanch",
        time: "2023-10-01T10:00:00",
        location: "Blanchard",
        notes: "Discuss project updates."
=======
    {name: "GDG weekly meeting",
        time: "2024-12-05",
        location: "Blanchard",
        notes: "Discuss project updates"
>>>>>>> susan_dev
    },
];

async function showEventLocations() {
    for (const event of events) {
        try {
<<<<<<< HEAD
            const location = await getPlaceCoordinates(event.location); // Get coordinates for the event location
=======
            const location = await getPlaceCoordinates(event.location); 
>>>>>>> susan_dev
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: event.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "blue",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "white"
                }
            });


            infowindow.setContent(`
                    <div>
                        <h3>${event.name}</h3>
                        <p><strong>Time:</strong> ${new Date(event.time).toLocaleString()}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Notes:</strong> ${event.notes}</p>
                    </div>
                 `);
            infowindow.open(map, marker);
<<<<<<< HEAD
            eventMarkers.push(marker); // Store the marker in the array
        } catch (error) {
            console.error(error); // Handle errors (e.g., place not found)
        }
    }
    eventLocationsVisible = true; // Set visibility to true
    document.getElementById("show-event").textContent = "Hide event locations"; // Change button text
=======
            eventMarkers.push(marker); 
        } catch (error) {
            console.error(error); 
        }
    }
    eventLocationsVisible = true; 
    document.getElementById("show-event").textContent = "Hide event locations"; 
>>>>>>> susan_dev
}

function hideEventLocations() {
    eventMarkers.forEach(marker => {
<<<<<<< HEAD
        marker.setMap(null); // Remove each marker from the map
    });
    eventMarkers = []; // Clear the markers array
    eventLocationsVisible = false; // Set visibility to false
    document.getElementById("show-event").textContent = "Show event locations"; // Change button text
=======
        marker.setMap(null); 
    });
    eventMarkers = []; 
    eventLocationsVisible = false; 
    document.getElementById("show-event").textContent = "Show event locations"; 
>>>>>>> susan_dev
}

/*Menu*/
document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('menu-button');
    var menuList = document.getElementById('menu-list');

<<<<<<< HEAD
    // Show the menu when the button is clicked
    menuButton.onclick = function (event) {
        event.stopPropagation(); // Prevent affecting parent elements like the window
        menuList.classList.toggle('hidden'); // If the window is closed, open it, and vise versa
    };

    // Closing the menu when clicking anywhere outside of it in the window
    window.onclick = function (event) {
        //checks if menu is visable and if the click does not occur on menu button
=======
    menuButton.onclick = function (event) {
        event.stopPropagation(); 
        menuList.classList.toggle('hidden'); 
    };

    window.onclick = function (event) {
>>>>>>> susan_dev
        if (!menuList.classList.contains('hidden') && !menuButton.contains(event.target)) {
            menuList.classList.add('hidden');
        }
    };
});

// Initialize the map
<<<<<<< HEAD
initMap();
=======
initMap();




>>>>>>> susan_dev
