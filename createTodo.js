const {v4:uuidv4} = require("uuid");

async function createTodo( body){
    const title = JSON.parse(body).title;
    console.log(title);
    if(title){
      return {
        title: title,
        id: uuidv4(),
      }
    }
      throw Error();  
}

module.exports = createTodo;