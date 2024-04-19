import { fetchData } from "/fetch.js";

// Log OUT
document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user_id")
    window.location.href = "index.html";
}

// Stressi merkintä
document.addEventListener('DOMContentLoaded', function () {
  const marksContainer = document.getElementById('slider-marks');
  const marks = ['0', '2', '4', '6' , '8', '10']; // Define your scale marks here

  marks.forEach(mark => {
    const span = document.createElement('span');
    span.textContent = mark;
    marksContainer.appendChild(span);

    // Optional: Make the marks clickable to set the slider value
    span.addEventListener('click', function () {
      const slider = document.getElementById('stress_level');
      slider.value = mark;
      // Trigger the input event if you have an event listener for the slider
      slider.dispatchEvent(new Event('input'));
    });
  });
});


// Tunnetila napit

// globaali muuttujat
const moodInput = document.querySelector('input[name="mood"]');
let selectedMoods = [];

document.addEventListener('DOMContentLoaded', function() {
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

});

// POST entries formi

const createEntry = document.querySelector('.createEntry')

createEntry.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const url = 'http://127.0.0.1:3000/api/entries';
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
    console.log(data)


    const options = {
      method: 'POST',
      headers: {
          Authorization: 'Bearer: ' + token,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  };

  console.log(options);

  fetchData(url, options).then((data) => {
    form.querySelector('input[name=entry_date]').value = '';
    form.querySelector('input[name=mood]').value = '';
    moodInput.value = '';
    selectedMoods = [];
    form.querySelector('input[name=stress_level').value = '';
    form.querySelector('input[name=weight]').value = '';
    form.querySelector('input[name=sleep_hours]').value = '';
    form.querySelector('textarea[name=notes]').value = '';

        // Remove 'moodSelected' class from all mood buttons
        const moodButtons = document.querySelectorAll('.mood-option-button');
        moodButtons.forEach(button => button.classList.remove('moodSelected'));

})
})


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
  console.log(date)
  const url = `http://127.0.0.1:3000/api/entries/date/${date}`;
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


function showDiaryEntries(entries) {
  // Tässä voit lisätä logiikan tietojen näyttämiseen, esim. dialogissa, modaalissa tai sivun alueella
  console.log('Diary entries:', entries);
}}

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

  month_picker.innerHTML = month_names[month];
  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);
  // Muokataan kuukauden alkamaan maanataista
  let firstDayMonday = first_day.getDay() === 0 ? 6 : first_day.getDay() - 1;


  for (let i = 0; i <= days_of_month[month] + firstDayMonday - 1; i++) {

    let day = document.createElement('div');

    if (i >= firstDayMonday) {
      let dayNum = i - firstDayMonday + 1;
      day.innerHTML = dayNum;
      day.classList.add('day');
      day.addEventListener('click', () => getDiaryEntries(year, month, dayNum));

      if (dayNum === currentDate.getDate() && year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        day.classList.add('current-date');
      }
    }
    calendar_days.appendChild(day);
  }
};






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

