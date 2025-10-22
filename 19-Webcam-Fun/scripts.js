const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

function paintCanvas() {
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;

  function draw() {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // apply green screen effect
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
    requestAnimationFrame(draw);
  }

  draw();
}

function takePhoto() {
  // play snap sound
  snap.currentTime = 0;
  snap.play();

  // take data out of canvas
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "photo");
  link.innerHTML = `<img src="${data}" alt="snapshot" />`;
  strip.insertBefore(link, strip.firstChild);
}

function greenScreen(pixels) {
  const levels = {};

  // read all the slider values into an object
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i + 0];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();
video.addEventListener("canplay", paintCanvas);
