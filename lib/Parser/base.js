'use strict';

exports.__esModule = true;

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

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _base2 = require('../base');

var _base3 = _interopRequireDefault(_base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var identifiers = {
    OR: 'OR',
    AND: 'AND',
    NOT: 'NOT',
    IN: 'IN',
    NOTIN: 'NOTIN',
    '>': 'OPERATOR',
    '<': 'OPERATOR',
    '<>': 'OPERATOR',
    '<=': 'OPERATOR',
    '>=': 'OPERATOR'
};
/**
 * 书写方法:
 and: {id: 1, name: 'a'},
 or:  {or: [{...}, {...}]}
 in: {id: [1,2,3]}
 not: {not: {name: '', id: 1}}
 notin: {notin: {'id': [1,2,3]}}
 operator: {id: {'<>': 1, '>=': 0}}
 * @param options
 * @param key
 * @param value
 * @param k
 * @param alias
 * @param isor
 * @returns {*}
 */
/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2016 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    16/8/14
 */
var preParseKnexWhere = function preParseKnexWhere(options, key, value, k, alias) {
    var isor = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];

    try {
        var idt = key.toUpperCase();
        switch (identifiers[idt]) {
            case 'OR':
                if (ORM.isArray(value)) {
                    for (var _iterator = value, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
                        var _ref;

                        if (_isArray) {
                            if (_i >= _iterator.length) break;
                            _ref = _iterator[_i++];
                        } else {
                            _i = _iterator.next();
                            if (_i.done) break;
                            _ref = _i.value;
                        }

                        var n = _ref;

                        for (var orKey in n) {
                            preParseKnexWhere(options, orKey, n[orKey], orKey, alias, true);
                        }
                    }
                }
                break;
            case 'IN':
                for (var _n in value) {
                    if (ORM.isArray(value[_n])) {
                        isor ? options.orwhere.in.push([alias + '.' + _n, value[_n]]) : options.where.in.push([alias + '.' + _n, value[_n]]);
                    }
                }
                break;
            case 'NOTIN':
                for (var _n2 in value) {
                    if (ORM.isArray(value[_n2])) {
                        isor ? options.orwhere.notin.push([alias + '.' + _n2, value[_n2]]) : options.where.notin.push([alias + '.' + _n2, value[_n2]]);
                    }
                }
                break;
            case 'NOT':
                for (var _n3 in value) {
                    if (ORM.isArray(value[_n3])) {
                        isor ? options.orwhere.notin.push([alias + '.' + _n3, value[_n3]]) : options.where.notin.push([alias + '.' + _n3, value[_n3]]);
                    } else {
                        isor ? options.orwhere.not.push([alias + '.' + _n3, value[_n3]]) : options.where.not.push([alias + '.' + _n3, value[_n3]]);
                    }
                }
                break;
            case 'OPERATOR':
                isor ? options.orwhere.operation.push([alias + '.' + k, key, value]) : options.where.operation.push([alias + '.' + k, key, value]);
                break;
            case 'AND':
            default:
                if (ORM.isArray(value)) {
                    isor ? options.orwhere.in.push([alias + '.' + key, value]) : options.where.in.push([alias + '.' + key, value]);
                } else if (ORM.isObject(value)) {
                    for (var _n4 in value) {
                        preParseKnexWhere(options, _n4, value[_n4], key, alias, isor);
                    }
                } else {
                    isor ? options.orwhere.and.push([alias + '.' + key, '=', value]) : options.where.and.push([alias + '.' + key, '=', value]);
                }
                break;
        }
    } catch (e) {
        return options;
    }
};
/**
 *
 * @param knex
 * @param optionWhere
 */
var parseKnexWhere = function parseKnexWhere(knex, optionWhere) {
    if (optionWhere.and) {
        optionWhere.and.map(function (data) {
            knex.where(data[0], data[1], data[2]);
        });
    }

    if (optionWhere.in) {
        optionWhere.in.map(function (data) {
            knex.whereIn(data[0], data[1]);
        });
    }

    if (optionWhere.not) {
        optionWhere.not.map(function (data) {
            knex.whereNot(data[0], data[1]);
        });
    }

    if (optionWhere.notin) {
        optionWhere.notin.map(function (data) {
            knex.whereNotIn(data[0], data[1]);
        });
    }

    if (optionWhere.null) {
        optionWhere.null.map(function (data) {
            //knex.whereNull(...data);
            data.map(function (d) {
                knex.whereNull(d);
            });
        });
    }

    if (optionWhere.notnull) {
        optionWhere.notnull.map(function (data) {
            data.map(function (d) {
                knex.whereNotNull(d);
            });
        });
    }

    if (optionWhere.between) {
        optionWhere.between.map(function (data) {
            knex.whereBetween(data[0], data[1]);
        });
    }

    if (optionWhere.notbetween) {
        optionWhere.notbetween.map(function (data) {
            knex.whereNotBetween(data[0], data[1]);
        });
    }

    if (optionWhere.operation) {
        optionWhere.operation.map(function (data) {
            knex.where(data[0], data[1], data[2]);
        });
    }
};
/**
 *
 * @param knex
 * @param optionOrWhere
 */
var parseKnexOrWhere = function parseKnexOrWhere(knex, optionOrWhere) {
    if (optionOrWhere.and) {
        optionOrWhere.and.map(function (data) {
            knex.orWhere(data[0], data[1], data[2]);
        });
    }
    if (optionOrWhere.operation) {
        optionOrWhere.operation.map(function (data) {
            knex.orWhere(data[0], data[1], data[2]);
        });
    }
    if (optionOrWhere.in) {
        optionOrWhere.in.map(function (data) {
            knex.orWhereIn(data[0], data[1]);
        });
    }
    if (optionOrWhere.not) {
        optionOrWhere.not.map(function (data) {
            knex.orWhereNot(data[0], data[1]);
        });
    }
    if (optionOrWhere.notin) {
        optionOrWhere.notin.map(function (data) {
            knex.orWhereNotIn(data[0], data[1]);
        });
    }
};

/**
 *
 * @param onCondition
 * @param alias
 * @param joinAlias
 * @returns {string}
 */
var preParseKnexJoin = function preParseKnexJoin(onCondition, alias, joinAlias) {
    var funcTemp = arguments.length <= 3 || arguments[3] === undefined ? 'this' : arguments[3];

    //解析on
    for (var n in onCondition) {
        if (n === 'or' || n === 'OR') {
            if (!ORM.isArray(onCondition[n])) {
                continue;
            }
            onCondition[n].forEach(function (it) {
                for (var i in it) {
                    //a join b, b join c的情况下,on条件内已经申明alias
                    if (i.indexOf('.') === -1) {
                        funcTemp += '.orOn(\'' + alias + '.' + i + '\', \'=\', \'' + joinAlias + '.' + it[i] + '\')';
                    } else {
                        funcTemp += '.orOn(\'' + i + '\', \'=\', \'' + joinAlias + '.' + it[i] + '\')';
                    }
                }
            });
        } else {
            //a join b, b join c的情况下,on条件内已经申明alias
            if (n.indexOf('.') === -1) {
                funcTemp += '.on(\'' + alias + '.' + n + '\', \'=\', \'' + joinAlias + '.' + onCondition[n] + '\')';
            } else {
                funcTemp += '.on(\'' + n + '\', \'=\', \'' + joinAlias + '.' + onCondition[n] + '\')';
            }
        }
    }
    return funcTemp;
};

var _class = function (_base) {
    (0, _inherits3.default)(_class, _base);

    function _class() {
        (0, _classCallCheck3.default)(this, _class);
        return (0, _possibleConstructorReturn3.default)(this, _base.apply(this, arguments));
    }

    _class.prototype.init = function init() {
        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.config = config;
    };

    /**
     *
     * @param cls
     * @param data
     * @param options
     */


    _class.prototype.parseLimit = function parseLimit(cls, data, options) {
        if (ORM.isEmpty(options.limit)) {
            return;
        }
        cls.limit(options.limit[1] || 10).offset(options.limit[0] || 0);
    };

    /**
     *
     * @param cls
     * @param data
     * @param options
     */


    _class.prototype.parseOrder = function parseOrder(cls, data, options) {
        if (ORM.isEmpty(options.order)) {
            return;
        }
        for (var n in options.order) {
            cls.orderBy(n, options.order[n]);
        }
    };

    /**
     *
     * @param cls
     * @param data
     * @param options
     */


    _class.prototype.parseField = function parseField(cls, data, options) {
        if (ORM.isEmpty(options.field)) {
            return;
        }
        var fds = [];
        options.field.forEach(function (item) {
            if (item.indexOf('.') > -1) {
                fds.push(item);
            } else {
                fds.push(options.name + '.' + item);
            }
        });
        cls.column(fds);
    };

    /**
     *
     * @param cls
     * @param data
     * @param options
     */


    _class.prototype.parseWhere = function parseWhere(cls, data, options) {
        if (ORM.isEmpty(options.where)) {
            return;
        }
        var optionsWhere = {
            where: {
                "and": [],
                "not": [],
                "in": [],
                "notin": [],
                "null": [],
                "notnull": [],
                "between": [],
                "notbetween": [],
                "operation": []
            },
            orwhere: {
                "and": [],
                "not": [],
                "in": [],
                "notin": [],
                "null": [],
                "notnull": [],
                "between": [],
                "notbetween": [],
                "operation": []
            }
        };
        //parse where options
        for (var key in options.where) {
            preParseKnexWhere(optionsWhere, key, options.where[key], '', options.name);
        }

        //parsed to knex
        for (var n in optionsWhere) {
            if (n === 'where') {
                parseKnexWhere(cls, optionsWhere[n]);
            } else if (n === 'orwhere') {
                parseKnexOrWhere(cls, optionsWhere[n]);
            }
        }
    };

    /**
     * group('xxx')
     * group(['xxx', 'xxx'])
     * @param cls
     * @param data
     * @param options
     */


    _class.prototype.parseGroup = function parseGroup(cls, data, options) {
        if (ORM.isEmpty(options.group)) {
            return;
        }
        cls.groupBy(options.group);
    };

    /**
     * join([{from: 'test', on: {aaa: bbb, ccc: ddd}, field: ['id', 'name'], type: 'inner'}])
     * join([{from: 'test', on: {or: [{aaa: bbb}, {ccc: ddd}]}, field: ['id', 'name'], type: 'left'}])
     * join([{from: 'test', on: {aaa: bbb, ccc: ddd}, field: ['id', 'name'], type: 'right'}])
     * @param cls
     * @param data
     * @param options
     */


    _class.prototype.parseJoin = function parseJoin(cls, data, options) {
        var _this2 = this;

        //解析后结果
        //.innerJoin('accounts', function() {
        //    this.on('accounts.id', '=', 'users.account_id').on('accounts.owner_id', '=', 'users.id').orOn('accounts.owner_id', '=', 'users.id')
        //})
        if (ORM.isArray(options.join)) {
            (function () {
                var type = void 0,
                    config = _this2.config,
                    name = options.name,
                    joinAlias = '',
                    joinTable = '',
                    onCondition = void 0,
                    func = '';
                options.join.map(function (item) {
                    if (item && item.from && item.on) {
                        onCondition = item.on;
                        joinAlias = item.from;
                        joinTable = '' + config.db_prefix + ORM.parseName(item.from);
                        //关联表字段
                        if (!ORM.isEmpty(item.field) && ORM.isArray(item.field)) {
                            options.field = options.field || [];
                            item.field.forEach(function (it) {
                                //关联表字段必须指定,不能写*
                                if (it.indexOf('*') === -1) {
                                    options.field.push(item.from + '.' + it + ' AS ' + joinAlias + '_' + it);
                                }
                            });
                        }
                        //构造函数
                        func = new Function('', preParseKnexJoin(onCondition, name, joinAlias));
                        //拼装knex
                        type = item.type ? item.type.toLowerCase() : 'inner';
                        cls[type + 'Join'](joinTable + ' AS ' + joinAlias, func);
                    }
                });
            })();
        }
    };

    /**
     *
     * @param cls
     * @param data
     * @param options
     * @returns {string}
     */


    _class.prototype.parseSql = function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cls, data, options) {
            var caseList, optType, n, mt;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            caseList = {
                                SELECT: { join: 1, where: 1, field: 1, limit: 1, order: 1, group: 1 },
                                ADD: {},
                                UPDATE: { where: 1 },
                                DELETE: { where: 1 },
                                COUNT: { join: 1, where: 1, limit: 1, group: 1 },
                                SUM: { join: 1, where: 1, limit: 1, group: 1 }
                            };

                            if (!cls) {
                                _context.next = 20;
                                break;
                            }

                            optType = options.method;
                            //处理join

                            if (!(options['join'] && caseList[optType]['join'])) {
                                _context.next = 8;
                                break;
                            }

                            _context.next = 7;
                            return this.parseJoin(cls, data, options);

                        case 7:
                            caseList[optType]['join'] && (caseList[optType]['join'] = 0);

                        case 8:
                            _context.t0 = _regenerator2.default.keys(options);

                        case 9:
                            if ((_context.t1 = _context.t0()).done) {
                                _context.next = 19;
                                break;
                            }

                            n = _context.t1.value;

                            if (!caseList[optType][n]) {
                                _context.next = 17;
                                break;
                            }

                            mt = 'parse' + ORM.ucFirst(n);
                            _context.t2 = mt && ORM.isFunction(this[mt]);

                            if (!_context.t2) {
                                _context.next = 17;
                                break;
                            }

                            _context.next = 17;
                            return this[mt](cls, data, options);

                        case 17:
                            _context.next = 9;
                            break;

                        case 19:
                            return _context.abrupt('return', cls.toString());

                        case 20:
                            _context.next = 24;
                            break;

                        case 22:
                            _context.prev = 22;
                            _context.t3 = _context['catch'](0);

                        case 24:
                            return _context.abrupt('return', '');

                        case 25:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 22]]);
        }));

        function parseSql(_x4, _x5, _x6) {
            return _ref2.apply(this, arguments);
        }

        return parseSql;
    }();

    /**
     *
     * @param cls
     * @param data
     * @param options
     * @returns {string}
     */


    _class.prototype.buildSql = function buildSql(cls, data, options) {
        if (options === undefined) {
            options = data;
        }
        //防止外部options被更改
        var parseOptions = ORM.extend({}, options);
        return this.parseSql(cls, data, parseOptions);
    };

    return _class;
}(_base3.default);

exports.default = _class;