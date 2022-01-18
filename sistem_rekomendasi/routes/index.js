const express = require('express');
const axios = require('axios');
const { query } = require('express');

const router = express.Router();

var formattedLocation;

const { geocode } = require('@googlemaps/google-maps-services-js/dist/geocode/geocode');

var latOrigin = -6.1463852;
var lngOrigin = 106.8060042;
const latLngOrigin = {
  "lat": parseFloat(latOrigin),
  "lng": parseFloat(lngOrigin)
};

const fs = require('fs');
const { json } = require('body-parser');

let itemsPerPage = 10;
router.get("/", (req, res) =>
  res.render("pages/home", {
    location: formattedLocation
  })
);

router.get("/bantuan", (req, res) =>
  res.render("pages/bantuan"));

 router.get("/detailcafe/:id", (req, res) =>{
  let cafeList = require('../CafeJakarta.1.json');
  let id = req.params['id'].toString();

  let cafe = null
  cafeList.forEach((elem) => {
    if (elem["id"] == id) {
      cafe = elem;
    }
  });

  cafe["imagesurl"] = cafe["Images"].split("; ");
  if (cafe["imagesurl"][0].length == 0) {
      cafe["imagesurl"][0] = 'cafedefault.png'
    }

   res.render("pages/detailcafe",{cafe: cafe, decisionTree: JSON.stringify(require('../public/cafe/json2/decisiontree/'+cafe.Filename))});
 });

function decide(decisionTree, decisions) {
  let currentNode = decisionTree;
  let j = 0;
  while ('children' in currentNode) {
    currentDecision = currentNode.text.name;
    let foundChild = false;
    for (let i = 0; i < currentNode.children.length; i++) {
      if (currentNode.children[i].text.name == decisions[currentDecision]) {
        currentNode = currentNode.children[i].children[0];
        foundChild = true;
        j ++;
        break;
      }
    }

    if (!foundChild){
      return 'Not Recommended';
    }
  }

  return currentNode.text.name;
}

function filterCafe(listCafe, wifi, smoking, indoor, outdoor, parking, valet, takeaway, delivery, booking) {
  let finalList = []

  listCafe.forEach((cafe)=>{
    decisionTree = require('../public/cafe/json2/decisiontree/'+cafe.Filename)
    decisions = {
      // Wifi,Smoking area,Indoor seating,Outdoor seating,Free parking,Valet parking,Takeaway,Home delivery,Table booking,Recommended
      'Wifi': wifi == 'true' ? 'Tersedia':'Tidak tersedia',
      'Smoking area': smoking == 'true' ? 'Tersedia':'Tidak tersedia',
      'Indoor seating': indoor == 'true' ? 'Tersedia':'Tidak tersedia',
      'Outdoor seating': outdoor == 'true' ? 'Tersedia':'Tidak tersedia',
      'Free parking': parking == 'true' ? 'Tersedia':'Tidak tersedia',
      'Valet parking': valet == 'true' ? 'Tersedia':'Tidak tersedia',
      'Takeaway': takeaway == 'true' ? 'Tersedia':'Tidak tersedia',
      'Home delivery': delivery == 'true' ? 'Tersedia':'Tidak tersedia',
      'Table booking': booking == 'true' ? 'Tersedia':'Tidak tersedia',
    }
    if (decide(decisionTree, decisions) == "Recommended") {
      finalList.push(cafe);
    }
  });
  return finalList;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  //rumus buat lat long antara cafe sama pengguna
  return deg * (Math.PI / 180)
}

function filteringCafe(listCafe, wifi, smoking, indoor, outdoor, parking, valet, takeaway, delivery, booking) {
  var listCafeTemp = [];
  var listCafeFilter = [];
  listCafe.forEach(element => {
    listCafeFilter.push(element);
  });
  listCafeTemp = [...listCafeFilter];

  if (wifi == 'true') {
    listCafeFilter = []
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Wifi")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (smoking == 'true') {
    listCafeFilter = [];
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Smoking Area")) {
        listCafeFilter.push(element);
      }
    });
  };
  listCafeTemp = [...listCafeFilter];
  if (indoor == 'true') {
    listCafeTemp.forEach(element => {
      listCafeFilter = [];
      if (element["More Info"].includes("Indoor Seating")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (outdoor == 'true') {
    listCafeTemp.forEach(element => {
      listCafeFilter = [];
      if (element["More Info"].includes("Outdoor Seating")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (parking == 'true') {
    listCafeFilter = [];
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Free Parking")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (valet == 'true') {
    listCafeFilter = [];
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Valet Parking Available")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (takeaway == 'true') {
    listCafeFilter = [];
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Takeaway Available")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (delivery == 'true') {
    listCafeFilter = [];
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Home Delivery")) {
        listCafeFilter.push(element);
      }
    });
  }
  listCafeTemp = [...listCafeFilter];
  if (booking == 'true') {
    listCafeFilter = [];
    listCafeTemp.forEach(element => {
      if (element["More Info"].includes("Booking Available")) {
        listCafeFilter.push(element);
      }
    });
  }
  return listCafeFilter;
}

function filterByPrice(listCafe, price) {
  var listCafeTemp = [];
  var listCafeFilter = [];
  listCafe.forEach(element => {
    listCafeFilter.push(element);
  });
  listCafeTemp = [...listCafeFilter];

  let regexHarga = /Rp([0-9]*.[0-9]*)/

  if (price > 0) {
    listCafeFilter = []
    listCafeTemp.forEach(element => {
      let match = regexHarga.exec(element["Cost for two"]);
      harga = parseFloat(match[1].replace(".",""))
      if (price >= harga) {
        listCafeFilter.push(element);
      }
    });
  }
  return listCafeFilter;
}

router.get("/rekomendasi", (req, res) => {
  let wifi = req.query.wifi;
  let smoking = req.query.smoking;
  let indoor = req.query.indoor;
  let outdoor = req.query.outdoor;
  let parking = req.query.parking;
  let valet = req.query.valet;
  let takeaway = req.query.takeaway;
  let delivery = req.query.delivery;
  let booking = req.query.booking;
  let harga = req.query.harga;
  let filtering = req.query.filtering;

  wifi = wifi == undefined ? "false": wifi
  smoking = smoking == undefined ? "false": smoking
  indoor = indoor == undefined ? "false": indoor
  outdoor = outdoor == undefined ? "false": outdoor
  parking = parking == undefined ? "false": parking
  valet = valet == undefined ? "false": valet
  takeaway = takeaway == undefined ? "false": takeaway
  delivery = delivery == undefined ? "false": delivery
  booking = booking == undefined ? "false" : booking
  filtering = filtering == undefined ? "false": filtering

  let price = parseFloat(harga)

  let q = {
    wifi: wifi,
    smoking: smoking,
    indoor: indoor,
    outdoor: outdoor,
    parking: parking,
    valet: valet,
    takeaway: takeaway,
    delivery: delivery,
    booking: booking,
    price: req.query.price,
    harga: harga,
    filtering: filtering
  }

  let cafeList = require('../CafeJakarta.1.json');

  cafeList = filterCafe(cafeList, wifi, smoking, indoor, outdoor, parking, valet, takeaway, delivery, booking);
  
  
  if (filtering == "true"){
    cafeList = filteringCafe(cafeList, wifi, smoking, indoor, outdoor, parking, valet, takeaway, delivery, booking);
  }
  
  if(req.query.price == "true") {
    cafeList = filterByPrice(cafeList, price);
  }

  let lat = req.query.lat ? parseFloat(req.query.lat) : -6.174465;
  let lon = req.query.lon ? parseFloat(req.query.lon) : 106.829437;


  function sort(a, b) {
    distA = getDistanceFromLatLonInKm(lat, lon, a["lat"], a["long"]);
    distB = getDistanceFromLatLonInKm(lat, lon, b["lat"], b["long"]);
    return distA - distB;
  }
  if (cafeList.length == 0) {
    res.render("pages/rekomendasi", {
      message: "Tidak ada rekomendasi cafe",
      query: q
    });
  } else {
    availablePages = Math.ceil(cafeList.length/itemsPerPage)
    cafeList = cafeList.slice(0, 100);
    cafeList.sort(sort);
    
    for (var i = 0; i < cafeList.length; i++) {
      cafeList[i]["distance"] = getDistanceFromLatLonInKm(lat, lon, cafeList[i]["lat"], cafeList[i]["long"]);
      cafeList[i]["imagesurl"] = cafeList[i]["Images"].split("; ")[0];
      if (!fs.existsSync('./public/cafe/images/'+cafeList[i]["imagesurl"]) || cafeList[i]["imagesurl"].length == 0) {
        cafeList[i]["imagesurl"] = 'cafedefault.png'
      }
    }

    res.render("pages/rekomendasi", {
      finalList: cafeList,
      query: q,
      availablePages: availablePages
    });
  }  
});

function searchCafe(query, cafeList) {
  if (query.replace(' ', '') == '') {
    return cafeList
  }

  query = query.toLowerCase();

  let finalList = []

  cafeList.forEach((cafe) => {
    queryStrList = query.split(' ')
    let hasAllStr = true

    queryStrList.forEach((qStr) => {
      if (cafe.Nama.toLowerCase().search(qStr) < 0) {
        hasAllStr = false
      }
    });

    if (hasAllStr) {
      finalList.push(cafe)
    }

  })

  return finalList;
}

router.get("/search", (req, res) => {
  let searchQuery = req.query.Search == undefined ? '' : decodeURI(req.query.Search);

  let cafeList = require('../CafeJakarta.1.json');

  cafeList = searchCafe(searchQuery, cafeList);

  let lat = req.query.lat ? parseFloat(req.query.lat) : -6.174465;
  let lon = req.query.lon ? parseFloat(req.query.lon) : 106.829437;


  function sort(a, b) {
    distA = getDistanceFromLatLonInKm(lat, lon, a["lat"], a["long"]);
    distB = getDistanceFromLatLonInKm(lat, lon, b["lat"], b["long"]);
    return distA - distB;
  }
  if (cafeList.length == 0) {
    res.render("pages/search", {
      message: "Tidak ada cafe yang dicari",
    });
  } else {
    availablePages = Math.ceil(cafeList.length/itemsPerPage)
    cafeList = cafeList.slice(0, 100);
    cafeList.sort(sort);
    
    for (var i = 0; i < cafeList.length; i++) {
      cafeList[i]["distance"] = getDistanceFromLatLonInKm(lat, lon, cafeList[i]["lat"], cafeList[i]["long"]);
      cafeList[i]["imagesurl"] = cafeList[i]["Images"].split("; ")[0];
      if (!fs.existsSync('./public/cafe/images/'+cafeList[i]["imagesurl"]) || cafeList[i]["imagesurl"].length == 0) {
        cafeList[i]["imagesurl"] = 'cafedefault.png'
      }
    }

    res.render("pages/search", {
      finalList: cafeList,
      availablePages: availablePages
    });
  }  
});

router.get("/detailcafe", (req, res) =>
  res.render("pages/detailcafe"));

router.get("/about", (req, res) =>
  res.render("pages/about"));

router.get("/algoc45/:id", (req, res) =>{
  let cafeList = require('../CafeJakarta.1.json');
  let id = req.params['id'].toString();

  let cafe = null
  cafeList.forEach((elem) => {
    if (elem["id"] == id) {
      cafe = elem;
    }
  });

   res.render("pages/algoc45",{cafe: cafe, decisionTree: JSON.stringify(require('../public/cafe/json2/decisiontree/'+cafe.Filename))});
  });

router.get("/admin", (req, res) =>
  res.render("pages/admin"));

router.get("/updatecafe", (req, res) =>
  res.render("pages/updatecafe"));

router.post("/updatecafe/:id", (req, res) =>{
  let cafeList = require('../CafeJakarta.1.json');

  let nama = req.body.nama;
  let address = req.body.address;
  let cost = req.body.cost;

  let wifi = req.body.wifi;
  let smoking = req.body.smoking;
  let indoor = req.body.indoor;
  let outdoor = req.body.outdoor;
  let parking = req.body.parking;
  let valet = req.body.valet;
  let takeaway = req.body.takeaway;
  let delivery = req.body.delivery;
  let booking = req.body.table;

  wifi = wifi == undefined ? "false": wifi
  smoking = smoking == undefined ? "false": smoking
  indoor = indoor == undefined ? "false": indoor
  outdoor = outdoor == undefined ? "false": outdoor
  parking = parking == undefined ? "false": parking
  valet = valet == undefined ? "false": valet
  takeaway = takeaway == undefined ? "false": takeaway
  delivery = delivery == undefined ? "false": delivery
  booking = booking == undefined ? "false" : booking

  let moreInfo = "";
  if (wifi != "false") {
    moreInfo += "Wifi; "
  }
  if (smoking != "false") {
    moreInfo += "Smoking Area; "
  }
  if (indoor != "false") {
    moreInfo += "Indoor Seating; "
  }
  if (outdoor != "false") {
    moreInfo += "Outdoor Seating; "
  }
  if (parking != "false") {
    moreInfo += "Free Parking; "
  }
  if (valet != "false") {
    moreInfo += "Valet Parking Available; "
  }
  if (takeaway != "false") {
    moreInfo += "Takeaway Available; "
  }
  if (delivery != "false") {
    moreInfo += "Home Delivery; "
  }
  if (booking != "false") {
    moreInfo += "Table booking recommended; "
  }
      
  let id = req.params['id'].toString();

  for (let i = 0; i < cafeList.length; i++){
    if (cafeList[i]["id"] == id) {
      cafeList[i].Nama = nama;
      cafeList[i]["Cost for two"] = cost;
      cafeList[i]["Address"] = address;
      cafeList[i]["More Info"] = moreInfo;
    }
  }

  fs.writeFileSync('./CafeJakarta.1.json', JSON.stringify(cafeList));
  res.redirect("/datacafe")});

router.get("/updatecafe/:id", (req, res) =>{
      let cafeList = require('../CafeJakarta.1.json');
    
      let wifi = req.query.wifi;
      let smoking = req.query.smoking;
      let indoor = req.query.indoor;
      let outdoor = req.query.outdoor;
      let parking = req.query.parking;
      let valet = req.query.valet;
      let takeaway = req.query.takeaway;
      let delivery = req.query.delivery;
      let booking = req.query.booking;
    
      wifi = wifi == undefined ? "false": wifi
      smoking = smoking == undefined ? "false": smoking
      indoor = indoor == undefined ? "false": indoor
      outdoor = outdoor == undefined ? "false": outdoor
      parking = parking == undefined ? "false": parking
      valet = valet == undefined ? "false": valet
      takeaway = takeaway == undefined ? "false": takeaway
      delivery = delivery == undefined ? "false": delivery
      booking = booking == undefined ? "false" : booking
    
      let id = req.params['id'].toString();
      
        let cafe = null
        cafeList.forEach((elem) => {
          if (elem["id"] == id) {
            cafe = elem;
          }
        });
        res.render("pages/updatecafe", {cafe : cafe})});

router.get("/datacafe", (req, res) =>{
  let cafeList = require('../CafeJakarta.1.json');

  res.render("pages/datacafe", {
    finalList: cafeList
  })
});

router.post("/admin", (req, res, next) => {
    let username = req.body.admin;
    let password = req.body.password;

    if (username == "adminGaby" && password == "adminGaby"){
      res.redirect("/datacafe");
    }
    else{
      res.render("pages/admin", {message: "Username atau password salah"});
    }
});

module.exports = router;