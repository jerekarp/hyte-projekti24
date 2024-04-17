// fetch("https://type.fit/api/quotes")
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     console.log(data);
//   });

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


  document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('myModal');
    var openBtn = document.getElementById('openModal');
    var closeBtn = document.getElementsByClassName('close')[0];

    // Avaa modal
    openBtn.addEventListener('click', function() {
        modal.style.display = "flex";
    });

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

document.getElementById('studentForm').addEventListener('submit', addStudentInfo);

function addStudentInfo(evt) {
  // evt.preventDefault();
  console.log(evt);

  const url = 'http://127.0.0.1:3000/api/users/info'
  let token = localStorage.getItem('token');

  const userId = localStorage.getItem('user_id');
  const first_name = document.getElementById('firstname').value;
  const surname = document.getElementById('lastname').value;
  const student_number = document.getElementById('studentnumber').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const stress_level = document.getElementById('stress').value;

  const options = {
    method: 'PUT',
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
      stress_level: stress_level
    }),
  };
  console.log("Request body:", options.body);

  fetchData(url, options).then((data) =>{
    console.log(data);
  });

}

// // Funktio joka luo merkinnän
// function createEntry(evt) {
//   evt.preventDefault();

//   console.log(evt);

//   const url = `http://127.0.0.1:3000/api/entries/`;
//   let token = localStorage.getItem('token');

//   const newEntryDate = document.getElementById('setDate').value;
//   const newMood = document.getElementById('setMood').value;
//   const newWeight = document.getElementById('setWeight').value;
//   const newSleep = document.getElementById('setSleep').value;
//   const newEntry = document.getElementById('setEntry').value;

//   const options = {
//       method: 'POST',
//       headers: {
//           Authorization: 'Bearer ' + token,
//           'Content-type': 'application/json',
//       },
//       body: JSON.stringify({
//           entry_date: newEntryDate,
//           mood: newMood,
//           weight: newWeight,
//           sleep_hours: newSleep,
//           notes: newEntry}),
//   };

//   fetchData(url, options).then((data) => {
//       console.log(data);
//       alert('Merkinnän lisäys onnistunut!');
//       document.getElementById('setDate').value = '';
//       document.getElementById('setMood').value = '';
//       document.getElementById('setWeight').value = '';
//       document.getElementById('setSleep').value = '';
//       document.getElementById('setEntry').value = '';
//       getEntryById();
//   });
// }



document.querySelector(".nav-link.nav-link-right").addEventListener("click", logOut);

function logOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
}


