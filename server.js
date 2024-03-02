const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errHandle = require("./errorHandle");
const todos = []; //讓todos先放在node.js的記憶體

const requestListener = (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With", // Headers支持哪些資訊做操作
    "Access-Control-Allow-Origin": "*", // 讓跨網域的IP造訪
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE", // 讓跨網域IP可以使用這些方法
    "Content-Type": "application/json",
  };

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          throw Error();
        }
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((e) => e.id === id);
    try {
      if (index !== -1) {
        todos.splice(index, 1);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: todos,
          })
        );
        res.end();
      } else {
        throw Error();
      }
    } catch (error) {
      errHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        const todo = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((e) => e.id === id);
        if(todo&&index!==-1){
          todos[index].title = todo;
        }else{
          throw Error();
        }
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: todos,
          })
        );
        res.end();
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
