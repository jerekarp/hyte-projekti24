import { fetchData } from './fetch.js';


// TODO: Käyttäjälle vaihtoehto suodattaa dataa (esim. viikottain, kuukausittain, kalenteri???)
document.addEventListener('DOMContentLoaded', function() {
    const data = {
      labels: [], // Tyhjä taulukko alustetaan, nimet päivitetään myöhemmin
      datasets: []
    };

    const config = {
      type: 'bar', // bar, line etc
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const myChart = new Chart(document.getElementById('myChart'), config);
    const chartSelection = document.getElementById('chartSelection');
    const maxDataElement = document.getElementById('max-data'); // Lisää maksimiarvot tähän elementtiin

    chartSelection.addEventListener('change', function() {
      const selectedValue = chartSelection.value;
      updateChartWithData(selectedValue);
    });

    async function updateChartWithData(selectedValue) {
      try {
        const token = localStorage.getItem("token");
        const url = 'http://127.0.0.1:3000/api/kubios/filtered-data';
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
          
            // Päivitetään maksimiarvot max-data-elementtiin
            maxDataElement.innerHTML = '';
            Object.keys(maxValues).forEach(param => {
                let value = maxValues[param];
                // Tarkistetaan, onko parametri stress_index ja pyöristetään se yhden desimaalin tarkkuuteen
                if (param === 'stress_index') {
                  value = Math.round(value * 10) / 10; // Pyöristetään yhden desimaalin tarkkuuteen
                } else {
                  value = Math.round(value); // Pyöristetään muut parametrit kokonaislukuun
                }
                const p = document.createElement('p');
                p.textContent = `${getUserFriendlyName(param)}: ${value}`;
                maxDataElement.appendChild(p);
            });

          let selectedLabel = '';
          if (selectedValue === 'all') { // Lisätään 'all' vaihtoehto
            selectedLabel = 'Kaikki data';
            // Päivitetään kaavion data kaikille valituille arvoille
            myChart.data.labels = filteredData.map(entry => formatDate(entry.measured_timestamp));
            myChart.data.datasets = Object.keys(filteredData[0]).filter(key => key !== 'measured_timestamp' && key !== 'rmssd_ms').map((key, index) => {
              return {
                label: getUserFriendlyName(key),
                data: filteredData.map(entry => entry[key]),
                backgroundColor: getBackgroundColor(index),
                borderColor: getBorderColor(index), 
                borderWidth: 1
              };
            });
          } else {
            // Muutetaan labeli ja päivitetään kaavion data valitun arvon mukaan
            selectedLabel = getUserFriendlyName(selectedValue)
    
            myChart.data.labels = filteredData.map(entry => formatDate(entry.measured_timestamp));
            myChart.data.datasets = [{
              label: selectedLabel,
              data: filteredData.map(entry => entry[selectedValue]),
              backgroundColor: getColor(selectedValue), 
              borderColor: getColor(selectedValue), 
              borderWidth: 1
            }];
          }

          myChart.update();
        } else {
          console.error('Failed to fetch or parse data');
        }
      } catch (error) {
        console.error('Error occurred while fetching data:', error);
      }
    }

    updateChartWithData('all'); // Oletusarvoisesti näytetään kaikki data
});

// Apufunktio käyttäjäystävällisen nimen saamiseksi parametrille
function getUserFriendlyName(param) {
  switch(param) {
    case 'stress_index':
      return 'Stressi-indeksi';
    case 'respiratory_rate':
      return 'Hengitysnopeus ( breaths/min )';
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


document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

  