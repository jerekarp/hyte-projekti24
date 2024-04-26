import { fetchData } from "/fetch.js";

document.addEventListener('DOMContentLoaded', function() {
  // Log OUT
  document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

  // Stressi merkintä
  const marksContainer = document.getElementById('slider-marks');
  const marks = ['0', '2', '4', '6', '8', '10']; // Define your scale marks here

  marks.forEach(mark => {
      const span = document.createElement('span');
      span.textContent = mark;
      marksContainer.appendChild(span);

      // Optional: Make the marks clickable to set the slider value
      span.addEventListener('click', function() {
          const slider = document.getElementById('stress_level');
          slider.value = mark;
          // Trigger the input event if you have an event listener for the slider
          slider.dispatchEvent(new Event('input'));
      });
  });

  // Tunnetila napit
  const moodInput = document.querySelector('input[name="mood"]');
  let selectedMoods = [];

  const moodButtons = document.querySelectorAll('.mood-option-button');

  moodButtons.forEach(button => {
      button.addEventListener('click', function() {
          const moodValue = this.getAttribute('data-mood');

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

  // Kuuntelee muutoksia input-kentässä ja päivittää nappien tilan
  moodInput.addEventListener('click', function() {
      const inputValues = this.value.split(',').map(mood => mood.trim());
      selectedMoods = inputValues;

      moodButtons.forEach(button => {
          const moodValue = button.getAttribute('data-mood');
          if (selectedMoods.includes(moodValue)) {
              button.classList.add('moodSelected');
          } else {
              button.classList.remove('moodSelected');
          }
      });
  });

  // Aseta nykyinen päivä oletusarvoksi
  let currentDate = new Date();
  let currentMonth = { value: currentDate.getMonth() };
  let currentYear = { value: currentDate.getFullYear() };
  generateCalendar(currentMonth.value, currentYear.value);

  // Hae päiväkirjamerkinnät heti sivun latauksen yhteydessä
  getDiaryEntries(currentYear.value, currentMonth.value, currentDate.getDate());

  // POST entries formi
  const createEntry = document.querySelector('.createEntry');

  createEntry.addEventListener('click', async(evt) => {
      evt.preventDefault();

      const url = `http://127.0.0.1:3000/api/entries` /*'/api/entries'*/;
      let token = localStorage.getItem('token');
      const form = document.querySelector('.create_diary_form');


      // Check if the form is valid
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
        console.log("Received entry data:", result);
        addEntryToTable(result);
        form.reset();
        document.querySelectorAll('.mood-option-button').forEach(button => button.classList.remove('moodSelected'));
        alert('Entry added successfully!');
    } catch (error) {
        console.error('Error adding entry:', error);
        alert(`Error adding entry: ${error.message || error}`);
    }

  });
});



// KALENTERI
const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};
const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

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


// HAE DATAA KALENTERISTA
async function getDiaryEntries(year, month, day) {
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
    showDiaryEntries(data);
  });
}

function showNotification(message, type) {
  // Etsi olemassa oleva ilmoitus tai luo uusi
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
  }

  // Aseta viesti ja tyyppi
  notification.textContent = message;
  notification.className = type; // Aseta luokka tyyppiin perustuen

  // Näytä ilmoitus asettamalla opacity välittömästi 1:ksi
  notification.style.opacity = '1';

  // Aseta ajastin ilmoituksen piilottamiseen
  setTimeout(() => {
    notification.style.opacity = '0';
    // Odota opacity-transitionin päättymistä ennen poistoa
    setTimeout(() => {
      notification.remove(); // Poista ilmoitus DOM:sta
    }, 500); // Odotusaika vastaa CSS transition kestoa
  }, 3000); // Ilmoitus näkyy 3 sekuntia
}



async function deleteEntryById(evt) {
  evt.preventDefault(); // Prevent default form submission behavior
  const button = evt.target.closest('.deleteButton');
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
    button.closest('tr').remove(); // Remove the row from the table
    showNotification('Päiväkirjamerkintä poistettu!', 'success'); // Success notification
  } catch (error) {
    console.error("Error deleting entry:", error);
    showNotification('Virhe poistettaessa merkintää.', 'error'); // Error notification
  }
}

// popUp lomakkee
function openUpdateForm() {
  const openForm = document.getElementById('updateFormContainer');
  if (openForm) {
    openForm.style.display = 'block';
  }
}

function closeUpdateForm(evt) {
  if (evt) {
    evt.stopPropagation();
  }
  const closeForm = document.getElementById('updateFormContainer');
  if (closeForm) {
    closeForm.style.display = 'none';
  }
}


// Muokkaa lomakke
async function updateEntryById(evt) {
  evt.preventDefault();
  const updateButton = evt.target.closest('.updateButton');
  const id = updateButton.getAttribute('data-id');
  const url = `http://127.0.0.1:3000/api/entries/${id}`;
  let token = localStorage.getItem('token');

  openUpdateForm();

  const formContainer = document.getElementById('formContainer');
  formContainer.innerHTML = '';  // Clear previous form if it exists

  const form = document.createElement('form');
  form.setAttribute('id', 'updateEntryForm');

  function addInputField(parent, fieldId, type, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.id = fieldId;
    input.placeholder = placeholder;
    parent.appendChild(input);
  }

  // Add fields to form
  addInputField(form, 'updateEntryDate', 'date', 'Entry Date');
  addInputField(form, 'updateMood', 'text', 'Tunnetila');
  addInputField(form, 'updateStressLevel', 'number', 'Stressinmäärä');
  addInputField(form, 'updateWeight', 'number', 'Paino');
  addInputField(form, 'updateSleepHours', 'number', 'Nukutut tunnit');
  addInputField(form, 'updateNotes', 'text', 'Muistinpanot');


  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Lisää uusi päiväkirjamerkintä';
  form.appendChild(submitButton);
  formContainer.appendChild(form);

  // Luo sulje-painike
  const closeButton = document.createElement('button');
  closeButton.type = 'button';  // Varmistetaan, ettei se lähetä lomaketta
  closeButton.textContent = 'Sulje';  // Teksti painikkeessa
  closeButton.onclick = function(evt) { closeUpdateForm(evt); }; // Lisää argumentti funktiokutsuun
  form.appendChild(closeButton);  // Lisää sulje-painike lomakkeeseen

  formContainer.appendChild(form);

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const entryDate = document.getElementById("updateEntryDate").value;
    const mood = document.getElementById("updateMood").value;
    const StressLevel = document.getElementById("updateStressLevel").value;
    const weight = document.getElementById("updateWeight").value;
    const sleepHours = document.getElementById("updateSleepHours").value;
    const notes = document.getElementById("updateNotes").value;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        entry_date: entryDate,
        mood: mood,
        stress_level: StressLevel,
        weight: weight,
        sleep_hours: sleepHours,
        notes: notes,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.message === "Entry data updated") {
        updateTableRow(id, entryDate, mood, StressLevel, weight, sleepHours, notes);
        showNotification('Päiväkirjamerkintä muokattu onnistuneesti', 'success'); // Custom function to show notifications
        form.reset();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      alert("Error updating entry: " + error.message);
      console.error("Error updating entry:", error);
    }
  });
}

function updateTableRow(id, entryDate, mood, stressLevel, weight, sleepHours, notes) {
  // Assuming each row in your table has an id `row-<entryId>`
  const row = document.getElementById(`row-${id}`);
  if (!row) {
    console.error('Failed to find the row for id', id);
    return;
  }

  // Update each cell directly
  row.cells[0].textContent = entryDate;
  row.cells[1].textContent = mood;
  row.cells[2].textContent = stressLevel;
  row.cells[3].textContent = weight;
  row.cells[4].textContent = sleepHours;
  row.cells[5].textContent = notes;
}


// TABLE AND SHOW TABLE

function initializeTable() {
  let container = document.getElementById('entriesTable');
  let table;

  // Check if the container is a table or needs a table to be added
  if (container.tagName !== 'TABLE') {
      table = document.createElement('table'); // Create a new table element
      container.appendChild(table); // Append it to the div
  } else {
      table = container; // Use the existing table
  }

  if (!table.tHead) {
      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      const headers = ['Päivämäärä', 'Tunnetila', 'Stressinmäärä', 'Paino', 'Nukutut tunnit', 'Muistiinpanot', 'Poista', 'Muokka'];
      headers.forEach(text => {
          const headerCell = headerRow.insertCell();
          headerCell.textContent = text;
      });
  }
  if (!table.tBodies.length) {
      table.createTBody();
  }
}

function addEntryToTable(entry) {
  const table = document.getElementById('entriesTable');
  const tbody = table.tBodies[0]; // Ensure this is correctly referencing your table's tbody

  const row = tbody.insertRow();
  row.id = `row-${entry.entry_id}`;

  // Ensure entry.notes is defined, or use an empty string as a fallback
  const notes = entry.notes || '';
  const notesClass = notes.length > 10 ? 'notes scrollable' : 'notes';

  row.innerHTML = `
      <td>${formatDate(entry.entry_date)}</td>
      <td>${entry.mood}</td>
      <td>${entry.stress_level}</td>
      <td>${entry.weight}</td>
      <td>${entry.sleep_hours}</td>
      <td class="${notesClass}">${notes}</td>
      <td><button class="deleteButton" data-id="${entry.entry_id}"><i class="fa fa-trash"></i></button></td>
      <td><button class="updateButton" data-id="${entry.entry_id}"><i class="fa fa-check"></i></button></td>
  `;

  // Add event listeners
  row.querySelector('.deleteButton').addEventListener('click', deleteEntryById);
  row.querySelector('.updateButton').addEventListener('click', updateEntryById);
}


async function showDiaryEntries(entries) {
  initializeTable();
  const table = document.querySelector('#entriesTable'); // Adjust this selector based on your HTML structure
  const tbody = table.tBodies[0];
  tbody.innerHTML = '';  // Clear previous entries

  if (entries.length === 0) {
      const noEntriesMessage = document.createElement('tr');
      noEntriesMessage.innerHTML = `<td colspan="8">Tällä päivällä ei ole tehty päiväkirjamerkintöjä. Voit tarkastella toista päivämäärää, jolle merkintöjä on kirjattu.</td>`;
      tbody.appendChild(noEntriesMessage);
      return;
  }

  entries.forEach(entry => addEntryToTable(entry, tbody));

  // Mark the calendar days after entries have been loaded
  markCalendarDays(entries);
}

function markCalendarDays(entries) {
  const calendarDays = document.querySelectorAll('.day');

  entries.forEach(entry => {
      const entryDate = new Date(entry.entry_date);
      const dayNum = entryDate.getDate();

      // Mark the calendar day corresponding to the entry date
      calendarDays.forEach(day => {
          if (parseInt(day.textContent) === dayNum && !day.querySelector('.entry-icon')) {
              const icon = document.createElement('img');
              icon.classList.add('entry-icon');
              icon.src = '/images/period.png'; // Ensure the path to the image is correct
              day.appendChild(icon);
          }
      });
  });
}




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
  let selectedDate = new Date(currentDate.getTime());  // Kopioi nykyinen päivämäärä, alustettavaksi valinnan mukaan

  month_picker.innerHTML = month_names[month];
  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);
  let firstDayMonday = first_day.getDay() === 0 ? 6 : first_day.getDay() - 1;

  for (let i = 0; i <= days_of_month[month] + firstDayMonday - 1; i++) {
    let day = document.createElement('div');

    if (i >= firstDayMonday) {
      let dayNum = i - firstDayMonday + 1;
      day.innerHTML = dayNum;
      day.classList.add('day');
      day.addEventListener('click', () => {
        // Päivitä selectedDate, kun käyttäjä klikkaa päivää
        selectedDate.setDate(dayNum);
        selectedDate.setMonth(month);
        selectedDate.setYear(year);
        updateCalendarDayStyles(calendar_days, selectedDate);  // Päivitä visuaalinen esitys
        getDiaryEntries(year, month, dayNum);
      });

     // Aseta current-date luokka vain jos päivä vastaa alkuperäistä currentDatea
      if (dayNum === currentDate.getDate() && year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        day.classList.add('current-date');
      }

      // Hae päiväkirjamerkinnät heti kun päivä luodaan
      getDiaryEntries(year, month, dayNum);
    }
    calendar_days.appendChild(day);
  }
};

// Apufunktio kalenteripäivien tyylien päivittämiseksi
function updateCalendarDayStyles(calendarElement, selectedDate) {
  let days = calendarElement.querySelectorAll('.day');
  days.forEach(day => {
    day.classList.remove('current-date');  // Poista vanha valinta
    let dayNumber = parseInt(day.textContent);
    if (dayNumber === selectedDate.getDate() && selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear()) {
      day.classList.add('current-date');  // Lisää current-date luokka uudelle valitulle päivälle
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
    second: 'numeric',
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

function formatDate(dateStr) {
  const date = new Date(dateStr);
 // console.log("Formatted date:", date); // Check how dates are being parsed
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function logOut(evt) {
  evt.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("name");
  window.location.href = "index.html";
}
