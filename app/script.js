// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var chances = 3;
var preCountDown;
var myInterval;
var counter = 20;
var visibleCount;

document.getElementById("display").innerHTML = 3;
function startGame() {
  clearInterval(myInterval);
  clearInterval(visibleCount);
  document.getElementById("chancesText").classList.remove("hidden");
  //initialize game variables
  progress = 0;
  chances = 3;
  gamePlaying = true;
  randomSequence();

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function randomSequence() {
  for (let i = 0; i <= 7; i++) {
    // for each clue that is revealed so far
    pattern[i] = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    console.log(pattern[i]);
  }
}

function stopGame() {
  clearInterval(myInterval);
  clearInterval(visibleCount);
  myInterval = 0;
  visibleCount = 0;
  gamePlaying = false;
  document.getElementById("chancesText").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("timerText").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 510,
};
function playTone(btn, len) {
  document.getElementById("myAudio" + btn).play();
  tonePlaying = true;

  setTimeout(function () {
    stopTone(btn);
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    document.getElementById("myAudio" + btn).play();
    tonePlaying = true;
  }
}
function stopTone(btn) {
  document.getElementById("myAudio" + btn).pause();
  document.getElementById("myAudio" + btn).currentTime = 0;
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  clearInterval(myInterval);
  clearInterval(visibleCount);
  clueHoldTime -= 30;
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  document.getElementById("timer").innerHTML =
    "Timer starts when clue sequence is played";
  preCountDown = setInterval(countdDown, delay);
  // document.getElementById("timer").innerHTML =
}

function loseGame() {
  clearInterval(myInterval);
  clearInterval(visibleCount);
  stopGame();
  alert("Game Over. You lost.");
  document.getElementById("display").innerHTML = 3;
}

function winGame() {
  clearInterval(myInterval);
  clearInterval(visibleCount);
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  console.log("time " + myInterval);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress != pattern.length - 1) {
        progress++;
        clearInterval(myInterval);
        clearInterval(visibleCount);
        playClueSequence();
      } else {
        winGame();
      }
    } else {
      guessCounter++;
    }
  } else {
    console.log("chances: " + chances);
    chances--;
    document.getElementById("display").innerHTML = chances;
    if (chances > 0) {
      document.getElementById("display").innerHTML = chances;
      clearInterval(myInterval);
      clearInterval(visibleCount);
      playClueSequence();
    } else {
      loseGame();
    }
  }
}

function countdDown() {
  clearInterval(preCountDown);
  myInterval = setInterval(loseGame, 21000);
  document.getElementById("timerText").classList.remove("hidden");
  counter = 20;
  visibleCount = setInterval(function () {
    document.getElementById("timer").innerHTML = counter;
    counter--;
    if (counter == 0) {
      clearInterval(visibleCount);
    }
  }, 1000);
}
