"use strict";

(function () {

  window.addEventListener('load', init);

  /**
   * initialize the document by adding sidebars when menu clicked
   * lock header when scrolled down
   * adds other functionalities to operate website
   */
  function init() {
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
      })
    }
    qs("#add-to-wishlist p").addEventListener('click', addToWishlist);
    qs("#right-arrow p").addEventListener('click', () => {
      nextPicture(true);
    });
    qs("#left-arrow p").addEventListener('click', () => {
      nextPicture(false);
    });
    window.onscroll = function() {
      if (window.scrollY > 0) {
        qs("header").classList.add("lock-header");
      } else {
        qs("header").classList.remove("lock-header");
      }
    }
  }

 /** this function is used to open the sidebar
  *  @param {object} evt - the sidebar that user is clicked
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
      allHR[(currentNumber+2) % 4].classList.toggle("to-black-border");
      allHR[(currentNumber+2) % 4].classList.toggle("to-white-border");
    }
    allHR[currentNumber-1].classList.toggle("to-black-border");
    allHR[currentNumber-1].classList.toggle("to-white-border");

    let startIndex = currentImage.src.indexOf("img/");
    let path = currentImage.src.substring(startIndex, currentNumberIndex);
    let newSrc = path + nextNumber + ".png";

    currentImage.src = newSrc;
  }

  /** this function is used to add this product into the wishlist when click the love icon*/
  function addToWishlist() {
    let wishlistIcon = qs("#add-to-wishlist p");
    let message = gen("p");
    if (id("add-message").children.length === 0) {
      if (wishlistIcon.textContent === "♡") {
        wishlistIcon.textContent = "♥︎"
        message.textContent = "Added to wishlist";
      } else {
        wishlistIcon.textContent = "♡";
        message.textContent = "Removed from Wishlist";
      }
      setTimeout(() => {
        id("add-message").removeChild(message);
      }, 1500);
      id("add-message").appendChild(message);
      }
    }

  /**
   * control sidebar to appear / disappear
   * @param {Object} subSidebar - sidebar
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
   * hide existing sidebars
   * @param {Object} subSidebar1 - sidebar 1 to hide
   * @param {Object} subSidebar2  - sidebar 2 to hide
   */
  function hideExistSidebars(subSidebar1, subSidebar2) {
    [subSidebar1, subSidebar2].forEach(sidebar => {
      if (sidebar.style.left === "300px") {
        sidebar.style.left = "0px";
        sidebar.style.display = "none";
      }
    });
  }


  //when click the place other than sidebar, the sidebar would be closed
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');
    let overlay = id("overlay");

    if (!sidebar.contains(event.target) && event.target !== menu
      && !type1Sidebar.contains(event.target) && !type2Sidebar.contains(event.target)
      && !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar, type2Sidebar, type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';

      document.removeEventListener('click', closeSidebar);
    }

  }

  /**
   * sidebars to hide
   * @param {Object} subSidebar1 - sidebar to hide
   * @param {Object} subSidebar2 - sidebar to hide
   * @param {Object} subSidebar3 - sidebar to hide
   */
  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
  }

  /**
   * genereates element
   * @param {Element} element
   * @returns {Object} - created element
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