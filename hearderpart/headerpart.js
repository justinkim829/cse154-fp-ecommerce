"use strict";

(function () {

  window.addEventListener('load', init);


  /** initilize all the buttons in the menu */
  function init() {

    window.onscroll = function () {
      harderFix();
    }
    let menu = id('menu');
    let sidebar = id('sidebar');
    let close = id("close");
    let overlay = id("overlay");
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');
    let type1 = id("type1");
    let type2 = id("type2");
    let type3 = id("type3");

    menu.classList.add(".change");
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
      closeSidebar(sidebar,type1Sidebar,type2Sidebar,type3Sidebar);
    });

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

  function harderFix(){
    let header = qs("header");
      console.log(header);
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
  }

  function closeSidebar(sidebar,type1Sidebar,type2Sidebar,type3Sidebar){
    sidebar.style.left = '-300px';
      type1Sidebar.style.left = '-300px';
      type2Sidebar.style.left = '-300px';
      type3Sidebar.style.left = '-300px';
      overlay.style.display = "none";
  }


  /**
   * make the sidebar appear and disappear
   * @param {object} subSidebar - the sidebar of the menu
   */
  function toggleSidebar(subSidebar) {
    if (subSidebar.style.left === "0px") {
      subSidebar.style.left = "300px";
      subSidebar.style.display = "block";
    } else {
      subSidebar.style.left = "0px";
      subSidebar.style.display = "none";
    }
  }

  /**
   * make all the subsidebars disappear except the one I speciaficly clicked
   * @param {object} subSidebar1 - the one that I do not click
   * @param {object} subSidebar2 - the one that I do not click
   */
  function hideExistSidebars(subSidebar1, subSidebar2) {
    [subSidebar1, subSidebar2].forEach(sidebar => {
      if (sidebar.style.left === "300px") {
        sidebar.style.left = "0px";
        sidebar.style.display = "none";
      }
    });
  }



  /**
   * when click the place other than sidebar, the sidebar would be closed
   * @param {object} event - the event that I just done.
   */
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');

    if (!sidebar.contains(event.target) && event.target !== menu
      && !type1Sidebar.contains(event.target) && !type2Sidebar.contains(event.target)
      && !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar, type2Sidebar, type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';

      document.removeEventListener('click', closeSidebar);
    }
  }

  /**
   * make all the subsidebars disappear except the one I speciaficly clicked
   * @param {object} subSidebar1 - the subsideabr for first type of watch
   * @param {object} subSidebar2 - the subsideabr for second type of watch
   * @param {object} subSidebar3 - the subsideabr for third type of watch
   */

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