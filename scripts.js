// Initial chart data for each species




const chartData = {
  keora: [486.83, 4668.25, 15899.65, 2606.43],
  baen: [319.59, 4992.2, 13659.8, 4688.92],
  gewa: [486.98, 3171.97, 15242.89, 4759.4],
  poshur: [9.04, 3310.75, 15010.38, 5331.24],

};


// urls, districtArray, geo json file name should be same 
const urls = [
  "/GeoJson/bagerhat.geojson",
  "/GeoJson/barisal.geojson",
  "/GeoJson/bhola.geojson",
  "/GeoJson/borguna.geojson",
  "/GeoJson/chattogram.geojson",
  "/GeoJson/coxbazar.geojson",
  "/GeoJson/feni.geojson",
  "/GeoJson/jhalokati.geojson",
  "/GeoJson/khulna.geojson",
  "/GeoJson/lakshimpur.geojson",
  "/GeoJson/noakhali.geojson",
  "/GeoJson/patuakhali.geojson",
  "/GeoJson/pirojpur.geojson",
  "/GeoJson/sathkhira.geojson"
];

const districtArray = [
  "bagerhat",
  "barisal",
  "bhola",
  "borguna",
  "chattogram",
  "coxbazar",
  "feni",
  "jhalokati",
  "khulna",
  "lakshimpur",
  "noakhali",
  "patuakhali",
  "pirojpur",
  "sathkhira"
];


// Function to get the state of each checkbox
function getSelectedCheckboxes() {
  const vsCheckbox = document.getElementById("vs").checked;
  const sCheckbox = document.getElementById("s").checked;
  const lsCheckbox = document.getElementById("ls").checked;
  const nsCheckbox = document.getElementById("ns").checked;

  return {
    vs: vsCheckbox,
    s: sCheckbox,
    ls: lsCheckbox,
    ns: nsCheckbox
  };
}

function checkAllSuitabilityType() {
  document.getElementById('vs').checked = true;
  document.getElementById('s').checked = true;
  document.getElementById('ls').checked = true;
  document.getElementById('ns').checked = true;
}

// Function to handle selection change checkbox in suitabilit
function handleSelectionChange() {
  var selectElement = document.getElementById("species");
  var selectedValue = selectElement.value;
  console.log("handleSelectionChange")

  // Get the state of each checkbox
  const checkboxStates = getSelectedCheckboxes();

  // Update chart data based on selected species and checkbox states
  switch (selectedValue) {
    case "keora":
      myChart.data.datasets[0].data = filterChartData(chartData.keora, checkboxStates);
      myChart.data.datasets[0].label = 'Sonneratia apetala (Keora)';
      break;
    case "baen":
      myChart.data.datasets[0].data = filterChartData(chartData.baen, checkboxStates);
      myChart.data.datasets[0].label = 'Avicennia officinalis (Baen)';

      break;
    case "gewa":
      myChart.data.datasets[0].data = filterChartData(chartData.gewa, checkboxStates);
      myChart.data.datasets[0].label = 'Excoecaria agallocha (Gewa)';
      break;
    case "poshur":
      myChart.data.datasets[0].data = filterChartData(chartData.poshur, checkboxStates);
      myChart.data.datasets[0].label = 'Xylocarpus moluccensis (Poshur)';
      break;
    default:
      return;
  }

  // Update chart
  myChart.update();
}

// Function to filter chart data based on checkbox states
function filterChartData(data, checkboxStates) {
  return [
    checkboxStates.ns ? data[0] : 0,
    checkboxStates.ls ? data[1] : 0,
    checkboxStates.s ? data[2] : 0,
    checkboxStates.vs ? data[3] : 0
  ];
}


var selectedDistrict = "";
var selectedSpecies = "";

function changeMapBasedOnDisctrictChange() {

  if (districtArray.includes(selectedDistrict)) {
    //map.fitBounds(window.currentPolygon.getBounds());
    urls.forEach(url => {
      // Split the string by the last "/" character
      const parts = url.split("/");
      // Extract the filename (assuming it's the last element)
      const filename = parts.pop();
      // Split the filename by the "." character (dot)
      const filenameWithoutExtension = filename.split(".")[0];
      //console.log("selectedValue " + selectedValue);
      //  console.log("filenameWithoutExtension "+ filenameWithoutExtension); // Output: sathkhira
      if (filenameWithoutExtension == selectedDistrict) {
        //console.log("found"); 
        //console.log("geoJsonLayerArray "+ geoJsonLayerArray); 
        if (geoJsonLayerArray.length > 0) {
          console.log("geoJsonLayerArray  Lenght" + geoJsonLayerArray.length);
          geoJsonLayerArray.forEach(geoJsonLayerV2 => {
            map.removeLayer(geoJsonLayerV2);

          })
        }
        if (geoJsonLayer) {
          map.removeLayer(geoJsonLayer);
        } else {
          console.log("GeoJSON layer is not loaded yet.");
        }

        // selectedDistrict = selectedValue
        (async () => {
          await loadGeoJSON(map, url);
        })();

      }
    });
  }


}


// Function to handle district change
function handleDistrictChange() {
  var selectElement = document.getElementById("district");
  var selectedValue = selectElement.value;
  selectedDistrict = selectedValue
  console.log("selectedDistrict " + selectedDistrict)
  if (selectedSpecies === "") {
    // Update map polygons based on selected district
    changeMapBasedOnDisctrictChange()

  } else {
    handleSpeciesChange()
    changeMapBasedOnDisctrictChange()
  }
}

var geoJsonLayer;
const geoJsonLayerArray = [];
let myArray = [];


function changeBarChartBasedOnSpeciesSelection(filteredData, species) {
  myArray.length = 0;
  filteredData.map(item =>
    myArray.push(item["Area (SQKM)"])
  )
  console.log("selectedDistrict myArray  " + myArray)
  myChart.data.datasets[0].data = myArray;
  myChart.data.datasets[0].label = species;
  myChart.update();
}



function handleSpeciesChange() {
  var selectElement = document.getElementById("species");
  var selectedValue = selectElement.value;
  checkAllSuitabilityType();
  selectedSpecies = selectedValue

  // Update chart data based on selected species
  switch (selectedValue) {
    case "keora":
      /**
       *  if species selet first, without district selection
       *  */
      if (selectedDistrict === "") {
        if (geoJsonLayerArray.length > 0) {
          console.log("geoJsonLayerArray  Lenght" + geoJsonLayerArray.length);
          geoJsonLayerArray.forEach(geoJsonLayerV2 => {
            map.removeLayer(geoJsonLayerV2);

          })
        }
        (async () => {
          for (const url of urls) {
            await loadGeoJSON(map, url);
          }
        })();

        myChart.data.datasets[0].data = chartData.keora;
        myChart.data.datasets[0].label = selectedValue;
        myChart.update


      } else {
        fetch('suitability.json')
          .then(response => response.json())
          .then(data => {
            const filteredData = data["Sonneratia apetala (keora)"].filter(item => item["District Name"] === selectedDistrict.toUpperCase());
            changeBarChartBasedOnSpeciesSelection(filteredData, selectedValue)
          })
          .catch(error => console.error('Error loading JSON data:', error));

      }
      break;
    case "baen":
      if (selectedDistrict === "") {
        if (geoJsonLayerArray.length > 0) {
          console.log("geoJsonLayerArray  Lenght" + geoJsonLayerArray.length);
          geoJsonLayerArray.forEach(geoJsonLayerV2 => {
            map.removeLayer(geoJsonLayerV2);

          })
        }
        (async () => {
          for (const url of urls) {
            await loadGeoJSON(map, url);
          }
        })();

        myChart.data.datasets[0].data = chartData.baen;
        myChart.data.datasets[0].label = selectedValue;
        myChart.update


      } else {
        fetch('suitability.json')
          .then(response => response.json())
          .then(data => {
            const filteredData = data["Avicennia officinalis (Baen)"].filter(item => item["District Name"] === selectedDistrict.toUpperCase());
            changeBarChartBasedOnSpeciesSelection(filteredData, selectedValue)
          })
          .catch(error => console.error('Error loading JSON data:', error));

      }
      break;
    case "gewa":
      if (selectedDistrict === "") {
        if (geoJsonLayerArray.length > 0) {
          console.log("geoJsonLayerArray  Lenght" + geoJsonLayerArray.length);
          geoJsonLayerArray.forEach(geoJsonLayerV2 => {
            map.removeLayer(geoJsonLayerV2);

          })
        }
        (async () => {
          for (const url of urls) {
            await loadGeoJSON(map, url);
          }
        })();

        myChart.data.datasets[0].data = chartData.gewa;
        myChart.data.datasets[0].label = selectedValue;
        myChart.update


      } else {
        fetch('suitability.json')
          .then(response => response.json())
          .then(data => {
            const filteredData = data["Excoecaria agallocha (Gewa)"].filter(item => item["District Name"] === selectedDistrict.toUpperCase());
            changeBarChartBasedOnSpeciesSelection(filteredData, selectedValue)
          })
          .catch(error => console.error('Error loading JSON data:', error));

      }
      break;

    case "poshur":
      if (selectedDistrict === "") {
        if (geoJsonLayerArray.length > 0) {
          console.log("geoJsonLayerArray  Lenght" + geoJsonLayerArray.length);
          geoJsonLayerArray.forEach(geoJsonLayerV2 => {
            map.removeLayer(geoJsonLayerV2);

          })
        }
        (async () => {
          for (const url of urls) {
            await loadGeoJSON(map, url);
          }
        })();

        myChart.data.datasets[0].data = chartData.poshur;
        myChart.data.datasets[0].label = selectedValue;
        myChart.update


      } else {
        fetch('suitability.json')
          .then(response => response.json())
          .then(data => {
            const filteredData = data["Xylocarpus moluccensis (Poshur)"].filter(item => item["District Name"] === selectedDistrict.toUpperCase());
            changeBarChartBasedOnSpeciesSelection(filteredData, selectedValue)
          })
          .catch(error => console.error('Error loading JSON data:', error));

      }
      break;
    default:
      // Handle unknown selection if necessary
      return;
  }

  // Update chart
  myChart.update();
}

// Event listener for species and checkbox change
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      handleSelectionChange();
    });
  });

  handleSelectionChange(); // Initialize the chart with the default species and checkbox states
});

// Chart.js initialization
window.addEventListener('load', function () {
  const ctx = document.getElementById('chart').getContext('2d');
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Not Suitable', 'Marginally Suitable', 'Suitable', 'Highly Suitable'],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: [
          'red',
          'orange',
          'yellow',
          'green'
        ]
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: false
        }
      }
    }
  });
});

// Initialize the map and set its view to Bangladesh's coordinates and a suitable zoom level
var map = L.map('map').setView([23.6850, 90.3563], 7);

// Set up the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

/*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);*/



// Event listener for district change
window.onload = function () {
  var selectElement = document.getElementById("species");
  selectElement.addEventListener("change", handleSpeciesChange);

  var districtSelectElement = document.getElementById("district");
  districtSelectElement.addEventListener("change", handleDistrictChange);
};

async function loadGeoJSON(map, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON data from ${url}: ${response.status}`);
    }
    const data = await response.json();
    geoJsonLayer = L.geoJSON(data).addTo(map);
    geoJsonLayerArray.push(geoJsonLayer);

  } catch (error) {
    console.error('Error loading GeoJSON:', error);
    // Optionally: Display an error message to the user
  }
}


const dialog = document.getElementById('sampleDialog');
const openButton = document.getElementById('openTopographicDialog');
const closeButton = document.getElementById('closeDialog');



// Event listener to open the dialog
openButton.addEventListener('click', function () {
  dialog.showModal();
});

// Event listener to close the dialog
closeButton.addEventListener('click', function () {
  dialog.close();
});


const dialogV2 = document.getElementById('sampleDialogClimatic');
const openButtonv2 = document.getElementById('openClimaticeDialog');
const closeButtonV2 = document.getElementById('closeDialogV2');


openButtonv2.addEventListener('click', function () {
  dialogV2.showModal();
});

// Event listener to close the dialog
closeButtonV2.addEventListener('click', function () {
  dialogV2.close();
});


const dialogV3 = document.getElementById('sampleDialogAnthro');
const openButtonv3 = document.getElementById('openAnthropogenicDialog');
const closeButtonV3 = document.getElementById('closeDialogV3');


openButtonv3.addEventListener('click', function () {
  dialogV3.showModal();
});

// Event listener to close the dialog
closeButtonV3.addEventListener('click', function () {
  dialogV3.close();
});


const dialogV4 = document.getElementById('sampleDialogEdaphic');
const openButtonv4 = document.getElementById('openEdaphicDialog');
const closeButtonV4 = document.getElementById('closeDialogV4');


openButtonv4.addEventListener('click', function () {
  dialogV4.showModal();
});

// Event listener to close the dialog
closeButtonV4.addEventListener('click', function () {
  dialogV4.close();
});