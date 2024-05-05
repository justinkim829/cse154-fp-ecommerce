

"use strict";

(function () {

  window.addEventListener("load", init);

  /** this function is used to initilizale the button with its functions. */
  function init() {
    let menu = id('menu');
    let sidebar = id('sidebar');
    let close = id("close");
    let overlay = id("overlay");
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');

    menu.classList.add(".change");
    // change the style when putting the cursor on the menu

    //click menu and open the side bar
    menu.addEventListener('click', function (event) {
      sidebar.style.left = '0px';
      overlay.style.display = "block";
      overlay.style.pointerEvents = 'auto';
      [type1Sidebar, type2Sidebar, type3Sidebar].forEach(sidebar => {
        sidebar.style.left = '0px';
      });
      event.stopPropagation();
      document.addEventListener('click', closeSidebar);
    });

    //click and close the side bar
    close.addEventListener('click', function () {
      sidebar.style.left = '-300px';
      type1Sidebar.style.left = '-300px';
      type2Sidebar.style.left = '-300px';
      type3Sidebar.style.left = '-300px';
      overlay.style.display = "none";

    });

    let type1 = id("type1");
    let type2 = id("type2");
    let type3 = id("type3");



    type1.addEventListener("click", function () {

      hideExistSidebars(type2Sidebar, type3Sidebar);
      toggleSidebar(type1Sidebar);
    })

    type2.addEventListener("click", function () {
      hideExistSidebars(type1Sidebar, type3Sidebar);
      toggleSidebar(type2Sidebar);
    })

    type3.addEventListener("click", function () {
      hideExistSidebars(type1Sidebar, type2Sidebar);
      toggleSidebar(type3Sidebar);
    })

  }


  function toggleSidebar(subSidebar) {
    if (subSidebar.style.left === "0px") {
      subSidebar.style.left = "300px";
      subSidebar.style.display = "block";
    } else {
      subSidebar.style.left = "0px";
      subSidebar.style.display = "none";
    }
  }

  function hideExistSidebars(subSidebar1, subSidebar2) {
    [subSidebar1, subSidebar2].forEach(sidebar => {
      if (sidebar.style.left === "300px") {
        sidebar.style.left = "0px";
        sidebar.style.display = "none";
      }
    });
  }


  //when click the place other than sidebar, the sidebar would be closed
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');

    if (!sidebar.contains(event.target) && event.target !== menu
      && !type1Sidebar.contains(event.target) && !type2Sidebar.contains(event.target)
      && !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar,type2Sidebar,type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';

      document.removeEventListener('click', closeSidebar);
    }

  }

  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
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