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
    this.gdpGrowth = formatValueAndDate(data["fb"]["growth"]);
    this.unemployment = formatValueAndDate(data["fb"]["unemployment"]);
    this.imports = formatValueAndDate(data["fb"]["imports"]);
    this.exports = formatValueAndDate(data["fb"]["exports"]);
    this.inflation = formatValueAndDate(data["fb"]["inflation"]);

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

    // demographics
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
    // age histogram, languages

    createTable("#religions", this.religions, ["Religion", "Percent"]);

    createTable("#ethnicity", this.ethnicity, ["Ethnicity", "Percent"]);

    createTable("#languages", this.languages, ["Language", "Notes"]);

    $("#populationGrowth").html(this.populationGrowth);

    this.populatedDemographics = true;
  }

  populateEducation() {
    // literacy, years in school, expenditure
    console.log("clicked education");
  }

  populateGeography() {
    // highest point, lowest point, natural resources, natural hazards
    console.log("clicked geography");
  }

  populateHealth() {
    // fertility rate, death rate, clean water, birth rate, infant mortality, sanitation, hiv, obesity,life expectancy,
    console.log("clicked health");
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

function formatValueAndDate(data) {
  let output = `${data["value"].toLocaleString()} ${data["units"]} (${
    data["date"]
  })`;
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
