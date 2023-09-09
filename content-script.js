chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        toggle();
    }
})
// console.log("Inside Content Script");  For checking the basic working of extension and background script
var iframe = document.createElement('iframe'); 
iframe.style.minWidth = 0;
iframe.style.height = "587px";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "999999999999";
iframe.style.border = "none"; 
iframe.style.opacity = 1;
iframe.style.onHover
iframe.addEventListener('mouseover', ()=>{
    iframe.style.opacity = 1;
});
iframe.addEventListener('mouseleave', ()=>{
    iframe.style.opacity = 0.5;
})

iframe.allow= "display-capture;";
iframe.src = chrome.runtime.getURL("./core/SideBar/SideBar.html");
document.body.appendChild(iframe);

//Communication with the extension.
window.onmessage = function(event){
    if (event.data == 'HideSnapdeskExtensioBox') {
        iframe.style.zIndex = "-1000";
        iframe.style.display = "none";
    }
    else if(event.data == 'ShowSnapdeskExtensionBox'){
        iframe.style.zIndex = "999999999999";
        iframe.style.display = "block";
    }
    else if(event.data == 'exitFullScreen' && document.fullscreenElement){
        document.exitFullscreen();
    }
    else if(event.data == 'Play_Root_Video'){
        console.log("Received Message Play_Root_Video Message Listener");
        var vidElement = document.querySelector("video");
        vidElement.play();
    }
};
function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="70px";
    }
    else{
        iframe.style.width="0px";
    }
}