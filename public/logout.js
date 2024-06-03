/*
 * Name: Jinseok Kim, Jincheng Wang
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement the logout functionality.
 * Also it checks if the user is logged in.
 * It is a js file for all pages except the newaccount and transaction page.
 * You are not logged in when you create a new account.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /** Initilizes the functions to check if user is logged in and log out. */
  async function init() {
    await checkIsLogin();
    logOutWhenClicked();
  }

  /** This function is used to log out when the log out text is clicked. */
  function logOutWhenClicked() {
    id("log").addEventListener("click", () => {
      logOut();
      window.location.reload();
    });
  }

  /** This function is used to log out from the user account */
  async function logOut() {
    let response = await fetch("/REM/logout");
    await statusCheck(response);
    let result = await response.text();
    if (result === "Logout Successfully") {
      id("log").setAttribute('href', "login.html");
      id("log").textContent = "Login";
    }
  }

  /** Checks if user is logged in */
  async function checkIsLogin() {
    let response = await fetch("/REM/checkiflogin");
    await statusCheck(response);
    let result = await response.text();
    if (result === "havn't Login") {
      id("trans").removeAttribute('href');
    } else {
      id("trans").setAttribute('href', "transaction.html");
      id("trans").classList.remove("hidden");
      id("log").textContent = "LogOut";
      id("log").removeAttribute('href');
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
})();
