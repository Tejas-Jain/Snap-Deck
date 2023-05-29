chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        toggle();
    }
})
console.log("Inside Content Script");
var iframe = document.createElement('iframe'); 
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "5px";
iframe.style.right = "0px";
iframe.style.zIndex = "999999999999";
iframe.style.border = "none"; 
iframe.allow= "display-capture;";
iframe.src = chrome.runtime.getURL("SideBar/SideBar.html");
document.body.appendChild(iframe);
window.onmessage = function(event){
    if (event.data == 'HideBox') {
        iframe.style.zIndex = "-1000";
        iframe.style.display = "none";
    }
    else if(event.data == 'ShowBox'){
        iframe.style.zIndex = "999999999999";
        iframe.style.display = "block";
    }
    else if(event.data == 'exitFullScreen'){
        document.exitFullscreen();
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