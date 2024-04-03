import { fetchData } from './fetch.js';


// Etsi nappi ja lisää tapahtumankäsittelijä sille
const loginButton = document.querySelector('#loginButton');

loginButton.addEventListener('click', async (evt) => {
  evt.preventDefault(); // Estä lomakkeen oletustoiminta (esim. sivun uudelleenlataus)

  const url = 'http://127.0.0.1:3000/api/auth/login';

  const loginForm = document.querySelector('.row.gtr-uniform'); // Korjattu syntaksi

  const data = {
    username: loginForm.querySelector('input[name=email]').value, // Korjattu syntaksi
    password: loginForm.querySelector('input[name=password]').value,
  };


  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  };

  fetchData(url, options).then((data) => { // Lisätty puuttuvat sulut
    // käsitellään fetchData funktiosta tullut JSON
    localStorage.setItem('token', data.token);
    setTimeout(function () {
        window.location.href = 'home.html';
      }, 1000);
  });
});

