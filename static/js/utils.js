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

function showError(message) {
  $("#errorBox").text(`An error occurred: ${message}`);
  $("#errorBox").show();
}
function hideError() {
  $("#errorBox").hide();
}

function formatValueAndUnits(data, date) {
  if (data === "No Data") {
    return "No Data";
  }
  let output = "";
  if (data["units"] === undefined) {
    output = `${data["value"].toLocaleString()}`;
  } else {
    output = `${data["value"].toLocaleString()} ${data["units"].replace(
      /_/g,
      " "
    )}`;
  }
  if (date === true) {
    output += ` (${data["date"]})`;
  }
  return output;
}

function formatTableData(data, columns) {
  output = [];

  for (var i = 0; i < data.length; i++) {
    let entry = data[i];
    let values = columns;
    let temp = [];
    values.forEach((value) => {
      entry[value] === undefined
        ? temp.push("No Data")
        : temp.push(entry[value]);
    });
    output.push(temp);
  }
  return output;
}

function createTable(element, data, columns) {
  let columnsObjects = [];

  columns.forEach((column) => {
    let temp = {};
    temp["title"] = column;
    columnsObjects.push(temp);
  });

  $(element).DataTable({
    data: data,
    columns: columnsObjects,
    paging: false,
    info: false,
    searching: false,
    destroy: true,
  });
}

function addChartData(chart, label, data) {
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label == label) {
      dataset.data = data;
    }
  });
  chart.update();
}

function removeAllChartData(chart) {
  chart.data.datasets.forEach((dataset) => {
    while (dataset.data.length > 0) {
      dataset.data.pop(); // remove all
    }
  });
  chart.update();
}

function updateAgeChartTitle(chart, year) {
  chart.options.title.text = `Age Breakdown By Gender (${year})`;
  chart.update();
}

function updateLabels(chart, labels) {
  chart.data.labels = labels;
  chart.update();
}

async function getLocation() {
  let response = await fetch("https://freegeoip.app/json/");
  let locData = await response.json();

  return locData["country_code"];
}

async function loadCountry(search) {
  hideMain();
  hideError();
  showLoader();

  let response = {};
  // check to see if country exists in local storage. if not, get it from server
  if (getLocalStorage(search) === null) {
    // get from server
    response = await Country.getData(search);
  } else {
    // get from localstorage stringified so need to parse
    response = JSON.parse(getLocalStorage(search));
  }

  // error checking
  if (response["status"]["name"] === "error") {
    console.log(response);

    setTimeout(function () {
      showError(response["message"]);
      showMain();
      hideLoader();
    }, 500);

    return;
  }

  country = new Country(response);

  setTimeout(function () {
    // add response to local storage
    if (response["clim"] === "No Data") {
      // set shorter time to live if have no climate data
      setLocalStorage(search, response, 86400);
    } else {
      setLocalStorage(search, response);
    }

    showMain();
    hideLoader();
  }, 500);
}

function hideMain() {
  $("main").css("visibility", "hidden");
}

function showMain() {
  $("main").css("visibility", "visible");
}

function getLocalStorage(key) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

function setLocalStorage(key, data, ttl = 1209600) {
  const now = new Date();

  const item = {
    value: data,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}
