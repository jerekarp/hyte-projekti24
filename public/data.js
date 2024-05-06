import { fetchData } from './fetch.js';

document.addEventListener('DOMContentLoaded', function() {
  const data = {
    labels: [], // Tyhjä taulukko alustetaan, nimet päivitetään myöhemmin
    datasets: []
  };

  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          display: !isMobileDevice
        }
      },
      plugins: {
        tooltip: {
          intersect: false
        },
        legend: {
          display: !isMobileDevice,
          onClick: function(e, legendItem) {
            const index = legendItem.datasetIndex;
            const ci = this.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          },
          onHover: function(e, legendItem) {
            e.native.target.style.cursor = 'pointer';
          },
          onLeave: function(e, legendItem) {
            e.native.target.style.cursor = 'default';
          }
        },
        title: {
          display: true,
          text: 'Kubios HRV'
        }
      },
      interaction: {
        mode: 'index'
      },
      onHover: function(e) {
        const points = this.getElementsAtEventForMode(
          e,
          'index', { axis: 'x', intersect: true },
          false
        );

        if (points.length) e.native.target.style.cursor = 'pointer';
        else e.native.target.style.cursor = 'default';
      }
    }
  };

  const myChart = new Chart(document.getElementById('myChart'), config);
  const chartSelection = document.getElementById('chartSelection');
  const maxDataElement = document.getElementById('max-data');
  const dataAmountInput = document.getElementById('dataAmount');
  const incrementButton = document.getElementById('increment');
  const decrementButton = document.getElementById('decrement');

  incrementButton.addEventListener('click', function() {
    dataAmountInput.stepUp();
    updateChartWithData(chartSelection.value, dataAmountInput.value);
  });

  decrementButton.addEventListener('click', function() {
    dataAmountInput.stepDown();
    updateChartWithData(chartSelection.value, dataAmountInput.value);
  });

  dataAmountInput.addEventListener('change', function() {
    updateChartWithData(chartSelection.value, dataAmountInput.value);
  });

  chartSelection.addEventListener('change', function() {
    updateChartWithData(chartSelection.value, dataAmountInput.value);
  });
  

  async function updateChartWithData(selectedValue, dataAmount) {
    try {

      // Tarkistetaan, onko selectedValue tyhjä, ja asetetaan se 'all'-arvoksi tarvittaessa
      if (!selectedValue) {
        selectedValue = 'all';
      }
      const token = localStorage.getItem("token");
      const url = 'http://127.0.0.1:3000/api/kubios/filtered-data?count=' + dataAmount;
      const options = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      

      const responseData = await fetchData(url, options);
      console.log(responseData)

      if (responseData.status === 'ok' && responseData.filteredData && responseData.maxValues) {
        let filteredData = responseData.filteredData;
        let maxValues = responseData.maxValues;

        

        maxDataElement.innerHTML = '';
        Object.keys(maxValues).forEach(param => {
          let value = maxValues[param];
          if (param === 'stress_index') {
            value = Math.round(value * 10) / 10;
          } else {
            value = Math.round(value);
          }
          const p = document.createElement('p');
          p.textContent = `${getUserFriendlyName(param)}: ${value}`;
          maxDataElement.appendChild(p);
        });

        let selectedLabel = '';
        let chartType = 'bar';
        if (selectedValue === 'all') {
          selectedLabel = 'Kaikki data';
          chartType = 'bar';
        } else {
          selectedLabel = getUserFriendlyName(selectedValue)
          chartType = 'line';
        }

        myChart.config.type = chartType;
        myChart.data.labels = filteredData.map(entry => formatDate(entry.measured_timestamp));
        myChart.data.datasets = (selectedValue === 'all') ?
          Object.keys(filteredData[0]).filter(key => key !== 'measured_timestamp' && key !== 'rmssd_ms').map((key, index) => {
            return {
              label: getUserFriendlyName(key),
              data: filteredData.map(entry => entry[key]),
              backgroundColor: getBackgroundColor(index),
              borderColor: getBorderColor(index),
              borderWidth: 1
            };
          }) :
          [{
            label: selectedLabel,
            data: filteredData.map(entry => entry[selectedValue]),
            backgroundColor: getColor(selectedValue),
            borderColor: getColor(selectedValue),
            borderWidth: 1
          }];

        myChart.update(); // Päivitetään kaavio
        dataAmountInput.value = responseData.dataCount;
      } else {
        console.error('Failed to fetch or parse data');
      }
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
    }
  }

  updateChartWithData('all', 15);
});



// Apufunktio käyttäjäystävällisen nimen saamiseksi parametrille
function getUserFriendlyName(param) {
  switch(param) {
    case 'stress_index':
      return 'Stressi-indeksi';
    case 'respiratory_rate':
      return 'Hengitystaajuus ( breaths/min )';
    case 'mean_hr_bpm':
      return 'Keskimääräinen syke ( bpm )';
    case 'readiness':
      return 'Readiness ( % )';
    default:
      return param;
  }
}

// Apufunktio värin saamiseksi !!! (Yksittäiset kuvaajat) !!!
function getColor(selectedValue) {
    let color = '';
    if (selectedValue === 'stress_index') {
        color = 'rgba(255, 99, 132, 1)';
      } else if (selectedValue === 'respiratory_rate') {
        color = 'rgba(54, 162, 235, 1)';
      } else if (selectedValue === 'mean_hr_bpm') {
        color = 'rgba(255, 206, 86, 1)';
      } else if (selectedValue === 'readiness') {
        color = 'rgba(75, 192, 192, 1)';
      }

    return color
}

// Apufunktio taustavärin saamiseksi !!! (Kaikki data -kuvaaja) !!!
function getBackgroundColor(index) {
  const colors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
  return colors[index % colors.length];
}

// Apufunktio reunavärin saamiseksi
function getBorderColor(index) {
  const colors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
  return colors[index % colors.length];
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0'); // Lisätään tarvittaessa johtava nolla
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Lisätään tarvittaessa johtava nolla
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${hours}:${minutes}`;
    return formattedDate;
}


// Modaali Info
let modal = document.getElementById("modal");
let icon = document.getElementById("info-icon");
let close = document.getElementsByClassName("close")[0];

// Näytetään modaalinen ikkuna kun klikkaat kuvaketta
icon.addEventListener("click", function() {
  modal.style.display = "block";
});

// Piilotetaan modaalinen ikkuna kun klikkaat sulkemispainiketta
close.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  let showMoreIcons = document.querySelectorAll(".show-more-icon");

  showMoreIcons.forEach(function(icon) {
    icon.addEventListener("click", function() {
      let content = icon.closest(".data-info").querySelector(".info-content");

      if (content) {
        // Lisätään tai poistetaan CSS-luokka 'expanded' tarvittaessa
        content.classList.toggle("expanded");
      } else {
        console.error("Info-content-div not found!");
      }
    });
  });
});


// Kirjautuminen ulos navbarin kirjaudu ulos painikkeesta
document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
  evt.preventDefault()
  // Kysy käyttäjältä vahvistusta
  if (window.confirm("Haluatko varmasti kirjautua ulos?")) {
      // Jos käyttäjä vahvistaa, poista käyttäjätiedot selaimen localStoragesta
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("name");

      // Ohjaa käyttäjä takaisin etusivulle
      window.location.href = "index.html";
  }
}




