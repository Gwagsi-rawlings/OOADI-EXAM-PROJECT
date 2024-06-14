// URL of the API endpoint
const baseURL = 'http://127.0.0.1:8000'; // Replace with your FastAPI server URL

// Get references to the DOM elements
const searchInput = document.getElementById('search-input');
const locationsList = document.getElementById('results');
const searchButton = document.getElementById('search-button');
const addToItinerary = document.getElementById('add-to-itinerary');
const itineraryInput = document.getElementById('itinerary-input');
let params = new URLSearchParams(window.location.search);
let location = params.get('location'); // get the value of 'location'
let locationName = params.get('address');
let currentMarker = null;
let myLocation = null;
let routePolyline;
// Function to fetch autocomplete suggestions
const fetchLocations = async (query) => {
    console.log('fetching locations')
    try {
        const response = await axios.get(`${baseURL}/locations?query=${query}`);
        const locations = response.data.map(location => location);

        // Clear previous suggestions
        locationsList.innerHTML = '';

        // Populate datalist with new suggestions
        locations.forEach(location => {
            //console.log (location)
            const list = document.createElement('li');
            const aTag = document.createElement('a');
            aTag.setAttribute('href', '?location=' + location.latitude + ',' + location.longitude + '&address=' + encodeURIComponent(location.address));
            aTag.innerHTML = location.name;
            list.appendChild(aTag); 
            locationsList.appendChild(list);
            console.log(locationsList.innerHTML)
        });
    } catch (error) {
        console.error('There was a problem fetching locations:', error);
    }
};

// Event listener for search input changes
searchInput.addEventListener('input', (event) => {
    
    const query = event.target.value.trim(); // Get input value and trim whitespace
    if (query.length >= 2) {  
        fetchLocations(query); // Fetch locations based on input
    }  
});


locationsList.addEventListener('click', (event) => {
    console.log('clicked')
    event.preventDefault(); // Prevent default link behavior
    const target = event.target;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      const newParams = new URLSearchParams(href);
      location = newParams.get('location'); 
      locationName = newParams.get('address');
  
      if (location) {
        let [latitude, longitude] = location.split(','); 
        
        // Remove existing marker if it exists
        if (currentMarker) {
          map.removeLayer(currentMarker);
        }
  
       // Create new marker
currentMarker = L.marker([latitude, longitude]).addTo(map);

// Create a button and add it to the popup
var btn = document.createElement("button");
btn.innerHTML = "Get Route";
btn.addEventListener("click", function() {
  alert("Button clicked!");
  getRoute(myLocation, [latitude, longitude]);
});

// Create a popup and add the button to it
var popup = L.popup().setContent(btn);

// Bind the popup to the marker
currentMarker.bindPopup(popup).openPopup();
        // Adjust the map view
        map.setView([latitude, longitude], 9); 
        locationsList.innerHTML = '';
      }
    }
  });



// Initialize the map
var map = L.map("map").setView([3.841205, 11.5422263], 4); // Yaoundé, Cameroon

// Add the map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

 
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        var myIcon = L.icon({
            iconUrl: 'assets/standing-up-man_10522.png',
            iconSize: [38, 95], // Size of the icon
            iconAnchor: [22, 94], // Point of the icon which will correspond to marker's location
            popupAnchor: [-3, -76] // Point from which the popup should open relative to the iconAnchor
          });
          myLocation = [latitude, longitude];
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        map.setView([latitude, longitude], 30)  ;
       var msrker=  L.marker([latitude, longitude], {icon: myIcon}).addTo(map);
       msrker.bindTooltip("My Location", {
        permanent: true, 
        direction: 'right',
        className: 'my-label'
    }).openTooltip();
        // Use the coordinates as needed
      },
      (error) =>{
        console.error("Error getting location:", error.message);
        // Handle errors appropriately
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  
 
  

  const getRoute = async (origin, destination) => {
    try {
        const response = await axios.get(`${baseURL}/directions?origin=${origin}&destination=${destination}`);
        const directionsData = response.data;
        //console.log(directionsData[0].overview_polyline.points)
        
        // Extract polyline points
        const polylinePoints = L.PolylineUtil.decode(directionsData[0].overview_polyline.points);
        //console.log(polylinePoints)
        // Remove existing route if it exists
        if (routePolyline) {
            map.removeLayer(routePolyline);
        }

        // Create and add polyline for the route
        routePolyline = L.polyline(polylinePoints, { color: 'blue' }).addTo(map);

        // Fit the map to the bounds of the route
        map.fitBounds(routePolyline.getBounds());

        // Display turn-by-turn directions  
        // const directionsList = document.getElementById("directions-list");
        // directionsList.innerHTML = ''; // Clear previous directions
        // const steps = directionsData[0].legs[0].steps;
        // for (const step of steps) {
        //     const listItem = document.createElement("li");
        //     listItem.innerHTML = `<b>${step.html_instructions}</b> (${step.distance.text}, ${step.duration.text})`;
        //     directionsList.appendChild(listItem);
        //}
    } catch (error) {
        console.error('Error getting route:', error);
    }
};
   



 