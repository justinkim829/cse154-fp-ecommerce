"use strict";

(function () {

  window.addEventListener('load', init);

  function init() {

    //lock header when window is scrolled down
    window.onscroll = function() {
      let header = qs("header");
      console.log(header);
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    }
  }

  function gen(element) {
    return document.createElement(element);
  }

  function id(id) {
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();