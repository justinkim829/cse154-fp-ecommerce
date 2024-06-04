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
    await getShoppingHistory();
    logOutWhenClicked();
    await checkIsLogin();
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

  /** This function is used to log out when the log out text is clicked. */
  function logOutWhenClicked() {
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
    window.location.href = "index.html";
  }

  /** This function is used to get all the shopping history */
  async function getShoppingHistory() {
    try {
      let response = await fetch("/REM/gettransaction");
      response = await statusCheck(response);
      let result = await response.json();
      if (result.length !== 0) {
        for (let i = 0; i < result.length; i++) {
          createCard(result[i]);
        }
      } else {
        showEmptyMessage();
      }
    } catch (err) {
      id("errdisplay").classList.add("hidden");
      setTimeout(() => {
        id("errdisplay").classList.remove("hidden");
      }, 2000);
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

  /** Show the message when there is no transaction history */
  function showEmptyMessage() {
    let message = gen("p");
    message.classList.add("messagedisplay");
    message.textContent = "There are nothing in the Transactions";
    id("watch-list").appendChild(message);
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
})();