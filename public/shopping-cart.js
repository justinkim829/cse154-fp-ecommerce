"use strict";

(function () {

  window.addEventListener('load', init);
  const GET_WATCH_INFO_URL = "/REM/getwatchesinfo";


  /**
   * This function initializes all the functions and event listeners on page load.
   */
  async function init() {
    activateSideBarAndScroll();
    await getAllWatches();
    sendSidebarToWatch();

    checkoutStatusChecking();
    id("checkout").addEventListener("click", () => {
      window.location.href = "payment.html";
    });

    for (let remove of qsa(".remove p")) {
      remove.addEventListener("click", (event) => {
        removeItem(event);
      });
    }

    for (let selector of qsa(".selectorquantity")) {
      selector.addEventListener("change", (event) => {
        changeQuantity(event);
      });
    }

    await checkIsLogin();
    qs("#log").addEventListener("click", () => {
      logOut();
      window.location.reload();
    });
  }

  /**
   * This function activates the sidebar and handles scrolling behavior.
   */
  function activateSideBarAndScroll() {
    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function(evt) {
      openSidebar(evt);
    });

    id("close").addEventListener('click', function() {
      closeSidebar(id("sidebar"), SIDEBARS[0], SIDEBARS[1], SIDEBARS[2]);
    });

    for (let i = 0; i < SIDEBARS.length; i++) {
      let idText = "type" + String(i + 1);
      id(idText).addEventListener("click", function() {
        hideExistSidebars(SIDEBARS[(i + 1) % 3], SIDEBARS[(i + 2) % 3]);
        toggleSidebar(SIDEBARS[i]);
      });
    }

    window.onscroll = function() {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    };
  }

  /**
   * This function logs out the user by sending a request to the server.
   */
  async function logOut() {
    let response = await fetch("/REM/logout");
    await statusCheck(response);
    let result = await response.text();
    if (result === "Logout Successfully") {
      id("log").setAttribute('href', "login.html");
      qs("#log").textContent = "Login";
    }
  }

  /**
   * This function checks if there are items in the shopping cart and updates the checkout button status.
   */
  function checkoutStatusChecking() {
    if (id("left-side").children.length === 1) {
      qs("button").disabled = true;
    } else {
      qs("button").disabled = false;
    }
  }

  /**
   * This function checks if the user is logged in or not and updates the UI accordingly.
   */
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
   * This function changes the quantity of a watch in the shopping cart.
   * @param {Event} event - The event triggered by changing the quantity.
   */
  async function changeQuantity(event) {
    let card = event.target.closest(".product");
    let numberOfWatch = event.target.value;
    let formdata = new FormData();
    formdata.append("id", card.id);
    formdata.append("number", numberOfWatch);
    try {
      let response = await fetch("/REM/changequantity", {
        method: "POST",
        body: formdata
      });
      response = await statusCheck(response);
      response = await response.text();
      if (response === "change the quantity successfully") {
        id("left-side").innerHTML = "";
        let result = getCurrentWatches();
        changeSummary(result);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This function removes an item from the shopping cart.
   * @param {Event} event - The event triggered by removing an item.
   */
  async function removeItem(event) {
    let card = event.target.closest(".product");
    let formdata = new FormData();
    formdata.append("id", card.id);
    try {
      let response = await fetch("/REM/removeitem", {
        method: "POST",
        body: formdata
      });
      response = await statusCheck(response);
      response = await response.text();
      id("left-side").innerHTML = "";
      let result = await getCurrentWatches();
      changeSummary(result);
      checkoutStatusChecking();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This function changes the main page into each watch page.
   */
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

  /**
   * This function opens the sidebar.
   * @param {Event} evt - The event triggered by clicking the menu button.
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
   * This function toggles the visibility of the sidebar.
   * @param {HTMLElement} subSidebar - The sidebar element to be toggled.
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
   * This function hides all the visible sidebars.
   * @param {HTMLElement} subSidebar1 - The first sidebar to be hidden.
   * @param {HTMLElement} subSidebar2 - The second sidebar to be hidden.
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
   * Closes the sidebar when clicking outside of it.
   * @param {Event} event - The event triggered by clicking outside the sidebar.
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
   * This function hides all sidebars.
   * @param {HTMLElement} subSidebar1 - The first sidebar to be hidden.
   * @param {HTMLElement} subSidebar2 - The second sidebar to be hidden.
   * @param {HTMLElement} subSidebar3 - The third sidebar to be hidden.
   */
  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
  }

  /**
   * Fetches all watch information from the backend and updates the UI.
   */
  async function getAllWatches() {
    try {
      let response = await fetch(GET_WATCH_INFO_URL);
      response = await statusCheck(response);
      let result = await response.json();
      let head = gen("h2");
      head.textContent = "Your Selections (" + result.length + ")";
      id("left-side").appendChild(head);
      for (let product of result) {
        let eachProduct = updateWebView(product);
        id("left-side").appendChild(eachProduct);
      }
      changeSummary(result);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetches current watches in the shopping cart from the backend and updates the UI.
   * @return {Array} - The list of current watches.
   */
  async function getCurrentWatches() {
    try {
      let response = await fetch(GET_WATCH_INFO_URL);
      response = await statusCheck(response);
      let result = await response.json();
      let head = gen("h2");
      head.textContent = "Your Selections (" + result.length + ")";
      id("left-side").appendChild(head);
      for (let product of result) {
        let eachProduct = updateWebView(product);
        id("left-side").appendChild(eachProduct);
      }
      let removes = qsa(".remove p");
      for (let remove of removes) {
        remove.addEventListener("click", (event) => {
          removeItem(event);
        });
      }
      for (let selector of qsa(".selectorquantity")) {
        selector.addEventListener("change", (event) => {
          changeQuantity(event);
        });
      }
      changeSummary(result);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Updates the UI with the watch information.
   * @param {Object} product - The watch product information.
   * @return {HTMLElement} productContainer - The container element with the watch information.
   */
  function updateWebView(product) {
    let productContainer = gen('section');
    productContainer.classList.add('product-container');

    let productSection = addProductDescription(product, productContainer);
    addCostOptions(product, productSection);

    // Insert a divider
    let hr = gen('hr');
    productContainer.appendChild(hr);

    return productContainer;
  }

  /**
   * Adds product description to the product container.
   * @param {Object} product - The watch product information.
   * @param {HTMLElement} productContainer - The container element for the product.
   * @returns {HTMLElement} - The section element with the product description.
   */
  function addProductDescription(product, productContainer) {
    let productSection = gen('section');
    productSection.classList.add('product');
    productContainer.appendChild(productSection);
    let img = gen('img');
    img.src = product.Img1;
    productSection.appendChild(img);
    let descriptionSection = gen('section');
    descriptionSection.classList.add('description');
    productSection.appendChild(descriptionSection);
    let productName = gen('p');
    productName.classList.add('description-name');
    productName.textContent = product.Name;
    descriptionSection.appendChild(productName);
    let productId = gen('p');
    productId.classList.add('description-id');
    productId.textContent = 'ID: ' + product.Type;
    descriptionSection.appendChild(productId);
    let productStatus = gen('p');
    productStatus.classList.add('description-status');
    productStatus.textContent = "Available";
    descriptionSection.appendChild(productStatus);
    let productStatusMsg = gen('p');
    productStatusMsg.classList.add('description-status-msg');
    productStatusMsg.textContent = "Your selection is available to purchase online.";
    descriptionSection.appendChild(productStatusMsg);
    productSection.id = product.WatchID;
    return productSection;
  }

  /**
   * Adds cost options to the product section.
   * @param {Object} product - The watch product information.
   * @param {HTMLElement} productSection - The section element for the product.
   */
  function addCostOptions(product, productSection) {
    let costSection = gen('section');
    costSection.classList.add('cost');
    productSection.appendChild(costSection);
    let price = gen('p');
    price.textContent = '$' + product.Price;
    costSection.appendChild(price);
    let quantitySelector = gen('select');
    quantitySelector.classList.add("selectorquantity");
    for (let i = 1; i <= 3; i++) {
      let option = gen('option');
      option.value = i;
      option.textContent = 'QTY: ' + i;
      quantitySelector.appendChild(option);
      if (i === product.Quantity) option.selected = true;
    }
    costSection.appendChild(quantitySelector);
    let colorSelector = gen('select');
    for (let color of ['blue', 'white', 'black']) {
      let option = gen('option');
      option.value = color;
      option.textContent = 'COLOR: ' + color.toUpperCase();
      colorSelector.appendChild(option);
    }
    costSection.appendChild(colorSelector);
    let removeSection = gen('section');
    removeSection.classList.add('remove');
    let remove = gen('p');
    remove.textContent = 'Remove';
    removeSection.appendChild(remove);
    costSection.appendChild(removeSection);
  }

  /**
   * Updates the order summary with the current watch selections.
   * @param {Array} result - An array containing all the watch objects.
   */
  function changeSummary(result) {
    let subtotal = 0;
    let numberOfWatch = 0;
    for (let i = 0; i < result.length; i++) {
      numberOfWatch = numberOfWatch + result[i].Quantity;
      subtotal = subtotal + (result[i].Price) * (result[i].Quantity);
    }
    qs("#order-summary p").textContent = numberOfWatch + " item";
    let tax = subtotal * 0.1025;
    let total = subtotal + tax;

    qs("#subtotal p").textContent = "$ " + Math.floor(subtotal);
    qs("#tax p").textContent = "$ " + Math.floor(tax);
    qs("#total p").textContent = "$ " + Math.floor(total);
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
   * Helper function to check the response status and return the result if successful.
   * @param {Response} res - The response to check.
   * @return {Promise<Response>} - The valid response if successful.
   * @throws {Error} - If the response is not successful.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Helper function to get an element by its ID.
   * @param {string} id - The ID of the element.
   * @return {HTMLElement} - The element with the specified ID.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Helper function to get the first element that matches the selector.
   * @param {string} selector - The CSS selector.
   * @return {HTMLElement} - The first element that matches the selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
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