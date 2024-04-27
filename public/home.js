import { fetchData } from './fetch.js';


// API: https://forum.freecodecamp.org/t/free-api-inspirational-quotes-json-with-code-examples/311373
fetch("https://type.fit/api/quotes")
.then(function(response) {
    return response.json();
})
.then(function(data) {
    // Haetaan satunnainen lainaus datasta
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomQuote = data[randomIndex].text;
    let author = data[randomIndex].author;

    if (randomQuote === "Today is the tomorrow we worried about yesterday.") {
        author = "Dale Carnegie";
    } else {
        // Poistetaan "type.fit" kirjoittajan nimestä, jos se on läsnä
        if (author.includes("type.fit")) {
            author = author.replace(", type.fit", "");
        }
    }

    document.getElementById("quote").innerHTML = "<em>" + randomQuote + "</em>" + "<br>- " + author;

})
.catch(function(error) {
    console.log("Virhe haettaessa lainausta:", error);
});

  // document.addEventListener('DOMContentLoaded', function() {
  //   const banner = document.getElementById('banner');
  //   const minikuva = document.getElementById('minikuva');
  //   let moveToRight = true; // Alustetaan oletustila, ensimmäinen liike on oikealle

  //   banner.addEventListener('mouseenter', function() {
  //     if (moveToRight) {
  //       minikuva.style.right = '10%'; // Siirtää kuvan oikeaan reunaan
  //       minikuva.style.transform = 'rotateY(1080deg)'; // Käynnistää nopean pyörinnän y-akselin ympäri myötäpäivään
  //     } else {
  //       minikuva.style.right = '85%'; // Siirtää kuvan vasempaan reunaan
  //       minikuva.style.transform = 'rotateY(-1080deg)'; // Käynnistää nopean pyörinnän y-akselin ympäri vastapäivään
  //     }
  //     moveToRight = !moveToRight; // Vaihtaa suuntaa seuraavaa hiiren siirtämistä varten
  //   });
  // });


// Esitietolomakkeen modalin toiminnot
document.addEventListener('DOMContentLoaded', function() {
  let modal = document.getElementById('myModal');
  let closeBtn = document.getElementById('closeInfoModal');

  // Sulje modal rististä
  closeBtn.addEventListener('click', function() {
      modal.style.display = "none";
  });

  // Sulje modal klikkaamalla sen ulkopuolelle
  window.addEventListener('click', function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  });
});

// Tarkistetaan backendistä löytyykö opiskelijan tietoja vai ei
// jos ei löydy, avataan modal automaattisesti
async function fetchStudentInfo() {
  // console.log('Fetching student info...');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  // console.log('User ID from localStorage:', userId); // Tulosta userId konsoliin
  // console.log('Token from localStorage:', token); // Tulosta token konsoliin
  const url = `http://127.0.0.1:3000/api/users/info/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    // console.log('Response status:', response.status, response.statusText); // Tulosta vastauksen tilakoodi ja teksti
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    // console.log('Response data:', data); // Tulosta vastausdata konsoliin

    if (!data.found) {
      console.log("No student information found, opening modal...");
      document.getElementById('myModal').style.display = 'flex';
    } else {
      console.log("Student information found:", data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching student info:', error);
    return null; // Palautetaan null, jos kutsussa tapahtuu virhe
  }
}

document.addEventListener('DOMContentLoaded', function() {
  fetchStudentInfo(); // Kutsutaan funktiota, kun sivu on ladattu
});



// Funktio esitietojen tallentamiseen
document.getElementById('studentForm').addEventListener('submit', addStudentInfo);

function addStudentInfo(evt) {
  evt.preventDefault();

  const url = 'http://127.0.0.1:3000/api/users/info';
  let token = localStorage.getItem('token');

  const userId = localStorage.getItem('user_id');
  const first_name = document.getElementById('firstname').value;
  const surname = document.getElementById('lastname').value;
  const student_number = document.getElementById('studentnumber').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const form = document.getElementById('studentForm');

  // Check if the form is valid
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      first_name: first_name,
      surname: surname,
      student_number: student_number,
      weight: weight,
      height: height,
      age: age,
      gender: gender,
    }),
  };

  fetchData(url, options).then((data) => {
    console.log(data);
    if (data && !data.error) {
      alert("Tiedot lisätty onnistuneesti!");
      document.getElementById('myModal').style.display = 'none';
    } else {
      alert("Tietojen lisääminen epäonnistui: " + (data.error || "Tuntematon virhe"));
    }
  }).catch((error) => {
    console.error('Error adding student info:', error);
    alert("Tietojen lisääminen epäonnistui: " + error.message);
  });
}

// Modalin avaaminen ja käyttäjän tietojen hakeminen
document.getElementById('openEditModalBtn').addEventListener('click', async function() {
  try {
    const response = await fetchStudentInfo();
    if (response && response.found) {
      populateEditModal(response.studentInfo);
      openEditModal();
    } else {
      console.log('No student information found or fetched data is invalid.');
    }
  } catch (error) {
    console.error('Failed to fetch student information:', error);
  }
});

// Täytetään editModal fetchStudentInfossa saaduilla tiedoilla
function populateEditModal(studentInfo) {
  if (studentInfo) {
    document.getElementById('editFirstname').value = studentInfo.first_name || '';
    document.getElementById('editLastname').value = studentInfo.surname || '';
    document.getElementById('editStudentnumber').value = studentInfo.student_number || '';
    document.getElementById('editWeight').value = studentInfo.weight || '';
    document.getElementById('editHeight').value = studentInfo.height || '';
    document.getElementById('editAge').value = studentInfo.age || '';
    document.getElementById('editGender').value = studentInfo.gender || '';
  }
}

function openEditModal() {
  document.getElementById('editModal').style.display = 'flex';
  window.addEventListener('click', windowOnClick);
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  window.removeEventListener('click', windowOnClick);
}

function windowOnClick(event) {
  const editModal = document.getElementById('editModal');
  // Tarkistetaan, onko klikattu elementtiä ulkopuolelta
  if (event.target === editModal) {
    closeEditModal();
  }
}

// Lisätään kuuntelijat sulje-napille
document.getElementById('closeEditModal').addEventListener('click', closeEditModal);

// Kuuntelija päivitä-painikkeelle
document.getElementById('updateInfo').addEventListener('click', updateStudentInfo);


// Lähetetään tietojen päivityspyyntö backendiin
function updateStudentInfo (evt) {
  evt.preventDefault();
  let token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const url = `http://127.0.0.1:3000/api/users/info/${userId}`;

  const newFirst_name = document.getElementById('editFirstname').value;
  const newLastname = document.getElementById('editLastname').value;
  const newStudentnumber = document.getElementById('editStudentnumber').value;
  const newWeight = document.getElementById('editWeight').value;
  const newHeight = document.getElementById('editHeight').value;
  const newAge = document.getElementById('editAge').value;
  const newGender = document.getElementById('editGender').value;

  const form = document.getElementById('editStudentForm');

  // Check if the form is valid
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const options = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      first_name: newFirst_name,
      surname: newLastname,
      student_number: newStudentnumber,
      weight: newWeight,
      height: newHeight,
      age: newAge,
      gender: newGender
    }),
  };

  fetchData(url, options).then((data) => {
    console.log(data);
    if (data && !data.error) {
      alert("Tiedot päivitetty onnistuneesti!");
      closeEditModal();
    } else {
      alert("Tietojen päivittäminen epäonnistui: " + (data.error || "Tuntematon virhe"));
    }
  }).catch((error) => {
    console.error('Error adding student info:', error);
    alert("Tietojen lisääminen epäonnistui: " + error.message);
  });
}

// Apufunktio käyttäjäystävällisen nimen saamiseksi parametrille
function getUserFriendlyName(param) {
  switch(param) {
    case 'measured_timestamp':
      return 'Mittausajankohta'
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

// Funktio muokkaa aikaleiman muotoon dd.mm.yyyy hh:mm
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0'); // Lisätään tarvittaessa johtava nolla
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Lisätään tarvittaessa johtava nolla
  const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${hours}:${minutes}`;
  return formattedDate;
}

async function latestMeasurementData() {
  const token = localStorage.getItem('token');

  try {
    const url = 'http://127.0.0.1:3000/api/kubios/filtered-data';
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    const responseData = await fetchData(url, options);

    // Tarkistetaan, että responseData sisältää filteredData-taulukon
    if (!responseData || !responseData.filteredData || !Array.isArray(responseData.filteredData)) {
      throw new Error('Virheellinen vastausdata');
    }

    // Otetaan filteredData-taulukon ensimmäinen elementti, joka on viimeisin mittaustulos
    const latestData = responseData.filteredData[responseData.filteredData.length - 1];

    // Etsitään <ul>-elementti, johon lisätään mittaustiedot
    const listElement = document.getElementById('latest-data');
    // Tyhjennetään lista
    listElement.innerHTML = '';

    // Lisätään jokainen mittaustieto omalle rivilleen listassa
    for (const key in latestData) {
      const listItem = document.createElement('li');
      const friendlyName = getUserFriendlyName(key);
      let value;

      // Jos avain on 'measured_timestamp', käytetään formatDate-funktiota muuttaaksesi aikaleiman muotoon
      if (key === 'measured_timestamp') {
        value = formatDate(latestData[key]);
      } else {
        // Pyöristetään datan parametrien arvot
        if (key === 'stress_index') {
          value = Math.round(latestData[key] * 10) / 10; // Pyöristetään yhden desimaalin tarkkuuteen
        } else {
          value = Math.round(latestData[key]); // Pyöristetään muut parametrit kokonaislukuun
        }
      }

      // Luo span elementti arvolle ja aseta sille väri
      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;
      valueSpan.style.color = '#044464';

      // Yhdistä kentän nimi ja arvo span-elementtiin
      listItem.textContent = `${friendlyName}: `;
      listItem.appendChild(valueSpan);
      listElement.appendChild(listItem);
    }

  } catch (error) {
    console.error('Virhe haettaessa mittaustietoja:', error);
    return null;
  }
}


async function latestDiaryEntry() {
  const url = `http://127.0.0.1:3000/api/entries`;
  const token = localStorage.getItem('token');

  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  fetchData(url, options).then((data) => {
    // Haetaan kaikista merkinnöistä viimeisin
    const latestEntry = data.reduce((latest, current) => {
      const latestDate = new Date(latest.entry_date);
      const currentDate = new Date(current.entry_date);
      return currentDate > latestDate ? current : latest;
    });

    const list = document.getElementById('latest-entry');

    // Tyhjennetään vanha merkintä
    list.innerHTML = '';

    // Määritetään kenttien nimet
    const keyDisplayNames = {
      entry_date: 'Päivämäärä',
      mood: 'Tunnetila',
      sleep_hours: 'Nukutut tunnit',
      stress_level: 'Stressin määrä',
      weight: 'Paino',
      notes: 'Merkintä'
    };

    // Luodaan uusi elementti listan kaikille jäsenille
    Object.keys(keyDisplayNames).forEach(key => {
      if (latestEntry[key] !== undefined) {
        let value = latestEntry[key];
        // Päivämäärän formatointi
        if (key === 'entry_date') {
          const date = new Date(value);
          value = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        }
        // Lisätään painon perään "kg"
        if (key === 'weight') {
          value = `${value}kg`;
        }

        const item = document.createElement('li');
        // Lisätään värit merkinnän tiedoille
        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.style.color = '#044464';

        item.textContent = `${keyDisplayNames[key]}: `;
        item.appendChild(valueSpan);

        list.appendChild(item);
      }
    });
  });
}








latestDiaryEntry();
latestMeasurementData();





// Funktio, joka näyttää sivustolla kirjautuneen käyttäjän käyttäjänimen
async function showUserName() {
  let username = localStorage.getItem('name');
  console.log("moi", username)
  showGreeting(username);

}

showUserName();

// Näytetään tervehdys käyttäjälle vuorokauden ajan mukaan
async function showGreeting(username) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Hyvää huomenta";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Hyvää päivää";
  } else {
    greeting = "Hyvää iltaa";
  }

  const notification = document.querySelector(".user");
  notification.innerHTML = `${greeting} <strong>${username}</strong>!`;

  notification.classList.add("show-notification");

  setTimeout(() => {
    notification.classList.remove("show-notification");
  }, 5000);
}

// Navigaatiopalkin mobiilinäkymä

document.getElementById('openEditModalBtn').addEventListener('click', function() {
  var mobileNav = document.getElementById('mobileNavbar');
  if (mobileNav.style.display === 'none') {
      mobileNav.style.display = 'flex';
  } else {
      mobileNav.style.display = 'none';
  }
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

