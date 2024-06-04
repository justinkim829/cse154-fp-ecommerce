REM Watch Store API Documentation
Jinseok Kim, Jincheng Wang

This API provides endpoints for a watch store application, allowing clients to login, create accounts, get watch details, and retrieve information about watches in a user's shopping cart.

1. User Login

Request Format: /REM/login

Request Type: POST

Returned Data Format: Plain Text

Description: Handles user login requests.

Example Request: POST /REM/login

json
{
  "Email": "user@example.com",
  "Password": "password123"
}

Example Response:
Login successful!
or
Invalid password
or
Email not found

Error Handling:
500 Server Error when there was an error validating the user.

2. Get Watch Details

Request Format: /watchdetails/:ID

Request Type: GET

Returned Data Format: JSON

Description: Retrieves details of a specific watch based on its ID.

Example Request: GET /watchdetails/123

Example Response:

json

{
  "ID": 1,
  "Name": "MR-G Frogman",
  "Price": 5800,
  "Description": "A premium, full-metal G-SHOCK MR-G timepiece for the sea — the titanium armor-clad, airtight MRG-BF1000 with ISO 200-meter water resistance — joins the FROGMAN family of full-fledged diver’s watches.\nThis MR-G diver’s watch takes the unique asymmetrical design, screw-lock case back and distinctive diving frog character — which were so popular when FROGMAN came out back in 1993 — to a whole new level.\nOriginally produced in resin, the complex design has now been remade in titanium, with each component crafted separately and polished meticulously for an entirely new feel of high-end quality.  The watch is built with an intricate combination of over 70 exterior components, including an O-ring waterproof seal to deliver outstanding FROGMAN water resistance and special buffers to strengthen the shock-resistant structure — all while maintaining the beauty of form the MR-G line is known for.",
  "Type": "D1",
  "Img1": "img/D/watch1/img1.png",
  "Img2": "img/D/watch1/img2.png",
  "Img3": "img/D/watch1/img3.png",
  "Img4": "img/D/watch1/img4.png",
  "Storage": 5,
  "category": "digital"
}

Error Handling:
500 Internal Server Error when there was an error retrieving the watch details.

3. Create Account

Request Format: /REM/createAccount

Request Type: POST

Returned Data Format: Plain Text

Description: Handles account creation requests. Stores user information in the database and returns a success or failure message.

Example Request: POST /REM/createAccount

json
{
  "Email": "newuser@example.com",
  "Password": "password123",
  "Gender": "Male",
  "FirstName": "John",
  "LastName": "Doe",
  "Month": "January",
  "Day": 1,
  "Year": 1990
}

Example Response:

Create Account Successful
or
Email Already Exists
or
Failed To Create Account

Error Handling:
500 Server Error when there was an error creating the account.

4. Get Watches Info

Request Format: /REM/getwatchesinfo

Request Type: GET

Returned Data Format: JSON

Description: Retrieves information about all watches in the user's shopping cart.

Example Request: GET /REM/getwatchesinfo

Example Response:

json
[
  {
    "ID": 0,
    "Name": "The Elijah McCoy Mechanic",
    "Price": "1,750",
    "Description": "As one of the world’s first Black American inventors, Elijah McCoy’s journey of triumph lives on in our language as synonymous with perfection: ‘The Real McCoy,’ a colloquialism popularized by demand for his superior locomotive oiler. This year, we honor McCoy’s prolific legacy of craftsmanship with the latest in our Great Americans Series, the manual-wind Elijah McCoy Pocket Watch.\nSKU\n20273678-sdt-005010761\nMOVEMENT\nSW210-1 Manual Wind\nDIAL COLOR DETAIL\nBlack\nCASE MATERIAL\nStainless Steel\nCASE PLATING\nSandblasted PVD Black\nCASE SIZE\n45mm",
    "Type": "P3",
    "Img1": "img/P/watch3/img1.png",
    "Img2": "img/P/watch3/img2.png",
    "Img3": "img/P/watch3/img3.png",
    "Img4": "img/P/watch3/img4.png",
    "Storage": 5,
    "category": "pocket",
    "UserID": 0,
    "WatchID": 9,
    "Quantity": 1,
    "Email": "0",
    "Password": "0",
    "Gender": "0",
    "FirstName": "0",
    "LastName": "0",
    "YearOfBirth": 0,
    "MonthOfBirth": 0,
    "DayOfBirth": 0
  },
  {
    "ID": 0,
    "Name": "Tambour Rose Gold",
    "Price": 60644,
    "Description": "What defines a Tambour watch? It is characterized by a circular case featuring curved sides, prominently engraved with the letters “LOUIS VUITTON” at the 12 o’clock position. It possesses a specific volume and an almost architectural approach to its dimensions and proportions. These attributes, among others, are meticulously maintained and enhanced in the latest iteration of the Tambour timepiece.\nThe essence of design permeates every aspect of the new Tambour watch. This design transcends mere aesthetics and delves into its purpose and intent. To begin with, it showcases a contemporary form with a universally appealing 40mm diameter and a slender 8.3mm case that elegantly follows the contours of the wearer’s wrist. Notably, the integrated bracelet on the new Tambour, a novel feature for Louis Vuitton watches, blends strength and fluidity. Its sleek, curved links ensure a snug and comfortable fit on the wrist, comparable to the softest leather strap.\nEvery facet of the new Louis Vuitton Tambour watch is a product of intentional design, signifying that every detail serves a purpose and has significance. Even the external aspects of the watch, every surface that comes into contact with the skin, are crafted to harmonize with the body. The caseback, for instance, is not flat but gently curves towards the middle of the case, mirroring the natural contour of the forearm as it approaches the wrist. By emulating the anatomy of the human arm, the Tambour watch appears even sleeker than its 8.3mm thickness. The bracelet links, featuring a convex shape on their upper surfaces and concave on the underside, create a rounded profile that maintains continuous contact with the entire wrist.\n",
    "Type": "M2",
    "Img1": "img/M/watch2/img1.png",
    "Img2": "img/M/watch2/img2.png",
    "Img3": "img/M/watch2/img3.png",
    "Img4": "img/M/watch2/img4.png",
    "Storage": 5,
    "category": "mechanical",
    "UserID": 0,
    "WatchID": 5,
    "Quantity": 1,
    "Email": "0",
    "Password": "0",
    "Gender": "0",
    "FirstName": "0",
    "LastName": "0",
    "YearOfBirth": 0,
    "MonthOfBirth": 0,
    "DayOfBirth": 0
  }
]
Error Handling:
500 Server Error when there was an error retrieving the watches info.


5. Get the info of all watches.

Request Format: /REM/getallwatches

Request Type: GET

Returned Data Format: JSON

Description: Retrieves information about all watches in the database.

Example Request: GET /REM/getallwatches
  Example Response:

  [
    {
      "ID": 1,
      "Name": "MR-G Frogman",
      "Price": 5800,
      "Description": "A premium, full-metal G-SHOCK MR-G timepiece for the sea — the titanium armor-clad, airtight MRG-BF1000 with ISO 200-meter water resistance — joins the FROGMAN family of full-fledged diver’s watches.\nThis MR-G diver’s watch takes the unique asymmetrical design, screw-lock case back and distinctive diving frog character — which were so popular when FROGMAN came out back in 1993 — to a whole new level.\nOriginally produced in resin, the complex design has now been remade in titanium, with each component crafted separately and polished meticulously for an entirely new feel of high-end quality.  The watch is built with an intricate combination of over 70 exterior components, including an O-ring waterproof seal to deliver outstanding FROGMAN water resistance and special buffers to strengthen the shock-resistant structure — all while maintaining the beauty of form the MR-G line is known for.",
      "Type": "D1",
      "Img1": "img/D/watch1/img1.png",
      "Img2": "img/D/watch1/img2.png",
      "Img3": "img/D/watch1/img3.png",
      "Img4": "img/D/watch1/img4.png",
      "Storage": 5,
      "category": "digital"
    },
    {
      "ID": 2,
      "Name": "Vintage AQ800E-7A",
      "Price": 56,
      "Description": "Reboot your retro vintage style with a contemporary update on the 1980s AQ-450 design. \nThis brand-new vintage style watch is a beautiful blend of retro and stylish.\n\nA separate dial and LCD serve up analog beauty alongside digital performance. \nThe LCD angles gently to follow the lines of the lugs, while the analog dial features simple bar index marks. \nThe watch face adorned in a grid pattern adds the final touch for a real retro feel.",
      "Type": "D2",
      "Img1": "img/D/watch2/img1.png",
      "Img2": "img/D/watch2/img2.png",
      "Img3": "img/D/watch2/img3.png",
      "Img4": "img/D/watch2/img4.png",
      "Storage": 5,
      "category": "digital"
    },
    {
      "ID": 3,
      "Name": "Tag Heuer Connected \nCalibre E4",
      "Price": 1600,
      "Description": "Cutting-edge technology meets high-end watchmaking in this TAG Heuer Connected Watch. Ready to push the boundaries, the distinct 45mm steel case features sharp sporty lugs and integrated steel pushers.\n\nSMART WITH SUPERIOR ERGONOMICS\nWith its large high-tech screen and black ceramic bezel, the ultimate luxury sports watch leverages our watchmaking expertise and offers optimal resistance to wear and aging.\n\nREADY TO TRACK YOUR GOALS\nNo matter your goal, the TAG Heuer sports exclusive application ensure you stay ahead. Enjoy improved grip thanks to the steel crown with rubber and steel pushers.\n\nSMART AND VERSATILE\nThe seamless steel h-shaped bracelet with folding clasp and safety buttons is easily interchangeable for optimized comfort.",
      "Type": "D3",
      "Img1": "img/D/watch3/img1.png",
      "Img2": "img/D/watch3/img2.png",
      "Img3": "img/D/watch3/img3.png",
      "Img4": "img/D/watch3/img4.png",
      "Storage": 5,
      "category": "digital"
    }
  ]

  Error Handling:
  500 Server Error when there was an error retrieving the watches info.


6. get the current user name.

  Request Format: /REM/getusername

  Request Type: GET

  Returned Data Format: JSON

  Description: Retrieves the current user's name.

  Example Request: GET /REM/getusername

  Example Response:
  {
    "name": "John Doe"
  }

  Error Handling:
  500 Server Error when there was an error retrieving the user's name.


  7. check if the user is currently logged in or not.

  Request Format: /REM/checkiflogin

  Request Type: GET

  Returned Data Format: Text

  Description: Checks if the user is currently logged in.

  Example Request: GET /REM/checkiflogin

  Example Response: "Already Login" or "havn't Login"

  Error Handling:
  None


8. get the current user ID.

  Request Format: /REM/currentuserid

  Request Type: GET

  Returned Data Format: Text

  Description: Retrieves the current user's ID.

  Example Request: GET /REM/currentuserid

  Example Response: "1"

  Error Handling:
  None


9. remove an item from the shopping cart.

  Request Format: /REM/removeitem

  Request Type: POST

  Returned Data Format: Text

  Description: Removes an item from the shopping cart.

  Example Request: POST /REM/removeitem

  {
    "id": 1
  }

  Example Response: "Remove the Item successfully" or "Failed to remove from the Shoppingcart"

  Error Handling:
  500 Server Error when there was an error removing the item.


10. change the quantity of a product in the shopping cart.

  Request Format: /REM/changequantity

  Request Type: POST

  Returned Data Format: Text

  Description: Changes the quantity of a product in the shopping cart.

  Example Request: POST /REM/changequantity

  {
    "id": 1,
    "number": 2
  }

  Example Response: "change the quantity successfully" or "Failed to change the quantity"

  Error Handling:
  500 Server Error when there was an error changing the quantity.



  11.This endpoint is used to add an item to the shopping cart.

  Request Format: /REM/addtoshoppingcart

  Request Type: POST

  Returned Data Format: Text

  Description: Adds an item to the shopping cart.

  Example Request: POST /REM/addtoshoppingcart

  {
    "productID": 1,
    "userID": 1
  }

  Example Response: "Successfully added to shopping cart" or "Internal Server Error. Failed to add watch to shopping cart"

  Error Handling:
  500 Server Error when there was an error adding the item.


12. remove an item from the shopping cart.

  Request Format: /REM/removefromshoppingcart
  Request Type: POST
  Returned Data Format: Text
  Description: Removes an item from the shopping cart.

  Example Request: POST /REM/removefromshoppingcart
  {
    "productID": 1,
    "userID": 1
  }
  Example Response: "Successfully deleted from shopping cart" or "Internal Server Error. Failed to remove watch from shopping cart"

  Error Handling:
  500 Server Error when there was an error removing the item.


  13. get the recommendation of all the products.

  Request Format: /REM/recommendation

  Request Type: POST

  Returned Data Format: Text

  Description: Gets the recommendation of all the products based on user input.

  Example Request: POST /REM/recommendation

  {
    "input": "Pocket"
  }

  Example Response: "Pocket Watch" or "No matching watches found"

  Error Handling:
  500 Server Error when there was an error getting the recommendation.



  14. buy the product from the shoppingcart.

  Request Format: /REM/buyproduct

  Request Type: POST

  Returned Data Format: Text

  Description: Processes the purchase of products in the shopping cart.

  Example Request: POST /REM/buyproduct

  {
    "cardHolderName": "John Doe",
    "cardNumber": "1234567812345678"
  }

  Example Response: "Confirmation code: REM12345678" or "Do not have enough money" or "Wrong card holder name" or "No credit card found" or "Not enough watches to supply"

  Error Handling:
  500 Server Error when there was an error processing the purchase.


  15. get all the transaction history.

  Request Format: /REM/gettransaction
  Request Type: GET
  Returned Data Format: JSON
  Description: Retrieves all the transaction history of the current user.

  Example Request: GET /REM/gettransaction
  Example Response:
  [
    {
      "TransactionID": 1,
      "UserID": 1,
      "WatchID": 1,
      "Quantity": 2,
      "Img": "sport-watch.png",
      "confirmationNumber": "REM12345678"
    },
    {
      "TransactionID": 2,
      "UserID": 1,
      "WatchID": 2,
      "Quantity": 1,
      "Img": "classic-watch.png",
      "confirmationNumber": "REM87654321"
    }
  ]

  Error Handling:
  500 Server Error when there was an error retrieving the transaction history.

  16. log out the current user.

  Request Format: /REM/logout

  Request Type: GET

  Returned Data Format: Text

  Description: Logs out the current user.

  Example Request: GET /REM/logout

  Example Response: "Logout Successfully"

  Error Handling:
  None