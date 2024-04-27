

"use strict";

(function () {

  window.addEventListener("load", init);

  /** this function is used to initilizale the button with its functions. */
  function init() {
    let menu = id('menu');
    let sidebar = id('sidebar');
    let close=id("close");
    let overlay=id("overlay");

    menu.classList.add(".change");
    // change the style when putting the cursor on the menu

    //click menu and open the side bar
    menu.addEventListener('click', function (event) {
      sidebar.style.left = '0px';
      overlay.style.display="block";
      overlay.style.pointerEvents = 'auto';
      event.stopPropagation();
      document.addEventListener('click', closeSidebar);

    });

    //click and close the side bar
    close.addEventListener('click', function () {
      sidebar.style.left = '-300px';
      overlay.style.display="none";

    });

  }

  //when click the place other than sidebar, the sidebar would be closed
  function closeSidebar(event){
    if (!sidebar.contains(event.target) && event.target !== menu) {
      sidebar.style.left = "-300px";
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';
      document.removeEventListener('click', closeSidebar);
    }

  }



  /**
   * This function is used to generate a new Node
   * @param {string} tagName - the Node wants to be created
   * @return {Node} The node that created .
   */
  function gen(tagName) {
    return document.createElement(tagName);
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

})();