var streaming = false;
var video = document.createElement('video');
var photo = null;
var capture = null;
var canvas = null;
var canvas2 = null;
var saveBtn = null;
var pipBtn = null;
var output = document.createElement('div');
var output2 = document.getElementById('output2');
var textBox = document.getElementById('notes');
var count = 0;
var saved = false;

video.addEventListener('pause', ()=>{
  video.play();
});

//Prompt for accident reload of screen
window.addEventListener("beforeunload", function(event) {
  // Call the save function when the event is triggered
  if(saved || !output2.hasChildNodes()) return;
  
  // Cancel the default browser behavior to show a confirmation dialog
  event.preventDefault();

  // Modern browsers require the `returnValue` property to be set
  return (event.returnValue = "");
});

//Adding Event to Start Btn
var startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
  if (!video.srcObject){
    window.top.postMessage('exitFullScreen', '*');
    setTimeout(() => {
      startup();
    }, 500);
  }
  else {    
    stopCapture();
  }
});

function stopCapture(){
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => {
        track.stop(); // Stop the track associated with the screen sharing stream
      }
    );
  }
  video.srcObject = null;
  if (document.pictureInPictureElement)
    document.exitPictureInPicture();
}


//Adding Event to PiP Button
pipBtn = document.getElementById('pipBtn'); //Adding Event Listener to Picture in Picture Button
pipBtn.addEventListener('click', () => {
  if (document.pictureInPictureElement)
    document.exitPictureInPicture();
  else if (document.pictureInPictureEnabled && video){
    if(!video.srcObject){
      alert(" Select the screen using \"Red Button\" ");
      return;
    }
    video.requestPictureInPicture()
    .then(pictureInPictureWindow => {
      // pictureInPictureWindow.onresize = takePicture();
    });
  }
});

if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Snap-Desk Notes"
  });

//Additional Options and buttons which can be set on Picture and Picture Screen

  navigator.mediaSession.setActionHandler("play", (e) => {
    /* Code excerpted. */
    takePicture();
  });
  navigator.mediaSession.setActionHandler("pause", (e)=>{takePicture();});
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
  if (output2.hasChildNodes()){
    var opt = {
      margin: 5,
      filename: 'VideoNotes.pdf',
      pagebreak: {mode: 'avoid-all'},
      image:      { type: 'jpeg', quality: 0.85},
      jsPDF:     {orientation: 'landscape' }
    };
    html2pdf().from(output).set(opt).save();
    saved = true;
  }
  else
    alert("Nothing to save. Please Try Capturing Something!!!");
}


//Adding Event to Capture Button
document.getElementById('captureBtn').addEventListener('click', takePicture, false);

//Take Picture Function to take a picture at from the current displayed screen
function takePicture() {
  if(!video.srcObject){
    alert("First select the screen");
    setTimeout(() => {
      startup();
    }, 500);
    return;
  }
  window.top.postMessage('HideBox', '*');
  //After lot of hit and trial and hours of research of hiding the box while capturing the screen, I found that the video is lagging behind the screen capture which causes the "Hidden Body"  to remain visible even after having everything else in the Synchronous mode.
  //So I added a delay of 400ms to capture the screen after the video has been loaded.
  setTimeout(() => {  //To Account for Video Lag while Capturing
    ++count;  //For Numbering the Captures
    //Main Output Element
    var wrapper = document.createElement('div');
    wrapper.id = "Canvas"+count;

    canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    // canvas.width = Math.round(.9 * screen.width);  //From Screen Size
    // canvas.width = Math.round(794);  //For Portrait, Here 794 is A4 page width for 96 PPI resolution{https://www.papersizes.org/a-sizes-in-pixels.htm}
    canvas.width = Math.round(1080); //for Landscape, Here 1123 is A4 page height for 96 ppi resolution
    canvas.height = Math.round(canvas.width / video.videoWidth * video.videoHeight);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    wrapper.appendChild(canvas);


    var para = document.createElement('p');
    para.innerHTML = textBox.value;
    wrapper.appendChild(para);
    textBox.value = null;

    output.appendChild(wrapper);


    //Side Bar Thumbnail Canvas Element
    canvas2 = document.createElement("canvas");
    var context2 = canvas2.getContext('2d');
    canvas2.width = Math.round(60); //for Landscape, Here 1123 is A4 page height for 96 ppi resolution
    canvas2.height = Math.round(canvas2.width / video.videoWidth * video.videoHeight);
    context2.drawImage(video, 0, 0, canvas2.width, canvas2.height);

    var h1 = document.createElement('h3');
        h1.innerHTML = count; //Adding Numbering to h1
        var cross = document.createElement('span');
            cross.style = 'color: red; font-size: 1.8rem; font-weight: bold; cursor: pointer;';
            cross.innerHTML = '&cross;';
        h1.appendChild(cross); //Adding Cross to h1
    h1.style = `
      margin-bottom: 0; 
      padding-bottom: 0; 
      border-bottom: 0;
      user-select: none;
    `;
    //Add Clickable Event Listener to h1
    cross.addEventListener('click', removePage, false);
    cross.id = count;

    var extraDiv = document.createElement('div');
    extraDiv.appendChild(h1);
    extraDiv.style = `
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 0; 
      justify-content: flex-start;
    `;
    extraDiv.id = "Canvas"+count;
    extraDiv.appendChild(canvas2);
    output2.appendChild(extraDiv);


    window.top.postMessage('ShowBox', '*');
  }, 500);
}

function removePage(e) {
  const id = e.currentTarget.id;
  var page = output.querySelector('#Canvas' + id); 
  console.log(page.parentNode);
  console.log(e.currentTarget);
  page.parentNode.removeChild(page);
  page = document.getElementById('Canvas' + id);
  console.log(page.parentNode);
  page.parentNode.removeChild(page);
}

async function startup() {
  window.top.postMessage('HideBox', '*');
  const displayMediaOptions = {
    video: true,
    audio: false,
    surfaceSwitching: "include",
    selfBrowserSurface: "include",
  }

  await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)//Getting User Screen Stream 
    .then((stream) => {
      video.srcObject = stream;
      video.srcObject.oninactive = () => stopCapture();
      video.play();
    })
    .catch((err) => {
      console.log("An error occurred: " + err);
    });
  window.top.postMessage('ShowBox', '*');
}
