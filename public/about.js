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
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
// Käytä sendMessage-funktiota lähettämään viesti backendiin
sendMessage('Kuka on Suomen presidentti');
  

document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
