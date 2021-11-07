const express = require('express');
const {Client, TravelMode, LocationType, TravelRestriction} = require("@googlemaps/google-maps-services-js");
const mapsClient = new Client({});

const router = express.Router();

const APIkey = "AIzaSyDVAXTTu7q3vhRNNeCsR6TciEh1v1XDo6w";

var formattedLocation;

var listCafeJakBar = require("../public/json/ListCafe_JakartaBarat.json");
const { geocode } = require('@googlemaps/google-maps-services-js/dist/geocode/geocode');

var latOrigin = -6.1463852;
var lngOrigin = 106.8060042;
const latLngOrigin = {"lat": parseFloat(latOrigin), "lng": parseFloat(lngOrigin)};

// listCafeJakBar.forEach(element => {
//   var address = element.address;
//   address = address.replace(' ', '+');

//   var lat;
//   var lng;

//   mapsClient.geocode({
//       params: {
//         address: address,
//         key: APIkey,
//       },
//       timeout: 1000, // milliseconds
//     })
//     .then(r => {
//       lat = r.data.results[0].geometry.location.lat; 
//       lng = r.data.results[0].geometry.location.lng;
//       console.log("Pass");
//     })
//     .catch(e => {
//       console.log(e.response.data.error_message);
//     });

//     const latLngDestination = {"lat": parseFloat(lat), "lng": parseFloat(lng)};
    
//     mapsClient.distancematrix({
//       params: {
//         origins: [latLngDestination
//         ], 
//         destinations: [
//           latLngDestination
//         ], 
//         mode: TravelMode['driving'], 
//       key: APIkey,
//       }, 
//   timeout: 1000, // milliseconds
//   })
//     .then(response => {
//       console.log(response.data.rows[0].elements[0].distance.text)
//     })
//     .catch(e => {
//       console.log(e.response.data.error_message);
//     });
// });


// mapsClient.geocode({
//   params: {
//     latlng: "-6.1463852,106.8060042",
//     key: APIkey,
//   },
//   timeout: 1000, // milliseconds
// })
// .then((r) => {
//   formattedLocation = r.data.results[0].formatted_address;
// })
// .catch((e) => {
//   console.log(e.response.data.error_message);
// });

//abis login pindah home
router.get("/", (req, res) =>
  res.render("pages/home", { location:formattedLocation})
);

router.get("/bantuan", (req, res) => 
  res.render("pages/bantuan"));

router.get("/cafejakarta", (req, res) => 
  res.render("pages/cafejakarta"));

router.get("/rekomendasi", (req, res) => 
  res.render("pages/rekomendasi"));

router.get("/test", (req, res) => 
  res.render("pages/test"));

module.exports = router;