let map;
let service;
let eventMarkers = [];
let infoWindows = [];
let currentMarker;
let routeVisible = false;
let eventLocationsVisible = false;

//Set MHC as center of map
function initMap() {
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

    showCurrentLocation();

    document.getElementById("show-current").addEventListener("click", function () {
        if (currentLocationVisible) {
            hideCurrentLocation();
        } else {
            showCurrentLocation();
        }
    });
};

function showCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

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

            infoWindow = new google.maps.InfoWindow({
                content: `
                <div style="width: 120px">
                    <p>You are here!</p>
                </div> 
            `});
            infoWindow.open(map, currentLocationMarker);
            map.setCenter(currentLocation);
            currentLocationVisible = true;
            document.getElementById("show-current").textContent = "Hide";
        }, () => {
            console.error("Geolocation service failed.");
        });
    } else {
        console.error("Your browser doesn't support geolocation.");
    }
}

function hideCurrentLocation() {
    if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
    }
    currentLocationVisible = false;
    document.getElementById("show-current").textContent = "Show";
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
                resolve(location);
            } else {
                reject('Place not found: ' + status);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener('input', () => {
        fetchPredictions(searchInput.value);
    })
});

function fetchPredictions(input) {
    if (input === '') {
        clearPredictions();
        return;
    }
    const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.2549, -72.5771),
        new google.maps.LatLng(42.2551, -72.5769)
    );
    autocompleteService.getPredictions({
        input: input,
        bounds: bounds,
    }, displayPredictions);
}

function displayPredictions(predictions, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
    }
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = '';

    predictions.forEach(prediction => {
        const listItem = document.createElement('li');
        listItem.textContent = prediction.description;
        listItem.setAttribute("data-place-id", prediction.place_id);
        listItem.setAttribute("data-place-name", prediction.description);
        autocompleteList.appendChild(listItem)
    })

    autocompleteList.style.display = 'block';
}

const autocompleteList = document.getElementById("autocomplete-list");
autocompleteList.addEventListener("click", function (event) {
    if (event.target && event.target.tagName === "LI") {
        const placeId = event.target.getAttribute("data-place-id");
        const placeName = event.target.getAttribute("data-place-name");
        selectPlaceById(placeId);
        startLocation = { lat: currentLocation.lat, lng: currentLocation.lng };
        getPlaceCoordinates(placeName)
        .then(coordinates => {
            destination = coordinates;
                })
        .catch(error => {
            ;
            console.error("Error getting destination coordinates")
        });

    }
})

function clearPredictions() {
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = '';
}

function selectPlaceById(placeId) {
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
            })

            infowindow.setContent(place.name);
            infowindow.open(map, currentMarker);
            clearPredictions();
        }

        else {
            console.error('Error fetching place details:', status);
        }
    });
}

const showButton = document.getElementById("show-route");

showButton.addEventListener("click", () => {
    toggleRoute();
});



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
        }
    });
}

function showRoute(){
    directionsRenderer.setMap(map);
    calculateRoute(startLocation, destination);
    routeVisible = true;
    showButton.textContent = "Hide route";
}

function hideRoute() {
    directionsRenderer.setMap(null);
    routeVisible = false;
    showButton.textContent = "Show route";
}

function toggleRoute() {
    if (routeVisible) {
        hideRoute();
    } else {
        showRoute();
    }
}


const showEvent = document.getElementById("show-event");

showEvent.addEventListener("click", () => {
    toggleLocation();
});


const events = [
    {
        name: "GDGs weekly meeting",
        time: "2024-04-17",
        location: "Kendade Hall",
        notes: "Discuss project updates"
    },

    {
        name: "Study Abroad 101",
        time: "2024-04-17",
        location: "Dwight Hall",
        notes: "Study abroad info session "
    },
];

async function showEventLocations() {
    for (const event of events) {
        try {
            const location = await getPlaceCoordinates(event.location);
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
            const infoWindow = new google.maps.InfoWindow({
                content:`
                <div>
                    <h3>${event.name}</h3>
                    <p><strong>Time:</strong> ${new Date(event.time).toLocaleString()}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Notes:</strong> ${event.notes}</p>
                </div>
                `
            });
        infoWindow.open(map, marker);
        infoWindows.push(infoWindow);
        eventMarkers.push(marker);

        } catch (error) {
            console.error(error);
        }
    }
    eventLocationsVisible = true;
    document.getElementById("show-event").textContent = "Hide event location";
}


function hideEventLocations() {
    eventMarkers.forEach(marker => {
        marker.setMap(null);
    });
    eventMarkers = [];
    eventLocationsVisible = false;
    document.getElementById("show-event").textContent = "Show event location";
}

function toggleLocation() {
    if (eventLocationsVisible) {
        hideEventLocations();
    } else {
        showEventLocations();
    }
}


/*Menu*/
document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('menu-button');
    var menuList = document.getElementById('menu-list');

    menuButton.onclick = function (event) {
        event.stopPropagation();
        menuList.classList.toggle('hidden');
    };

    window.onclick = function (event) {
        if (!menuList.classList.contains('hidden') && !menuButton.contains(event.target)) {
            menuList.classList.add('hidden');
        }
    };
});

// Initialize the map
window.initMap();