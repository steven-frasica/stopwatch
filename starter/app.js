const timerMilliseconds = document.querySelector(".timer__milliseconds");
const timerSeconds = document.querySelector(".timer__seconds");
const timerMinutes = document.querySelector(".timer__minutes");

// `cancelId` keeps track of the current animation frame so Stop can cancel it.
// `startTime` marks when the current run began.
// `savedTime` stores previously accumulated time so Start can resume after Stop.
let cancelId;
let startTime;
let savedTime = 0;

function startTimer() {
  // Capture the timestamp for the current run.
  // Later, updateTimer compares `Date.now()` against this value.
  startTime = Date.now();
  // Start the browser-driven render loop.
  // requestAnimationFrame is a good fit here because it updates alongside repaint.
  cancelId = requestAnimationFrame(updateTimer);
}

function stopTimer() {
  // Add the most recent run onto the previously saved total.
  // This is what allows the stopwatch to pause and resume instead of restarting.
  savedTime = savedTime + Date.now() - startTime;
  console.log(savedTime);

  // Stop the animation loop using the id returned by requestAnimationFrame.
  cancelAnimationFrame(cancelId);
}

function resetTimer() {
  // Interview note:
  // Reset usually needs to clear both layers of state:
  // 1. the timing values (`savedTime`, current run state)
  // 2. the DOM display (`00:00:000`)
  // If the timer is running, it also needs to stop the animation loop.
  savedTime = 0;
  timerMilliseconds.innerHTML = "000";
  timerSeconds.innerHTML = "00";
  timerMinutes.innerHTML = "00";
}

// want to update the time every ms
function updateTimer() {
  // Total elapsed time is any previously saved time plus the time
  // from the current active run.
  let millisElapsed = savedTime + Date.now() - startTime;

  // Convert the raw millisecond count into larger units for display.
  let secondsElapsed = millisElapsed / 1000;
  let minutesElapsed = secondsElapsed / 60;

  // Break the total into the exact pieces the UI needs.
  // `% 60` keeps seconds in the 0-59 range after full minutes are removed.
  let minutesText = Math.floor(minutesElapsed);
  let secondsText = Math.floor(secondsElapsed % 60);
  let millisText = millisElapsed % 1000;

  // Pad the values so the stopwatch always has a stable shape.
  // Example: 4 seconds becomes 04, and 9 milliseconds becomes 009.
  if (minutesText.toString().length === 1) {
    minutesText = "0" + minutesText;
  }
  if (secondsText.toString().length === 1) {
    secondsText = "0" + secondsText;
  }
  if (millisText.toString().length < 3) {
    millisText = millisText.toString().padStart(3, "0");
  }

  // Push the formatted values into the DOM.
  timerMilliseconds.innerHTML = millisText;
  timerSeconds.innerHTML = secondsText;
  timerMinutes.innerHTML = minutesText;

  // Call requestAnimationFrame again to keep the loop alive.
  // The first call starts the loop; this call keeps it repeating.
  // timerMilliseconds.innerHTML = millisElapsed % 1000
  // timerSeconds.innerHTML = String(Math.floor(secondsElapsed % 60)).padStart(2, '0')
  // timerMinutes.innerHTML = String(Math.round(minutesElapsed)).padStart(2, '0')
  // timerMinutes.innerHTML = minutesElapsed % 1000 % 60
  cancelId = requestAnimationFrame(updateTimer);
}
