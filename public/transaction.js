/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the transaction website,which is used to fullfill to
 * make user check their transaction history after they already login.
 */

"use strict";

(function() {

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
    await checkIsLogin();
    qs("#log").addEventListener("click", () => {
      logOut();
      window.location.reload();
    });

  }

  /** This function is used to log out from the user account */
  async function logOut() {
    let response = await fetch("/REM/logout");
    response = await statusCheck(response);
    let result = await response.text();
    if (result === "Logout Successfully") {
      id("log").setAttribute('href', "login.html");
      qs("#log").textContent = "Login";
    }
    window.location.href = "mainpage.html";
  }

  /** This function is used to check if the user is login or not */
  async function checkIsLogin() {
    let response = await fetch("/REM/checkiflogin");
    await statusCheck(response);
    let result = await response.text();
    if (result !== "havn't Login") {
      qs("#log").textContent = "LogOut";
      id("log").removeAttribute('href');
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

  /** This function is used to get all the shopping history */
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

  /**
   * This function is used to create the imge element
   * @param {object} transaction - the transaction info
   * @returns {Image} the img element
   */
  function createImageElement(transaction) {
    let img = document.createElement('img');
    img.src = transaction.Img1;
    img.alt = transaction.Name;
    return img;
  }

  /**
   * This function is used to create the status element
   * @returns {element} created status element
   */
  function createStatusElement() {
    let status = document.createElement('p');
    status.classList.add('transaction-status');
    status.textContent = 'COMPLETED';
    return status;
  }

  /**
   * This function is used to create the detail element
   * @param {object} label the lable element
   * @param {object} value the value of the label
   * @returns {Element} the detail element
   */
  function createDetailElement(label, value) {
    let detail = document.createElement('p');
    detail.textContent = `${label}: `;
    let span = document.createElement('span');
    span.textContent = value;
    detail.appendChild(span);
    return detail;
  }

  /**
   * This function is used to append all the info element into the container
   * @param {object} container the container that contain all the purchase info
   * @param {object} elements the small pieces of info needed to be add into the card
   */
  function appendTransactionDetails(container, elements) {
    elements.forEach(element => {
      container.appendChild(element);
    });
  }

  /**
   * This function is used to create the card for each transaction history
   * @param {object} transaction all the purchse info
   */
  function createCard(transaction) {
    let transactionList = document.getElementById('watch-list');

    let transactionRecord = document.createElement('div');
    transactionRecord.classList.add('transaction-record');

    let img = createImageElement(transaction);
    transactionRecord.appendChild(img);

    let transactionDetails = document.createElement('div');
    transactionDetails.classList.add('transaction-details');

    let status = createStatusElement();
    transactionDetails.appendChild(status);

    let orderId = createDetailElement('Order ID', transaction.confirmationNumber);
    let name = createDetailElement('Name', transaction.Name);
    let type = createDetailElement('Type', transaction.Type);
    let total = createDetailElement('Total', `$${transaction.Price}`);
    total.classList.add('transaction-total');

    appendTransactionDetails(transactionDetails, [orderId, name, type, total]);
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