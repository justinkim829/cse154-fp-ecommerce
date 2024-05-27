'use strict';

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

const sqlite = require('sqlite');

const multer = require("multer");
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(multer().none());

let currentUserID = 14;

app.get("/REM/checkiflogin", (req, res) => {
  if (currentUserID !== 0) {
    res.type("text").status(200).send("Already Login");
  } else {
    res.type("text").status(200).send("havn't Login");
  }
});

app.get("/REM/currentuserid", async (req, res) => {
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
    }
    else {
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
    }
  } catch (err) {
    res.type("text").send("Failed To Create Account");
  }
});

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

app.post("/REM/removeitem", async (req, res) => {
  try {
    let db = await getDBConnection();
    let watchID = req.body.id;
    let removeSql = "DELETE FROM Shoppingcart WHERE watchID = ? AND UserID = ?;"
    await db.run(removeSql, [watchID, currentUserID]);
    res.type("text").send("Remove the Item successfully");
  } catch (err) {
    res.type("text").status(500).send("Failed to remove from the Shoppingcart")
  }
});

app.post("/REM/changequantity", async (req, res) => {
  try {
    let db = await getDBConnection();
    let watchID = req.body.id;
    let number = req.body.number;
    let removeSql = "UPDATE Shoppingcart SET Quantity = ? WHERE watchID = ? AND UserID = ?;"
    await db.run(removeSql, [number, watchID, currentUserID]);
    res.type("text").send("change the quantity successfully");
  } catch (err) {
    res.type("text").status(500).send("Failed to change the quantity");
  }
});

app.post("/REM/addtoshoppingcart", async (req, res) => {
  try {
    res.type("text");
    let db = await getDBConnection();
    let productID = req.body.productID;
    let userID = req.body.userID;
    let watchID = await db.get("SELECT ID FROM watches WHERE Type = ?", productID);
    watchID = watchID.ID;
    let selection = "INSERT INTO Shoppingcart (UserID, WatchID, Quantity) " +
      "VALUES (?, ?, ?)";
    await db.run(selection, userID, watchID, 1);
    res.status(200).send("Successfully added to shopping cart");
  } catch (err) {
    res.type("text").status(500).send("Internal Server Error. Failed to add watch to shopping cart");
  }
});

app.post("/REM/removefromshoppingcart", async (req, res) => {
  try {
    res.type("text");
    let db = await getDBConnection();
    let productID = req.body.productID;
    let userID = req.body.userID;
    userID = userID ? userID : "0";
    await db.run("DELETE FROM Shoppingcart WHERE userID = ? AND WatchID = ?", userID, productID);
    res.status(200).send("Successfully deleted from shopping cart");
  } catch (err) {
    res.type("text").status(500).send("Internal Server Error. Failed to add watch to shopping cart");
  }
});

app.post('/REM/recommendation', async (req, res) => {
  try {
    const input = req.body.input;
    const db = await getDBConnection();

    // Find all watches matching the input
    const watches = await db.all(
      `SELECT * FROM watches WHERE LOWER(name) LIKE ? OR category LIKE ?`,
      `%${input}%`,
      `${input}%`
    );

    if (watches.length === 0) {
      return res.status(404).send('No matching watches found');
    }

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

    if (maxWatch) {
      res.status(200).send(maxWatch.Type);
    } else {
      res.status(200).send(watches[0].Type);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/REM/buyproduct", async (req, res) => {
  try {
    let db = await getDBConnection();
    let { cardHolderName, cardNumber } = req.body
    let searchCardSql = "Select * From card Where CardNumber = ? AND UserName = ?";
    let cardExist = await db.get(searchCardSql, [cardNumber, cardHolderName]);
    if (await ifEnoughStorage()) {
      if (cardExist) {
        if (cardExist.UserName === cardHolderName) {
          let currentDeposit = cardExist.Deposit;
          let totalPrice = await getTotalPriceOfWatches();
          if (currentDeposit >= totalPrice) {
            let remainDeposit = currentDeposit - totalPrice;
            await processAfterSuccess(remainDeposit, cardNumber);
            res.type("text").send("Proceed Successfully");
          } else {
            res.type("text").send("Do not have enough money");
          }
        } else {
          res.type("text").send("Wrong cardHolderName");
        }
      } else {
        res.type("text").send("NO credit card find");
      }
    } else {
      res.type("text").send("Not enough watches to supply");
    }
  } catch (err) {
    res.type("text").status(500).send("Failed to Proceed");
  }
});

async function processAfterSuccess(remainDeposit, cardNumber) {
  await deductMoney(remainDeposit, cardNumber);
  await deductQuantity();
  await addIntoTransaction();
  await emptyShoppingcart();
}

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

function generateConfirmationNumber() {
  return 'REM' + Math.floor(Math.random() * 1000000000);
}


async function emptyShoppingcart() {
  let db = await getDBConnection();
  try {
    let emptyShoppingcartSql = "DELETE FROM Shoppingcart WHERE UserID = ? ";
    await db.run(emptyShoppingcartSql, [currentUserID]);
  } catch (err) {
    console.error(err);
  }
}

async function deductMoney(remainDeposit, cardNumber) {
  try {
    let db = await getDBConnection();
    let deductMoneySql = "UPDATE card SET Deposit = ? WHERE CardNumber = ?";
    await db.run(deductMoneySql, [remainDeposit, cardNumber]);
  } catch (err) {
    console.error(err);
  }
}

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
      let remain = Storage - Quantity
      let deductQuantitySql = "UPDATE watches SET Storage = ? WHERE ID = ?";
      await db.run(deductQuantitySql, [remain, WatchId]);
    }
  } catch (err) {
    console.error(err);
  }
}

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

app.get("/REM/gettransaction", async (req, res) => {
  let db = await getDBConnection();
  try {
    let getTransactionSql = 'SELECT * FROM transactions JOIN WATCHES ON WATCHES.ID = ' +
      "transactions.WatchID WHERE transactions.UserID = ?";
    let arrayOfTranInfo = await db.all(getTransactionSql, currentUserID);
    res.type("json").send(arrayOfTranInfo);

  } catch (err) {
    res.type("json").status(500).send("failed to get the Transaction history")
  }
})

app.get("/REM/logout", async (req, res) => {
  currentUserID = 0;
  res.type("text").send("Logout Successfully");
})




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