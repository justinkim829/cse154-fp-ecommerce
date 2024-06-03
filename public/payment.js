/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the payment website, which is used to fullfill
 * the payment of the items in the shoppingcart after user is login, user need to provide
 * the credict card info as well as all the divery info.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  const GET_WATCH_INFO_URL = "/REM/getwatchesinfo";
  let timeoutId = 0;

  /** this function is used to initilizale the button with its functions. */
  async function init() {
    await getAllWatches();
    id("form1").addEventListener("submit", (event) => {
      buyProduct(event);
    });
    await checkIsLogin();
  }

  /**
   * This function is used to buy the product
   * @param {event} event - the event of clicking the payment button
   */
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
      if (result.substring(0,17) === "Confirmation code") {
        let displayMessage = gen("p");
        displayMessage.textContent = "Purchased Successfully";
        id("displaymessage").appendChild(displayMessage);
        timeoutId = setInterval(() => {
          window.location.href = "transaction.html";
        }, 2000);
      } else {
        handleFailSituation(result);
      }
    } catch (err) {
      console.error(err);
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
      qs("#log").textContent = "LogOut";
      id("log").removeAttribute('href');
    }
  }

  /**
   * This function is used to handle all the fail situation when purchase the item
   * @param {object} result - the result of purchase the item
   */
  function handleFailSituation(result) {
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
    let QuantityOfWatch = gen('p');
    QuantityOfWatch.textContent = " x "+product.Quantity;
    innerSection.appendChild(QuantityOfWatch);
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