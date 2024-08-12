

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFya3BsYXRlcyIsImEiOiJjbHpxcGhpdGQwd3FuMnFzM3pxMmxoMzNjIn0.qMNONw0hdb__b381URmP1g'; // Replace with your Mapbox access token

// Initialize the map with satellite streets style for labels and borders
var map = new mapboxgl.Map({
    container: 'map', // ID of the container where the map will be rendered
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // Mapbox style with labels and borders
    center: [78.4867, 17.3850], // Starting position [longitude, latitude] for Hyderabad
    zoom: 10, // Initial zoom level
    pitch: 45, // Angle of view (for 3D effect)
    bearing: -17.6 // Rotation of the map
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Reverse geocode coordinates to get the nearest city name
async function getCityName(lat, lon) {
    const apiKey = 'your_mapbox_geocoding_api_key'; // Replace with your Mapbox Geocoding API key
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${apiKey}&types=place`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const placeName = data.features[0]?.place_name || 'Unknown Location';
        return placeName.split(",")[0]; // Return the city name
    } catch (error) {
        console.error('Error fetching city name:', error);
        return 'Unknown Location';
    }
}

// Function to fetch trending news from NewsAPI based on city name
async function fetchTrendingNews(city) {
    const apiKey = 'ea4c382a07cc403bb7873c1c4368fa4a'; // Replace with your NewsAPI key
    const url = `https://newsapi.org/v2/everything?q=${city}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayNewsArticles(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Function to display news articles in the sidebar
function displayNewsArticles(articles) {
    const newsContainer = document.getElementById('news-articles');
    newsContainer.innerHTML = ''; // Clear previous articles

    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news found for this location.</p>';
        return;
    }

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';

        const title = document.createElement('h3');
        title.textContent = article.title;

        const description = document.createElement('p');
        description.textContent = article.description;

        articleDiv.appendChild(title);
        articleDiv.appendChild(description);
        newsContainer.appendChild(articleDiv);
    });
}

// Event listener for when the user stops interacting with the map (e.g., after zooming or panning)
map.on('moveend', async function() {
    // Get the current center coordinates of the map
    const center = map.getCenter();
    const lat = center.lat;
    const lon = center.lng;

    // Get the city name based on the current center coordinates
    const city = await getCityName(lat, lon);

    // Fetch news based on the city name
    fetchTrendingNews(city);
});

// Initial fetch of news for the starting position
getCityName(map.getCenter().lat, map.getCenter().lng).then(city => {
    fetchTrendingNews(city);
});
