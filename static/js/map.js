class Map {
  constructor(_id) {
    //this is the mapid set in the html div
    this.id = _id;

    //defaults london
    this.lat = 51.509865;
    this.lon = -0.118092;
    this.zoom = 4;
    this.maxZoom = 10;
    this.minZoom = 2;

    //outline data
    this.outlineFeature = undefined;
    this.outlineCountry = undefined;

    //layers
    this.baseMap;
    this.baseMapUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";

    this.baseMapOptions = {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapbox_key,
    };

    //set up the map
    this.map = L.map(this.id, {
      zoomControl: true,
    }).setView([this.lat, this.lon], this.zoom);

    //add our base layer
    this.baseMap = L.tileLayer(this.baseMapUrl, this.baseMapOptions).addTo(
      this.map
    );

    //map resize
    this.map.on("map-container-resize", function () {
      this.map.invalidateSize();
    });
  }

  setView(_lat, _lon) {
    this.map.setView([_lat, _lon]);
  }

  setOutline(data) {
    this.outlineFeature = data;
    this.drawOutline();
  }

  drawOutline() {
    //remove previous if defined
    if (this.outlineCountry !== undefined) {
      this.map.removeLayer(this.outlineCountry);
    }

    //draw the outline using leaflets built-in feature method
    this.outlineCountry = L.geoJSON(this.outlineFeature).addTo(this.map);
    this.fitBounds();
  }

  removeOutline() {
    this.map.removeLayer(this.outlineCountry);
  }

  fitBounds() {
    this.map.fitBounds(this.outlineCountry.getBounds());
  }

  addEasyButton(icon, func) {
    L.easyButton(icon, func).addTo(this.map);
  }
}
