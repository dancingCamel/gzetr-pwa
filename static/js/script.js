$(document).ready(function () {
  var map = new Map("mapid");
  // var error = false;
  // var errorMessage = "";
  var country;

  $("#searchBtn").click(async function () {
    showLoader();

    let search = $("#searchBox").val();

    let response = await Country.getData(search);

    // add status code validation here
    country = new Country(response);
    country.populatePrimary();
    country.populateIntro();

    map.setOutline(country.geojson);

    hideLoader();
  });

  $("#searchBox").keydown(function (e) {
    if (event.which == 13) {
      event.preventDefault();
      $("#searchBtn").trigger("click");
    }
  });

  $("#econModalBtn").click(function () {
    country.populateEconomy();
  });

  $("#demographicsModalBtn").click(function () {
    country.populateDemographics();
  });

  $("#climateModalBtn").click(function () {
    country.populateClimate();
  });

  $("#educationModalBtn").click(function () {
    country.populateEducation();
  });

  $("#geographyModalBtn").click(function () {
    country.populateGeography();
  });

  $("#timezonesModalBtn").click(function () {
    country.populateTimezones();
  });
  $("#healthModalBtn").click(function () {
    country.populateHealth();
  });
});

// helper functions
function showLoader() {
  $("#loader").modal({
    backdrop: "static", //remove ability to close modal with click
    keyboard: false, //remove option to close with keyboard
    show: true,
  });
}

function hideLoader() {
  $("#loader").modal("hide");
}

function showError(message) {}
function hideError() {}
