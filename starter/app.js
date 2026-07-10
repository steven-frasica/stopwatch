



const timerMilliseconds = document.querySelector('.timer__milliseconds');
const timerSeconds = document.querySelector('.timer__seconds')
const timerMinutes = document.querySelector('.timer__minutes')

// These variables hold the stopwatch state between button clicks.
// `cancelId` is the id for the current animation frame so we can stop the loop.
// `startTime` is the timestamp for the current run.
// `savedTime` is the total elapsed time from previous runs, which enables pause/resume.
let cancelId;
let startTime;
let savedTime = 0;

function startTimer() {
  // Capture the moment this run starts.
  // Interview talking point: we do not increment a counter manually.
  // Instead, we measure real elapsed time with Date.now(), which is more accurate.
  startTime = Date.now()

  // Start a render loop that updates the DOM on each browser repaint.
  // Interview talking point: requestAnimationFrame is a good fit for visual updates,
  // but it will not fire every single millisecond. It runs roughly once per frame.
  cancelId = requestAnimationFrame(updateTimer)
}

function stopTimer() {
  // Add the time from the current run to any time that was already saved.
  // This is the key pause/resume behavior: stopping does not erase elapsed time.
  savedTime = savedTime + Date.now() - startTime;

  // Stop the animation loop so the display no longer updates.
  cancelAnimationFrame(cancelId);
}

function resetTimer() {
  // Reset the current run start point and clear any previously accumulated time.
  // Because this function does not cancel the animation frame, a running stopwatch
  // will immediately continue from 00:00:000 after reset.
  startTime = Date.now();
  savedTime = 0

  // Restore the display to the default zeroed format.
  timerMilliseconds.innerHTML = '000';
  timerSeconds.innerHTML = '00';
  timerMinutes.innerHTML = '00';
}

function updateTimer() {
  // Total elapsed time is:
  // 1. anything saved from previous runs
  // 2. plus the time since the current run started
  let millisElapsed = savedTime + Date.now() - startTime
  let secondsElapsed = millisElapsed / 1000;
  let minutesElapsed = secondsElapsed / 60;

  // Break the total into the pieces the UI needs.
  // `% 60` keeps seconds in the 0-59 range after full minutes are removed.
  let minutesText = Math.floor(minutesElapsed)
  let secondsText = Math.floor(secondsElapsed % 60)
  let millisText = millisElapsed % 1000

  // Pad each value so the stopwatch always displays as MM:SS:MMM.
  // Interview talking point: this is presentation logic only; the math is already done above.
  if (minutesText.toString().length === 1) {
    minutesText = '0' + minutesText;
  }
  if (secondsText.toString().length === 1) {
    secondsText = '0' + secondsText
  }
  if (millisText.toString().length < 3) {
    millisText = millisText.toString().padStart(3, '0');
  }

  // Push the formatted values into the DOM.
  timerMilliseconds.innerHTML = millisText;
  timerSeconds.innerHTML = secondsText;
  timerMinutes.innerHTML = minutesText;

  // Schedule the next update so the loop keeps running until stopTimer cancels it.
  // This implementation assumes startTimer is not called repeatedly while already running.
  cancelId = requestAnimationFrame(updateTimer)
}