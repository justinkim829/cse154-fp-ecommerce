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
    changeHeaderWhenScrolled()
    id("layout").addEventListener("click", () => {
      toggleLayout();
    });
    await fetchWatches()
  }

  /**
   * change the header background and text color when scrolled down.
   */
  function changeHeaderWhenScrolled() {
    window.onscroll = function() {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    };
  }

  /** This function is used to toggle between two differenr layouts */
  function toggleLayout() {
    id("mechanicalwatch").classList.toggle("changewatchlength");
    id("digitalwatch").classList.toggle("changewatchlength");
    id("pocketwatch").classList.toggle("changewatchlength");
    for (let row of qsa(".watch-row")) {
      row.classList.toggle("changetorow");
    }
    for (let box of qsa(".box")) {
      box.classList.toggle("changebox");
    }
    id("displayall").classList.toggle("grid-view");
    id("displayall").classList.toggle("list-view");
  }

  /** This function is used to get all the watches info */
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

  /**
   * This function is used to display all the watches info into the board
   * @param {object} watches an array that contain all the watches
   */
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

  /**
   * This function is used to create different cards for the kind of watches
   * @param {number} id the id of the watch
   * @param {String} title the title of the watch
   * @param {number} rowId the id of that certain row
   */
  function addWatchSection(id, title, rowId) {
    let certainWatch = gen('section');
    certainWatch.id = `${id}watch`;
    let h3 = gen('h3');
    h3.textContent = title;
    certainWatch.appendChild(h3);
    let row = gen('div');
    row.className = 'watch-row';
    row.id = rowId;
    certainWatch.appendChild(row);
    document.getElementById('displayall').appendChild(certainWatch);
  }

  /**
   * This function is used to add the same kind of watches into the same row
   * @param {object} watches an array of watches that contain all the info
   * @param {number} rowId the id of that certain row
   */
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