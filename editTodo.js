async function editTodo(todos,index,body){
  const title = JSON.parse(body).title;
  console.log(title)
  if(title){
    todos[index].title = title;
  }else{
    throw Error();
  }
}

module.exports = editTodo;