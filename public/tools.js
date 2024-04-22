

// ensimmäinen modaali
document.addEventListener('DOMContentLoaded', function() {
  // 1 Modalin viittaus
  var modal = document.getElementById("myModal1");
  var btn = document.getElementById("avaaNappi1");
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

// toinen modaali

document.addEventListener('DOMContentLoaded', function() {

  var modal = document.getElementById("myModal2");
  var btn = document.getElementById("avaaNappi2");
  var span = document.getElementsByClassName("close2")[0];
  modal.style.display = "none";

  btn.addEventListener('click', function() {
    modal.style.display = "block";
  });
  span.addEventListener('click', function() {
    modal.style.display = "none";
  });
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

// kolmas modaali

document.addEventListener('DOMContentLoaded', function() {

  var modal = document.getElementById("myModal3");
  var btn = document.getElementById("avaaNappi3");
  var span = document.getElementsByClassName("close3")[0];
  modal.style.display = "none";

  btn.addEventListener('click', function() {
    modal.style.display = "block";
  });
  span.addEventListener('click', function() {
    modal.style.display = "none";
  });
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

// neljäs modaali

document.addEventListener('DOMContentLoaded', function() {

  var modal = document.getElementById("myModal4");
  var btn = document.getElementById("avaaNappi4");
  var span = document.getElementsByClassName("close4")[0];
  modal.style.display = "none";

  btn.addEventListener('click', function() {
    modal.style.display = "block";
  });
  span.addEventListener('click', function() {
    modal.style.display = "none";
  });
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

// Kirjautuminen ulos navbarin kirjaudu ulos painikkeesta
document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    window.location.href = "index.html";
}
