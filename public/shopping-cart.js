"use strict";

(function () {

  window.addEventListener('load', init);
  const GET_WATCH_INFO_URL = "/REM/getwatchesinfo";
  const COLOR = ["blue", "white", "black"];

  /** This function is used to initiallize all the functions */
  async function init() {
    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function (evt) {
      openSidebar(evt);
    });

    id("close").addEventListener('click', function () {
      closeSidebar(id("sidebar"), SIDEBARS[0], SIDEBARS[1], SIDEBARS[2]);
    });

    for (let i = 0; i < SIDEBARS.length; i++) {
      let idText = "type" + String(i + 1);
      id(idText).addEventListener("click", function () {
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

  /** This function is used to log out */
  async function logOut() {
    let response = await fetch("/REM/logout");
    await statusCheck(response);
    let result = await response.text();
    if (result === "Logout Successfully") {
      id("log").setAttribute('href', "login.html");
      qs("#log").textContent = "Login";
    }
  }

  /** This function is used to check if there are items in the shoppingcart */
  function checkoutStatusChecking() {
    if (id("left-side").children.length === 1) {
      qs("button").disabled = true;
    } else {
      qs("button").disabled = false;
    }
  }

  /** This function is used to check if the account is log in or not */
  async function checkIsLogin() {
    let response = await fetch("/REM/checkiflogin");
    await statusCheck(response);
    let result = await response.text();
    if (result === "havn't Login") {
      id("trans").removeAttribute('href');
    } else {
      id("trans").setAttribute('href', "transaction.html");
      id("trans").classList.remove("hidden");
      qs("#log").textContent="LogOut";
      id("log").removeAttribute('href');
    }
  }

  /** This function is used to change the quantity of the watch */
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

  /** this function is used to remove the item from the shoppingcart */
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

  /**
   * This function is used to open the sidebar
   * @param {event} evt refers to which specific sidebar is being clicked
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
   * @param {object} subSidebar the sidebar that poll out
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
   * @param {event} event - the action of click the page
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

  /** This function is used get all the watches info form the backend */
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

  /** This function is used to get all the watches in the shoppingcart */
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
   * This function is used to put each watch info into the display board
   * @param {object} product - the object of each watch
   * @return {object} productContainer -the creted block consisit of all the nodes
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
   * this function is used to add the product description in the card
   * @param {object} product all the info the products
   * @param {object} productContainer the container that contain all the watch info
   * @returns created card of the watch info
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
   * This function is used to update the total price every time user change the idea
   * @param {object} product all the info the products
   * @param {object} productSection the created card
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
   * This function is used to change all the summury info
   * @param {object} result - an Array that contain all the watches object
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
   * Helper function user to generate certain node
   * @param {object} selector - the node user wants to create
   * @return {object} return the created node
   */
  function gen(selector) {
    return document.createElement(selector);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
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