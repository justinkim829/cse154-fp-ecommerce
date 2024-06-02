/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the display-all website, which is used to get all
 * the watches info from the database and display on the page
 */

"use strict";

(function () {

  window.addEventListener("load", init);

  /** This function is used to initialize all the functions */
  async function init() {
    sidebarStart();
    sendSidebarToWatch();
    sendRecommendationsToWatch();

    window.onscroll = function () {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    };
    await checkIsLogin();
    qs("#log").addEventListener("click", () => {
      logOut();
      window.location.reload();
    });
    id("layout").addEventListener("click", () => {
      toggleLayout();
    });
    await fetchWatches()
    for (let box of qsa(".box")) {
      box.addEventListener("click", (event) => {
        changeToWatchPage(event);
      });
    }
  }

  function toggleLayout() {
    let displayAll = id("displayall");
    let mechanical = id("mechanicalwatch");
    let digital = id("digitalwatch");
    let pocket = id("pocketwatch");
    mechanical.classList.toggle("changewatchlength");
    digital.classList.toggle("changewatchlength");
    pocket.classList.toggle("changewatchlength");
    for (let row of qsa(".watch-row")) {
      row.classList.toggle("changetorow");
    }
    for (let box of qsa(".box")) {
      box.classList.toggle("changebox");
    }
    displayAll.classList.toggle("grid-view");
    displayAll.classList.toggle("list-view");
  }

  function changeToWatchPage(event) {
    let box = event.currentTarget;
    sendToWatch(box.id);
  }

  async function fetchWatches() {
    try {
      let response = await fetch("/REM/getallwatches");
      await statusCheck(response);
      let result = await response.json();
      displayWatches(result);
    } catch (error) {
      console.error(error);
    }
  }

  function displayWatches(watches) {
    let mechanicalWatches = watches.filter(watch => watch.category === 'mechanical');
    let digitalWatches = watches.filter(watch => watch.category === 'digital');
    let pocketWatches = watches.filter(watch => watch.category === 'pocket');

    addWatchSection('mechanical', 'MECHANICAL WATCH', 'mechanical-watch-row');
    addWatchSection('digital', 'DIGITAL WATCH', 'digital-watch-row');
    addWatchSection('pocket', 'POCKET WATCH', 'pocket-watch-row');

    addWatchesToRow(mechanicalWatches, 'mechanical-watch-row');
    addWatchesToRow(digitalWatches, 'digital-watch-row');
    addWatchesToRow(pocketWatches, 'pocket-watch-row');
  }


  function addWatchSection(id, title, rowId) {
    let section = document.createElement('section');
    section.id = `${id}watch`;

    let h3 = document.createElement('h3');
    h3.textContent = title;
    section.appendChild(h3);

    let row = document.createElement('div');
    row.className = 'watch-row';
    row.id = rowId;
    section.appendChild(row);

    document.getElementById('displayall').appendChild(section);
  }

  function addWatchesToRow(watches, rowId) {
    let row = document.getElementById(rowId);
    watches.forEach(watch => {
      let box = gen('section');
      box.className = 'box';
      box.id = watch.Type;
      let img = gen('img');
      img.src = watch.Img1;
      img.alt = watch.Name;
      let h3 = gen('h3');
      h3.textContent = watch.Name;
      let details = gen('div');
      details.className = 'details';
      let price = gen('p');
      price.textContent = `Price: $ ${watch.Price}`;
      let category = gen('p');
      category.textContent = `Storage: ${watch.Storage}`;
      details.appendChild(price);
      details.appendChild(category);
      details.classList.toggle("hidden");

      box.appendChild(img);
      box.appendChild(h3);
      row.appendChild(box);
      box.appendChild(details);
    });
  }

  /** This function is used to change the mainpage into each watch page */
  function sendToWatch(productID) {
    sessionStorage.setItem('productID', productID);
    window.location.href = "watch.html";
  }


  /** This function is used to log out form the account */
  async function logOut() {
    let response = await fetch("/REM/logout");
    await statusCheck(response);
    let result = await response.text();
    if (result === "Logout Successfully") {
      id("log").setAttribute('href', "login.html");
      qs("#log").textContent = "Login";
    }
  }

  /** This function is used to change the mainpage into each watch page */
  function sendSidebarToWatch() {
    let options = qsa(".double-sidebar ul li");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', () => {
        let productID = options[i].querySelector("p").textContent;
        sessionStorage.setItem('productID', productID);
        window.location.href = "watch.html";
      });
    }
  }

  /** This function is used to check if the account is log in */
  async function checkIsLogin() {
    let response = await fetch("/REM/checkiflogin");
    await statusCheck(response);
    let result = await response.text();
    if (result === "havn't Login") {
      id("trans").removeAttribute('href');
    } else {
      id("trans").setAttribute('href', "transaction.html");
      id("trans").classList.remove("hidden");
      qs("#log").textContent = "LogOut";
      id("log").removeAttribute('href');
    }
  }

  /**
   * This function is used to change the images and contents of the page
   * to match the clicked recommendation (watch).
   */
  function sendRecommendationsToWatch() {
    let recommended = qsa(".box");
    let productIDs = ["M1", "D2", "P3"];
    for (let i = 0; i < recommended.length; i++) {
      recommended[i].addEventListener('click', () => {
        let productID = productIDs[i];
        sessionStorage.setItem('productID', productID);
        window.location.href = "watch.html";
      });
    }
  }

  /**
   * This function is used to open the sidebar
   * @param {object} evt - refers to which specific sidebar is being clicked
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


  /** This function is used to control all the small sidebars and open it when clicked */
  function sidebarStart() {
    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function (evt) {
      openSidebar(evt);
    });

    qs(".close").addEventListener('click', function () {
      closeSidebar(id("sidebar"), SIDEBARS[0], SIDEBARS[1], SIDEBARS[2]);
    });

    for (let i = 0; i < SIDEBARS.length; i++) {
      let idText = "type" + String(i + 1);
      id(idText).addEventListener("click", function () {
        hideExistSidebars(SIDEBARS[(i + 1) % 3], SIDEBARS[(i + 2) % 3]);
        toggleSidebar(SIDEBARS[i]);
      });
    }
  }

  /**
   * This function is used to open and close the sidebar
   * @param {object} subSidebar - the sidebar that pull out
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
   * This function is used to hide all the appeared sidebars
   * @param {object} subSidebar1 the subsidebar that already poll out
   * @param {object} subSidebar2 the subsidebar that already poll out
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
   * @param {object} event - the action of click the page
   */
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');
    let overlay = id("overlay");

    if (!sidebar.contains(event.target) && !type1Sidebar.contains(event.target) &&
      !type2Sidebar.contains(event.target) && !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar, type2Sidebar, type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';

      document.removeEventListener('click', closeSidebar);
    }
  }

  /**
   * Checks the status of the response.
   * @param {Response} res - The response object.
   * @throws an error if the response is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
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
      sidebar.style.display = "none";
    });
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