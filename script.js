window.addEventListener("scroll",function(){

    const navbar =
    document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.background =
        "rgba(0,0,0,0.85)";

    }
    else{

        navbar.style.background =
        "rgba(0,0,0,0.5)";
    }

});

console.log("TI WEBSITE LOADED");