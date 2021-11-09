var streaming = false;
var video = null;
var photo = null;
var capture = null;
var canvas = null;
var saveBtn = null;
var pipBtn = null;
var mediaStream = null;
var output = document.createElement('div');
var textBox = document.getElementById('notes');


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
      pictureInPictureWindow.onresize = takepicture;
    });
  }
});


//Adding Event To Save Button
saveBtn = document.getElementById('saveBtn'); //Adding EventListener to Save Button
saveBtn.addEventListener('click', savepdf);
function savepdf() {
  if (output){
    var opt = {
      margin: 5,
      filename:  'Snap-Deck Notes.pdf',
      pagebreak: {mode: 'avoid-all'},
      image:     {type: 'png'},
      jsPDF:     {orientation: 'landscape' }
    };
    html2pdf().from(output).set(opt).save();
  }
  else
    console.log("Output is Empty Plz Try Capturing Something First");
}


//Adding Event to Capture Button
document.getElementById('captureBtn').addEventListener('click', (ev) => {
  if (video)
    takepicture();
  else
    console.log("Start Streaming First");
}, false);

//Take Picture Function to take a picture at from the current displayed screen
function takepicture() {
  canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');
  // canvas.width = Math.round(.9 * screen.width);  //From Screen Size
  // canvas.width = Math.round(794);  //For Portrait, Here 794 is A4 page width for 96 PPI resolution{https://www.papersizes.org/a-sizes-in-pixels.htm}
  canvas.width = Math.round(1080); //for Landscape, Here 1123 is A4 page height for 96 ppi resolution
  canvas.height = Math.round(canvas.width / video.videoWidth * video.videoHeight);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  output.appendChild(canvas);
  var para = document.createElement('p');
  para.innerHTML = textBox.value;
  textBox.value = null;
  output.appendChild(para);
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
