document.addEventListener('DOMContentLoaded', function() {
  // 1 Modalin viittaus
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("avaaNappi");
  var span = document.getElementsByClassName("close")[0];
  // modal on piilossa kunnes sitä kutsutaan.
  modal.style.display = "none";
  // Kun käyttäjä klikkaa nappia, avaa modal
  btn.addEventListener('click', function() {
    modal.style.display = "block";
  });
  // Kun käyttäjä klikkaa <span> (x), sulje modal
  span.addEventListener('click', function() {
    modal.style.display = "none";
  });
  // Kun käyttäjä klikkaa modalin ulkopuolella, sulje se
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Chatin lähetys Enter painikkeella
  document.getElementById("chat-input").addEventListener("keydown", function(KeyboardEvent) {
    if (KeyboardEvent.keyCode === 13) { // Enter-näppäin on keycode 13
      KeyboardEvent.preventDefault(); // Estää oletustoiminnon, kuten lomakkeen lähetyksen
      const message = KeyboardEvent.target.value; // Haetaan viesti input-kentästä
      if (message) {
        sendMessage(message);
      }
    }
  });


});

// Frontend koodi (esimerkki käyttäen Fetch API:a)
const sendMessage = async (message) => {
  try {
    const response = await fetch('http://localhost:3000/api/chat/zenbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    document.getElementById('chat-output').innerText = data.response; // Näyttää palvelimen vastauksen sivulla
    console.log('Response from server:', data);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('chat-output').innerText = 'Error: ' + error.message; // Näyttää virheviestin sivulla
  }
  finally {
    document.getElementById('chat-input').value = ''; // Tyhjentää chattikentän
  }
}


document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user_id")
    window.location.href = "index.html";
}
