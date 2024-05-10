import { fetchData } from "/fetch.js";

document.addEventListener('DOMContentLoaded', function() {
  // Log OUT
  document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

  // Stressi merkintä
  const marksContainer = document.getElementById('slider-marks');
  const marks = ['0', '2', '4', '6', '8', '10'];

  marks.forEach(mark => {
      // Luodaan uusi merkintä arvolle
      const span = document.createElement('span');
      span.textContent = mark;
      marksContainer.appendChild(span);

      // Annetaan liukusäätimelle arvo
      span.addEventListener('click', function() {
          const slider = document.getElementById('stress_level');
          slider.value = mark;
          slider.dispatchEvent(new Event('input'));
      });
  });

  // Tunnetila napit
  const moodInput = document.querySelector('input[name="mood"]');
  // Luodaan tyhjä lista, johon lisätään valitut tunnetilat
  let selectedMoods = [];

  const moodButtons = document.querySelectorAll('.mood-option-button');

  moodButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Hakee nappien 'data-mood' arvo
          const moodValue = this.getAttribute('data-mood');
          // Pushataan valittu tunnetilaa selectedMoods listaan
          if (!selectedMoods.includes(moodValue)) {
              selectedMoods.push(moodValue);
              this.classList.add('moodSelected');
          } else {
              // Jos tunnetila on jo listassa, poistetaan se
              selectedMoods = selectedMoods.filter(mood => mood !== moodValue);
              this.classList.remove('moodSelected')
          }
          // Päivitetään piilotetun kentän arvo
          moodInput.value = selectedMoods.join(', ');
      });
  });

  // Päivitetään nappien tilan
  moodInput.addEventListener('click', function() {
      const inputValues = this.value.split(',').map(mood => mood.trim());
      selectedMoods = inputValues;
      // Käydään läpi valitut tunnetilaat ja merkkataan valitut napit
      moodButtons.forEach(button => {
          const moodValue = button.getAttribute('data-mood');
          if (selectedMoods.includes(moodValue)) {
              button.classList.add('moodSelected');
          } else {
              button.classList.remove('moodSelected');
          }
      });
  });

  // Luodaan tämänhetkisen päivään ja ajan, kuukauden, vuoden
  let currentDate = new Date();
  let currentMonth = { value: currentDate.getMonth() };
  let currentYear = { value: currentDate.getFullYear() };
  generateCalendar(currentMonth.value, currentYear.value);

  // Haetaan päiväkirjamerkinnät heti sivun latauksen yhteydessä
  getDiaryEntries(currentYear.value, currentMonth.value, currentDate.getDate());

  // POST päivkirjamerkintä lomake
  const createEntry = document.querySelector('.createEntry');

  createEntry.addEventListener('click', async(evt) => {
      evt.preventDefault();

      const url = `http://127.0.0.1:3000/api/entries` /*'/api/entries'*/;
      let token = localStorage.getItem('token');
      const form = document.querySelector('.create_diary_form');


      // Tarkistetaan onko formi täytetty oikein
      if (!form.checkValidity()) {
          form.reportValidity();
          return;
      }

      const data = {
          entry_date: form.querySelector('input[name=entry_date]').value,
          mood: moodInput.value,
          stress_level: form.querySelector('input[name=stress_level]').value,
          weight: form.querySelector('input[name=weight]').value,
          sleep_hours: form.querySelector('input[name=sleep_hours]').value,
          notes: form.querySelector('textarea[name=notes]').value,
      };

      const options = {
          method: 'POST',
          headers: {
              Authorization: 'Bearer: ' + token,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      };
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        // Kutustaan funktio ja listään merkintä taulukkoon
        addEntryToTable(result);
        // Nolla lomakke
        form.reset();
        // Nollataan valitut mood napit
        document.querySelectorAll('.mood-option-button').forEach(button => button.classList.remove('moodSelected'));
        alert('Päiväkirjamerkintä lisätty onnistuneesti! ');
         // Päivitetään kalenterinäkymä heti uuden merkinnän lisäämisen jälkeen
        const newEntryDate = new Date(data.entry_date);
        getDiaryEntries(newEntryDate.getFullYear(), newEntryDate.getMonth(), newEntryDate.getDate());
    } catch (error) {
        console.error('Error adding entry:', error);
        alert(`Virhe lisättäessä päiväkirjamerkintää: ${error.message || error}`);
    }

  });
});

// HAE DATAA KALENTERISTA
async function getDiaryEntries(year, month, day) {
  // Muodostetaan päivämäärä oikeasa muodossa
  const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const url = `http://127.0.0.1:3000/api/entries/date/${date}` /*`/api/entries/date/${date}`;*/
  const token = localStorage.getItem('token');

  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  fetchData(url, options).then((data) => {
    // kutustaan funktio ja annetaan sille data
    showDiaryEntries(data);
  });
}


function showNotification(message, type) {
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.className = type;
  // Näyetään ilmoitus
  notification.style.opacity = '1';

  // Ajastin ilmoituksen piilottamiseen
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// POISTA merkkintä
async function deleteEntryById(evt) {
  evt.preventDefault();
  // Haetaan lähin deleteButton
  const button = evt.target.closest('#deleteButton');
  const id = button.getAttribute('data-id');
  const url = `http://127.0.0.1:3000/api/entries/${id}`;
  let token = localStorage.getItem('token');


  const options = {
      method: 'DELETE',
      headers: {
          Authorization: 'Bearer: ' + token
      }
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
    // Poista taulukon rivin
    button.closest('tr').remove();
    // Kutsutaan funktio ja näytetään onnistunut viesti
    showNotification('Päiväkirjamerkintä poistettu!', 'success');
  } catch (error) {
    console.error("Error deleting entry:", error);
    // Kutsutaan funktio ja näytetään virheviesti
    showNotification('Virhe poistettaessa merkintää.', 'error');
  }
}

// avaa lomakke
function openUpdateForm() {
  const openForm = document.getElementById('updateFormContainer');
  if (openForm) {
    // Näyetetään lomake
    openForm.style.display = 'block';
  }
}

// sulje lomakke
function closeUpdateForm() {
  const formContainer = document.getElementById('updateFormContainer');
  // Piilota lomake
  formContainer.style.display = 'none';
}

// Muokkaa lomake funktio
async function updateEntryById(evt) {
  evt.preventDefault();

  // Avataan muokka lomakkee tietylle päiväkirjamerkinnälle
  // Hakee ensimmäisen updateButton
  const updateButton = evt.target.closest('#updateButton');
  // Haetaan id arvo
  const id = updateButton.getAttribute('data-id');
  const url = `http://127.0.0.1:3000/api/entries/${id}`;
  let token = localStorage.getItem('token');

  // Haetaan tietyn merkinnän dataa ja käytetään niitä lomakkeen esitäyttämiseen
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    const data = await response.json();

    // Tarkista, että data saatiin ja se sisältää tarvittavat tiedot
    if (response.ok && data) {
      // Avataan update lomake
      openUpdateForm();

      const formContainer = document.getElementById('formContainer');
      formContainer.innerHTML = '';

      // Luodaan update lomake
      const form = document.createElement('form');
      // Annetaan lomakkeelle id
      form.setAttribute('id', 'updateEntryForm');

      // Lomaken inputit, jossa on eri kenttiä
      function addInputField(parent, fieldId, type, placeholder, value, required) {
        const input = document.createElement('input');
        input.type = type; // inputin tyypi
        input.id = fieldId; // inputin id
        input.placeholder = placeholder; // inputin viestikentä
        input.value = value || ''; // // iputin alkuarvo
        if (required) {
            input.required = true; // booolean arvo: onko kentä pakollinen
        }
        parent.appendChild(input);
      }

      // Annetaan joka inputille id, type, placeholder, dataa(arvo), määritetään pakolliseksi
      addInputField(form, 'updateEntryDate', 'date', 'Entry Date', data.entry_date, true);
      addInputField(form, 'updateMood', 'text', 'Tunnetila', data.mood, true);
      addInputField(form, 'updateStressLevel', 'number', 'Stressinmäärä', data.stress_level, true);
      addInputField(form, 'updateWeight', 'number', 'Paino', data.weight, true);
      addInputField(form, 'updateSleepHours', 'number', 'Nukutut tunnit', data.sleep_hours, true);
      addInputField(form, 'updateNotes', 'text', 'Muistinpanot', data.notes, true);


      // Päivitettyn lomakkeen lähetä nappi
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = 'Päivitä merkintä';
      form.appendChild(submitButton);
      formContainer.appendChild(form);

      // Päivitettyn lomakkeen sulje nappi
      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.textContent = 'Sulje';
      // Kun sulje nappi painetaan kutustaan closeUpdateFrom funktio
      closeButton.onclick = function(evt) { closeUpdateForm(evt); };
      form.appendChild(closeButton);

      formContainer.appendChild(form);
    } else {
      throw new Error('Failed to fetch entry data');
    }
  } catch (error) {
    alert('Virhe haettaessa päiväkirjamerkintä: ' + error.message);
    console.error('Error fetching entry data:', error);
  }

 // Päivittää merkinnät palvelimmelle
  const form = document.getElementById('updateEntryForm');
  // Kutsu funktio kun lomakketta yritetään lähettää
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Haetaan lomakkeen eri kenttien arvot ID:iden perusteella ja tallennetaan ne muuttujiksi
    const entryDate = document.getElementById('updateEntryDate').value;
    const mood = document.getElementById('updateMood').value;
    const stressLevel = document.getElementById('updateStressLevel').value;
    const weight = document.getElementById('updateWeight').value;
    const sleepHours = document.getElementById('updateSleepHours').value;
    const notes = document.getElementById('updateNotes').value;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        entry_date: entryDate,
        mood: mood,
        stress_level: stressLevel,
        weight: weight,
        sleep_hours: sleepHours,
        notes: notes,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);  // Lokitetaan vastaus selvyyden vuoksi

      if (response.ok && data.message === 'Entry data updated') {
        // Päivietään taulukkorvi
        updateTableRow(id, entryDate, mood, stressLevel, weight, sleepHours, notes);
        // Onnitunut ilmoitusviesti
        showNotification('Päiväkirjamerkintä muokattu onnistuneesti', 'success');
        // Tyhjennetään lomake
        form.reset();
        // Suljetaan lomake kun data on lähetetty
        closeUpdateForm();
      } else {
        throw new Error('Virhe merkinnän muokkaamisessa, tarkista lomake: ' + data.message);
      }
    } catch (error) {
      alert('Virhe päivittäessä päiväkirjamerkintää: ' + error.message);
      console.error('Error updating entry:', error);
    }
  });
}

// Päivitetyn merkinnään uusi rivi taulussa
function updateTableRow(id, entryDate, mood, stressLevel, weight, sleepHours, notes) {
  // Haetaan id ja row
  const row = document.getElementById(`row-${id}`);
  if (!row) {
    console.error('Failed to find the row for id', id);
    return;
  }
  // Pävitetään soulun sisällön arvolla
  row.cells[0].textContent = entryDate;
  row.cells[1].textContent = mood;
  row.cells[2].textContent = stressLevel;
  row.cells[3].textContent = weight;
  row.cells[4].textContent = sleepHours;

  // Varmitetaan että notes nappi ei häviä
  const notesButton = row.cells[5].querySelector('#notesButton');
  if (notesButton) {
    notesButton.setAttribute('data-id', id);
    notesButton.addEventListener('click', function() {
      showModal(notes);
    });
  }

}

// Luodaan taulu
function initializeTable() {
  let container = document.getElementById('entriesTable');
  let table;

  // Jos ei ole taulukko, luodaan sellainen
  if (container.tagName !== 'TABLE') {
      table = document.createElement('table');
      container.appendChild(table);
  } else {
  // Jos container on taulukko, käytetään sitä suoraan
      table = container;
  }

  // Luodaan taululle otsikkorivi
  if (!table.tHead) {
      const thead = table.createTHead();
      const headerRow = thead.insertRow();

      // Lisätään ikoneja muuttujaan
      const icons = [
        'date.png',
        'mood.png',
        'stress.png',
        'weight.png',
        'sleep.png',
        'notes.png',
      ];

      // Lisätään jokaiselle ikonille
      icons.forEach(iconPath => {
         // Lisätään jokaiselle ikonille otsikkorivi
          const headerCell = headerRow.insertCell();
          const img = document.createElement('img');
          img.src = `/images/${iconPath}`; // Polkku
          img.alt = iconPath.split('.')[0]; // Alt text as first part of the file name
          img.classList.add('tableIcons');
          headerCell.appendChild(img); // Lisätään kuva
      });
  }

  if (!table.tBodies.length) {
      table.createTBody();
  }
}


// Lisätään taulu
function addEntryToTable(entry) {
  const table = document.getElementById('entriesTable');
  const tbody = table.tBodies[0];

  // Lisätään uusi rivi tbodyn
  const row = tbody.insertRow();
  // Yksilöidän rivi
  row.id = `row-${entry.entry_id}`;

  // Asetetaan riveille HTML-sisällön
  row.innerHTML = `
      <td>${formatDate(entry.entry_date)}</td>
      <td>${entry.mood}</td>
      <td>${entry.stress_level}</td>
      <td>${entry.weight}</td>
      <td>${entry.sleep_hours}</td>
      <td><button class="tableButtons" aria-label="Lisätietoja" id="notesButton" data-id="${entry.entry_id}"><i class="fa fa-ellipsis-v"></i></button></td>
      <td><button class="tableButtons" aria-label="Päivitä" id="updateButton" data-id="${entry.entry_id}"><i class="fa fa-edit"></i></button></td>
      <td><button class="tableButtons" aria-label="Poista" id="deleteButton" data-id="${entry.entry_id}"><i class="fa fa-trash"></i></button></td>
  `;
  // Avataan muistinpanot ikkunnassa kutsumalla showModal(enty.notes)
  row.querySelector('#notesButton').addEventListener('click', function() {
    showModal(entry.notes);
  });
  // Kutsutaan funktio, joka poista merkinnän
  row.querySelector('#deleteButton').addEventListener('click', deleteEntryById);
  // Kutsutaan funktio, joka päivittää merkinnän
  row.querySelector('#updateButton').addEventListener('click', updateEntryById);
}

// Moduuli muistinpamoille
// Funktio showModal ottaa parametrina notes-muuttujan, joka sisältää muistiinpanotekstin
function showModal(notes) {
  const modal = document.getElementById('entryModal');
  const modalText = modal.querySelector('#modalText');
  // Asetetaan teksti moduuli ikkunaan
  modalText.textContent = notes;
  // Näytetään moduuli
  modal.style.display = 'block';

  // Lisää sulku-toiminnallisuus
  const closeButton = modal.querySelector('.closeButton');
  // Piilotetaan moduuli
  closeButton.onclick = function() {
  modal.style.display = 'none';
  }
}

// Näytetään merkinnät
async function showDiaryEntries(entries) {
  // Luodaan pohja taulukolle
  initializeTable();
  // Luodaan taulu viestille jos ei ole merkkintöjä
  const table = document.querySelector('#entriesTable');
  const tbody = table.tBodies[0];
  tbody.innerHTML = '';

  // Jos merkintöjä ei ole luodaan rivi
  if (entries.length === 0) {
      const noEntriesMessage = document.createElement('tr');
      noEntriesMessage.innerHTML = `<td colspan="8">Tällä päivällä ei ole tehty päiväkirjamerkintöjä. Voit tarkastella toista päivämäärää, jolle merkintöjä on kirjattu.</td>`;
      tbody.appendChild(noEntriesMessage);
      return;
  }
  // Käy läpi merkinnät ja lisä yksittäinen merkintä taulukkoon
  entries.forEach(entry => addEntryToTable(entry, tbody));

  // Kutsutaan funktio jos päivälle löyty merkintä
  markCalendarDays(entries);
}

// Luodaan funktio joka merkkaa kalenterin päivät joille on päiväkirjamerkintöjä
function markCalendarDays(entries) {
  const calendarDays = document.querySelectorAll('.day');

  entries.forEach(entry => {
      // Päivämäärän selvittäminen
      const entryDate = new Date(entry.entry_date);
      const dayNum = entryDate.getDate();
      // Käydään päivär läpi
      calendarDays.forEach(day => {
          // Jos kalenterinpäivän ja merkinnät vastaavat keskennään merkkataan päivää
          if (parseInt(day.textContent) === dayNum) {
              day.classList.add('dayMarked');
          }
      });
  });
}


// KALENTERI

// Luodaan karkausvuosi
const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};
const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

// Kalenterin toiminnallisuuksien perusrunko
let calendar = document.querySelector('.calendar');
const month_names = [
    'Tammikuu',
    'Helmikuu',
    'Maaliskuu',
    'Huhtikuu',
    'Toukokuu',
    'Kesäkuu',
    'Heinäkuu',
    'Elokuu',
    'Syyskuu',
    'Lokakuu',
    'Marraskuu',
    'Joulukuu',
  ];

let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');

month_picker.onclick = () => {
  month_list.classList.remove('hideonce');
  month_list.classList.remove('hide');
  month_list.classList.add('show');
  dayTextFormate.classList.remove('showtime');
  dayTextFormate.classList.add('hidetime');
  timeFormate.classList.remove('showtime');
  timeFormate.classList.add('hideTime');
  dateFormate.classList.remove('showtime');
  dateFormate.classList.add('hideTime');
};

// Kalenteri näkymä

const generateCalendar = (month, year) => {
  let calendar_days = document.querySelector('.calendar-days');
  calendar_days.innerHTML = '';
  let calendar_header_year = document.querySelector('#year');
  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let currentDate = new Date();
  // Luo uuden päivämääräobjektin kopioiden `currentDate`-objektin aikaleiman
  let selectedDate = new Date(currentDate.getTime());

  //  Päivittää kuukauden nimen otsikossa
  month_picker.innerHTML = month_names[month];
  // Asetta vuoden numeron näkyviin
  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);
  // Muunetaan viikon ensimmäisen päivän indeksin maanantaille (0 = maanantai).
  let firstDayMonday = first_day.getDay() === 0 ? 6 : first_day.getDay() - 1;

  // Luodaan ruutu jokaista kalenteripäivää varten
  for (let i = 0; i <= days_of_month[month] + firstDayMonday - 1; i++) {
    let day = document.createElement('div');

    if (i >= firstDayMonday) {
      let dayNum = i - firstDayMonday + 1;
      day.innerHTML = dayNum;
      day.classList.add('day');
      day.addEventListener('click', () => {
        selectedDate.setDate(dayNum);
        selectedDate.setMonth(month);
        selectedDate.setYear(year);
        // Päivittää kalenterinäkymän valitun päivän korostamiseksi
        updateCalendarDayStyles(calendar_days, selectedDate);
        // Hakee päiväkirjamerkinnät valitulle päivämäärälle
        getDiaryEntries(year, month, dayNum);
      });

      // Tarkistetaan onko tämä päivä nykyinen päivä, ja korostetaan sitä
      if (dayNum === currentDate.getDate() && year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        day.classList.add('current-date');
      }
      // Hakee päiväkirjamerkinnät valitulle päivämäärälle
      getDiaryEntries(year, month, dayNum);
    }
    calendar_days.appendChild(day);
  }
};

// Korostetaan valittu päivää
function updateCalendarDayStyles(calendarElement, selectedDate) {
  let days = calendarElement.querySelectorAll('.day');
  // Lisää korostuksen päivälle, joka täsmää 'selectedDate' päivän kanssa
  days.forEach(day => {
    day.classList.remove('current-date');
    let dayNumber = parseInt(day.textContent);
    if (dayNumber === selectedDate.getDate() && selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear()) {
      day.classList.add('current-date');
    }
  });
}

let month_list = calendar.querySelector('.month-list');
month_names.forEach((e, index) => {
  let month = document.createElement('div');
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace('show', 'hide');
    dayTextFormate.classList.remove('hideTime');
    dayTextFormate.classList.add('showtime');
    timeFormate.classList.remove('hideTime');
    timeFormate.classList.add('showtime');
    dateFormate.classList.remove('hideTime');
    dateFormate.classList.add('showtime');
  };
});

(function() {
  month_list.classList.add('hideonce');
})();
document.querySelector('#pre-year').onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector('#next-year').onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector('.time-formate');
const todayShowDate = document.querySelector('.date-formate');

const currshowDate = new Date();
const showCurrentDateOption = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timeZone: 'Europe/Helsinki'
};
const currentDateFormate = new Intl.DateTimeFormat(
  'fi-FI',
  showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;
setInterval(() => {
  const timer = new Date();
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Helsinki'
  };
  const formateTimer = new Intl.DateTimeFormat('fi-FI', option).format(timer);
  let time = `${`${timer.getHours()}`.padStart(
      2,
      '0'
    )}:${`${timer.getMinutes()}`.padStart(
      2,
      '0'
    )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
  todayShowTime.textContent = formateTimer;
}, 1000);

// Muunetaan päivämäärän ymmärrettävään muotoon
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

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
