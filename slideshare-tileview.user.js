// ==UserScript==
// @name           slideshare tileview
// @description    Shows slides in tile
// @version        1.2
// @author         vzvu3k6k
// @match          http://www.slideshare.net/*
// @namespace      http://vzvu3k6k.tk/
// @license        Public Domain
// ==/UserScript==

(function(){
    var player = document.querySelector(".player");
    if(!player) return;

    // Make tiles
    var slides = player.querySelectorAll(".slide_container .slide");
    var tileContainer = document.createElement("div");
    tileContainer.setAttribute("class", "_tile_container");
    Array.prototype.forEach.call(slides, function(slide){
        var img = document.createElement("img");
        img.setAttribute("src", slide.querySelector("img").dataset.small);
        img.dataset.index = slide.dataset.index;
        tileContainer.appendChild(img);
    });
    tileContainer.addEventListener("click", function(event){
        if(event.target.tagName.toLowerCase() == "img"){
            toggleTileMode();
            showSlide(event.target.dataset.index);
        }
    });
    player.appendChild(tileContainer);

    function showSlide(index){
        /*
          In `http://www.slideshare.net/{username}/{slidename}`,
          we can show the slide by calling `player.play`

          In `http://www.slideshare.net/fullscreen/...` or
          `http://www.slideshare.net/slideshow/embed_code/...`,
          `player` is a DOM element and we have to call `jsplayer.play`.
        */
        location.href = "javascript:(" + function(index){
            (window.jsplayer || window.player).play(index);
        } + ")(" + index +")";
    }

    // Add styles
    var tileWidth = (function(){
        var baseTileWidth = 205;
        var stageWidth = player.querySelector(".stage").getBoundingClientRect().width;
        var tileNumInRow = Math.floor(stageWidth / baseTileWidth);
        return (stageWidth - getScrollbarWidth()) / Math.max(tileNumInRow, 2);
    })();
    var style = document.createElement("style");
    style.textContent =
            "._tile_container {display:none; overflow-y:scroll; position:absolute; top:0;}" +
            "._tile_mode ._tile_container {display:block;}" +
            "._tile_container img {float:left; width:" + tileWidth + "px !important; background:none; display:block; cursor:pointer;}" +
            "._tile_container img:hover {opacity: 0.8;}" +

            "._tile_mode .slide_container {display:none}" +
            "._tile_mode .pointly {pointer-events:none;}" +
            "._tile_mode .stage {overflow-y:scroll !important;}" +

            "._btnToggleTile {color:black; background:none !important; float:right !important; text-indent:0 !important; padding-top:3px !important; text-decoration:none;}" +
            "._btnToggleTile:hover {color:#333;}" +
            "._btnToggleTile:after {content:'\\25A6'; font-size:21px;}" +
            "._tile_mode ._btnToggleTile:after {content:'\\25A3';}";
    document.head.appendChild(style);

    // borrowed from
    //   Getting scroll bar width using JavaScript - Stack Overflow
    //   http://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
    // written by lostsource
    function getScrollbarWidth() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    // Add a button
    var toggleButton = document.createElement("a");
    toggleButton.setAttribute("href", "#");
    toggleButton.setAttribute("class", "_btnToggleTile");
    toggleButton.setAttribute("title", "Toggle Tile Mode");
    toggleButton.addEventListener("click", toggleTileMode);
    var navActions = player.querySelector(".navActions");
    navActions.insertBefore(toggleButton, navActions.querySelector(".goToSlideLabel"));

    function toggleTileMode(){
        tileContainer.setAttribute("style", player.querySelector(".stage").getAttribute("style"));
        player.classList.toggle("_tile_mode");
    }
})();
