/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the watch website,which is used to fullfill to
 * help User better understand this watch, showing all the details information, User
 * can also add this watch into the shoppingcart
 */

"use strict";

(function() {

  window.addEventListener('load', init);

  const CATEGORIES_MAP = new Map([
    ['M', 3],
    ['D', 3],
    ['P', 3]
  ]);

  /** this function is used to initilizale the button with its functions. */
  async function init() {
    qs("#product-details p").addEventListener("click", displayDetailSidebar);
    qs("#sidebarfordetail .close").addEventListener("click", closeTheDetailSidebar);
    id("add-to-cart").addEventListener('click', addToWishlist);
    arrowsToNextImage();
    changeHeaderWhenScrolled();
    await receiveSidebarToWatch();
  }

  /**
   * change the header background and text color when scrolled down.
   */
  function changeHeaderWhenScrolled() {
    window.onscroll = function() {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    };
  }

  /** This function is used change into the next image */
  function arrowsToNextImage() {
    let rightArrow = qs("#right-arrow p");
    rightArrow.addEventListener('click', () => {
      nextPicture(true);
    });

    let leftArrow = qs("#left-arrow p");
    leftArrow.addEventListener('click', () => {
      nextPicture(false);
    });
  }

  /**
   * When the watch of a the sidebar is clicked,
   * reload the page to match the images and description of that clicked watch.
   * Store the watch ID.
   */
  async function receiveSidebarToWatch() {
    reloadPage(localStorage.getItem("productID"));
    let watch = await getData(`/REM/checkifwatchadded/${localStorage.getItem("productID")}`, false);
    if (watch.length === 0) {
      qs("#add-to-wishlist p").textContent = "♡";
      qs("#add-to-cart button").textContent = "Add To Cart";
    } else {
      qs("#add-to-wishlist p").textContent = "♥︎";
      qs("#add-to-cart button").textContent = "Remove From Cart";
    }
  }

  /**
   * this function is used to change into the next picture when we clicked the arrow
   * @param {boolean} isRightArrow - whether user chicked the arrow
   */
  function nextPicture(isRightArrow) {
    let currentImage = qs("#img-container img");

    let currentNumberIndex = currentImage.src.indexOf(".") - 1;
    let currentNumber = parseInt(currentImage.src[currentNumberIndex]);

    let nextNumber;
    let allHR = qsa("#image-number hr");
    if (isRightArrow) {
      nextNumber = (currentNumber + 1) % 5;
      nextNumber = (nextNumber % 5 === 0) ? 1 : nextNumber;
      allHR[currentNumber % 4].classList.toggle("to-black-border");
      allHR[currentNumber % 4].classList.toggle("to-white-border");
    } else {
      nextNumber = (currentNumber - 1) % 5;
      nextNumber = (nextNumber % 5 === 0) ? 4 : nextNumber;
      allHR[(currentNumber + 2) % 4].classList.toggle("to-black-border");
      allHR[(currentNumber + 2) % 4].classList.toggle("to-white-border");
    }
    allHR[currentNumber - 1].classList.toggle("to-black-border");
    allHR[currentNumber - 1].classList.toggle("to-white-border");

    let startIndex = currentImage.src.indexOf("img/");
    let path = currentImage.src.substring(startIndex, currentNumberIndex);
    let newSrc = path + nextNumber + ".png";

    currentImage.src = newSrc;
  }

  /** this function is used to add this product into the wishlist when click the love icon */
  async function addToWishlist() {
    let wishlistIcon = qs("#add-to-wishlist p");
    let message = gen("p");
    let params = new FormData();

    if (id("add-message").children.length === 0) {
      try {
        let currentUserID = await getData("/REM/currentuserid", true);
        params.append("productID", localStorage.getItem("productID"));
        params.append("userID", currentUserID);
        if (wishlistIcon.textContent === "♡") {
          wishlistIcon.textContent = "♥︎";
          let response = await postData("/REM/addtoshoppingcart", params, true);
          qs("#add-to-cart button").textContent = "Remove From Cart";
          message.textContent = response;
        } else {
          wishlistIcon.textContent = "♡";
          let response = await postData("/REM/removefromshoppingcart", params, true);
          qs("#add-to-cart button").textContent = "Add To Cart";
          message.textContent = response;
        }
      } catch (err) {
        errHandle();
      }
      setTimeout(() => {
        id("add-message").removeChild(message);
      }, 1500);
      id("add-message").appendChild(message);
    }
  }

  /** This function is used to handle the error */
  function errHandle() {
    id("errdisplay").classList.remove("hidden");
    setTimeout(() => {
      id("errdisplay").classList.add("hidden");
    }, 2000);
  }

  /**
   * Display the sidebar to shwo details
   * @param {event} event - the event that triggered
   */
  function displayDetailSidebar(event) {
    let productDetails = id("sidebarfordetail");
    productDetails.style.right = "0px";
    id("overlay").style.display = "block";
    id("overlay").style.pointerEvents = 'auto';
    event.stopPropagation();
    document.addEventListener('click', closeDetailSidebarAuto);
  }

  /**
   * close the sidebar to show details
   */
  function closeTheDetailSidebar() {
    let productDetails = id("sidebarfordetail");
    productDetails.style.right = "-400px";
    id("overlay").style.display = "none";
  }

  /**
   * automatically close the sidebar to show details
   * @param {event} event - the event the triggered
   */
  function closeDetailSidebarAuto(event) {
    let sidebarfordetail = id("sidebarfordetail");
    let overlay = id("overlay");

    if (!sidebarfordetail.contains(event.target)) {
      sidebarfordetail.style.right = "-400px";
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';
    }
  }

  /**
   * reset the horizontal lines which indicate
   * the picture num of watch that is shown
   */
  function resetHRs() {
    let allHRs = qsa("#image-number hr");
    for (let i = 0; i < allHRs.length; i++) {
      allHRs[i].classList.remove("to-white-border");
      allHRs[i].classList.add("to-black-border");
    }
    allHRs[0].classList.add("to-white-border");
    allHRs[0].classList.remove("to-blacke-border");
  }

  /**
   * reset sidebars back to display nothing
   * used when page reloads
   */
  function resetAllSidebar() {
    let overlay = id("overlay");
    let arraySidebars = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar'), id("sidebar")];
    for (let sidebar of arraySidebars) {
      sidebar.style.left = "-300px";
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';
    }
  }

  /**
   * update watch info (imgs, name, price, etc.) for the watch page
   * @param {String} productID the productID of to watch
   */
  async function changeWatchImages(productID) {
    try {
      let data = await getData(`/watchdetails/${productID}`, false);
      let imagePath = data.Img1;
      let currentImage = qs("#img-container img");
      currentImage.src = imagePath;
      currentImage.alt = productID;

      let productNumber = qs("#product-number p");
      productNumber.textContent = productID;

      qs("#product-name h2").textContent = data.Name;
      qs("#price p").textContent = "$" + data.Price;
      qs("#sidebarfordetail p").textContent = data.Description;

      changeRecommendations(productID);
    } catch (err) {
      errHandle();
    }
  }

  /**
   * change recommendations that show up in the bottom of the page
   * to match the watch type that is being viewed
   * @param {String} productID the productID of to watch
   */
  function changeRecommendations(productID) {
    let productType = productID[0];
    let productNum = parseInt(productID[1]);

    let recommendations = [];
    let watchNums = CATEGORIES_MAP.get(productType);
    for (let i = productNum + 1; i <= productNum + watchNums; i++) {
      let nextWatchNum = (i % watchNums) === 0 ? watchNums : i % watchNums;
      if (nextWatchNum !== productNum) {
        let sameCatPath = `img/${productType.toLowerCase()}/watch${nextWatchNum}/img1.png`;
        recommendations.push([sameCatPath, productType + nextWatchNum]);
      }
    }
    for (let key of CATEGORIES_MAP.keys()) {
      if (key !== productType) {
        let diffCatPath = `img/${key.toLowerCase()}/watch${productNum}/img1.png`;
        recommendations.push([diffCatPath, key + productNum]);
      }
    }
    changeRecommendedWatches(recommendations);
  }

  /**
   * change recommended watch images based on the recommendations given
   * @param {Array} recommendations - array of arrays which contain
   * the path of image and type of watch
   */
  function changeRecommendedWatches(recommendations) {
    let recommendedWatches = qsa("#recommendation-list .watch-box img");
    for (let i = 0; i < recommendedWatches.length; i++) {
      recommendedWatches[i].src = recommendations[i][0];
      recommendedWatches[i].alt = recommendations[i][1];

      recommendedWatches[i].removeEventListener('click', recommendedWatches[i].clickHandler);

      recommendedWatches[i].clickHandler = () => reloadPage(recommendedWatches[i].alt);
      recommendedWatches[i].addEventListener(
      'click',
      recommendedWatches[i].clickHandler,
      {once: true}
      );
    }
  }

  /**
   * reload page (reset sidebars, horizontal lines, and image information)
   * @param {String} productID product ID of the watch
   */
  function reloadPage(productID) {
    resetAllSidebar();
    changeWatchImages(productID);
    resetHRs();
    window.scrollTo(0, 0);
  }

  /**
   * Fetches data from the given endpoint.
   * @param {string} endPoint - The API endpoint.
   * @param {boolean} isReturnText - Whether the received data is text or JSON.
   * @returns {Promise<Object|string>} The fetched data after error handling.
   */
  async function getData(endPoint, isReturnText) {
    let data;
    try {
      data = await fetch(endPoint);
      await statusCheck(data);
      if (isReturnText) {
        data = await data.text();
      } else {
        data = await data.json();
      }
      return data;
    } catch (err) {
      throw new Error(await data.text());
    }
  }

  /**
   * Sends a POST request to the specified endpoint with the provided parameters.
   * @param {string} endPoint - The URL to which the request is sent.
   * @param {FormData} params - The parameters to be sent in the request body.
   * @param {boolean} isReturnText - Indicates whether the response should be
   *                                 returned as text (true) or JSON (false).
   * @return {Promise<string|Object>} - The response data as a string if isReturnText
   *                                    is true, or as an object if false.
   * @throws Will log an error message to the console if the request fails.
   */
  async function postData(endPoint, params, isReturnText) {
    let data;
    try {
      data = await fetch(endPoint, {
        method: 'POST',
        body: params
      });
      await statusCheck(data);
      if (isReturnText) {
        data = await data.text();
      } else {
        data = await data.json();
      }
      return data;
    } catch (err) {
      throw new Error(await data.text());
    }
  }

  /**
   * Checks the status of the response.
   * @param {Response} res - The response object.
   * @throws an error if the response is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
  }

  /**
   * Helper function user to generate certain node
   * @param {object} element - the node user wants to create
   * @return {Node} the node that was created.
   */
  function gen(element) {
    return document.createElement(element);
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