class Country {
  constructor(data) {
    // add validation to individual values here
    // primary info
    this.countryName = data["rc"]["name"];
    this.noun = data["fb"]["noun"];
    this.adj = data["fb"]["adj"];
    this.flag = data["rc"]["flag"];
    this.capital = data["rc"]["capital"];
    this.area = data["rc"]["area"].toLocaleString();
    this.population = data["rc"]["population"].toLocaleString();
    this.gdp = data["fb"]["gdpLatest"].toLocaleString();
    this.gdpCapita = data["fb"]["capitaLatest"].toLocaleString();

    let languages = [];
    data["rc"]["languages"].forEach((element) => {
      languages.push(element.name);
    });

    this.officialLang = languages.join(", ");
    this.tld = data["rc"]["tld"].join(", ");
    this.callingCodes = data["rc"]["callingCodes"].join(", ");
    this.currencySymbol = data["oc"]["currencySymbol"];
    this.currencyName = data["oc"]["currencyName"];
    this.wikiLink =
      "https://wikipedia.com/wiki/" + data["geo"]["properties"]["NAME"];
    this.wikiText = data["geo"]["properties"]["NAME"];
    this.intro = data["fb"]["background"];
    this.geojson = data["geo"];
    this.econOverview = data["fb"]["econOverview"];

    // economy
    this.gdpGrowth = formatValueAndUnits(data["fb"]["growth"], true);
    this.unemployment = formatValueAndUnits(data["fb"]["unemployment"], true);
    this.imports = formatValueAndUnits(data["fb"]["imports"], true);
    this.exports = formatValueAndUnits(data["fb"]["exports"], true);
    this.inflation = formatValueAndUnits(data["fb"]["inflation"], true);

    this.historicalGDP = formatTableData(data["fb"]["gdp"], [
      "value",
      "units",
      "date",
    ]);

    this.historicalGDP.forEach((element) => {
      element[0] = Math.round(element[0]).toLocaleString();
    });

    this.historicalCapita = formatTableData(data["fb"]["capita"], [
      "value",
      "units",
      "date",
    ]);
    this.historicalCapita.forEach((element) => {
      element[0] = Math.round(element[0]).toLocaleString();
    });

    // Demographics
    this.religions = formatTableData(data["fb"]["religions"], [
      "name",
      "percent",
    ]);

    this.ethnicity = formatTableData(data["fb"]["ethnicity"], [
      "name",
      "percent",
    ]);

    this.populationGrowth = `${data["fb"]["popGrowth"][
      "growth_rate"
    ].toLocaleString()} % (${data["fb"]["popGrowth"]["date"]})`;

    this.languages = formatTableData(data["fb"]["languages"], ["name", "note"]);

    this.ageLabels = Object.keys(data["fb"]["ages"]);
    this.ageLabels.pop();
    this.ageYear = data["fb"]["ages"]["date"];

    this.ageData = { female: [], male: [] };
    this.ageLabels.forEach((element) => {
      this.ageData.female.push(data["fb"]["ages"][element]["females"]);
      this.ageData.male.push(data["fb"]["ages"][element]["males"]);
    });

    for (var i = 0; i < this.ageLabels.length; i++) {
      this.ageLabels[i] = this.ageLabels[i].replace(/_/g, " ");
    }

    // Education
    this.literacy = formatValueAndUnits(data["fb"]["literacy"], false);

    this.yearsInSchool = formatValueAndUnits(
      data["fb"]["yearsInSchool"],
      false
    );

    this.eduExpenditure =
      data["fb"]["eduExpenditure"] === "No Data"
        ? "No Data"
        : `${data["fb"]["eduExpenditure"]["percent_of_gdp"]} % of GDP (${data["fb"]["eduExpenditure"]["date"]})`;

    // Geography
    this.highestPoint =
      data["fb"]["highestPoint"] === "No Data"
        ? "No Data"
        : `${data["fb"]["highestPoint"]["name"]} (${formatValueAndUnits(
            data["fb"]["highestPoint"]["elevation"]
          )})`;

    this.lowestPoint =
      data["fb"]["lowestPoint"] === "No Data"
        ? "No Data"
        : `${data["fb"]["lowestPoint"]["name"]} (${formatValueAndUnits(
            data["fb"]["lowestPoint"]["elevation"]
          )})`;

    this.naturalResources = data["fb"]["naturalResources"].join("; ");
    let naturalHazards = [];
    data["fb"]["naturalHazards"].forEach((hazard) => {
      naturalHazards.push(hazard.description);
    });
    this.naturalHazards = naturalHazards.join("; ");

    // Health
    this.birthRate =
      data["fb"]["birthRate"] === "No Data"
        ? "No Data"
        : `${data["fb"]["birthRate"]["births_per_1000_population"]}/1000 population (${data["fb"]["birthRate"]["date"]})`;

    this.deathRate =
      data["fb"]["deathRate"] === "No Data"
        ? "No Data"
        : `${data["fb"]["deathRate"]["deaths_per_1000_population"]}/1000 population (${data["fb"]["deathRate"]["date"]})`;

    this.infMortality = formatValueAndUnits(
      data["fb"]["infantMortality"],
      false
    );

    this.lifeExpectancy = formatValueAndUnits(
      data["fb"]["lifeExpectancy"],
      false
    );

    this.fertilityRate =
      data === "No Data"
        ? "No Data"
        : `${data["fb"]["fertility"]["children_born_per_woman"]} child/woman (${data["fb"]["fertility"]["date"]})`;

    this.cleanWater = formatValueAndUnits(data["fb"]["cleanWater"], false);

    this.sanitation = formatValueAndUnits(data["fb"]["sanitation"], false);

    this.hiv =
      data["fb"]["hiv"] === "No Data"
        ? "No Data"
        : `${data["fb"]["hiv"]["percent_of_adults"]}% of adults (${data["fb"]["hiv"]["date"]})`;

    this.obesity =
      data["fb"]["obesity"] === "No Data"
        ? "No Data"
        : `${data["fb"]["obesity"]["percent_of_adults"]}% of adults (${data["fb"]["obesity"]["date"]})`;

    // keep track of which parts of page have been built
    this.populatedPrimary = false;
    this.populatedIntro = false;
    this.populatedEconomy = false;
    this.populatedDemographics = false;
    this.populatedEducation = false;
    this.populatedGeography = false;
    this.populatedHealth = false;
    this.populatedTimezones = false;
    this.populatedClimate = false;
  }

  populatePrimary() {
    $("#countryName").html(this.countryName);
    $("#noun").html(this.noun);
    $("#adj").html(this.adj);
    $("#flag").attr("src", this.flag);
    $("#capital").html(this.capital);
    $("#area").html(this.area);
    $("#population").html(this.population);
    $("#gdp").html(this.gdp);
    $("#gdpCapita").html(this.gdpCapita);

    $("#officialLang").html(this.officialLang);
    $("#tld").html(this.tld);
    $("#callingCode").html(this.callingCodes);
    $("#currencySymbol").html(this.currencySymbol);
    $("#currencyName").html(this.currencyName);
    $("#wikiLink").attr("href", this.wikiLink);
    $("#wikiLink").text(this.wikiText);

    this.populatedPrimary = true;
  }

  populateIntro() {
    $("#introBlock").html(this.intro);
    $("#introModal").html(this.intro);

    this.populatedIntro = true;
  }

  populateEconomy() {
    $("#econOverview").html(this.econOverview);
    $("#gdpGrowth").html(this.gdpGrowth);
    $("#unemployment").html(this.unemployment);
    $("#inflation").html(this.inflation);
    $("#imports").html(this.imports);
    $("#exports").html(this.exports);

    createTable("#historicalGDP", this.historicalGDP, [
      "Value",
      "Units",
      "Year",
    ]);

    createTable("#historicalGdpCapita", this.historicalCapita, [
      "Value",
      "Units",
      "Year",
    ]);

    this.populatedEconomy = true;
  }

  populateDemographics() {
    createTable("#religions", this.religions, ["Religion", "Percent"]);

    createTable("#ethnicity", this.ethnicity, ["Ethnicity", "Percent"]);

    createTable("#languages", this.languages, ["Language", "Notes"]);

    $("#populationGrowth").html(this.populationGrowth);

    // update age histogram
    removeAllChartData(ageChart);
    updateChartTitle(ageChart, this.ageYear);
    updateLabels(ageChart, this.ageLabels);
    addChartData(ageChart, "Female", this.ageData["female"]);
    addChartData(ageChart, "Male", this.ageData["male"]);

    this.populatedDemographics = true;
  }

  populateEducation() {
    $("#literacy").html(this.literacy);
    $("#yearsInSchool").html(this.yearsInSchool);
    $("#eduExpenditure").html(this.eduExpenditure);

    this.populatedEducation = true;
  }

  populateGeography() {
    $("#highestPoint").html(this.highestPoint);
    $("#lowestPoint").html(this.lowestPoint);
    $("#natHaz").html(this.naturalHazards);
    $("#natResources").html(this.naturalResources);

    this.populatedGeography = true;
  }

  populateHealth() {
    $("#fertilityRate").html(this.fertilityRate);
    $("#deathRate").html(this.deathRate);
    $("#cleanWater").html(this.cleanWater);
    $("#birthRate").html(this.birthRate);
    $("#infMortality").html(this.infMortality);
    $("#sanitation").html(this.sanitation);
    $("#hiv").html(this.hiv);
    $("#obesity").html(this.obesity);
    $("#lifeExpectancy").html(this.lifeExpectancy);

    this.populatedHealth = true;
  }

  populateTimezones() {
    // timezones table
    console.log("clicked timezones");
  }

  populateClimate() {
    // climate overview. climate data graphs (bar for temp with line for rainfall overlay)
    console.log("clicked climate");
  }

  static async getData(search) {
    let response = await fetch("../../static/php/main.php?country=" + search);
    let data = await response.json();

    return data;
  }
}

function formatValueAndUnits(data, date) {
  if (data === "No Data") {
    return "No Data";
  }
  let output = `${data["value"].toLocaleString()} ${data["units"].replace(
    /_/g,
    " "
  )}`;
  if (date === true) {
    output += ` (${data["date"]})`;
  }
  return output;
}

function formatTableData(data, columns) {
  if (data === "No Data") {
    return "No Data";
  }
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

function addChartData(chart, gender, data) {
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label == gender) {
      dataset.data = data;
    }
  });
  chart.update();
}

function removeAllChartData(chart) {
  chart.data.datasets.forEach((dataset) => {
    while (dataset.data.length > 0) {
      dataset.data.pop(); // this needs to remove all
    }
  });
  chart.update();
}

function updateChartTitle(chart, year) {
  chart.options.title.text = `Age Breakdown By Gender (${year})`;
  chart.update();
}

function updateLabels(chart, labels) {
  chart.data.labels = labels;
  chart.update();
}
