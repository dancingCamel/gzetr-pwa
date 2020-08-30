class Map {
  constructor(_id) {
    //this is the mapid set in the html div
    this.id = _id;

    //defaults london
    this.lat = 51.509865;
    this.lon = -0.118092;
    this.zoom = 12;
    this.maxZoom = 18;
    this.minZoom = 2;

    //outline data
    this.outlineFeature = undefined;
    this.outlineCountry = undefined;

    //layers
    this.baseMap;
    this.baseMapUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
    this.baseMapView = {
      streets: "mapbox/streets-v11",
    };

    this.baseMapOptions = {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      id: this.baseMapView.streets,
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapbox_key,
    };

    //set up the map
    this.mapOptions = {
      zoomControl: true,
      attributionControl: false,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      maxBoundsViscosity: 1.0,
    };
    this.map = L.map(this.id, this.mapOptions).setView(
      [this.lat, this.lon],
      this.zoom
    );

    //add our base layer
    this.baseMap = L.tileLayer(this.baseMapUrl, this.baseMapOptions).addTo(
      this.map
    );

    //map resize
    this.map.on("map-container-resize", function () {
      this.map.invalidateSize();
    });
  }

  setLocation(_lat, _lon, _zoom = 0) {
    if (_lat === undefined || _lon === undefined) {
      console.log("You need to enter lat and lon coordinates in setLocation!");
    }
    this.lat = _lat;
    this.lon = _lon;
    if (_zoom !== 0) {
      try {
        this.zoom = Number(_zoom);
      } catch (error) {
        console.log("invalid zoom parameter in .setLocation!");
      }
    }
  }

  setView(_lat, _lon) {
    this.map.setView([_lat, _lon]);
  }

  redrawLayers() {
    //remove base map and redraw
    this.map.removeLayer(this.baseMap);
    this.baseMap = L.tileLayer(this.baseMapUrl, this.baseMapOptions).addTo(
      this.map
    );
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

    //draw the ouline using leaflets built in feature method

    this.outlineCountry = L.geoJSON(this.outlineFeature).addTo(this.map);
    this.fitBounds();
  }

  removeOutline() {
    this.map.removeLayer(this.outlineCountry);
  }

  fitBounds() {
    this.map.fitBounds(this.outlineCountry.getBounds());
  }

  resetSize() {
    this.map.invalidateSize();
  }

  closePopup() {
    this.map.closePopup();
  }
}
