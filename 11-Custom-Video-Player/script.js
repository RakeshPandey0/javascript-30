// Get Elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

// Flags
let mouseDown = false;

// Build functions
function togglePlay() {
  // if video is paused while function is called, play the video and vice versa
  const method = video.paused ? "play" : "pause";
  video[method]();
}

function updateButton() {
  const icon = this.paused ? "►" : "❚❚";
  toggle.textContent = `${icon}`;
}

function handleProgress() {
  const percentage = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percentage}%`;
}

function handleSkip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRange() {
  if (mouseDown) video[this.name] = this.value;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}
// Event Listeners

//video pause and play events
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
toggle.addEventListener("click", togglePlay);
video.addEventListener("timeupdate", handleProgress);
//video skip events
skipButtons.forEach((button) => button.addEventListener("click", handleSkip));

//video volume and playbackspeed events
ranges.forEach((range) => range.addEventListener("change", handleRange));
ranges.forEach((range) => range.addEventListener("mousemove", handleRange));

//handle flag for tracking change in range
ranges.forEach((range) =>
  range.addEventListener("mousedown", () => (mouseDown = true))
);
ranges.forEach((range) =>
  range.addEventListener("mouseup", () => (mouseDown = false))
);

progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mouseDown && scrub(e));
progress.addEventListener("mousedown", () => (mouseDown = true));
progress.addEventListener("mouseup", () => (mouseDown = false));
