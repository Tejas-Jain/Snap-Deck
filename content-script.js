chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        toggle();
    }
})
console.log("Inside Content Script");
var iframe = document.createElement('iframe'); 
iframe.style.height = "80%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "5px";
iframe.style.right = "0px";
iframe.style.zIndex = "99999";
iframe.style.border = "none"; 
iframe.allow= "display-capture; fullscreen";
iframe.src = chrome.extension.getURL("SideBar/SideBar.html");
document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="70px";
    }
    else{
        iframe.style.width="0px";
    }
}