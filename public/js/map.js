mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 13,
    center: coordinates
});


const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)//listing.geometry.coordinates
        .addTo(map);
