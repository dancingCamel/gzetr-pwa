var ageChart;
var climateChart;
var country;

$(document).ready(async function () {
  // page setup
  $(".basicAutoComplete").autoComplete();
  var map = new Map("mapid");

  // if on mobile device, add easy buttons for each modal
  map.addEasyButton("fa-info-circle", function () {
    $("#primary").modal("show");
  });

  map.addEasyButton("fa-glasses", function () {
    $("#intro").modal("show");
  });

  map.addEasyButton("fa-chart-line", function () {
    if (!country.populatedEconomy) {
      country.populateEconomy();
    }
    $("#economy").modal("show");
  });

  map.addEasyButton("fa-users", function () {
    if (!country.populatedDemographics) {
      country.populateDemographics();
    }
    $("#demographics").modal("show");
  });

  map.addEasyButton("fa-cloud", function () {
    if (!country.populatedClimate) {
      country.populateClimate();
    }
    $("#climateModal").modal("show");
  });

  map.addEasyButton("fa-book-open", function () {
    if (!country.populatedEducation) {
      country.populateEducation();
    }
    $("#education").modal("show");
  });

  map.addEasyButton("fa-clock", function () {
    if (!country.populatedTimezones) {
      country.populateTimezones();
    }
    $("#timezonesModal").modal("show");
  });

  map.addEasyButton("fa-heartbeat", function () {
    if (!country.populatedHealth) {
      country.populateHealth();
    }
    $("#health").modal("show");
  });

  $("#searchBtn").click(async function () {
    const search = $("#searchBox").val();
    await loadCountry(search);
    country.populatePrimary();
    country.populateIntro();
    map.setOutline(country.geojson);
  });

  $("#searchBox").keydown(function (e) {
    if (event.which == 13) {
      event.preventDefault();
      $("#searchBtn").trigger("click");
    }
  });

  // Set up modal button functions
  $("#econModalBtn").click(function () {
    if (!country.populatedEconomy) {
      country.populateEconomy();
    }
  });

  $("#demographicsModalBtn").click(function () {
    if (!country.populatedDemographics) {
      country.populateDemographics();
    }
  });

  $("#climateModalBtn").click(function () {
    if (!country.populatedClimate) {
      country.populateClimate();
    }
  });

  $("#educationModalBtn").click(function () {
    if (!country.populatedEducation) {
      country.populateEducation();
    }
  });

  $("#geographyModalBtn").click(function () {
    if (!country.populatedGeography) {
      country.populateGeography();
    }
  });

  $("#timezonesModalBtn").click(function () {
    if (!country.populatedTimezones) {
      country.populateTimezones();
    }
  });

  $("#healthModalBtn").click(function () {
    if (!country.populatedHealth) {
      country.populateHealth();
    }
  });
  // draw an empty age histogram table
  var ctx1 = $("#ageChart");

  var ageChartData = {
    labels: [],
    datasets: [
      {
        label: "Female",
        barPercentage: 1,
        categoryPercentage: 0.8,
        backgroundColor: "rgba(250,128,114,0.7)",
        borderColor: "rgba(250,128,114,1)",
        borderWidth: 1,
        data: [],
      },
      {
        label: "Male",
        barPercentage: 1,
        categoryPercentage: 0.8,
        backgroundColor: "rgba(0,191,255,0.7)",
        borderColor: "rgba(0,191,255,1)",
        borderWidth: 1,
        data: [],
      },
    ],
  };
  ageChart = new Chart(ctx1, {
    type: "bar",
    data: ageChartData,
    options: {
      responsive: true,
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `Age Breakdown By Gender`,
      },
      scales: {
        yAxes: [{ ticks: { beginAtZero: true } }],
      },
    },
  });

  // draw an empty climate chart
  var ctx2 = $("#climateChart");

  var climateChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        type: "bar",
        yAxisID: "tempAxis",
        label: "Temp",
        barPercentage: 1,
        categoryPercentage: 0.8,
        backgroundColor: "rgba(250,128,114,0.7)",
        borderColor: "rgba(250,128,114,1)",
        borderWidth: 1,
        data: [],
      },
      {
        type: "line",
        fill: false,
        yAxisID: "precipAxis",
        label: "Precip",
        barPercentage: 1,
        categoryPercentage: 0.8,
        backgroundColor: "rgba(0,191,255,0.7)",
        borderColor: "rgba(0,191,255,1)",
        borderWidth: 1,
        data: [],
      },
    ],
  };
  climateChart = new Chart(ctx2, {
    type: "bar",
    data: climateChartData,
    options: {
      responsive: true,
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Climate Data`,
      },
      scales: {
        yAxes: [
          {
            display: true,
            scaleLabel: { display: true, labelString: "degC" },
            position: "left",
            id: "tempAxis",
            ticks: { beginAtZero: true },
          },
          {
            display: true,
            scaleLabel: { display: true, labelString: "mm" },
            position: "right",
            id: "precipAxis",
            ticks: { beginAtZero: true },
          },
        ],
      },
    },
  });

  // Get user's location when first visit page
  let location = await getLocation();
  await loadCountry(location);
  country.populatePrimary();
  country.populateIntro();
  map.setOutline(country.geojson);
});
