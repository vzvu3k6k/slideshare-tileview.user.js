// ==UserScript==
// @name           slideshare tileview
// @description    Shows slides in tile
// @version        1.0
// @author         vzvu3k6k
// @match          http://www.slideshare.net/*
// @namespace      http://vzvu3k6k.tk/
// @license        Public Domain
// ==/UserScript==

(function(){
    // Make tiles
    var player = document.querySelector(".player");
    var slides = player.querySelectorAll(".slide_container .slide");
    var tileContainer = document.createElement("div");
    tileContainer.setAttribute("class", "_tile_container");
    Array.prototype.forEach.call(slides, function(slide){
        var img = document.createElement("img");
        img.setAttribute("src", slide.querySelector("img").getAttribute("data-small"));
        img.setAttribute("data-index", slide.getAttribute("data-index"));
        tileContainer.appendChild(img);
    });
    tileContainer.addEventListener("click", function(event){
        if(event.target.tagName.toLowerCase() == "img"){
            toggleTileMode();
            location.href = "javascript:(" + function(index){
                player.play(index);
            } + ")(" + event.target.getAttribute("data-index") +")";
        }
    });
    player.appendChild(tileContainer);

    // Add styles
    var style = document.createElement("style");
    style.textContent =
            "._tile_container {display:none; overflow-y:scroll; position:absolute; top:0;}" +
            ".tile_mode ._tile_container {display:block;}" +
            "._tile_container img {float:left; width:205px !important; background:none; display:block; cursor:pointer;}" +
            "._tile_container img:hover {opacity: 0.8;}" +

            ".tile_mode .slide_container {display:none}" +
            ".tile_mode .pointly {pointer-events:none;}" +
            ".tile_mode .stage {overflow-y:scroll !important;}" +

            "._btnToggleTile {background:none !important; float:right !important; text-indent:0 !important; padding-top:3px !important;}" +
            "._btnToggleTile:after {color:black; content:'\\25A6'; font-size:21px;}" +
            ".tile_mode ._btnToggleTile:after {color:black; content:'\\25A3'; font-size:21px;}";
    document.head.appendChild(style);

    // Add a button
    var toggleButton = document.createElement("a");
    toggleButton.setAttribute("href", "#");
    toggleButton.setAttribute("class", "_btnToggleTile");
    toggleButton.addEventListener("click", toggleTileMode);
    var navActions = player.querySelector(".navActions");
    navActions.insertBefore(toggleButton, navActions.querySelector(".goToSlideLabel"));

    function toggleTileMode(){
        tileContainer.setAttribute("style", player.querySelector(".stage").getAttribute("style"));
        player.classList.toggle("tile_mode");
    }
})();