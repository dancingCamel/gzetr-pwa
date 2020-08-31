var map = new Map("mapid");
var geojson = {};
var error = false;
var errorMessage = "";

$("#searchBtn").click(async function () {
  showLoader();

  let country = $("#searchBox").val();
  data = await getData(country);
  populatePage(data);

  geojson = data["geo"];
  map.setOutline(geojson);

  hideLoader();
});

async function getData(country) {
  let response = await fetch("../../static/php/main.php?country=" + country);
  let data = await response.json();
  return data;
}

function populatePage(data) {
  console.log(data);
  populatePrimary(data);
  populateIntro(data);
  populateEconomy(data);
  populateDemographics(data);
  populateClimate(data);
  populateEducation(data);
  populateGeography(data);
  populateTimezones(data);
  populateHealth(data);
}

function populatePrimary(data) {
  $("#countryName").html(data["rc"]["name"]);
  $("#noun").html(data["fb"]["noun"]);
  $("#adj").html(data["fb"]["adj"]);
  $("#flag").attr("src", data["rc"]["flag"]);
  $("#capital").html(data["rc"]["capital"]);
  $("#area").html(data["rc"]["area"].toLocaleString());
  $("#population").html(data["rc"]["population"].toLocaleString());
  $("#gdp").html(data["fb"]["gdpLatest"].toLocaleString());
  $("#gdpCapita").html(data["fb"]["capitaLatest"].toLocaleString());

  let languages = [];
  data["rc"]["languages"].forEach((element) => {
    languages.push(element.name);
  });
  $("#mainLang").html(languages.join(", "));
  $("#tld").html(data["rc"]["tld"].join(", "));
  $("#callingCode").html(data["rc"]["callingCodes"].join(", "));
  $("#currencySymbol").html(data["oc"]["currencySymbol"]);
  $("#currencyName").html(data["oc"]["currencyName"]);
  $("#wikiLink").attr(
    "href",
    "https://wikipedia.com/wiki/" + data["geo"]["properties"]["NAME"]
  );
  $("#wikiLink").text(data["geo"]["properties"]["NAME"]);
}

function populateIntro(data) {
  $("#introBlock").html(data["fb"]["background"]);
  $("#introModal").html(data["fb"]["background"]);
}

function populateEconomy(data) {
  // overview, gdp table with dates, gdp/capita table with dates, gdp growth, unemployment, imports, exports, inflation
}
function populateDemographics(data) {
  // religion, ethnicity, age histogram, population growth, languages, life expectancy,
}
function populateEducation(data) {
  // literacy, years in school, expenditure
}
function populateGeography(data) {
  // highest point, lowest point, natural resources, natural hazards
}
function populateHealth(data) {
  // fertility rate, death rate, clean water, birth rate, infant mortality, sanitation, hiv, obesity,
}
function populateTimezones(data) {
  // timezones table
}
function populateClimate(data) {
  // climate overview. climate data graphs (bar for temp with line for rainfall overlay)
}

function showLoader() {
  $("#loader").modal({
    backdrop: "static", //remove ability to close modal with click
    keyboard: false, //remove option to close with keyboard
    show: true, //Display loader!
  });
}

function hideLoader() {
  $("#loader").modal("hide");
}
