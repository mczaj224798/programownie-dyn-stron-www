
var game = {
  zdobyte : 0,
  zycia : 1,
}

// alert(data[0]['country']);
let box = document.getElementById("wrap");

const COUTNRIES_COUNT = 247
let randomized = getRandomInt(0, COUTNRIES_COUNT)
let word = data[randomized]['country'];

let letters = []

for (let i = 0; i < word.length; i += 1) {
  letters[i] = document.createElement('span');
  if ( word[i] === ' ') {
    letters[i].classList.add("letter-space")
  } else {
    letters[i].classList.add("letter")
  }
  letters[i].innerHTML = word[i];
  box.appendChild(letters[i]);
}

//
// for (var i = 0; i < data[0]['country'].length; i += 1) {
//
//
//     // alert(data[0]['country'][i]);
//   }


// addElement("wrap");
//LISTENERS

document.getElementById("graj").addEventListener("click", Sprawdz_Litery);
// alert(game.zycia);


//FUNKCJE
function Sprawdz_Litery() {
  var liter = document.getElementById("wpisz_litere").value;
  // alert(liter);
  // alert(getRandomInt(10,20));
}

//
// function addElement(mydiv)
// {
//
//   newDiv = document.createElement("span");
//   newDiv.innerHTML = "jasiokotek";
//
//   my_div = document.getElementById(mydiv);
//   document.body.insertBefore(newDiv, my_div);
//
//   newDiv2 = document.createElement("span");
//   newDiv2.innerHTML = "jasiokotek2";
//   document.body.insertBefore(newDiv2, my_div.nextSibling);
//
//   newDiv.classList.add("mystyle");
// }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
