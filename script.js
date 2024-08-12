// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFya3BsYXRlcyIsImEiOiJjbHpxcGhpdGQwd3FuMnFzM3pxMmxoMzNjIn0.qMNONw0hdb__b381URmP1g'; // Mapbox access token

// Initialize the map
var map = new mapboxgl.Map({
    container: 'map', // ID of the container where the map will be rendered
    style: 'mapbox://styles/mapbox/satellite-v9', // Mapbox style for satellite view
    center: [78.4867, 17.3850], // Starting position [longitude, latitude] for Hyderabad
    zoom: 10, // Initial zoom level
    pitch: 45, // Angle of view (for 3D effect)
    bearing: -17.6 // Rotation of the map
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Function to fetch trending news from NewsAPI based on coordinates
async function fetchTrendingNews(lat, lon) {
    const apiKey = 'ea4c382a07cc403bb7873c1c4368fa4a'; // NewsAPI key
    const url = `https://newsapi.org/v2/everything?q=${lat},${lon}&apiKey=${apiKey}`;

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
map.on('moveend', function() {
    // Get the current center coordinates of the map
    const center = map.getCenter();
    const lat = center.lat;
    const lon = center.lng;

    // Fetch news based on the new center coordinates
    fetchTrendingNews(lat, lon);
});

// Initial fetch of news for the starting position
const initialCenter = map.getCenter();
fetchTrendingNews(initialCenter.lat, initialCenter.lng);
