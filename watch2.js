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

    //change wishlisticon when wishlist icon("♡") clicked
    let wishlistIcon = qs("#add-to-wishlist p");
    wishlistIcon.addEventListener('click', addToWishlist);
  }

  function addToWishlist() {
    let wishlistIcon = qs("#add-to-wishlist p");
    let message = gen("p");
    if (id("add-message").children.length === 0) {
      if (wishlistIcon.textContent === "♡") {
        wishlistIcon.textContent = "♥︎"
        message.textContent = "Added to wishlist";
      } else {
        wishlistIcon.textContent = "♡";
        message.textContent = "Removed from Wishlist";
      }
      setTimeout(() => {
        id("add-message").removeChild(message);
      }, 1500);
      id("add-message").appendChild(message);
      }
    }

  function gen(element) {
    return document.createElement(element);
  }

  /**
   * This function is used to get that element by its ID
   * @param {string} id - the ID that wants to get
   * @return {Node} return the node that ID corespond to .
   */
    function id(id) {
      return document.getElementById(id);
    }

    /**
     * This function is used to get that element by its name
     * @param {string} selector - the element wants to be find in the HTML page
     * @return {Node} return the node that selector corespond to .
     */
    function qs(selector) {
      return document.querySelector(selector);
    }

    /**
     * This function is used to get all the elements by its name
     * @param {string} selector - the elements wants to be find in the HTML page
     * @return {Node} return the all the node that selector corespond to .
     */
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }
    // _______________________ header start
    function closeSidebar(event){
      if (!sidebar.contains(event.target) && event.target !== menu) {
        sidebar.style.left = "-300px";
        overlay.style.display = "none";
        overlay.style.pointerEvents = 'none';
        document.removeEventListener('click', closeSidebar);
      }

    }
    // _______________________ header end
})();