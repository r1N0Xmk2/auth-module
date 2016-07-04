#安装
`npm install r1N0Xmk2/auth-module --save` 或 `svn:CloudMeeting`
#使用方法
建立`auth-model.js`文件
```javascript
var auth = require('auth-module');
//初始化 auth-model
var authModel = auth.init({
    agentName: 'test', //auth模块agentName
    agentKey: 'test', //auth模块agentKey
    authAddr: 'http://localhost:4003', //auth-node模块地址
    refresh: 5 //重新获取token时间间隔 默认值：5 ,单位小时
});
module.exports = authModel;
```
在`app.js`中引入之前建立的`auth-model.js`文件
```
var auth = require('path/to/auth-model.js');
```

router中的例子
```javascript
router.post('/getToken', function (req, res, next) {
  // Promise方法
  authModel.getTokenPromise(req.body).then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.getToken(req.body, function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
router.get('/updateToken', function (req, res, next) {
  // Promise方法
  authModel.updateTokenPromise().then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.updateToken(function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
router.post('/emailRegister', function (req, res, next) {
  // Promise方法
  authModel.emailRegisterPromise(req.body).then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.emailRegister(req.body, function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
router.post('/forgetPassword', function (req, res, next) {
  // Promise方法
  authModel.forgetPasswordPromise(req.body).then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.forgetPassword(req.body, function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
router.post('/getUserByAccount', function (req, res, next) {
  // Promise方法
  authModel.getUserByAccountPromise(req.body).then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.getUserByAccount(req.body, function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
router.get('/getUserByOpenId/:openId', function (req, res, next) {
  // Promise方法
  authModel.getUserByOpenIdPromise(_.merge(req.body, req.query, req.params)).then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.getUserByOpenId(_.merge(req.body, req.query, req.params), function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
router.post('/authMD5', function (req, res, next) {
  // Promise方法
  authModel.authMD5Promise(req.body).then(function (ret) {
    res.send(200, ret);
  }, function (err){
    res.send(200, err);
  })
  //callback方法
  //authModel.authMD5(req.body, function (err, ret) {
    //if (err)  {
      //res.send(200, err)
    //} else {
      //res.send(200, ret)
    //}
  //});
});
```
