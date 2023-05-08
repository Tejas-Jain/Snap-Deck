var streaming = false;
var video = null;
var photo = null;
var capture = null;
var canvas = null;
var saveBtn = null;
var pipBtn = null;
var mediaStream = null;
var output = document.createElement('div');
var output2 = document.getElementById('output2');
var textBox = document.getElementById('notes');
var count = 0;

//Adding Event to Start Btn
var startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
  if (!mediaStream)
    startup();
  else {
    mediaStream.getTracks()[0].stop();
    video.srcObject = null;
    mediaStream = null;
    if (document.pictureInPictureElement)
      document.exitPictureInPicture();
  }
});


//Adding Event to PiP Button
pipBtn = document.getElementById('pipBtn'); //Adding Event Listener to Picture in Picture Button
pipBtn.addEventListener('click', () => {
  if (document.pictureInPictureElement)
    document.exitPictureInPicture();
  else if (document.pictureInPictureEnabled && video){
    video.requestPictureInPicture()
    .then(pictureInPictureWindow => {
      // pictureInPictureWindow.onresize = takePicture();
    });
  }
});

if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Snap-Deck Notes"
  });

//Additional Options and buttons which can be set on Picture and Picture Screen

  navigator.mediaSession.setActionHandler("play", () => {
    /* Code excerpted. */
  });
  navigator.mediaSession.setActionHandler("pause", takePicture);
  // navigator.mediaSession.setActionHandler("stop", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("seekbackward", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("seekforward", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("seekto", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("previoustrack", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("nexttrack", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("skipad", () => {
  //   /* Code excerpted. */
  // });
}
//Adding Event To Save Button
saveBtn = document.getElementById('saveBtn'); //Adding EventListener to Save Button
saveBtn.addEventListener('click', savepdf, false);
function savepdf() {
  if (output){
    var opt = {
      margin: 5,
      filename: 'VideoNotes.pdf',
      pagebreak: {mode: 'avoid-all'},
      image:      { type: 'jpeg', quality: 0.85},
      jsPDF:     {orientation: 'landscape' }
    };
    html2pdf().from(output).set(opt).save();
  }
  else
    alert("Output is Empty Plz Try Capturing Something First");
}


//Adding Event to Capture Button
document.getElementById('captureBtn').addEventListener('click', takePicture, false);

//Take Picture Function to take a picture at from the current displayed screen
function takePicture() {
  if(!video){
    alert("Start Stream First");
    return;
  }
  window.top.postMessage('HideBox', '*');
  //After lot of hit and trial and hours of research of hiding the box while capturing the screen, I found that the video is lagging behind the screen capture which causes the "Hidden Body"  to remain visible even after having everything else in the Synchronous mode.
  //So I added a delay of 400ms to capture the screen after the video has been loaded.
  setTimeout(() => {  //To Account for Video Lag while Capturing

    //Main Output Element
    canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    // canvas.width = Math.round(.9 * screen.width);  //From Screen Size
    // canvas.width = Math.round(794);  //For Portrait, Here 794 is A4 page width for 96 PPI resolution{https://www.papersizes.org/a-sizes-in-pixels.htm}
    canvas.width = Math.round(1080); //for Landscape, Here 1123 is A4 page height for 96 ppi resolution
    canvas.height = Math.round(canvas.width / video.videoWidth * video.videoHeight);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    output.appendChild(canvas);

    //Side Bar Thumbnail Element
    canvas2 = document.createElement("canvas");
    var context2 = canvas2.getContext('2d');
    canvas2.width = Math.round(60); //for Landscape, Here 1123 is A4 page height for 96 ppi resolution
    canvas2.height = Math.round(canvas2.width / video.videoWidth * video.videoHeight);
    context2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    var h1 = document.createElement('h3');
    h1.innerHTML = ++count;
    h1.style = 'margin-bottom: 0;';
    var extraDiv = document.createElement('div');
    extraDiv.appendChild(h1);
    extraDiv.style = 'display: flex; flex-direction: column; align-items: center; gap: 0; justify-content: flex-start;'
    extraDiv.appendChild(canvas2);
    output2.appendChild(extraDiv);

    var para = document.createElement('p');
    para.innerHTML = textBox.value;
    textBox.value = null;
    output.appendChild(para);
    window.top.postMessage('ShowBox', '*');
  }, 15);
}


async function startup() {
  video = document.createElement('video');
  window.top.postMessage('HideBox', '*');
  const displayMediaOptions = {
    video: true,
    audio: false,
    surfaceSwitching: "include",
    selfBrowserSurface: "include",
  }

  await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)//Getting User Screen Stream 
    .then((stream) => {
      mediaStream = stream;              //And Adding it to Video Element
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.log("An error occurred: " + err);
    });
  window.top.postMessage('ShowBox', '*');
}
