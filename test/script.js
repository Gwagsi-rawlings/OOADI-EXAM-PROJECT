// Get references to the DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const recentSearchesList = document.getElementById('recent-searches-list');
const addToItinerary = document.getElementById('add-to-itinerary');
const itineraryInput = document.getElementById('itinerary-input');
const shareLocationButton = document.getElementById('share-location');

// Array to store recent searches
let recentSearches = [];

// Function to add a new search to the recent searches list
function addToRecentSearches(location) {
  if (recentSearches.includes(location)) {
    recentSearches.splice(recentSearches.indexOf(location), 1);
  }
  recentSearches.unshift(location);
  recentSearches = recentSearches.slice(0, 5); // Keep only the 5 most recent searches
  updateRecentSearchesList();
}

// Function to update the recent searches list in the DOM
function updateRecentSearchesList() {
  recentSearchesList.innerHTML = '';
  recentSearches.forEach((location) => {
    const listItem = document.createElement('li');
    listItem.textContent = location;
    recentSearchesList.appendChild(listItem);
  });
}

// Add event listeners
searchButton.addEventListener('click', () => {
  const location = searchInput.value.trim();
  if (location) {
    addToRecentSearches(location);
    searchInput.value = '';
    // Perform search functionality here
    console.log(`Searching for: ${location}`);
  }
});

addToItinerary.addEventListener('click', () => {
  const itineraryName = itineraryInput.value.trim();
  if (itineraryName) {
    // Implement itinerary functionality here
    console.log(`Adding to itinerary: ${itineraryName}`);
    itineraryInput.value = '';
  }
});

shareLocationButton.addEventListener('click', () => {
  // Implement share location functionality here
  console.log('Sharing location');
});







const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

