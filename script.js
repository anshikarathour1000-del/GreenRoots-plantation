let treeCount = 1000;

function adoptTree() {
    treeCount++;

document.getElementById("treeCount").innerText= treeCount + "+";
alert("Congratulations! You adopted a tree");
}

// Initialize Map
const map = L.map('map').setView([26.8467, 80.9462], 11);

// Add OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Plantation locations
const locations = [
    {
        name: "Gomti Nagar Park",
        lat: 26.8530,
        lng: 81.0160,
        trees: 200
    },
    {
        name: "Hazratganj Area",
        lat: 26.8500,
        lng: 80.9400,
        trees: 150
    },
    {
        name: "Aliganj Colony",
        lat: 26.8900,
        lng: 80.9400,
        trees: 100
    },
    {
        name: "Vikas Nagar",
        lat: 26.8900,
        lng: 80.9600,
        trees: 100
    },
    {
        name: "Janeshwar Mishra Park",
        lat: 26.8320,
        lng: 80.9520,
        trees: 250
    },
    {
        name: "Indira Nagar",
        lat: 26.8780,
        lng: 80.9990,
        trees: 180
    },
    {
        name: "Alambagh",
        lat: 26.8070,
        lng: 80.9020,
        trees: 200
    }

];

// Add markers
locations.forEach(loc => {
    L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(
            `<b>${loc.name}</b><br>${loc.trees} trees planted`
        );
});

// Add marker when user clicks on map
map.on('click', function(e) {
    L.marker(e.latlng)
        .addTo(map)
        .bindPopup('Potential Tree Plantation Location')
        .openPopup();
});



