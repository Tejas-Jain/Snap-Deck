var streaming = false;
var video = null;
var photo = null;
var capture = null;
var canvas = null;
var saveBtn = null;
var pipBtn = null;
var mediaStream = null;
var output = document.createElement('div');


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


//Adding Event to PiP Buttton
pipBtn = document.getElementById('pipBtn'); //Adding Event Listener to Picture in Picture Button
pipBtn.addEventListener('click', () => {
  if (document.pictureInPictureElement)
    document.exitPictureInPicture();
  else if (document.pictureInPictureEnabled && video)
    video.requestPictureInPicture();
});


//Adding Event To Save Button
saveBtn = document.getElementById('saveBtn'); //Adding EventListener to Save Button
saveBtn.addEventListener('click', savepdf);
function savepdf() {
  if (output)
    html2pdf().from(output).set({ margin:0}).save();
  else
    console.log("Output is Empty Plz Try Capturing Something First");

}


//Adding Event to Capture Button
document.getElementById('captureBtn').addEventListener('click', (ev) => {
  if (video)
    takepicture();
  else
    console.log("Start Streamig First");
}, false);
function takepicture() {
  canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');
  canvas.width = Math.round(.9 * screen.width);
  canvas.height = Math.round(canvas.width / video.videoWidth * video.videoHeight);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  output.appendChild(canvas);
}


function startup() {
  video = document.createElement('video');
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })//Getting User Screen Stream 
    .then((stream) => {
      mediaStream = stream;              //And Adding it to Video Element
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.log("An error occurred: " + err);
    });
}
