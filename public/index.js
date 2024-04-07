import { fetchData } from './fetch.js';


const loginButton = document.querySelector('#loginButton');

loginButton.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const loginForm = document.querySelector('.row.gtr-uniform');
  const authError = document.getElementById('authError');

  const emailInput = loginForm.querySelector('input[name=email]');
  const passwordInput = loginForm.querySelector('input[name=password]');

  // Tarkistetaan, että ovatko kentät tai kenttä tyhjä
  if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
    alert('Please enter both email and password.');
    return;
  }

  const url = 'http://127.0.0.1:3000/api/auth/login';

  const data = {
    username: emailInput.value,
    password: passwordInput.value,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      if (!data.token) {
        // Kirjautuminen epäonnistui

        // Lisätään visuaalinen tyylittely syöttökenttiin ilmaisemaan epäonnistuminen ja lisätään virheteksti
        emailInput.style.border = '2px solid indianred';
        passwordInput.style.border = '2px solid indianred';
        authError.innerText = 'Invalid username or password';
        authError.style.color = 'indianred';

        // Lisätään shake-luokka
        emailInput.classList.add('shake');
        passwordInput.classList.add('shake');

        // Poistetaan shake-luokka ja punaiset rajat syöttökentistä 4 sekunnin kuluttua
        setTimeout(function() {
          emailInput.classList.remove('shake');
          passwordInput.classList.remove('shake');
          emailInput.style.border = '';
          passwordInput.style.border = '';
          authError.innerText = '';
    }, 3500);
      } else {
        // Kirjautuminen onnistui, lisätään token ja ohjataan etusivulle
        // TODO: Visuaalinen ilmoitus onnistuneesta kirjautumisesta
        localStorage.setItem('token', data.token);
        setTimeout(function () {
          window.location.href = 'home.html';
        }, 1000);
      }
    })
    .catch(error => {
      // Käsittely virheiden varalta
      console.error('Error:', error);
    });
});



