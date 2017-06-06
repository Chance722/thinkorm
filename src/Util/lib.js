/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2016 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    16/7/26
 */

const _interopSafeRequire = function (obj) {
    return (obj && obj.__esModule && obj.default) ? obj.default : obj;
};
const co = require('co');
const thinklib = require('think_lib');

var lib = thinklib;

/**
 * 生成一个defer对象
 * 
 * @returns {*} 
 */
lib.getDefer = function () {
    let defer = {};
    defer.promise = new Promise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
};

/**
 * 大写首字符
 * 
 * @param {string} name 
 * @returns {string} 
 */
lib.ucFirst = function (name) {
    name = (name || '') + '';
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
};

/**
 * 字符串命名风格转换
 * @param  {[type]} name [description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
lib.parseName = function (name) {
    name = name.trim();
    if (!name) {
        return name;
    }
    //首字母如果是大写，不转义为_x
    name = name[0].toLowerCase() + name.substr(1);
    return name.replace(/[A-Z]/g, function (a) {
        return '_' + a.toLowerCase();
    });
};

/**
 * hash
 * 
 * @param {string} str 
 * @returns {string} 
 */
lib.hash = function (str) {
    let _hash = 5381;
    let I64BIT_TABLE =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    let i = str.length - 1;
    if (typeof str === 'string') {
        for (; i > -1; i--) {
            _hash += (_hash << 5) + str.charCodeAt(i);
        }
    } else {
        for (; i > -1; i--) {
            _hash += (_hash << 5) + str[i];
        }
    }
    let value = _hash & 0x7FFFFFFF;
    let retValue = '';
    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    } while (value >>= 6);
    return retValue;
};

/**
 * console format
 * 
 * @param {any} msg 
 * @param {any} type 
 * @param {any} showTime 
 * @param {any} debug 
 */
lib.log = function (msg, type, showTime, debug = true) {
    let dateTime = `[${lib.datetime('', '')}] `;
    let message = msg;
    if (lib.isError(msg)) {
        type = 'ERROR';
        message = msg.stack;
        ('prototype' in console.error) && console.error(msg.stack);
    } else if (type === 'ERROR') {
        type = 'ERROR';
        if (!lib.isString(msg)) {
            message = JSON.stringify(msg);
        }
        ('prototype' in console.error) && console.error(message);
    } else if (type === 'WARNING') {
        type = 'WARNING';
        if (!lib.isString(msg)) {
            message = JSON.stringify(msg);
        }
        ('prototype' in console.warn) && console.warn(message);
    } else {
        if (!lib.isString(msg)) {
            message = JSON.stringify(msg);
        }
        if (lib.isNumber(showTime)) {
            let _time = Date.now() - showTime;
            message += '  ' + `${_time}ms`;
        }
        type = type || 'INFO';
        //判断console.info是否被重写
        ('prototype' in console.info) && console.info(message);
    }
    (debug || type === 'THINK') && console.log(`${dateTime}[${type}] ${message}`);
};

/**
 * 执行等待，避免一个耗时的操作多次被执行。 callback 需要返回一个 Promise 。
 * @param  {String}   key      []
 * @param  {Function} callback []
 * @return {Promise}            []
 */
lib.await = function (key, callback) {
    if(!ORM.instances.await){
        ORM.instances.await = new (_interopSafeRequire(require('./await.js')))();
    }
    return (ORM.instances.await).run(key, callback);
};

/**
 * alias co module
 * @type {Object}
 */
lib.thinkCo = function (obj) {
    //optimize invoke co package
    if (obj && typeof obj.next === 'function') {
        return co(obj);
    }
    return Promise.resolve(obj);
};

/**
 * 加载文件
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
lib.thinkRequire = function (file) {
    try {
        var obj = require(file);
        obj = _interopSafeRequire(obj);
        if (lib.isFunction(obj)) {
            obj.prototype.__filename = file;
        }
        return obj;
    } catch (err) {
        return null;
    }
};

module.exports = lib;