webpackJsonp([0],{

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// State
var gameState = {
  userPokemon: '',
  cpuPokemon: '',
  pokemonDB: [{
    name: 'charmander',
    type: 'fire',
    hp: 39,
    attack: 51,
    defense: 48,
    level: 1,
    img: "http://www.smogon.com/dex/media/sprites/xy/charmander.gif"
  }, {
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    attack: 49,
    defense: 49,
    level: 1,
    img: "http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif"
  }, {
    name: 'squirtle',
    type: 'water',
    hp: 44,
    attack: 44,
    defense: 50,
    level: 1,
    img: "http://www.smogon.com/dex/media/sprites/xy/squirtle.gif"
  }]
};
// Elements
var battleScreen = document.querySelector("#battle-screen");
var pokemonEl = document.querySelector(".select-screen").querySelectorAll(".character");
var attackBtnsEl = document.getElementById("battle-screen").querySelectorAll(".attack");
// Initial loop
var i = 0;
while (i < pokemonEl.length) {
  // Přidá všem charakterům funkci (na výběrové stránce)
  pokemonEl[i].onclick = function () {
    // Current pokemon name
    var pokemonName = this.dataset.pokemon;

    // Elements for images on battle screen
    var player1Img = document.querySelector(".player1").getElementsByTagName('img');
    var player2Img = document.querySelector(".player2").getElementsByTagName('img');
    // Save the current pokemon to gameState
    gameState.userPokemon = pokemonName;

    // CPU picks a pokemon
    cpuPick(randomNumber(0, 3));

    // Change screen to battle scene
    battleScreen.classList.toggle("active");

    // Select data from current pokemon
    gameState.currentPokemon = gameState.pokemonDB.filter(function (pokemon) {
      return pokemon.name == gameState.userPokemon;
    });

    // Select data from CPU's pokemon
    gameState.currentRivalPokemon = gameState.pokemonDB.filter(function (pokemon) {
      return pokemon.name == gameState.cpuPokemon;
    });

    // Změna obrázků pokémonů
    player1Img[0].src = gameState.currentPokemon[0].img;
    player2Img[0].src = gameState.currentRivalPokemon[0].img;

    // health calculator
    gameState.currentPokemon[0].health = calculateInitialHealth(gameState.currentPokemon);
    gameState.currentPokemon[0].originalHealth = calculateInitialHealth(gameState.currentPokemon);

    gameState.currentRivalPokemon[0].health = calculateInitialHealth(gameState.currentRivalPokemon);
    gameState.currentRivalPokemon[0].originalHealth = calculateInitialHealth(gameState.currentRivalPokemon);
  };
  i++;
}

// attack loop
var a = 0;
while (a < attackBtnsEl.length) {
  attackBtnsEl[a].onclick = function () {
    gameState.currentUserAttack = this.dataset.attack;

    play(gameState.currentUserAttack, cpuAttack());
  };
  a++;
}
// cpu vybírá útok
function cpuAttack() {
  var attacks = ["rock", "paper", "scissors"];
  return attacks[randomNumber(0, 3)];
}

// calculate initial health
function calculateInitialHealth(user) {
  return 0.20 * Math.sqrt(user[0].level) * user[0].defense * user[0].hp;
}

// Vygeneruje random číslo
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// CPU si náhodně vybere pokémona podle náhodného indexu
function cpuPick(index) {
  if (pokemonEl[index].dataset.pokemon == gameState.userPokemon) {
    cpuPick();
  } else {
    gameState.cpuPokemon = pokemonEl[index].dataset.pokemon;
  }
}

function attackMove(attack, level, stack, critical, enemy, attacker) {
  console.log(enemy.name + " hp before:" + enemy.health);
  var attackAmount = attack * level * (stack + critical) / 1.7;
  enemy.health = enemy.health - attackAmount;
  console.log(enemy.name + " hp after:" + enemy.health);

  var userHP = document.querySelector(".player1").querySelector(".stats").querySelector(".health").querySelector(".health-bar").querySelector(".inside");
  var cpuHP = document.querySelector(".player2").querySelector(".stats").querySelector(".health").querySelector(".health-bar").querySelector(".inside");

  if (enemy.owner == "user") {
    var minusPercent = enemy.health * 100 / enemy.originalHealth;
    userHP.style.width = (minusPercent <= 0 ? 0 : minusPercent) + "%";
    // jestli je minusPercent menší než 0, řekněme že to je nula, pokud je to větší než nula, zůstane to takové, jaké to je --> děláme to protože procenta nemůžou být v mínusu (width)
  } else {
    var minusPercent = enemy.health * 100 / enemy.originalHealth;
    cpuHP.style.width = (minusPercent <= 0 ? 0 : minusPercent) + "%";
  }
}
// logika kámen nůžky papír
function play(userAttack, cpuAttack) {
  var currentPokemon = gameState.currentPokemon[0];
  var currentRivalPokemon = gameState.currentRivalPokemon[0];
  currentPokemon.owner = "user";
  currentRivalPokemon.owner = "cpu";
  switch (userAttack) {
    case "rock":
      // rock vs rock DRAW
      if (cpuAttack == "rock") {
        if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
          attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
          attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
        }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
          console.log("You lose! :(");
          return;
        }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
          console.log("You win! Hooray!");
          return;
        }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
          console.log("It is a draw..");
          return;
        }
      }
      // rock vs paper LOSE
      else if (cpuAttack == "paper") {
          if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
            attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
            attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
          }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
            console.log("You lose! :(");
            return;
          }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
            console.log("You win! Hooray!");
            return;
          }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
            console.log("It is a draw..");
            return;
          }
        }
        // rock vs scissors WIN
        else if (cpuAttack == "scissors") {
            if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
              attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
              attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
            }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
              console.log("You lose! :(");
              return;
            }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
              console.log("You win! Hooray!");
              return;
            }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
              console.log("It is a draw..");
              return;
            }
          }
      break;
    case "paper":
      // paper vs rock WIN
      if (cpuAttack == "rock") {
        if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
          attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
          attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
        }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
          console.log("You lose! :(");
          return;
        }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
          console.log("You win! Hooray!");
          return;
        }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
          console.log("It is a draw..");
          return;
        }
      }
      // paper vs paper DRAW
      else if (cpuAttack == "paper") {
          if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
            attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
            attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
          }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
            console.log("You lose! :(");
            return;
          }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
            console.log("You win! Hooray!");
            return;
          }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
            console.log("It is a draw..");
            return;
          }
        }
        // paper vs scissors LOSE
        else if (cpuAttack == "scissors") {
            if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
              attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
              attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
            }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
              console.log("You lose! :(");
              return;
            }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
              console.log("You win! Hooray!");
              return;
            }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
              console.log("It is a draw..");
              return;
            }
          }
      break;
    case "scissors":
      // scissors vs scissors DRAW
      if (cpuAttack == "scissors") {
        if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
          attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
          attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
        }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
          console.log("You lose! :(");
          return;
        }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
          console.log("You win! Hooray!");
          return;
        }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
          console.log("It is a draw..");
          return;
        }
      }
      // scissors vs paper WIN
      else if (cpuAttack == "paper") {
          if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
            attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
            attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
          }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
            console.log("You lose! :(");
            return;
          }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
            console.log("You win! Hooray!");
            return;
          }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
            console.log("It is a draw..");
            return;
          }
        }
        // scissors vs rock LOSE
        else if (cpuAttack == "rock") {
            if (currentPokemon.health > 0 && currentRivalPokemon.health > 0) {
              attackMove(currentPokemon.attack, currentPokemon.level, 0.8, 1, currentRivalPokemon, currentPokemon);
              attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8, 1, currentPokemon, currentRivalPokemon);
            }if (currentPokemon.health <= 0 && currentRivalPokemon.health > 0) {
              console.log("You lose! :(");
              return;
            }if (currentPokemon.health > 0 && currentRivalPokemon.health <= 0) {
              console.log("You win! Hooray!");
              return;
            }if (currentPokemon.health <= 0 && currentRivalPokemon.health <= 0) {
              console.log("It is a draw..");
              return;
            }
          }
      break;
  }
}

/***/ })

},[97]);