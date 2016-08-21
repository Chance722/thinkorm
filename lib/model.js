'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base2 = require('./base');

var _base3 = _interopRequireDefault(_base2);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _valid = require('./Util/valid');

var _valid2 = _interopRequireDefault(_valid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseType = function parseType(type) {
    type = type || 'HASONE';
    if (type == 1) {
        type = 'HASONE';
    } else if (type == 2) {
        type = 'HASMANY';
    } else if (type == 3) {
        type = 'MANYTOMANY';
    } else {
        type = (type + '').toUpperCase();
    }
    return type;
}; /**
    *
    * @author     richen
    * @copyright  Copyright (c) 2016 - <richenlin(at)gmail.com>
    * @license    MIT
    * @version    16/7/25
    */

var _class = function (_base) {
    (0, _inherits3.default)(_class, _base);

    function _class() {
        (0, _classCallCheck3.default)(this, _class);
        return (0, _possibleConstructorReturn3.default)(this, _base.apply(this, arguments));
    }

    /**
     * init
     * @param name
     * @param config
     */
    _class.prototype.init = function init(name) {
        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        // 主键名称
        this.pk = 'id';
        // 数据库配置信息
        this.config = null;
        // 模型名称(不能被重载)
        this.modelName = '';
        // 数据表名(不能被重载)
        this.tableName = '';
        // 是否自动迁移(默认安全模式)
        this.safe = true;
        // 数据表字段信息
        this.fields = {};
        // 数据验证
        this.validations = {};
        // 关联关系
        this.relation = {};
        // 参数
        this._options = {};
        // 数据
        this._data = {};
        // 关联模型数据
        this._relationData = {};
        // 验证规则
        this._valid = _valid2.default;

        // 配置
        this.config = {
            db_type: config.db_type,
            db_host: config.db_host,
            db_port: config.db_port,
            db_name: config.db_name,
            db_user: config.db_user,
            db_pwd: config.db_pwd,
            db_prefix: config.db_prefix,
            db_charset: config.db_charset,
            db_ext_config: config.db_ext_config
        };
        // 模型名
        if (name) {
            this.modelName = name;
        } else {
            this.modelName = this.getModelName();
        }
        // 表名
        this.tableName = this.getTableName();
        // 安全模式
        this.safe = this.config.db_ext_config.safe === true;
        // colleciton key
        this.clsKey = config.db_type + '_' + config.db_host + '_' + config.db_port + '_' + config.db_name;
        // collection instance
        this.instances = null;
    };

    /**
     *
     * @param args
     * @returns {*}
     */


    _class.load = function load() {
        return _schema2.default.setCollection.apply(_schema2.default, arguments);
    };

    /**
     * 初始化模型
     */


    _class.prototype.initModel = function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            if (ORM.collections[this.clsKey]) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', this.error('Collections is undefined, please run setCollection before.'));

                        case 3:
                            if (ORM.collections[this.clsKey][this.modelName]) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt('return', this.error('Collections ' + this.modelName + ' is undefined.'));

                        case 5:
                            this.instances = ORM.connections[this.clsKey];

                            if (this.instances) {
                                _context.next = 10;
                                break;
                            }

                            _context.next = 9;
                            return _schema2.default.setConnection(this.config);

                        case 9:
                            this.instances = _context.sent;

                        case 10:
                            return _context.abrupt('return', this.instances);

                        case 13:
                            _context.prev = 13;
                            _context.t0 = _context['catch'](0);
                            return _context.abrupt('return', this.error(_context.t0));

                        case 16:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 13]]);
        }));

        function initModel() {
            return _ref.apply(this, arguments);
        }

        return initModel;
    }();

    /**
     * 错误封装
     * @param err
     */


    _class.prototype.error = function error(err) {
        if (err) {
            var msg = err;
            if (!ORM.isError(msg)) {
                if (!ORM.isString(msg)) {
                    msg = (0, _stringify2.default)(msg);
                }
                msg = new Error(msg);
            }
            var stack = msg.message ? msg.message.toLowerCase() : '';
            // connection error
            if (~stack.indexOf('connect') || ~stack.indexOf('refused')) {
                this.instances && this.instances.close && this.instances.close();
            }
            ORM.log(msg);
        }
        return ORM.getDefer().promise;
    };

    /**
     * 数据迁移
     */


    _class.prototype.migrate = function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
            var model;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return this.initModel();

                        case 3:
                            model = _context2.sent;
                            return _context2.abrupt('return', model.migrate(ORM.collections[this.clsKey]));

                        case 7:
                            _context2.prev = 7;
                            _context2.t0 = _context2['catch'](0);
                            return _context2.abrupt('return', this.error(_context2.t0));

                        case 10:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 7]]);
        }));

        function migrate() {
            return _ref2.apply(this, arguments);
        }

        return migrate;
    }();

    /**
     * 事务开始
     */


    _class.prototype.startTrans = function () {
        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
            var model;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return this.initModel();

                        case 3:
                            model = _context3.sent;
                            return _context3.abrupt('return', model.startTrans());

                        case 7:
                            _context3.prev = 7;
                            _context3.t0 = _context3['catch'](0);
                            return _context3.abrupt('return', this.error(_context3.t0));

                        case 10:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 7]]);
        }));

        function startTrans() {
            return _ref3.apply(this, arguments);
        }

        return startTrans;
    }();

    /**
     * 事务提交
     */


    _class.prototype.commit = function () {
        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
            var model;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            _context4.next = 3;
                            return this.initModel();

                        case 3:
                            model = _context4.sent;
                            return _context4.abrupt('return', model.commit());

                        case 7:
                            _context4.prev = 7;
                            _context4.t0 = _context4['catch'](0);
                            return _context4.abrupt('return', this.error(_context4.t0));

                        case 10:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[0, 7]]);
        }));

        function commit() {
            return _ref4.apply(this, arguments);
        }

        return commit;
    }();

    /**
     * 事务回滚
     */


    _class.prototype.rollback = function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
            var model;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            _context5.next = 3;
                            return this.initModel();

                        case 3:
                            model = _context5.sent;
                            return _context5.abrupt('return', model.rollback());

                        case 7:
                            _context5.prev = 7;
                            _context5.t0 = _context5['catch'](0);
                            return _context5.abrupt('return', this.error(_context5.t0));

                        case 10:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this, [[0, 7]]);
        }));

        function rollback() {
            return _ref5.apply(this, arguments);
        }

        return rollback;
    }();

    /**
     * 获取表名
     * @return {[type]} [description]
     */


    _class.prototype.getTableName = function getTableName() {
        try {
            if (!this.tableName) {
                var tableName = this.config.db_prefix || '';
                tableName += ORM.parseName(this.getModelName());
                this.tableName = tableName.toLowerCase();
            }
            return this.tableName;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 获取模型名
     * @access public
     * @return string
     */


    _class.prototype.getModelName = function getModelName(name) {
        try {
            if (!this.modelName) {
                var filename = this.__filename || __filename;
                var last = filename.lastIndexOf('/');
                this.modelName = filename.substr(last + 1, filename.length - last - 4);
            }
            return this.modelName;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 获取主键名称
     * @access public
     * @return string
     */


    _class.prototype.getPk = function getPk() {
        try {
            if (!ORM.isEmpty(this.fields)) {
                for (var v in this.fields) {
                    if (this.fields[v].hasOwnProperty('primaryKey') && this.fields[v].primaryKey === true) {
                        this.pk = v;
                    }
                }
            } else {
                if (this.config.db_type === 'mongo') {
                    this.pk = '_id';
                }
            }
            return this.pk;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 根据查询结果生成分页
     * @return {[type]} [description]
     */


    _class.prototype.page = function page(_page, listRows) {
        try {
            if (_page === undefined) {
                return this;
            }
            this._options.page = listRows === undefined ? _page : _page + ',' + listRows;
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 关联操作
     * @param table
     * @param field
     */


    _class.prototype.rel = function rel() {
        var _this2 = this;

        var table = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        var field = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        try {
            if (table) {
                (function () {
                    //获取关联关系
                    var rels = _schema2.default.getRelation(_this2.modelName, _this2.config);
                    if (table === true) {
                        _this2._options.rel = rels;
                    } else {
                        if (ORM.isString(table)) {
                            table = table.replace(/ +/g, '').split(',');
                        }
                        if (ORM.isArray(table)) {
                            _this2._options.rel = {};
                            table.forEach(function (item) {
                                rels[item] && (_this2._options.rel[item] = rels[item]);
                            });
                        }
                    }
                    //关联表字段
                    if (!ORM.isEmpty(field)) {
                        for (var n in field) {
                            if (n in _this2._options.rel) {
                                _this2._options.rel[n]['field'] = field[n];
                            }
                        }
                    }
                })();
            }
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 指定查询数量
     * @param  {[type]} offset [description]
     * @param  {[type]} length [description]
     * @return {[type]}        [description]
     */


    _class.prototype.limit = function limit(offset, length) {
        try {
            if (offset === undefined) {
                return this;
            }
            if (ORM.isArray(offset)) {
                length = offset[1] || length;
                offset = offset[0];
            } else if (length === undefined) {
                length = offset;
                offset = 0;
            }
            offset = Math.max(parseInt(offset) || 0, 0);
            if (length) {
                length = Math.max(parseInt(length) || 0, 0);
            }
            this._options.limit = [offset, length];
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 排序
     * @param order
     * @returns {exports}
     */


    _class.prototype.order = function order(_order) {
        try {
            if (_order === undefined) {
                return this;
            }
            if (ORM.isObject(_order)) {
                this._options.order = _order;
            } else if (ORM.isString(_order)) {
                var strToObj = function strToObj(_str) {
                    return _str.replace(/^ +/, '').replace(/ +$/, '').replace(/( +, +)+|( +,)+|(, +)/, ',').replace(/ +/g, '-').replace(/,-/g, ',').replace(/-/g, ':').replace(/^/, '{"').replace(/$/, '"}').replace(/:/g, '":"').replace(/,/g, '","');
                };
                this._options.order = JSON.parse(strToObj(_order));
            }
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 要查询的字段
     * @param  {[type]} field   [description]
     * @return {[type]}         [description]
     */


    _class.prototype.field = function field(_field) {
        try {
            if (ORM.isEmpty(_field)) {
                return this;
            }
            if (ORM.isString(_field)) {
                _field = _field.replace(/ +/g, '').split(',');
            }
            this._options.field = _field;
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * where条件
     * 书写方法:
     * and:      where({id: 1, name: 'a'})
     * or:       where({or: [{...}, {...}]})
     * in:       where({id: [1,2,3]})
     * not:      where({not: {name: '', id: 1}})
     * notin:    where({notin: {'id': [1,2,3]}})
     * operator: where({id: {'<>': 1, '>=': 0}})
     * @return {[type]} [description]
     */


    _class.prototype.where = function where(_where) {
        try {
            if (!_where) {
                return this;
            }
            this._options.where = ORM.extend(false, this._options.where || {}, _where);
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     *
     * group('xxx')
     * group(['xxx', 'xxx'])
     * @param group
     */


    _class.prototype.group = function group(_group) {
        try {
            if (!_group) {
                return this;
            }
            this._options.group = _group;
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * join([{from: 'test', on: {aaa: bbb, ccc: ddd}, field: ['id', 'name'], type: 'inner'}])
     * join([{from: 'test', on: {or: [{aaa: bbb}, {ccc: ddd}]}, field: ['id', 'name'], type: 'left'}])
     * join([{from: 'test', on: {aaa: bbb, ccc: ddd}, field: ['id', 'name'], type: 'right'}])
     * @param join
     */


    _class.prototype.join = function join(_join) {
        try {
            if (!_join || !ORM.isArray(_join) || _join.length === 0) {
                return this;
            }
            this._options.join = _join;
            return this;
        } catch (e) {
            return this.error(e);
        }
    };

    /**
     * 数据插入之前操作，可以返回一个promise
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */


    _class.prototype._beforeAdd = function _beforeAdd(data, options) {
        return _promise2.default.resolve(data);
    };

    /**
     * 添加一条数据
     * @param {[type]} data    [description]
     * @param {[type]} options [description]
     * @param int 返回插入的id
     */


    _class.prototype.add = function () {
        var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(data, options) {
            var parsedOptions, model, result, pk;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;

                            if (!ORM.isEmpty(data)) {
                                _context6.next = 3;
                                break;
                            }

                            return _context6.abrupt('return', this.error('_DATA_TYPE_INVALID_'));

                        case 3:
                            _context6.next = 5;
                            return this._parseOptions(options);

                        case 5:
                            parsedOptions = _context6.sent;
                            _context6.next = 8;
                            return this.initModel();

                        case 8:
                            model = _context6.sent;

                            //copy data
                            this._data = ORM.extend({}, data);
                            _context6.next = 12;
                            return this._beforeAdd(this._data, parsedOptions);

                        case 12:
                            this._data = _context6.sent;
                            _context6.next = 15;
                            return this._parseData(this._data, parsedOptions);

                        case 15:
                            this._data = _context6.sent;

                            if (!ORM.isEmpty(this._data)) {
                                _context6.next = 18;
                                break;
                            }

                            return _context6.abrupt('return', this.error('_DATA_TYPE_INVALID_'));

                        case 18:
                            _context6.next = 20;
                            return model.add(this._data, parsedOptions);

                        case 20:
                            result = _context6.sent;
                            _context6.next = 23;
                            return this.getPk();

                        case 23:
                            pk = _context6.sent;

                            this._data[pk] = this._data[pk] ? this._data[pk] : result;

                            if (ORM.isEmpty(this._relationData)) {
                                _context6.next = 28;
                                break;
                            }

                            _context6.next = 28;
                            return this._postRelationData(result, parsedOptions, this._relationData, 'ADD');

                        case 28:
                            _context6.next = 30;
                            return this._afterAdd(this._data, parsedOptions);

                        case 30:
                            _context6.next = 32;
                            return this._parseData(this._data[pk] || 0, parsedOptions, false);

                        case 32:
                            result = _context6.sent;
                            return _context6.abrupt('return', result);

                        case 36:
                            _context6.prev = 36;
                            _context6.t0 = _context6['catch'](0);
                            return _context6.abrupt('return', this.error(_context6.t0));

                        case 39:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this, [[0, 36]]);
        }));

        function add(_x4, _x5) {
            return _ref6.apply(this, arguments);
        }

        return add;
    }();

    /**
     * 数据插入之后操作，可以返回一个promise
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */


    _class.prototype._afterAdd = function _afterAdd(data, options) {
        return _promise2.default.resolve(data);
    };

    /**
     * 查询后新增
     * @param data
     * @param options
     */


    _class.prototype.thenAdd = function () {
        var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(data, options) {
            var record;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.prev = 0;

                            if (!ORM.isEmpty(data)) {
                                _context7.next = 3;
                                break;
                            }

                            return _context7.abrupt('return', this.error('_DATA_TYPE_INVALID_'));

                        case 3:
                            _context7.next = 5;
                            return this.find(options);

                        case 5:
                            record = _context7.sent;

                            if (!ORM.isEmpty(record)) {
                                _context7.next = 8;
                                break;
                            }

                            return _context7.abrupt('return', this.add(data, options));

                        case 8:
                            return _context7.abrupt('return', null);

                        case 11:
                            _context7.prev = 11;
                            _context7.t0 = _context7['catch'](0);
                            return _context7.abrupt('return', this.error(_context7.t0));

                        case 14:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this, [[0, 11]]);
        }));

        function thenAdd(_x6, _x7) {
            return _ref7.apply(this, arguments);
        }

        return thenAdd;
    }();

    /**
     * 数据删除之前操作，可以返回一个promise
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */


    _class.prototype._beforeDelete = function _beforeDelete(options) {
        return _promise2.default.resolve(options);
    };

    /**
     * 删除数据
     * @return {[type]} [description]
     */


    _class.prototype.delete = function () {
        var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(options) {
            var parsedOptions, model, result;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.prev = 0;
                            _context8.next = 3;
                            return this._parseOptions(options);

                        case 3:
                            parsedOptions = _context8.sent;

                            if (!ORM.isEmpty(parsedOptions.where)) {
                                _context8.next = 6;
                                break;
                            }

                            return _context8.abrupt('return', this.error('_OPERATION_WRONG_'));

                        case 6:
                            _context8.next = 8;
                            return this.initModel();

                        case 8:
                            model = _context8.sent;
                            _context8.next = 11;
                            return this._beforeDelete(parsedOptions);

                        case 11:
                            _context8.next = 13;
                            return model.delete(parsedOptions);

                        case 13:
                            result = _context8.sent;
                            _context8.next = 16;
                            return this._afterDelete(parsedOptions);

                        case 16:
                            _context8.next = 18;
                            return this._parseData(result || [], parsedOptions, false);

                        case 18:
                            result = _context8.sent;
                            return _context8.abrupt('return', result);

                        case 22:
                            _context8.prev = 22;
                            _context8.t0 = _context8['catch'](0);
                            return _context8.abrupt('return', this.error(_context8.t0));

                        case 25:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this, [[0, 22]]);
        }));

        function _delete(_x8) {
            return _ref8.apply(this, arguments);
        }

        return _delete;
    }();

    /**
     * 删除后续操作
     * @return {[type]} [description]
     */


    _class.prototype._afterDelete = function _afterDelete(options) {
        return _promise2.default.resolve(options);
    };

    /**
     * 更新前置操作
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */


    _class.prototype._beforeUpdate = function _beforeUpdate(data, options) {
        return _promise2.default.resolve(data);
    };

    /**
     * 更新数据
     * @return {[type]} [description]
     */


    _class.prototype.update = function () {
        var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(data, options) {
            var parsedOptions, model, pk, result;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.prev = 0;
                            _context9.next = 3;
                            return this._parseOptions(options);

                        case 3:
                            parsedOptions = _context9.sent;
                            _context9.next = 6;
                            return this.initModel();

                        case 6:
                            model = _context9.sent;

                            //copy data
                            this._data = ORM.extend({}, data);
                            _context9.next = 10;
                            return this._beforeUpdate(this._data, parsedOptions);

                        case 10:
                            this._data = _context9.sent;
                            _context9.next = 13;
                            return this._parseData(this._data, parsedOptions);

                        case 13:
                            this._data = _context9.sent;

                            if (!ORM.isEmpty(this._data)) {
                                _context9.next = 16;
                                break;
                            }

                            return _context9.abrupt('return', this.error('_DATA_TYPE_INVALID_'));

                        case 16:
                            _context9.next = 18;
                            return this.getPk();

                        case 18:
                            pk = _context9.sent;

                            if (!ORM.isEmpty(parsedOptions.where)) {
                                _context9.next = 29;
                                break;
                            }

                            if (ORM.isEmpty(this._data[pk])) {
                                _context9.next = 26;
                                break;
                            }

                            parsedOptions.where = {};
                            parsedOptions.where[pk] = this._data[pk];
                            delete this._data[pk];
                            _context9.next = 27;
                            break;

                        case 26:
                            return _context9.abrupt('return', this.error('_OPERATION_WRONG_'));

                        case 27:
                            _context9.next = 30;
                            break;

                        case 29:
                            if (!ORM.isEmpty(this._data[pk])) {
                                delete this._data[pk];
                            }

                        case 30:
                            _context9.next = 32;
                            return model.update(this._data, parsedOptions);

                        case 32:
                            result = _context9.sent;

                            if (ORM.isEmpty(this._relationData)) {
                                _context9.next = 36;
                                break;
                            }

                            _context9.next = 36;
                            return this._postRelationData(result, parsedOptions, this._relationData, 'UPDATE');

                        case 36:
                            _context9.next = 38;
                            return this._afterUpdate(this._data, parsedOptions);

                        case 38:
                            _context9.next = 40;
                            return this._parseData(result || [], parsedOptions, false);

                        case 40:
                            result = _context9.sent;
                            return _context9.abrupt('return', result);

                        case 44:
                            _context9.prev = 44;
                            _context9.t0 = _context9['catch'](0);
                            return _context9.abrupt('return', this.error(_context9.t0));

                        case 47:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, this, [[0, 44]]);
        }));

        function update(_x9, _x10) {
            return _ref9.apply(this, arguments);
        }

        return update;
    }();

    /**
     * 更新后置操作
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */


    _class.prototype._afterUpdate = function _afterUpdate(data, options) {
        return _promise2.default.resolve(data);
    };

    /**
     * 查询数据条数
     * count('xxx')
     * @param options
     * @returns {*}
     */


    _class.prototype.count = function () {
        var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(options) {
            var parsedOptions, pk, model, result;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.prev = 0;
                            _context10.next = 3;
                            return this._parseOptions(options);

                        case 3:
                            parsedOptions = _context10.sent;
                            _context10.next = 6;
                            return this.getPk();

                        case 6:
                            pk = _context10.sent;
                            _context10.next = 9;
                            return this.initModel();

                        case 9:
                            model = _context10.sent;
                            _context10.next = 12;
                            return model.count(pk, parsedOptions);

                        case 12:
                            result = _context10.sent;
                            _context10.next = 15;
                            return this._parseData(result || 0, parsedOptions, false);

                        case 15:
                            result = _context10.sent;
                            return _context10.abrupt('return', result);

                        case 19:
                            _context10.prev = 19;
                            _context10.t0 = _context10['catch'](0);
                            return _context10.abrupt('return', this.error(_context10.t0));

                        case 22:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, this, [[0, 19]]);
        }));

        function count(_x11) {
            return _ref10.apply(this, arguments);
        }

        return count;
    }();

    /**
     * 统计数据数量和
     * sum('xxx')
     * @param field
     * @param options
     * @returns {*}
     */


    _class.prototype.sum = function () {
        var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(field, options) {
            var parsedOptions, pk, model, result;
            return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _context11.prev = 0;
                            _context11.next = 3;
                            return this._parseOptions(options);

                        case 3:
                            parsedOptions = _context11.sent;
                            _context11.next = 6;
                            return this.getPk();

                        case 6:
                            pk = _context11.sent;

                            field = field || pk;
                            // init model
                            _context11.next = 10;
                            return this.initModel();

                        case 10:
                            model = _context11.sent;
                            _context11.next = 13;
                            return model.sum(field, parsedOptions);

                        case 13:
                            result = _context11.sent;
                            _context11.next = 16;
                            return this._parseData(result || 0, parsedOptions, false);

                        case 16:
                            result = _context11.sent;
                            return _context11.abrupt('return', result);

                        case 20:
                            _context11.prev = 20;
                            _context11.t0 = _context11['catch'](0);
                            return _context11.abrupt('return', this.error(_context11.t0));

                        case 23:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, this, [[0, 20]]);
        }));

        function sum(_x12, _x13) {
            return _ref11.apply(this, arguments);
        }

        return sum;
    }();

    /**
     * 查询一条数据
     * @return 返回一个promise
     */


    _class.prototype.find = function () {
        var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(options) {
            var parsedOptions, model, result;
            return _regenerator2.default.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            _context12.prev = 0;
                            _context12.next = 3;
                            return this._parseOptions(options);

                        case 3:
                            parsedOptions = _context12.sent;
                            _context12.next = 6;
                            return this.initModel();

                        case 6:
                            model = _context12.sent;
                            _context12.next = 9;
                            return model.find(parsedOptions);

                        case 9:
                            result = _context12.sent;
                            _context12.next = 12;
                            return this._parseData(result, parsedOptions, false);

                        case 12:
                            result = _context12.sent;

                            result = (ORM.isArray(result) ? result[0] : result) || {};

                            if (ORM.isEmpty(parsedOptions.rel)) {
                                _context12.next = 18;
                                break;
                            }

                            _context12.next = 17;
                            return this._getRelationData(parsedOptions, result);

                        case 17:
                            result = _context12.sent;

                        case 18:
                            _context12.next = 20;
                            return this._afterFind(result, parsedOptions);

                        case 20:
                            return _context12.abrupt('return', result);

                        case 23:
                            _context12.prev = 23;
                            _context12.t0 = _context12['catch'](0);
                            return _context12.abrupt('return', this.error(_context12.t0));

                        case 26:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, this, [[0, 23]]);
        }));

        function find(_x14) {
            return _ref12.apply(this, arguments);
        }

        return find;
    }();

    /**
     * find查询后置操作
     * @return {[type]} [description]
     */


    _class.prototype._afterFind = function _afterFind(result, options) {
        return _promise2.default.resolve(result);
    };

    /**
     * 查询数据
     * @return 返回一个promise
     */


    _class.prototype.select = function () {
        var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(options) {
            var parsedOptions, model, result;
            return _regenerator2.default.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            _context13.prev = 0;
                            _context13.next = 3;
                            return this._parseOptions(options);

                        case 3:
                            parsedOptions = _context13.sent;
                            _context13.next = 6;
                            return this.initModel();

                        case 6:
                            model = _context13.sent;
                            _context13.next = 9;
                            return model.select(parsedOptions);

                        case 9:
                            result = _context13.sent;
                            _context13.next = 12;
                            return this._parseData(result || [], parsedOptions, false);

                        case 12:
                            result = _context13.sent;

                            if (ORM.isEmpty(parsedOptions.rel)) {
                                _context13.next = 17;
                                break;
                            }

                            _context13.next = 16;
                            return this._getRelationData(parsedOptions, result);

                        case 16:
                            result = _context13.sent;

                        case 17:
                            _context13.next = 19;
                            return this._afterSelect(result, parsedOptions);

                        case 19:
                            return _context13.abrupt('return', result);

                        case 22:
                            _context13.prev = 22;
                            _context13.t0 = _context13['catch'](0);
                            return _context13.abrupt('return', this.error(_context13.t0));

                        case 25:
                        case 'end':
                            return _context13.stop();
                    }
                }
            }, _callee13, this, [[0, 22]]);
        }));

        function select(_x15) {
            return _ref13.apply(this, arguments);
        }

        return select;
    }();

    /**
     * 查询后置操作
     * @param  {[type]} result  [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */


    _class.prototype._afterSelect = function _afterSelect(result, options) {
        return _promise2.default.resolve(result);
    };

    /**
     * 返回数据里含有count信息的查询
     * @param  options
     * @param  pageFlag 当页面不合法时的处理方式，true为获取第一页，false为获取最后一页，undefined获取为空
     * @return promise
     */


    _class.prototype.countSelect = function () {
        var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(options, pageFlag) {
            var parsedOptions, countNum, pageOptions, totalPage, offset, result;
            return _regenerator2.default.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            _context14.prev = 0;

                            if (ORM.isBoolean(options)) {
                                pageFlag = options;
                                options = {};
                            }
                            _context14.next = 4;
                            return this._parseOptions(options);

                        case 4:
                            parsedOptions = _context14.sent;
                            _context14.next = 7;
                            return this.count(parsedOptions);

                        case 7:
                            countNum = _context14.sent;
                            pageOptions = parsedOptions.page;
                            totalPage = Math.ceil(countNum / pageOptions.num);

                            if (ORM.isBoolean(pageFlag)) {
                                if (pageOptions.page > totalPage) {
                                    pageOptions.page = pageFlag === true ? 1 : totalPage;
                                }
                                parsedOptions.page = pageOptions.page + ',' + pageOptions.num;
                            }
                            //传入分页参数
                            offset = pageOptions.page - 1 < 0 ? 0 : (pageOptions.page - 1) * pageOptions.num;

                            parsedOptions.limit = [offset, pageOptions.num];
                            result = ORM.extend(false, { count: countNum, total: totalPage }, pageOptions);
                            _context14.next = 16;
                            return this.select(parsedOptions);

                        case 16:
                            result.data = _context14.sent;
                            _context14.next = 19;
                            return this._parseData(result, parsedOptions, false);

                        case 19:
                            result = _context14.sent;
                            return _context14.abrupt('return', result);

                        case 23:
                            _context14.prev = 23;
                            _context14.t0 = _context14['catch'](0);
                            return _context14.abrupt('return', this.error(_context14.t0));

                        case 26:
                        case 'end':
                            return _context14.stop();
                    }
                }
            }, _callee14, this, [[0, 23]]);
        }));

        function countSelect(_x16, _x17) {
            return _ref14.apply(this, arguments);
        }

        return countSelect;
    }();

    /**
     * 解析参数
     * @param oriOpts
     * @param extraOptions
     * @returns {*}
     * @private
     */


    _class.prototype._parseOptions = function _parseOptions(oriOpts, extraOptions) {
        var options = void 0;
        if (ORM.isScalar(oriOpts)) {
            options = ORM.extend({}, this._options);
        } else {
            options = ORM.extend({}, this._options, oriOpts, extraOptions);
        }
        //查询过后清空sql表达式组装 避免影响下次查询
        this._options = {};
        //获取表名
        options.table = options.table || this.getTableName();
        //模型名称
        options.name = options.name || this.modelName;
        //解析field,根据model的fields进行过滤
        var field = [];
        if (ORM.isEmpty(options.field) && !ORM.isEmpty(options.fields)) options.field = options.fields;
        //解析分页
        if (options['page']) {
            var page = options.page + '';
            var num = 0;
            if (page.indexOf(',') > -1) {
                page = page.split(',');
                num = parseInt(page[1], 10);
                page = page[0];
            }
            num = num || 10;
            page = parseInt(page, 10) || 1;
            options.page = { page: page, num: num };
        } else {
            options.page = { page: 1, num: 10 };
        }
        return options;
    };

    /**
     * 检测数据是否合法
     * @param data
     * @param options
     * @param preCheck
     * @param option
     * @returns {*}
     */


    _class.prototype._parseData = function _parseData(data, options) {
        var preCheck = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
        var option = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

        if (preCheck) {
            //根据模型定义字段类型进行数据检查
            var result = [];
            for (var _field2 in data) {
                //分离关联模型数据
                if (this.relation[_field2]) {
                    !this._relationData[_field2] && (this._relationData[_field2] = {});
                    this._relationData[_field2] = data[_field2];
                    delete data[_field2];
                }
                //移除未定义的字段
                if (!this.fields[_field2]) {
                    delete data[_field2];
                }
            }
            //根据规则自动验证数据
            if (ORM.isEmpty(this.validations)) {
                return data;
            }
            var field = void 0,
                value = void 0,
                checkData = [];
            for (field in this.validations) {
                value = ORM.extend(this.validations[field], { name: field, value: data[field] });
                checkData.push(value);
            }
            if (ORM.isEmpty(checkData)) {
                return data;
            }
            result = {};
            result = this._valid(checkData);
            if (ORM.isEmpty(result)) {
                return data;
            }
            return this.error((0, _values2.default)(result)[0]);
        } else {
            if (ORM.isJSONObj(data)) {
                return data;
            } else {
                return JSON.parse((0, _stringify2.default)(data));
            }
        }
    };

    /**
     *
     * @param options
     * @returns {*}
     * @private
     */


    _class.prototype._getRelationData = function () {
        var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(options, data) {
            var caseList, relationData, relation, rtype, fkey, pk, n, _iterator, _isArray, _i, _ref16, _ref17, k, v;

            return _regenerator2.default.wrap(function _callee15$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            _context15.prev = 0;
                            caseList = {
                                HASONE: this._getHasOneRelation,
                                HASMANY: this._getHasManyRelation,
                                MANYTOMANY: this._getManyToManyRelation
                            };
                            relationData = data;

                            if (ORM.isEmpty(data)) {
                                _context15.next = 41;
                                break;
                            }

                            relation = options.rel, rtype = void 0, fkey = void 0;
                            _context15.next = 7;
                            return this.getPk();

                        case 7:
                            pk = _context15.sent;
                            _context15.t0 = _regenerator2.default.keys(relation);

                        case 9:
                            if ((_context15.t1 = _context15.t0()).done) {
                                _context15.next = 41;
                                break;
                            }

                            n = _context15.t1.value;

                            rtype = relation[n]['type'];

                            if (!(relation[n].fkey && rtype && rtype in caseList)) {
                                _context15.next = 39;
                                break;
                            }

                            fkey = rtype === 'MANYTOMANY' ? ORM.parseName(relation[n].name) : relation[n].fkey;

                            if (!ORM.isArray(data)) {
                                _context15.next = 36;
                                break;
                            }

                            _iterator = data.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

                        case 16:
                            if (!_isArray) {
                                _context15.next = 22;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context15.next = 19;
                                break;
                            }

                            return _context15.abrupt('break', 34);

                        case 19:
                            _ref16 = _iterator[_i++];
                            _context15.next = 26;
                            break;

                        case 22:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context15.next = 25;
                                break;
                            }

                            return _context15.abrupt('break', 34);

                        case 25:
                            _ref16 = _i.value;

                        case 26:
                            _ref17 = _ref16;
                            k = _ref17[0];
                            v = _ref17[1];
                            _context15.next = 31;
                            return caseList[rtype](relation[n], data[k]);

                        case 31:
                            data[k][fkey] = _context15.sent;

                        case 32:
                            _context15.next = 16;
                            break;

                        case 34:
                            _context15.next = 39;
                            break;

                        case 36:
                            _context15.next = 38;
                            return caseList[rtype](relation[n], data);

                        case 38:
                            data[fkey] = _context15.sent;

                        case 39:
                            _context15.next = 9;
                            break;

                        case 41:
                            return _context15.abrupt('return', relationData);

                        case 44:
                            _context15.prev = 44;
                            _context15.t2 = _context15['catch'](0);
                            return _context15.abrupt('return', this.error(_context15.t2));

                        case 47:
                        case 'end':
                            return _context15.stop();
                    }
                }
            }, _callee15, this, [[0, 44]]);
        }));

        function _getRelationData(_x20, _x21) {
            return _ref15.apply(this, arguments);
        }

        return _getRelationData;
    }();

    /**
     *
     * @param rel
     * @param data
     * @returns {*}
     * @private
     */


    _class.prototype._getHasOneRelation = function _getHasOneRelation(rel, data) {
        var _where2;

        if (ORM.isEmpty(data) || ORM.isEmpty(data[rel.fkey])) {
            return {};
        }
        var model = rel.model;
        return model.find({ field: rel.field, where: (_where2 = {}, _where2[rel.rkey] = data[rel.fkey], _where2) });
    };

    /**
     *
     * @param rel
     * @param data
     * @returns {{}}
     * @private
     */


    _class.prototype._getHasManyRelation = function _getHasManyRelation(rel, data) {
        var _where3;

        if (ORM.isEmpty(data) || ORM.isEmpty(data[rel.primaryPk])) {
            return [];
        }
        var model = rel.model;
        var options = { field: rel.field, where: (_where3 = {}, _where3[rel.rkey] = data[rel.primaryPk], _where3) };
        return model.select(options);
    };

    /**
     *
     * @param rel
     * @param data
     * @returns {{}}
     * @private
     */


    _class.prototype._getManyToManyRelation = function _getManyToManyRelation(rel, data) {
        var _where4;

        if (ORM.isEmpty(data) || ORM.isEmpty(data[rel.primaryPk])) {
            return [];
        }
        var model = rel.model;
        var rpk = model.getPk();
        //let mapModel = `${rel.primaryName}${rel.name}Map`;
        //if(model.config.db_type === 'mongo'){
        return rel.mapModel.field(rel.fkey).select({ where: (_where4 = {}, _where4[rel.fkey] = data[rel.primaryPk], _where4) }).then(function (data) {
            var _where5;

            var keys = [];
            data.map(function (item) {
                item[rel.fkey] && keys.push(item[rel.fkey]);
            });
            return model.select({ where: (_where5 = {}, _where5[rpk] = keys, _where5) });
        });
        //} else {
        //    let options = {
        //        table: `${model.config.db_prefix}${ORM.parseName(mapModel)}`,
        //        name: mapModel,
        //        join: [
        //            {from: `${rel.model.modelName}`, on: {[rel.rkey]: rpk}, field: rel.field, type: 'inner'}
        //        ],
        //        where: {
        //            [rel.fkey]: data[rel.primaryPk]
        //        }
        //    };
        //    //数据量大的情况下可能有性能问题
        //    let regx = new RegExp(`${rel.name}_`, "g");
        //    return model.select(options).then(result => {
        //        result = JSON.stringify(result).replace(regx, '');
        //        return JSON.parse(result);
        //    });
        //}
    };

    /**
     *
     * @param result
     * @param options
     * @param relationData
     * @param postType
     * @returns {*}
     * @private
     */


    _class.prototype._postRelationData = function () {
        var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(result, options, relationData, postType) {
            var caseList, relation, rtype, pk, n;
            return _regenerator2.default.wrap(function _callee16$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            _context16.prev = 0;
                            caseList = {
                                HASONE: this._postHasOneRelation,
                                HASMANY: this._postHasManyRelation,
                                MANYTOMANY: this._postManyToManyRelation
                            };

                            if (ORM.isEmpty(result)) {
                                _context16.next = 17;
                                break;
                            }

                            relation = _schema2.default.getRelation(this.modelName, this.config), rtype = void 0;
                            _context16.next = 6;
                            return this.getPk();

                        case 6:
                            pk = _context16.sent;
                            _context16.t0 = _regenerator2.default.keys(relationData);

                        case 8:
                            if ((_context16.t1 = _context16.t0()).done) {
                                _context16.next = 17;
                                break;
                            }

                            n = _context16.t1.value;

                            rtype = relation[n] ? relation[n]['type'] : null;

                            if (!(relation[n].fkey && rtype && rtype in caseList)) {
                                _context16.next = 15;
                                break;
                            }

                            relation[n]['clsKey'] = this.clsKey;
                            _context16.next = 15;
                            return caseList[rtype](result, options, relation[n], relationData[n], postType);

                        case 15:
                            _context16.next = 8;
                            break;

                        case 17:
                            return _context16.abrupt('return');

                        case 20:
                            _context16.prev = 20;
                            _context16.t2 = _context16['catch'](0);
                            return _context16.abrupt('return', this.error(_context16.t2));

                        case 23:
                        case 'end':
                            return _context16.stop();
                    }
                }
            }, _callee16, this, [[0, 20]]);
        }));

        function _postRelationData(_x22, _x23, _x24, _x25) {
            return _ref18.apply(this, arguments);
        }

        return _postRelationData;
    }();

    /**
     *
     * @param result
     * @param options
     * @param rel
     * @param relationData
     * @param postType
     * @private
     */


    _class.prototype._postHasOneRelation = function () {
        var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(result, options, rel, relationData, postType) {
            var _ORM$collections$rel$, _where6;

            var model, fkey, info, _where7;

            return _regenerator2.default.wrap(function _callee17$(_context17) {
                while (1) {
                    switch (_context17.prev = _context17.next) {
                        case 0:
                            if (!(ORM.isEmpty(result) || ORM.isEmpty(relationData))) {
                                _context17.next = 2;
                                break;
                            }

                            return _context17.abrupt('return');

                        case 2:
                            model = rel.model;
                            _context17.t0 = postType;
                            _context17.next = _context17.t0 === 'ADD' ? 6 : _context17.t0 === 'UPDATE' ? 14 : 24;
                            break;

                        case 6:
                            _context17.next = 8;
                            return model.add(relationData);

                        case 8:
                            fkey = _context17.sent;
                            _context17.t1 = fkey && ORM.collections[rel.clsKey][rel.primaryName];

                            if (!_context17.t1) {
                                _context17.next = 13;
                                break;
                            }

                            _context17.next = 13;
                            return ORM.collections[rel.clsKey][rel.primaryName].update((_ORM$collections$rel$ = {}, _ORM$collections$rel$[rel.fkey] = fkey, _ORM$collections$rel$), { where: (_where6 = {}, _where6[rel.primaryPk] = result, _where6) });

                        case 13:
                            return _context17.abrupt('break', 24);

                        case 14:
                            if (relationData[rel.fkey]) {
                                _context17.next = 20;
                                break;
                            }

                            if (!ORM.collections[rel.clsKey][rel.primaryName]) {
                                _context17.next = 20;
                                break;
                            }

                            _context17.next = 18;
                            return ORM.collections[rel.clsKey][rel.primaryName].field(rel.fkey).find(options);

                        case 18:
                            info = _context17.sent;

                            relationData[rel.fkey] = info[rel.fkey];

                        case 20:
                            if (!relationData[rel.fkey]) {
                                _context17.next = 23;
                                break;
                            }

                            _context17.next = 23;
                            return model.update(relationData, { where: (_where7 = {}, _where7[rel.rkey] = relationData[rel.fkey], _where7) });

                        case 23:
                            return _context17.abrupt('break', 24);

                        case 24:
                            return _context17.abrupt('return');

                        case 25:
                        case 'end':
                            return _context17.stop();
                    }
                }
            }, _callee17, this);
        }));

        function _postHasOneRelation(_x26, _x27, _x28, _x29, _x30) {
            return _ref19.apply(this, arguments);
        }

        return _postHasOneRelation;
    }();

    /**
     *
     * @param result
     * @param options
     * @param rel
     * @param relationData
     * @param postType
     * @private
     */


    _class.prototype._postHasManyRelation = function () {
        var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(result, options, rel, relationData, postType) {
            var model, rpk, _iterator2, _isArray2, _i2, _ref21, _ref22, k, v, _where8;

            return _regenerator2.default.wrap(function _callee18$(_context18) {
                while (1) {
                    switch (_context18.prev = _context18.next) {
                        case 0:
                            if (!(ORM.isEmpty(result) || ORM.isEmpty(relationData))) {
                                _context18.next = 2;
                                break;
                            }

                            return _context18.abrupt('return');

                        case 2:
                            model = rel.model, rpk = model.getPk();
                            _iterator2 = relationData.entries(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);

                        case 4:
                            if (!_isArray2) {
                                _context18.next = 10;
                                break;
                            }

                            if (!(_i2 >= _iterator2.length)) {
                                _context18.next = 7;
                                break;
                            }

                            return _context18.abrupt('break', 30);

                        case 7:
                            _ref21 = _iterator2[_i2++];
                            _context18.next = 14;
                            break;

                        case 10:
                            _i2 = _iterator2.next();

                            if (!_i2.done) {
                                _context18.next = 13;
                                break;
                            }

                            return _context18.abrupt('break', 30);

                        case 13:
                            _ref21 = _i2.value;

                        case 14:
                            _ref22 = _ref21;
                            k = _ref22[0];
                            v = _ref22[1];
                            _context18.t0 = postType;
                            _context18.next = _context18.t0 === 'ADD' ? 20 : _context18.t0 === 'UPDATE' ? 24 : 28;
                            break;

                        case 20:
                            //子表插入数据
                            v[rel.rkey] = result;
                            _context18.next = 23;
                            return model.add(v);

                        case 23:
                            return _context18.abrupt('break', 28);

                        case 24:
                            if (!v[rpk]) {
                                _context18.next = 27;
                                break;
                            }

                            _context18.next = 27;
                            return model.update(v, { where: (_where8 = {}, _where8[rpk] = v[rpk], _where8) });

                        case 27:
                            return _context18.abrupt('break', 28);

                        case 28:
                            _context18.next = 4;
                            break;

                        case 30:
                            return _context18.abrupt('return');

                        case 31:
                        case 'end':
                            return _context18.stop();
                    }
                }
            }, _callee18, this);
        }));

        function _postHasManyRelation(_x31, _x32, _x33, _x34, _x35) {
            return _ref20.apply(this, arguments);
        }

        return _postHasManyRelation;
    }();

    /**
     *
     * @param result
     * @param options
     * @param rel
     * @param relationData
     * @param postType
     * @private
     */


    _class.prototype._postManyToManyRelation = function () {
        var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(result, options, rel, relationData, postType) {
            var _rel$mapModel$thenAdd, _where9;

            var model, rpk, _iterator3, _isArray3, _i3, _ref24, _ref25, k, v, fkey, _rel$mapModel$thenAdd2, _where10, _where11;

            return _regenerator2.default.wrap(function _callee19$(_context19) {
                while (1) {
                    switch (_context19.prev = _context19.next) {
                        case 0:
                            if (!(ORM.isEmpty(result) || ORM.isEmpty(relationData))) {
                                _context19.next = 2;
                                break;
                            }

                            return _context19.abrupt('return');

                        case 2:
                            //子表主键
                            model = rel.model, rpk = model.getPk();
                            //关系表

                            _iterator3 = relationData.entries(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);

                        case 4:
                            if (!_isArray3) {
                                _context19.next = 10;
                                break;
                            }

                            if (!(_i3 >= _iterator3.length)) {
                                _context19.next = 7;
                                break;
                            }

                            return _context19.abrupt('break', 41);

                        case 7:
                            _ref24 = _iterator3[_i3++];
                            _context19.next = 14;
                            break;

                        case 10:
                            _i3 = _iterator3.next();

                            if (!_i3.done) {
                                _context19.next = 13;
                                break;
                            }

                            return _context19.abrupt('break', 41);

                        case 13:
                            _ref24 = _i3.value;

                        case 14:
                            _ref25 = _ref24;
                            k = _ref25[0];
                            v = _ref25[1];
                            _context19.t0 = postType;
                            _context19.next = _context19.t0 === 'ADD' ? 20 : _context19.t0 === 'UPDATE' ? 28 : 39;
                            break;

                        case 20:
                            _context19.next = 22;
                            return model.add(v);

                        case 22:
                            fkey = _context19.sent;
                            _context19.t1 = fkey && rel['mapModel'];

                            if (!_context19.t1) {
                                _context19.next = 27;
                                break;
                            }

                            _context19.next = 27;
                            return rel['mapModel'].thenAdd((_rel$mapModel$thenAdd = {}, _rel$mapModel$thenAdd[rel.fkey] = result, _rel$mapModel$thenAdd[rel.rkey] = fkey, _rel$mapModel$thenAdd), { where: (_where9 = {}, _where9[rel.fkey] = result, _where9[rel.rkey] = fkey, _where9) });

                        case 27:
                            return _context19.abrupt('break', 39);

                        case 28:
                            if (!(v[rel.fkey] && v[rel.rkey])) {
                                _context19.next = 35;
                                break;
                            }

                            _context19.t2 = rel['mapModel'];

                            if (!_context19.t2) {
                                _context19.next = 33;
                                break;
                            }

                            _context19.next = 33;
                            return rel['mapModel'].thenAdd((_rel$mapModel$thenAdd2 = {}, _rel$mapModel$thenAdd2[rel.fkey] = v[rel.fkey], _rel$mapModel$thenAdd2[rel.rkey] = v[rel.rkey], _rel$mapModel$thenAdd2), { where: (_where10 = {}, _where10[rel.fkey] = v[rel.fkey], _where10[rel.rkey] = v[rel.rkey], _where10) });

                        case 33:
                            _context19.next = 38;
                            break;

                        case 35:
                            if (!v[rpk]) {
                                _context19.next = 38;
                                break;
                            }

                            _context19.next = 38;
                            return model.update(v, { where: (_where11 = {}, _where11[rpk] = v[rpk], _where11) });

                        case 38:
                            return _context19.abrupt('break', 39);

                        case 39:
                            _context19.next = 4;
                            break;

                        case 41:
                            return _context19.abrupt('return');

                        case 42:
                        case 'end':
                            return _context19.stop();
                    }
                }
            }, _callee19, this);
        }));

        function _postManyToManyRelation(_x36, _x37, _x38, _x39, _x40) {
            return _ref23.apply(this, arguments);
        }

        return _postManyToManyRelation;
    }();

    return _class;
}(_base3.default);

exports.default = _class;