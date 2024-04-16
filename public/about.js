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

document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
