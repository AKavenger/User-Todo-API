//Requiring all modules
const express = require("express");
const https = require("https");

const app = express();

//API to return all the objects with all the fields returned by the third party API except the userId field.
app.get("/todos", function(req, res) {

  const url = "https://jsonplaceholder.typicode.com/todos";

  //Making HTTP GET request to todos API
  https.get(url, function(response) {
    console.log(response.statusCode);
    let todoDetails = '';

    response.on("data", function(data) {
      todoDetails += data;
    });

    //UserId key which needs to be excluded
    const key = "userId";

    response.on("end", function() {

      const jsonTodo = JSON.parse(todoDetails);

      //Excluding each of userId key from each JSON object by undefining their values.
      jsonTodo.forEach(function(todo) {

        todo.userId = undefined;
        todo = JSON.parse(JSON.stringify(todo));

      })

      //Sending JSON response
      res.json(jsonTodo);
    });
  });
})

//API to return user information along with todo items where userid matches with the one provided in the URL
app.route("/user/:userId")

  .get(function(req, res) {

    //Creating Express route parameter object
    const userId = req.params.userId;

    const url = "https://jsonplaceholder.typicode.com/users/" + userId;

    //Making HTTP GET Request for user details
    https.get(url, function(response) {

      console.log(response.statusCode);
      let details = '';
      let todoDetails = '';

      response.on("data", function(data) {
        details += data;
      });

      //Creating URL With specific userId
      const urlTodos = "https://jsonplaceholder.typicode.com/todos/?userId=" + userId;

      //Making HTTP GET Request for user with specific userId
      https.get(urlTodos, function(todoResponse) {

        todoResponse.on("data", function(todo) {
          todoDetails += todo;
        });

        todoResponse.on("end", function() {

          const jsonTodo = JSON.parse(todoDetails);
          const jsonDetails = JSON.parse(details);

          //Adding user Todos with his/her details
          jsonDetails["todos"] = jsonTodo;

          //Sending JSON Response
          res.json(jsonDetails);
        });
      });

    })
  })

//For Local server at port 3000
app.listen(3000, function() {
  console.log("Server is running on Port 3000");
})
