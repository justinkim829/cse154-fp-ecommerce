/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the login website,which is used to fullfill to
 * login the userAccoount, give the err messege if user have the wrong password or email
 * address.
 */

"use strict";

(function () {
  const LOGIN_URL = "/REM/login";
  let timeoutId = 0;

  window.addEventListener('load', init);

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
    id("input").addEventListener("submit", (event) => {
      login(event);
      storeEmail(event);
    });
    sendSidebarToWatch();
    await checkIsLogin();
    qs("#log").addEventListener("click", () => {
      logOut();
      window.location.reload();
    });
    autoFillLogin();

  }

  function autoFillLogin() {
    let savedEmail = sessionStorage.getItem('userEmail');
    if (savedEmail) {
      id('email').value = savedEmail;
    }
  }

  function storeEmail(event) {
    event.preventDefault();
    let email = id("email").value
    sessionStorage.setItem('userEmail', email);
  }

  /** This function is used to log out from the account */
  async function logOut() {
    let response = await fetch("/REM/logout");
    response = await statusCheck(response);
    let result = await response.text();
    if (result === "Logout Successfully") {
      id("log").setAttribute('href', "login.html");
      qs("#log").textContent = "Login";
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

  /** Checks if user is loggied in */
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
      console.error(err);
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
          window.location.href = "mainpage.html";
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
      console.error(err);
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
      console.error(err);
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
  function qs(selector) {
    return document.querySelector(selector);
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