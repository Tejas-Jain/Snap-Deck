
// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

// var width = 370;    // We will scale the photo width to this
// var height = 0;     // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

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
  else if (document.pictureInPictureEnabled)
    video.requestPictureInPicture();
});


//Adding Event To Save Button
saveBtn = document.getElementById('saveBtn'); //Adding EventListener to Save Button
saveBtn.addEventListener('click', savepdf);
function savepdf() {
  if (output)
    html2pdf().from(output).set({ margin: 1 }).save();
  else
    console.log("Output is Empty Plz Try Capturing Something First");

}


//Adding Event to Capture Button
document.getElementById('captureBtn').addEventListener('click', (ev) => {
  if (video)
    takepicture();
  else
    console.log("Start Streamig First");
  // ev.preventDefault();
}, false);
function takepicture() {
  canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');
  // if (width && height) {
  canvas.width = Math.round(.9 * screen.width);
  canvas.height = Math.round(canvas.width / video.videoWidth * video.videoHeight);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  output.appendChild(canvas);
  // var data = canvas.toDataURL('image/png');
  // photo.setAttribute('src', data);
  // } else{
  //   clearphoto();
  // }
}


//Function of StartBtn
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
  // video.addEventListener('canplay',(ev)=>{
  //   if (!streaming) {
  //     height = video.videoHeight / (video.videoWidth/width);

  //     // Firefox currently has a bug where the height can't be read from
  //     // the video, so we will make assumptions if this happens.

  //     if (isNaN(height)) {
  //       height = width / (4/3);
  //     }
  //     // video.setAttribute('width', width);
  //     // video.setAttribute('height', height);
  //     // canvas.setAttribute('width', width);
  //     // canvas.setAttribute('height', height);
  //     streaming = true;
  //   }
  // }, false);


  // clearphoto();
// Fill the photo with an indication that none has been
// captured.

// function clearphoto() {
//   var context = canvas.getContext('2d');
//   context.fillStyle = "#AAA";
//   context.fillRect(0, 0, canvas.width, canvas.height);

//   var data = canvas.toDataURL('image/png');
//   photo.setAttribute('src', data);
// }

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.


