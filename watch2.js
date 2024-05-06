"use strict";

(function () {

  window.addEventListener('load', init);

  function init() {

    //lock header when window is scrolled down
    window.onscroll = function() {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    }

    //THE HEADER START
    let menu = id('menu');
    let sidebar = id('sidebar');
    let close = id("close");
    let overlay = id("overlay");
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');

    menu.classList.add(".change");
    // change the style when putting the cursor on the menu

    //click menu and open the side bar
    menu.addEventListener('click', function (event) {
      sidebar.style.left = '0px';
      overlay.style.display = "block";
      overlay.style.pointerEvents = 'auto';
      [type1Sidebar, type2Sidebar, type3Sidebar].forEach(sidebar => {
        sidebar.style.left = '0px';
      });
      event.stopPropagation();
      document.addEventListener('click', closeSidebar);
    });

    //click and close the side bar
    close.addEventListener('click', function () {
      sidebar.style.left = '-300px';
      type1Sidebar.style.left = '-300px';
      type2Sidebar.style.left = '-300px';
      type3Sidebar.style.left = '-300px';
      overlay.style.display = "none";

    });

    let type1 = id("type1");
    let type2 = id("type2");
    let type3 = id("type3");



    type1.addEventListener("click", function () {

      hideExistSidebars(type2Sidebar, type3Sidebar);
      toggleSidebar(type1Sidebar);
    })

    type2.addEventListener("click", function () {
      hideExistSidebars(type1Sidebar, type3Sidebar);
      toggleSidebar(type2Sidebar);
    })

    type3.addEventListener("click", function () {
      hideExistSidebars(type1Sidebar, type2Sidebar);
      toggleSidebar(type3Sidebar);
    })
  //THE HEADER END

    //change wishlisticon when wishlist icon("â™¡") clicked
    let wishlistIcon = qs("#add-to-wishlist p");
    wishlistIcon.addEventListener('click', addToWishlist);

    //change picture when right and left arrow clicked
    let rightArrow = qs("#right-arrow p");
    rightArrow.addEventListener('click', () => {
      nextPicture(true);
    });

    let leftArrow = qs("#left-arrow p");
    leftArrow.addEventListener('click', () => {
      nextPicture(false);
    });
  }

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

  function addToWishlist() {
    let wishlistIcon = qs("#add-to-wishlist p");
    let message = gen("p");
    if (id("add-message").children.length === 0) {
      if (wishlistIcon.textContent === "â™¡") {
        wishlistIcon.textContent = "â™¥ï¸Ž"
        message.textContent = "Added to wishlist";
      } else {
        wishlistIcon.textContent = "â™¡";
        message.textContent = "Removed from Wishlist";
      }
      setTimeout(() => {
        id("add-message").removeChild(message);
      }, 1500);
      id("add-message").appendChild(message);
      }
    }

  // HEADER FUNCTION START
  function toggleSidebar(subSidebar) {
    if (subSidebar.style.left === "0px") {
      subSidebar.style.left = "300px";
      subSidebar.style.display = "block";
    } else {
      subSidebar.style.left = "0px";
      subSidebar.style.display = "none";
    }
  }

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

    if (!sidebar.contains(event.target) && event.target !== menu
      && !type1Sidebar.contains(event.target) && !type2Sidebar.contains(event.target)
      && !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar,type2Sidebar,type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';

      document.removeEventListener('click', closeSidebar);
    }

  }

  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
  }
  //HEADER FUNCTION END
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