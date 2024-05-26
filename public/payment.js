
"use strict";

(function () {

  window.addEventListener("load", init);
  const GET_WATCH_INFO_URL = "/REM/getwatchesinfo";
  let timeoutId = 0;

  /** this function is used to initilizale the button with its functions. */
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
    sendSidebarToWatch();
    await getAllWatches();
    id("form1").addEventListener("submit", (event) => {
      buyProduct(event);
    });
  }


  async function buyProduct(event) {
    event.preventDefault();
    let cardHolderName = id('card-holder-name').value;
    let cardNumber = id('card-number').value;
    let formdata = new FormData();
    formdata.append("cardHolderName", cardHolderName);
    formdata.append("cardNumber", cardNumber);
    try {
      let response = await fetch("/REM/buyproduct", {
        method: "POST",
        body: formdata
      });
      response = await statusCheck(response);
      let result = await response.text();
      if (result === "Proceed Successfully") {
        let displayMessage = gen("p");
        displayMessage.textContent = "Proceed Successfully";
        id("displaymessage").appendChild(displayMessage);

        timeoutId = setInterval(() => {
          window.location.href = "transaction.html";
        }, 2000);

      } else {
        HandleFailSituation(result);
      }
    } catch (err) {
      console.error(err);
    }
  }


  function HandleFailSituation(result) {
    let displayMessage = gen("p");
    displayMessage.textContent = result;
    id("displaymessage").appendChild(displayMessage);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setInterval(() => {
      if (id("displaymessage").lastChild) {
        id("displaymessage").removeChild(id("displaymessage").lastChild);
      }
    }, 2000);
    id("name").value = "";
    id("email").value = "";
    id("phone-number").value = "";
    id("city").value = "";
    id("country").value = "";
    id("street-address").value = "";
    id("zip-code").value = "";
    id("card-holder-name").value = "";
    id("card-number").value = "";
    id("expiry-date").value = "";
    id("cvv").value = "";
    id("billing-address").value = "";
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

  /**
   * This function is used to open and close the sidebar
   * @param {object} subSidebar - the sidebar that poll out
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
   * @param {object} subSidebar1 the sidebar that poll out
   * @param {object} subSidebar2 the sidebar that poll out
   * @param {object} subSidebar3 the sidebar that poll out
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
      for (let product of result) {
        let item = updatedisplayboard(product);
        id("itemsdisplayboard").appendChild(item);
        let hr = gen('hr');
        id("itemsdisplayboard").appendChild(hr);
      }
      changeSummary(result);

    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This function is used to diaplay all the watch info into the board
   * @param {object} product each watch get from the database
   * @return {object} itemSection - the creted block consisit of all the nodes
   */
  function updatedisplayboard(product) {
    let itemSection = gen('section');
    itemSection.classList.add('item');
    let img = gen('img');
    img.src = product.Img1;
    img.alt = 'pictureOfWatch';
    itemSection.appendChild(img);
    let innerSection = gen('section');
    let nameP = gen('p');
    nameP.textContent = product.Name;
    innerSection.appendChild(nameP);
    let priceP = gen('p');
    priceP.textContent = product.Price;
    innerSection.appendChild(priceP);
    itemSection.appendChild(innerSection);
    document.body.appendChild(itemSection);
    return itemSection;
  }

  /**
   * This function is used to change all the summury info
   * @param {object} result - an Array that contain all the watches object
   */
  function changeSummary(result) {
    let subtotal = 0;
    for (let product of result) {
      subtotal = subtotal + (product.Price) * (product.Quantity);
    }
    let tax = subtotal * 0.1025;
    let total = subtotal + tax;

    qs("#subtotal p").textContent = "$ " + Math.floor(subtotal);
    qs("#tax p").textContent = "$ " + Math.floor(tax);
    qs("#total p").textContent = "$ " + Math.floor(total);
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
   * Helper function user to generate certain node
   * @param {object} selector - the node user wants to create
   * @return {Node} the node that was created.
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