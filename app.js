/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Section: CSE 154
 * This endpoint is used to handle different situations, including buying a prduct,
 * Delete from the shoppingcart, add into the transaction database,simulate all the
 * situations for a watch saling web page.
 */

'use strict';

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

const sqlite = require('sqlite');

const nodemailer = require('nodemailer');

const multer = require("multer");
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(multer().none());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'rem375254@gmail.com',
    pass: 'tdmg sdjz okgq ggov'
  }
});

let currentUserID = 0;

app.get("/REM/getallwatches", async (req, res) => {
  let db = await getDBConnection();
  let getWatchesSql = "SELECT * FROM watches;"
  try{
    let watchArray = await db.all(getWatchesSql);
    res.type("json").send(watchArray);
  }catch {
    res.status(500).send("An error occurred");
  }
});

/** This end point is used to get the current user name */
app.get("/REM/getusername", async (req, res) => {
  let db = await getDBConnection();
  let getUserSql = "SELECT name FROM USER WHERE ID = ?;"
  try {
    let name = db.get(getUserSql, [currentUserID]);
    res.type("text").send(name);
  } catch {
    res.status(500).send("An error occurred");
  }
});

/** This end point is used to check if the user is currently log in or not */
app.get("/REM/checkiflogin", (req, res) => {
  if (currentUserID !== 0) {
    res.type("text").status(200);
    res.send("Already Login");
  } else {
    res.type("text").status(200);
    res.send("havn't Login");
  }
});

app.get("/REM/currentuserid", (req, res) => {
  res.type("text").send(currentUserID.toString());
});

/**
 * This function is used to check the userInfo and show the hint message that whether
 * user login successfully or not
 */
app.post("/REM/login", async (req, res) => {
  let db = await getDBConnection();
  let email = req.body.Email;
  let password = req.body.Password;

  try {
    let user = await db.get("SELECT * FROM User WHERE Email = ?", [email]);
    if (user) {
      if (currentUserID === 0) {
        currentUserID = user.ID;
        if (password === user.Password) {
          res.type("text").send("Login successful!");
        } else {
          res.type("text").send("Invalid password");
        }
      } else {
        res.type("text").send("Already Logged In");
      }
    } else {
      res.type("text").send("Email not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

/**
 * This function is used to get certian watch that user wants to
 */
app.get("/watchdetails/:ID", async function (req, res) {
  try {
    let watchID = req.params.ID;
    let qry = `Select * FROM watches WHERE Type = "${watchID}"`;
    let db = await getDBConnection();
    let result = await db.get(qry);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * This function is used to create the new Account and put the user info into the
 * database, show the hint message if the create account part is failed
 */
app.post("/REM/createAccount", async (req, res) => {
  let db = await getDBConnection();
  let email = req.body.Email;
  let password = req.body.Password;
  let gender = req.body.Gender;
  let firstName = req.body.FirstName;
  let lastName = req.body.LastName;
  let month = req.body.Month;
  let day = req.body.Day;
  let year = req.body.Year;
  let checkEmailSql = 'SELECT Email FROM User WHERE Email = ?';
  try {
    let row = await db.get(checkEmailSql, [email]);
    if (row) {
      res.type("text").send("Email Already Exists");
    } else {
      let sql = 'INSERT INTO User (Email, Password, Gender, FirstName, ' +
        'LastName, DayOfBirth, MonthOfBirth, YearOfBirth) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      await db.run(sql, [email, password, gender, firstName, lastName, day, month, year]);
      res.type("text").send("Create Account Successful");
      sendMailProcess(email, firstName);
    }
  } catch (err) {
    res.type("text").send("Failed To Create Account");
  }
});

function sendMailProcess(email, firstName) {
  try {
    transporter.sendMail({
      from: '"Re:M" <rem375254@gmail.com>',
      to: email,
      subject: "Create Re:m Account Successfully",
      html:`
           <p>Dear ${firstName}:</p>
           <p>You have created the account successfully,</p>
           <p>You can use this account to explore more items and enjoy our services.</p>
           <p>Best regards,</p>
           <p>Re:M</p>
           `
    });
  }catch(err){
    console.error(err);
  }
}

/**
 * This function is used to get all the watches from the database that
 * this user put in his or her shopping cart
 */
app.get("/REM/getwatchesinfo", async (req, res) => {
  try {
    let db = await getDBConnection();
    let getwatchesSql = 'SELECT * FROM WATCHES JOIN Shoppingcart ON WATCHES.ID = ' +
      'Shoppingcart.WatchID JOIN User ON User.ID = Shoppingcart.UserID WHERE User.ID=?';
    let arrayOfWatches = await db.all(getwatchesSql, [currentUserID]);
    res.type("json").send(arrayOfWatches);
  } catch (err) {
    res.type("json").send({ "errMessage": err });
  }
});

/** This endpoint is used to remove the item from the shopping cart  */
app.post("/REM/removeitem", async (req, res) => {
  try {
    let db = await getDBConnection();
    let watchID = req.body.id;
    let removeSql = "DELETE FROM Shoppingcart WHERE watchID = ? AND UserID = ?;";
    await db.run(removeSql, [watchID, currentUserID]);
    res.type("text");
    res.send("Remove the Item successfully");
  } catch (err) {
    res.type("text").status(500);
    res.send("Failed to remove from the Shoppingcart");
  }
});

/** This endpoint is used to change the quantity of product wants to buy for user */
app.post("/REM/changequantity", async (req, res) => {
  try {
    let db = await getDBConnection();
    let watchID = req.body.id;
    let number = req.body.number;
    let removeSql = "UPDATE Shoppingcart SET Quantity = ? WHERE watchID = ? AND UserID = ?;";
    await db.run(removeSql, [number, watchID, currentUserID]);
    res.type("text");
    res.send("change the quantity successfully");
  } catch (err) {
    res.type("text").status(500);
    res.send("Failed to change the quantity");
  }
});

/** This endpoint is used to add the item into the shoppingcart */
app.post("/REM/addtoshoppingcart", async (req, res) => {
  try {
    res.type("text");
    let db = await getDBConnection();
    let productID = req.body.productID;
    let userID = req.body.userID;
    let watchID = await db.get("SELECT ID FROM watches WHERE Type = ?", productID);
    watchID = watchID.ID;
    let selectExisting = "SELECT * FROM Shoppingcart WHERE WatchID = ? AND UserID = ?";
    let doesWatchExist = await db.all(selectExisting, watchID, userID);
    if (doesWatchExist.length) {
      let update = "UPDATE Shoppingcart SET Quantity = Quantity + 1 WHERE WatchID = ? AND UserID = ?";
      await db.run(update, watchID, userID);
    } else {
      let selection = "INSERT INTO Shoppingcart (UserID, WatchID, Quantity) " +
        "VALUES (?, ?, ?)";
      await db.run(selection, userID, watchID, 1);
    }
    res.status(200).send("Successfully added to shopping cart");
  } catch (err) {
    res.type("text").status(500);
    res.send("Internal Server Error. Failed to add watch to shopping cart");
  }
});

/** This endpoint is used to remove the itrm form the shopping cart */
app.post("/REM/removefromshoppingcart", async (req, res) => {
  try {
    res.type("text");
    let db = await getDBConnection();
    let productID = req.body.productID;
    let userID = req.body.userID;
    userID = userID ? userID : "0";
    await db.run("DELETE FROM Shoppingcart WHERE userID = ? AND WatchID = ?", userID, productID);
    res.status(200);
    res.send("Successfully deleted from shopping cart");
  } catch (err) {
    res.type("text").status(500);
    res.send("Internal Server Error. Failed to add watch to shopping cart");
  }
});

/** This endpoint is used to get the recommendation of all the products */
app.post('/REM/recommendation', async (req, res) => {
  try {
    const input = req.body.input;
    const result = await findRecommendations(input);
    if (result[2].length === 0) {
      return res.status(404).send('No matching watches found');
    } else if (result[0]) {
      res.status(200);
      res.send(result[0].Type);
    } else {
      res.status(200);
      res.send(result[1]);
    }
  } catch (err) {
    res.status(500);
    res.send('Internal Server Error');
  }
});

/** This endpoint is used to buy the product from the shoppingcart */
app.post("/REM/buyproduct", async (req, res) => {
  res.type("text");
  try {
    let { cardHolderName, cardNumber } = req.body;
    let cardExist = await findCard(cardNumber, cardHolderName);
    if (await ifEnoughStorage()) {
      if (cardExist) {
        if (cardExist.UserName === cardHolderName) {
          let currentDeposit = cardExist.Deposit;
          let totalPrice = await getTotalPriceOfWatches();
          if (currentDeposit >= totalPrice) {
            await processAfterSuccess(currentDeposit - totalPrice, cardNumber);
            res.send("Proceed Successfully");
          } else {
            res.send("Do not have enough money");
          }
        } else {
          res.send("Wrong cardHolderName");
        }
      } else {
        res.send("NO credit card find");
      }
    } else {
      res.send("Not enough watches to supply");
    }
  } catch (err) {
    res.status(500).send("Failed to Proceed");
  }
});

/** This endpoint is used to get all the transaction history */
app.get("/REM/gettransaction", async (req, res) => {
  let db = await getDBConnection();
  try {
    let getTransactionSql = 'SELECT * FROM transactions JOIN WATCHES ON WATCHES.ID = ' +
      "transactions.WatchID WHERE transactions.UserID = ?";
    let arrayOfTranInfo = await db.all(getTransactionSql, currentUserID);
    res.type("json");
    res.send(arrayOfTranInfo);
  } catch (err) {
    res.type("json").status(500);
    res.send("failed to get the Transaction history");
  }
});

/** This endpoint is used to log out */
app.get("/REM/logout", (req, res) => {
  currentUserID = 0;
  res.type("text");
  res.send("Logout Successfully");
});

/**
 * Finds a card in the database based on the card number and card holder name.
 * @param {string} cardNumber - The card number to search for.
 * @param {string} cardHolderName - The name of the card holder.
 * @returns {Promise<Object|null>} - The card object if found, otherwise null.
 */
async function findCard(cardNumber, cardHolderName) {
  try {
    let db = await getDBConnection();
    let searchCardSql = "Select * From card Where CardNumber = ? AND UserName = ?";
    return await db.get(searchCardSql, [cardNumber, cardHolderName]);
  } catch (err) {
    console.error(err);
  }
}

/**
 * This function is used to process all the info when purchase successfully
 * @param {String} remainDeposit - the remaining deposit in dollars
 * @param {String} cardNumber - the card number for purchase
 */
async function processAfterSuccess(remainDeposit, cardNumber) {
  await deductMoney(remainDeposit, cardNumber);
  await deductQuantity();
  await addIntoTransaction();
  await emptyShoppingcart();
}

/** This endpoint is used to put the purchase info into the transaction database */
async function addIntoTransaction() {
  try {
    let db = await getDBConnection();
    let getwatchesSql = 'SELECT * FROM WATCHES JOIN Shoppingcart ON WATCHES.ID = ' +
      'Shoppingcart.WatchID JOIN User ON User.ID = Shoppingcart.UserID WHERE User.ID=?';
    let arrayOfWatches = await db.all(getwatchesSql, [currentUserID]);
    for (let watch of arrayOfWatches) {
      let WatchId = watch.WatchID;
      let comfirmationNumber = generateConfirmationNumber();
      let Userid = watch.UserID;
      let Quantity = watch.Quantity;
      let Img = watch.Img1;

      let addIntoTransactionSql = "INSERT INTO transactions " +
        "(confirmationNumber , UserID , WatchID , Quantity, Img) VALUES(?,?,?,?,?);";
      await db.run(addIntoTransactionSql, [comfirmationNumber, Userid, WatchId, Quantity, Img]);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * This function is used to generte the comfirmation code
 * @returns {String} Confirmation number of the purchase
 */
function generateConfirmationNumber() {
  return 'REM' + Math.floor(Math.random() * 1000000000);
}

/** This function is used to empty all the shoppingcart */
async function emptyShoppingcart() {
  let db = await getDBConnection();
  try {
    let emptyShoppingcartSql = "DELETE FROM Shoppingcart WHERE UserID = ? ";
    await db.run(emptyShoppingcartSql, [currentUserID]);
  } catch (err) {
    console.error(err);
  }
}

/**
 * This function is used to deduct the money in the card account
 * @param {String} remainDeposit - remaining deposit amount in dollars
 * @param {String} cardNumber - card number used for purchase
 */
async function deductMoney(remainDeposit, cardNumber) {
  try {
    let db = await getDBConnection();
    let deductMoneySql = "UPDATE card SET Deposit = ? WHERE CardNumber = ?";
    await db.run(deductMoneySql, [remainDeposit, cardNumber]);
  } catch (err) {
    console.error(err);
  }
}

/** This function is used to deduct the quantity of the watches in the storage */
async function deductQuantity() {
  try {
    let db = await getDBConnection();
    let getwatchesSql = 'SELECT * FROM WATCHES JOIN Shoppingcart ON WATCHES.ID = ' +
      'Shoppingcart.WatchID JOIN User ON User.ID = Shoppingcart.UserID WHERE User.ID=?';
    let arrayOfWatches = await db.all(getwatchesSql, [currentUserID]);
    for (let watch of arrayOfWatches) {
      let WatchId = watch.WatchID;
      let Storage = watch.Storage;
      let Quantity = watch.Quantity;
      let remain = Storage - Quantity;
      let deductQuantitySql = "UPDATE watches SET Storage = ? WHERE ID = ?";
      await db.run(deductQuantitySql, [remain, WatchId]);
    }
  } catch (err) {
    console.error(err);
  }
}

/** This function is used to check if it has the enough storage */
async function ifEnoughStorage() {
  let flag = true;
  let db = await getDBConnection();
  try {
    let getwatchesSql = 'SELECT * FROM WATCHES JOIN Shoppingcart ON WATCHES.ID = ' +
      'Shoppingcart.WatchID JOIN User ON User.ID = Shoppingcart.UserID WHERE User.ID=?';
    let arrayOfWatches = await db.all(getwatchesSql, [currentUserID]);
    for (let watch of arrayOfWatches) {
      if (watch.Quantity > watch.Storage) {
        flag = false;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return flag;
}

/** This function is used to get the total price of the selected watches */
async function getTotalPriceOfWatches() {
  let db = await getDBConnection();
  let totalPrice = 0;
  try {
    let getwatchesSql = 'SELECT * FROM WATCHES JOIN Shoppingcart ON WATCHES.ID = ' +
      'Shoppingcart.WatchID JOIN User ON User.ID = Shoppingcart.UserID WHERE User.ID=?';
    let arrayOfWatches = await db.all(getwatchesSql, [currentUserID]);
    for (let watch of arrayOfWatches) {
      totalPrice = totalPrice + watch.Price;
    }
  } catch (err) {
    console.error(err);
  }
  return totalPrice;
}

/**
 * This function is used to find the recommendation watch
 * @param {String} input - user input to search a watch
 * @return {Array} - array containing recommendation IDs for watches.
 */
async function findRecommendations(input) {
  try {
    const db = await getDBConnection();
    const watches = await db.all(
      `SELECT * FROM watches WHERE LOWER(name) LIKE ? OR category LIKE ?`,
      `%${input}%`,
      `${input}%`
    );
    let maxWatch = null;
    let maxCount = 0;
    for (const watch of watches) {
      const countResult = await db.get(
        `SELECT COUNT(*) as count FROM shoppingcart WHERE WatchID = ?`,
        watch.ID
      );
      if (countResult.count > maxCount) {
        maxWatch = watch;
        maxCount = countResult.count;
      }
    }
    await db.close();
    return [maxWatch, watches[0].Type, watches];
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'watch.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);