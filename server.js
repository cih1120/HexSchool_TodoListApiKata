const http = require("http");
const successHandle = require("./successHandle");
const errHandle = require("./errorHandle");
const editTodo = require("./editTodo")
const createTodo = require("./createTodo");
let todos = [];

const requestListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  const successRes = () => successHandle(res, todos);

  if (req.url === "/todos") {
    switch (req.method) {
      case "GET": {
        successRes();
        break;
      }
      case "DELETE": {
        todos.length = 0;
        successRes();
        break;
      }
      case "POST": {
        try {
          req.on("end", () => {
            createTodo(body)
              .then((todo) => {
                todos.push(todo);
                successRes();
              })
              .catch(() => errHandle(res))
          })
        }
        catch {
          errHandle(res);
        }
        break;
      }
      case "OPTIONS": {
        successRes();
        break;
      }
      default: {
        errHandle(res);
        break;
      }
    }
  } else if (req.url.startsWith("/todos/")) {
    const id = req.url.split("/").pop();
    const index = todos.findIndex(e => e.id === id);
    if (id && index !== -1) {
      switch (req.method) {
        case "DELETE": {
          todos.splice(index, 1);
          successRes();
          break;
        }
        case "PATCH": {
          try {
            req.on("end", () => {
              editTodo(todos,index,body)
              .then(()=>successRes())
              .catch(()=>errHandle(res));
            })
          }
          catch {
            errHandle(res);
          }
          break;
        }
        default: {
          errHandle(res);
          break;
        }
      }
    } else {
      errHandle(res);
    }
  } else {
    errHandle(res);
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);