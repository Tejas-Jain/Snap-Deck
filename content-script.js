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
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.border = "none"; 
iframe.allow= "display-capture";
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