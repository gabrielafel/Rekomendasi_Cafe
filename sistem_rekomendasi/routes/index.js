const express = require('express');
const {Client} = require("@googlemaps/google-maps-services-js");

const router = express.Router();

const mapsClient = new Client({});

const APIkey = "AIzaSyDVAXTTu7q3vhRNNeCsR6TciEh1v1XDo6w";

var formattedLocation;

function getLatLngFromAddress(address) {
  address = address.Replace(' /i', '+');
  let latLngLocation;
  mapsClient.geocode({params: {
    address:address
  }})
  .then((r) => {
     latLngLocation = r.data.results[0].geometry.location.lat+','+r.data.results[0].geometry.location.lng;
  })
  .catch((e) => {
    console.log(e.response.data.error_message);
  });

  return latLngLocation;
}

mapsClient.geocode({
  params: {
    latlng: "-6.1463852,106.8060042",
    key: APIkey,
  },
  timeout: 1000, // milliseconds
})
.then((r) => {
  formattedLocation = r.data.results[0].formatted_address;
})
.catch((e) => {
  console.log(e.response.data.error_message);
});

var listCafeJakBar = require("../public/json/ListCafe_JakartaBarat.json");
console.log(getLatLngFromAddress(listCafeJakBar[0]));

//abis login pindah home
router.get("/", (req, res) =>
  res.render("pages/home", { location:formattedLocation})
);

router.get("/test", (req, res) => 
  res.render("pages/test"));

module.exports = router;