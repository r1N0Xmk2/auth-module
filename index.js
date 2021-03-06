var util = require('util')
var _ = require('lodash');
var request = require('request');
var async = require('async');
var Promise = require('promise');
// callback to promise
var promisify = function promisify(fn, receiver) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      fn.apply(receiver, [].concat(args, [function (err, res) {
        return err ? reject(err) : resolve(res);
      }]));
    });
  };
};

function init (options) {
    var model = {};
    // Defined Auth-node Functions to Create
    var ownedFuns = [
        {
            name: 'emailRegister',
            url: '/emailRegister',
            method: 'POST',
            token: true
        }, {
            name: 'forgetPassword',
            url: '/forgetPassword',
            method: 'POST',
            token: true
        }, {
            name: 'createUserByEmail',
            url: '/createUserByEmail',
            method: 'POST',
            token: true
        }, {
            name: 'getUserByEmail',
            url: '/getUserByEmail',
            method: 'POST',
            token: true
        }, {
            name: 'getUserByAccount',
            url: '/getUserByAccount',
            method: 'POST',
            token: true
        }, {
            name: 'getUserByOpenId',
            url: '/getUserByOpenId/:openId',
            method: 'GET',
            token: true
        }, {
            name: 'authMD5',
            url: '/authMD5',
            method: 'POST',
            token: true
        }, {
            name: 'getUserByPhoneNum',
            url: '/getUserByPhoneNum',
            method: 'POST',
            token: true
        }, {
            name: 'signInByPhoneNum',
            url: '/signInByPhoneNum',
            method: 'POST',
            token: true
        }, {
            name: 'getCaptcha',
            url: '/getCaptcha',
            method: 'GET',
            token: true
        }, {
            name: 'checkPhoneNum',
            url: '/checkPhoneNum',
            method: 'POST',
            token: true
        }, {
            name: 'clearPhoneNum',
            url: '/clearPhoneNum',
            method: 'POST',
            token: true
        }, {
            name: 'sendSMS',
            url: '/sendSMS',
            method: 'POST',
            token: true
        }, {
            name: 'verifySMSCode',
            url: '/verifySMSCode',
            method: 'POST',
            token: true
        }, {
            name: 'registerUserByPhone',
            url: '/registerUserByPhone',
            method: 'POST',
            token: true
        },{
            name: 'emailBind',
            url: '/emailBind',
            method: 'POST',
            token: true
        },{
            name: 'updateUserName',
            url: '/updateUserName',
            method: 'POST',
            token: true
        },{
            name: 'emailToUpdateTel',
            url: '/emailToUpdateTel',
            method: 'POST',
            token: true
        },{
            name: 'sendSMSAuth',
            url: '/sendSMSAuth',
            method: 'POST',
            token: true
        },{
            name: 'verifySMS',
            url: '/verifySMS',
            method: 'POST',
            token: true
        },{
            name: 'checkPhoneAgain',
            url: '/checkPhoneAgain',
            method: 'POST',
            token: true
        },{
            name: 'updatePassword',
            url: '/updatePassword',
            method: 'POST',
            token: true
        },{
            //修改个人信息的手机号和邮箱
            name: 'editEmailAndPhone',
            url: '/editEmailAndPhone',
            method: 'POST',
            token: true
        },{
            //修改密码
            name: 'restPassword',
            url: '/restPassword',
            method: 'POST',
            token: true
        },{
            name:'emailToUpdateEmail',
            url:'/emailToUpdateEmail',
            method:'POST',
            token:true
        },{
            name:'checkAccount',
            url:'/checkAccount',
            method:'POST',
            token:true
        },{
            name:'signInByEmail',
            url:'/signInByEmail',
            method:'POST',
            token:true
        },{
            name:'appCheckAccount',
            url:'/appCheckAccount',
            method:'POST',
            token:false
        },{
            name:'appForgetPassword',
            url:'/appForgetPassword',
            method:'POST',
            token:false
        },{
            name:'checkEmail',
            url:'/checkEmail',
            method:'POST',
            token:true
        }
    ];
    if (options.funs && options.funs.length ) {
        ownedFuns = ownedFuns.concat(options.funs)
    }
    // init necessary fields
    var necessaryFields = ['agentName', 'agentKey', 'authAddr'];
    options.refresh = options.refresh || 5;
    if (necessaryFields.every(function (field) {
        return _.has(options, field);
    })) {
        model.options = options;
        model.getToken = function (params, callback) {
            console.log('get token');
            request.post({
                url: model.options.authAddr+'/getToken',
                json: {
                    agentName: params && params.agentName || model.options.agentName,
                    agentKey: params && params.agentKey || model.options.agentKey
                }
            }, function (err, res, body) {
                if (err) {
                    callback(err);
                } else if (body && body.res > 0){
                    callback(null, body);
                } else {
                    callback(body);
                }
            });
        };
        model.updateToken = function (callback) {
            if (!model.token) {
                return model.getToken({}, callback);
            } else {
                request.get({
                    url: model.options.authAddr+'/updateToken',
                    headers: {
                        'x-access-token': model.token
                    },
                    json: {
                        agentName: model.options.agentName,
                        agentKey: model.options.agentKey
                    }
                }, function (err, res, body) {
                    if (err) {
                        callback(err);
                    } else if (body && body.res > 0){
                        callback(null, body);
                    } else {
                        callback(body);
                    }
                });
            }
        };
        async.whilst(function () {
            return !model.token
        }, function (callback) {
            async.retry({times: 5, interval: 1 * 60 * 1000}, function (cb, ret) {
                model.getToken({}, cb);
            }, function (err, res) {
                if (err) {
                    console.error('init get Token Fail');
                } else {
                    model.token = res.token;
                    console.log('token get', new Date(), model.token);
                }
                callback();
            });
        }, function (err) {
        })
        ownedFuns.forEach(function (fun) {
            //console.log('create function', fun.name);
            model[fun.name] = function (params, cb) {
                async.auto({
                    'waitToken': function (callback) {
                        async.retry({times: 5, interval: 5000}, function (cbRetry, ret) {
                            if(model.token) {
                                cbRetry();
                            } else {
                                console.error('Get Token From Memory Error');
                                cbRetry('Get Token Error');
                            }
                        }, callback);
                    },
                    'request': ['waitToken', function (ret, callback) {
                        var reqOptions = {};
                        var lackField = false;
                        var paramsClone = _.cloneDeep(params, true);
                        var url = _.clone(fun.url);
                        if (~ fun.url.indexOf(':')) {
                            url = url.replace(/:([A-Za-z_\$][A-Za-z0-9_\$]*)/g, function (match, field) {
                                if (_.has(paramsClone, field)) {
                                    paramsClone = _.omit(paramsClone, field);
                                    //delete params[field]
                                    return params[field];
                                } else {
                                    lackField = true;
                                    return 'undefined';
                                }
                            });
                            if (lackField) {
                                 return callback('lack necessary Params');
                            }
                        }
                        reqOptions.url = model.options.authAddr + url;
                        reqOptions.method = fun.method.toUpperCase();
                        if (fun.token) {
                            reqOptions.headers = {
                                'x-access-token': model.token
                            };
                        }
                        if (fun.method.toUpperCase() == 'GET') {
                            reqOptions.qs = paramsClone;
                        } else {
                            reqOptions.json = paramsClone;
                        }
                        console.error('request auth node options', reqOptions)
                        request(reqOptions, function (err, res, body) {
                            if (err) {
                                callback(err);
                            } else if (body){
                                try{
                                    if (typeof body == 'string')
                                        body=JSON.parse(body);
                                }catch(e){
                                    console.error('Auth module Parse result Error', e,body)
                                    return callback('Auth module Parse result Error')
                                }
                                if (body.res > 0) {
                                    callback(null, body);
                                } else {
                                    callback(body);
                                }
                            } else {
                                callback('Request return not comply with standard');
                            }
                        });
                    }]
                }, function (err, result) {
                    cb(err, result.request);
                });
            };
        });
        setInterval(function(){
            async.whilst(function () {
                return true;
            }, function (callback) {
                async.retry({times: 10, interval: 1 * 60 * 1000}, function (cbRetry, ret) {
                    model.updateToken(cbRetry);
                }, function (err, res) {
                    if (err) {
                        console.error('Update Token Fail');
                        callback();
                    } else {
                        model.token = res.token;
                        callback('update success');
                    }
                });
            }, function (err) {
                console.log(err, model.token);
            })
        }, options.refresh * 60 * 60 * 1000);
    } else {
        console.error('Missing required parameters');
    }

    model.changeOptions=function (opt) {
        model.options = opt;
        model.updateToken(function (err, ret) {
            if (err) console.log('updateFail');
        })
    }

    // Make Promise Functions
    Object.getOwnPropertyNames(model).filter(function (funName) {
        return _.isFunction(model[funName]);
    }).forEach(function (funName) {
         model[funName+'Promise'] = promisify(model[funName], model);
         //console.log('create function', funName+'Promise')
    });
    return model;
}
module.exports = {
    init: init
};
