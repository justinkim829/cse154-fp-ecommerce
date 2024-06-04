/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the display-all website, which is used to get all
 * the watches info from the database and display on the page
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /** This function is used to initialize all the functions */
  async function init() {
    changeHeaderWhenScrolled();
    selectCategoryWhenChanged();
    id("layout").addEventListener("click", () => {
      toggleLayout();
    });
    await fetchWatches();
    for (let box of qsa(".box")) {
      box.addEventListener("click", (event) => {
        changeToWatchPage(event);
      });
    }
    filterSearchBar();
    clearSearch();
  }

  /** Check and show watches that match categories when changed */
  function selectCategoryWhenChanged() {
    id("category").addEventListener("change", (evt) => {
      selectCategory(evt);
    });
  }

  /**
   * Show the items of the selected category when the category is choosed
   * Remove background of all boxes
   * Then show the boxes that match through an animation.
   * @param {event} evt -  evt that occurred
   */
  function selectCategory(evt) {
    removeSelectedBoxes();
    let category = evt.currentTarget.value;
    let containers = qsa("#displayall > section");
    containers.forEach(container => {
      if (container.id.includes(category)) {
        scrollToRecommendation(category);
        let matchedBoxes = container.querySelectorAll(".box");
        matchedBoxes.forEach(box => {
          animateBackground(box, 600);
        });
      }
    });
  }

  /**
   * Change viewpoint to where the category of the recommended watch
   * is located
   * @param {String} category - category for the watch
   */
  function scrollToRecommendation(category) {
    if (category === "mechanical") {
      window.scrollTo({
        top: 1,
        behavior: "smooth"
      });
    } else if (category === "digital") {
      window.scrollTo({
        top: 680,
        behavior: "smooth"
      });
    } else if (category === "pocket") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }
  }

  /** Clear all selected watches when clear button clicked. */
  function clearSearch() {
    id("clear-search").addEventListener("click", () => {
      removeSelectedBoxes();
      id("filter-items").value = "";
      id("category").selectedIndex = 0;
    });
  }

  /**
   * Set background color of all boxes to black (default).
   * Directly changed the style instead of adding classlists because
   * in the animatation function, the style takes in a parameter that changes over time.
   * This value cannot be added to css because it is not a constant.
   */
  function removeSelectedBoxes() {
    let allBoxes = qsa("#displayall > section .box");
    allBoxes.forEach(box => {
      box.style.background = "black";
    });
  }

  /**
   * This function is used to highlight the background of the recommended watch
   * giving it an animation effect
   * @param {Element} element - container to apply background transition
   * @param {Integer} duration - duration of the animation
   */
  function animateBackground(element, duration) {
    let startTime = null;

    /**
     * Calculate change for each step and apply animation
     * @param {object} timestamp - current time
     */
    function animationStep(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      let progress = (timestamp - startTime) / duration;
      if (progress > 1) {
        progress = 1;
      }
      let colorStop = progress * 100;
      element.style.background = `linear-gradient` +
                                 `(to top left, black 0%, rgb(0, 0, 72) ${colorStop}%)`;
      if (progress < 1) {
        requestAnimationFrame(animationStep);
      } else {
        element.style.background = 'rgb(0, 0, 72)';
      }
}
    requestAnimationFrame(animationStep);
  }

  /**
   * This function is used to filter through the watches
   * and show the watch that fits the user input.
   */
  function filterSearchBar() {
    let input = id("filter-items")
    input.addEventListener('keypress', async (evt) => {
      if (evt.key === "Enter") {
        removeSelectedBoxes()
        let inputValue = input.value.trim().toLowerCase();
        console.log(inputValue);
        let params = new FormData();
        params.append("input", inputValue);
        try {
          let recommendedID = await postData('/REM/recommendation', params, true);
          console.log(2)
          let watchBox = id(recommendedID);
          let parentID = watchBox.parentElement.id;
          console.log(parentID.slice(0, parentID.indexOf("-")));
          scrollToRecommendation(parentID.slice(0, parentID.indexOf("-")));
          animateBackground(watchBox, 600);
        } catch (err) {
          id("filter-items").value = "";
          id("filter-items").placeholder = "No Matches Found. Try Again.";
        }
      }
    });
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
      id("errdisplay").classList.add("hidden");
      setTimeout(() => {
        id("errdisplay").classList.remove("hidden");
      }, 2000);
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
   * This function is used to jump into the certain watch page
   * @param {event} event the event of clicking certain watch
   */
  function changeToWatchPage(event) {
    let box = event.currentTarget;
    sendToWatch(box.id);
  }

  /**
   * This function is used to change the mainpage into each watch page
   * @param {String} productID - the id of this certain product
   */
  function sendToWatch(productID) {
    const bc = new BroadcastChannel('bc');
    localStorage.setItem('productID', productID);
    bc.postMessage(productID);
    window.location.href = "watch.html";
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
   * Fetches data from post endpoints.
   * @param {String} endPoint - the endpoint of the post
   * @param {FormData} params - the body of the post request
   * @param {String} isReturnText - the return text
   * @returns {String|JSON} data - the processed data
   */
  async function postData(endPoint, params, isReturnText) {
    let data;
    try {
      data = await fetch(endPoint, {
        method: 'POST',
        body: params
      });
      await statusCheck(data);
      if (isReturnText) {
        data = await data.text();
      } else {
        data = await data.json();
      }
      return data;
    } catch (err) {
      throw new Error(await data.text());
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