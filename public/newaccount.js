/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the newaccount website, which is used to fullfill
 * to create a new account for the new user, the user has to provide some basic info
 * in order to create the account successfully.
 */

"use strict";

(function() {

  window.addEventListener('load', init);
  const CREATE_URL = "/REM/createAccount";
  let intervalid = 0;

  /** This function is used to initiallize all the functions */
  function init() {
    id("form1").addEventListener("submit", (evt) => {
      createAccount(evt);
    });
  }

  /**
   * This function is used to send all the info of user into the database
   * @param {event} event The action of click the button
   */
  async function createAccount(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("Email", id('emailaddress').value);
    formData.append("Password", id('password').value);
    formData.append("Gender", id('title').value);
    formData.append("FirstName", id('firstname').value);
    formData.append("LastName", id('lastname').value);
    formData.append("Month", id('month').value);
    formData.append("Day", id('day').value);
    formData.append("Year", id('year').value);
    try {
      let response = await fetch(CREATE_URL, {
        method: "POST",
        body: formData
      });
      response = await statusCheck(response);
      let result = await response.text();
      statusChecking(result);

    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This function updates the status message displayed to the user and manages the
   * visibility of the status message on the screen.
   * @param {string} result - The result message to be displayed.
   */
  function statusChecking(result) {
    let board = id("showstatus");
    if (board.children.length !== 0) {
      board.removeChild(board.lastChild);
    }
    let message = gen("p");
    message.textContent = result;
    board.appendChild(message);

    if (intervalid) {
      clearTimeout(intervalid);
    }
    intervalid = setInterval(() => {
      if (board.lastChild) {
        board.removeChild(board.lastChild);
      }
    }, 2000);
    handleSuccess(result);
  }

  /**
   * This function handles the successful account creation result, redirecting the user to the
   * login page if the account creation was successful.
   * @param {string} result - The result message from the account creation process.
   */
  function handleSuccess(result) {
    if (result === "Create Account Successful") {
      if (intervalid) {
        clearTimeout(intervalid);
      }
      intervalid = setInterval(() => {
        window.location.href = "login.html";
      }, 2000);
    }
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
   * This function is used to get all the elements by its name
   * @param {string} selector - the elements wants to be find in the HTML page
   * @return {Node} return the all the node that selector corespond to .
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * This function is used to get that element by its name
   * @param {string} selector - the element wants to be find in the HTML page
   * @return {Node} return the node that selector corespond to .
   */
  function gen(selector) {
    return document.createElement(selector);
  }
})();