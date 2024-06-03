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
  "ID": 123,
  "Name": "Luxury Watch",
  "Brand": "Brand A",
  "Price": 299.99,
  "Description": "A luxurious watch with premium features.",
  "Image": "luxury-watch.png"
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
    "ID": 1,
    "Name": "Sport Watch",
    "Brand": "Brand B",
    "Price": 149.99,
    "Quantity": 2,
    "Image": "sport-watch.png"
  },
  {
    "ID": 2,
    "Name": "Classic Watch",
    "Brand": "Brand C",
    "Price": 199.99,
    "Quantity": 1,
    "Image": "classic-watch.png"
  }
]

Error Handling:
500 Server Error when there was an error retrieving the watches info.