/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the login website,which is used to fullfill to
 * login the userAccoount, give the error messege if user have the wrong password or email
 * address.
 */

"use strict";

(function() {
  const LOGIN_URL = "/REM/login";
  let timeoutId = 0;

  window.addEventListener('load', init);

  /** This function is used to initiallize all the functions */
  function init() {
    id("input").addEventListener("submit", async (event) => {
      await login(event);
      storeEmail(event);
    });
    autoFillLogin();
  }

  /**
   * This function is used to store and the fullfill the Email when user has already
   * input before
   */
  function autoFillLogin() {
    let savedEmail = sessionStorage.getItem('userEmail');
    if (savedEmail) {
      id('email').value = savedEmail;
    }
  }

  /**
   * This function is used to store the email into the session storage
   * @param {event} event - the event of click the submit
   */
  function storeEmail(event) {
    event.preventDefault();
    let email = id("email").value;
    sessionStorage.setItem('userEmail', email);
  }

  /**
   * This function is used to log in the user account and display the message if
   * user log in successfully or not
   * @param {event} event - the action of clicking the button
   */
  async function login(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("Email", id("email").value);
    formData.append("Password", id("password").value);
    try {
      let result = await postRequest(formData);
      processLogIn(result);
    } catch (err) {
      id("errdisplay").classList.remove("hidden");
      setTimeout(() => {
        id("errdisplay").classList.add("hidden");
      }, 2000);
    }
  }

  /**
   * process the log in action
   * show user-friendly response when login was successful/unsuccessful
   * @param {string} result - indicates if login was successful
   */
  function processLogIn(result) {
    try {
      let para = gen("p");
      if (result === "Login successful!") {
        para.textContent = result;
        id("messagedisplay").appendChild(para);
        setInterval(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        id("password").value = "";
        id("email").value = "";
        para.textContent = result;
        id("messagedisplay").appendChild(para);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setInterval(() => {
          if (id("messagedisplay").lastChild) {
            id("messagedisplay").removeChild(id("messagedisplay").lastChild);
          }
        }, 2000);
      }
    } catch (err) {
      id("errdisplay").classList.remove("hidden");
      setTimeout(() => {
        id("errdisplay").classList.add("hidden");
      }, 2000);
    }
  }

  /**
   * This function is used to post the email and password in to back end
   * @param {object} formData - FormData that would be sent to the post request
   */
  async function postRequest(formData) {
    try {
      let response = await fetch(LOGIN_URL, {
        method: "POST",
        body: formData
      });
      response = await statusCheck(response);
      let result = await response.text();
      return result;
    } catch (err) {
      id("errdisplay").classList.remove("hidden");
      setTimeout(() => {
        id("errdisplay").classList.add("hidden");
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
   * This function is used to get that element by its name
   * @param {string} selector - the element wants to be find in the HTML page
   * @return {Node} return the node that selector corespond to .
   */
  function gen(selector) {
    return document.createElement(selector);
  }
})();