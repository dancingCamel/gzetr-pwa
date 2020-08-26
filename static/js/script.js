$(document).ready(function(){
    var mymap = L.map('mapid').setView([51.505, -0.09], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        // save this key to env vars. already refreshed token
        accessToken: 'pk.eyJ1IjoiZGFuY2luZ2NhbWVsIiwiYSI6ImNrZWFqbTZtNjAxOHcyem5yNDl2bTI4NHUifQ.6NM95gEke5TS2wEGOT8zDw'
    }).addTo(mymap);
})

$('#searchBtn').click(function(){
    alert('clicked');
})

