/*
 * Name: Jinseok Kim, Jincheng Wang
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement the sidebar functionality.
 * This includes switching to the watch page that matches
 * the watch ID that was clicked from the sidebar.
 * It is a js file for all pages.
 */

"use strict";

(function() {
  window.addEventListener('load', init);

  /** this function is used to initilizale the sidebar and store the clicked watch ID */
  function init() {
    sidebarStart();
    sendSidebarToWatch();
    errMessageDisplay();
  }

  /** This function is used to handle the situation when server is crashed */
  function errMessageDisplay() {
    let container = gen("section");
    container.id = "errdisplay";
    let errMessage = gen("p");
    errMessage.textContent = "MEOW";
    container.appendChild(errMessage);
    container.classList.add("hidden");
    container.classList.add("location");
    document.body.appendChild(container);
  }

  /** This function is to initialize all the functionalities of the sidebar */
  function sidebarStart() {
    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function(evt) {
      openSidebar(evt);
    });

    qs(".close").addEventListener('click', function() {
      closeSidebar(id("sidebar"), SIDEBARS[0], SIDEBARS[1], SIDEBARS[2]);
    });

    for (let i = 0; i < SIDEBARS.length; i++) {
      let idText = "type" + String(i + 1);
      id(idText).addEventListener("click", function() {
        toggleSidebar(SIDEBARS[i]);
        hideExistSidebars(SIDEBARS[(i + 1) % 3], SIDEBARS[(i + 2) % 3]);
      });
    }
  }

  /**
   * open the sidebar
   * @param {event} evt event that triggered
   */
  function openSidebar(evt) {
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');

    id("sidebar").style.left = '0px';
    id("overlay").style.display = "block";
    id("overlay").style.pointerEvents = 'auto';
    [type1Sidebar, type2Sidebar, type3Sidebar].forEach(sidebar => {
      sidebar.style.left = '0px';
    });
    evt.stopPropagation();
    document.addEventListener('click', closeSidebar);
  }

  /**
   * This function is used to open and close the sidebar
   * @param {object} subSidebar - the sidebar to open/close
   */
  function toggleSidebar(subSidebar) {
    if (subSidebar.style.left === "0px") {
      subSidebar.style.left = "300px";
    } else {
      subSidebar.style.left = "0px";
    }
  }

  /**
   * This function is used to close all the sidebars
   * @param {object} subSidebar1 - First sidebar that should be hidden
   * @param {object} subSidebar2 - Second sidebar that should be hidden
   * @param {object} subSidebar3 - Third sidebar that should be hidden
   */
  function hideExistSidebars(subSidebar1, subSidebar2) {
    [subSidebar1, subSidebar2].forEach(sidebar => {
      if (sidebar.style.left === "300px") {
        sidebar.style.left = "0px";
      }
    });
  }

  /**
   * when click the place other than sidebar, the sidebar would be closed
   * @param {event} event - the action of click the page
   */
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');
    let overlay = id("overlay");
    let menu = id("menu");

    if (!sidebar.contains(event.target) && event.target !== menu &&
      !type1Sidebar.contains(event.target) && !type2Sidebar.contains(event.target) &&
      !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar, type2Sidebar, type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';
      document.removeEventListener('click', closeSidebar);
    }
  }

  /**
   * This function is used to close all the sidebars
   * @param {object} subSidebar1 the sidebar that pull out
   * @param {object} subSidebar2 the sidebar that pull out
   * @param {object} subSidebar3 the sidebar that pull out
   */
  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
    });
  }

  /**
   * Store the watch ID that was clicked in the sidebar.
   * Move to the watch page.
   */
  function sendSidebarToWatch() {
    const bc = new BroadcastChannel('bc');
    let options = qsa(".double-sidebar ul li");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', () => {
        let productID = options[i].querySelector("p").textContent;
        localStorage.setItem('productID', productID);
        bc.postMessage(productID);
        if (!window.location.href.includes("watch.html")) {
          window.location.href = "watch.html";
        }
      });
    }
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
   * Helper function to create a new HTML element.
   * @param {string} selector - The type of element to create.
   * @return {HTMLElement} - The created element.
   */
  function gen(selector) {
    return document.createElement(selector);
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
   * Helper function to get all elements that match the selector.
   * @param {string} selector - The CSS selector.
   * @return {NodeList} - A NodeList of elements that match the selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();