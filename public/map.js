// Start with a default unlocked country
let unlockedCountries = JSON.parse(localStorage.getItem("unlockedCountries"));

if (!unlockedCountries || unlockedCountries.length === 0) {
    unlockedCountries = ['United Kingdom'];
    localStorage.setItem("unlockedCountries", JSON.stringify(unlockedCountries))
}

// Function to unlock a country by ISO code
function unlockCountry(countryName) {
    if (!unlockedCountries.includes(countryName)) {
        unlockedCountries.push(countryName);
        localStorage.setItem("unlockedCountries", JSON.stringify(unlockedCountries));
    }
}

// Initialise map
initMap();

// Initialise Leaflet Map
function initMap() {
    console.log('Initializing map');
    const map = L.map('map').setView([20, 0], 2); // World View
    console.log('Map initialized');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetch('geojson/countries.geo.json') // GeoJSON file with all countries
        .then(res => res.json())
        .then(geojson => {
            console.log('Unlocked countries:', unlockedCountries);
            L.geoJSON(geojson, {
                style: feature => ({

                    fillColor: unlockedCountries.includes(feature.properties.name) ? '#22d3ee' : '#888',
                    weight: 1,
                    color: '#555',
                    fillOpacity: 0.7

                }),
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        if (unlockedCountries.includes(feature.properties.name)) {
                            window.location.href = 'game.html?country=' + feature.properties.name;
                        } else {
                            alert("This country is locked! Solve previous questions to unlock.");
                        }
                    });
                }
            }).addTo(map);
        });
}