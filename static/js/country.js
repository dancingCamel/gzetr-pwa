class Country {
  constructor(data) {
    // add validation to individual values here
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

  static async getData(search) {
    let response = await fetch("../../static/php/main.php?country=" + search);
    let data = await response.json();
    console.log(data);
    return data;
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
    // overview, gdp table with dates, gdp/capita table with dates, gdp growth, unemployment, imports, exports, inflation
  }

  populateDemographics() {
    // religion, ethnicity, age histogram, population growth, languages, life expectancy,
  }

  populateEducation() {
    // literacy, years in school, expenditure
  }

  populateGeography() {
    // highest point, lowest point, natural resources, natural hazards
  }

  populateHealth() {
    // fertility rate, death rate, clean water, birth rate, infant mortality, sanitation, hiv, obesity,
  }

  populateTimezones() {
    // timezones table
  }

  populateClimate() {
    // climate overview. climate data graphs (bar for temp with line for rainfall overlay)
  }
}
