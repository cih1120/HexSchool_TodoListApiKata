function errorHandles(res){
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With', // Headers支持哪些資訊做操作
    'Access-Control-Allow-Origin': '*', // 讓跨網域的IP造訪
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE', // 讓跨網域IP可以使用這些方法
   'Content-Type': 'application/json'
 }
  res.writeHead(400,headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": "欄位未填寫正確，或無此 todo id",
  }));
  res.end();
}

module.exports = errorHandles;