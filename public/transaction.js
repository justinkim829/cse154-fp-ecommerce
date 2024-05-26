"use strict";

(function () {

  window.addEventListener("load", init);

  /** This function is used to initialize all the functions */
  async function init() {
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
    await getShoppingHistory();
    sendSidebarToWatch();

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
   * @param {object} subSidebar - all the sidebars when menu is clicked
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
   * @param {object} subSidebar1 - First other sidebar that should be hidden
   * @param {object} subSidebar2 - Second other sidebar that should be hidden
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
   * When click the place other than sidebar, the sidebar would be closed
   * @param {object} event - event that triggered
   */
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let overlay = id("overlay");
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');
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
   * @param {object} subSidebar1 - First sidebar that should be hidden
   * @param {object} subSidebar2 - Second sidebar that should be hidden
   * @param {object} subSidebar3 - Third sidebar that should be hidden
   */
  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
  }

  async function getShoppingHistory() {
    try {
      let response = await fetch("/REM/gettransaction");
      response = await statusCheck(response);
      let result = await response.json();
      for (let i = 0; i < result.length; i++) {
        createCard(result[i]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function createCard(transaction) {
    let transactionList = id('watch-list');

    let transactionRecord = gen('div');
    transactionRecord.classList.add('transaction-record');

    let img = gen('img');
    img.src = transaction.Img1;
    img.alt = transaction.Name;
    transactionRecord.appendChild(img);

    let transactionDetails = gen('div');
    transactionDetails.classList.add('transaction-details');

    let status = gen('p');
    status.classList.add('transaction-status');
    status.textContent = 'COMPLETED';
    transactionDetails.appendChild(status);

    let orderId = gen('p');
    orderId.textContent = 'Order ID: ';
    let orderIdSpan = gen('span');
    orderIdSpan.textContent = transaction.confirmationNumber;
    orderId.appendChild(orderIdSpan);
    transactionDetails.appendChild(orderId);

    let name = gen('p');
    name.textContent = 'Name: ';
    let nameSpan = gen('span');
    nameSpan.textContent = transaction.Name;
    name.appendChild(nameSpan);
    transactionDetails.appendChild(name);

    let type = gen('p');
    type.textContent = 'Quantity: ';
    let typeSpan = gen('span');
    typeSpan.textContent = transaction.Quantity;
    type.appendChild(typeSpan);
    transactionDetails.appendChild(type);

    let total = gen('p');
    total.classList.add('transaction-total');
    total.textContent = 'Total: ';
    let totalSpan = gen('span');
    totalSpan.textContent = `$${transaction.Price}`;
    total.appendChild(totalSpan);
    transactionDetails.appendChild(total);

    transactionRecord.appendChild(transactionDetails);
    transactionList.appendChild(transactionRecord);
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