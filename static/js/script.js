var map = new Map("mapid");
var geojson = {};

$("#searchBtn").click(async function () {
  let country = $("#searchBox").val();
  data = await getData(country);
  populatePage(data);
  geojson = data["geo"];
  map.setOutline(geojson);
});

async function getData(country) {
  let response = await fetch("../../static/php/main.php?country=" + country);
  let data = await response.json();
  return data;
}

function populatePage(data) {
  console.log(data);
}
