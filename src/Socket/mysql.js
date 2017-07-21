/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2016 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    16/7/25
 */
const base = require('../base');
const lib = require('../Util/lib');
const schema = require('../schema');
const awaitjs = require('../Util/await');
const mysql = require('mysql');

module.exports = class extends base {
    init(config = {}) {
        this.config = {
            database: config.db_name,
            host: config.db_host || '127.0.0.1',
            user: config.db_user || 'root',
            password: config.db_pwd || '',
            port: config.db_port || 3306,
            encoding: config.db_charset || 'utf8',
            connectTimeout: config.db_timeout * 1000 || 10000, //try connection timeout
            connectionLimit: config.db_ext_config.db_pool_size || 10,
            db_ext_config: config.db_ext_config || {}
        };
        //node-mysql2 not support utf8 or utf-8
        let charset = (this.config.encoding || '').toLowerCase();
        if (charset === 'utf8' || charset === 'utf-8') {
            this.config.charset = 'UTF8_GENERAL_CI';
        }
        this.pool = null;
        this.connection = null;
    }

    connect() {
        if (this.connection) {
            return Promise.resolve(this.connection);
        }
        //use pool
        if (this.pool) {
            let fn = lib.promisify(this.pool.getConnection, this.pool);
            return fn().then(conn => {
                this.connection = conn;
                return this.connection;
            }).catch(e => {
                this.close();
                return Promise.reject(e);
            });
        }
        let config = this.config;
        if (this.connectionLimit) {
            this.pool = mysql.createPool(config);
            return this.connect();
        }

        let connectKey = `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
        if (config.db_ext_config.forceNewNum) {
            connectKey = `${connectKey}_${config.db_ext_config.forceNewNum}`;
        }

        if (!schema.connections) {
            schema.connections = new awaitjs();
        }
        return schema.connections.run(connectKey, () => {
            let deferred = lib.getDefer();
            let connection = mysql.createConnection(config);
            connection.connect(err => {
                if (err) {
                    this.close();
                    deferred.reject(err);
                } else {
                    deferred.resolve(connection);
                }
            });
            connection.on('error', () => {
                this.close();
                deferred.reject('DB connection error');
            });
            connection.on('end', () => {
                this.close();
                deferred.reject('DB connection end');
            });
            this.connection = connection;
            if (this.deferred) {
                this.deferred.reject(new Error('DB connection closed'));
            }
            this.deferred = deferred;
            return this.deferred.promise;
        });
    }

    close() {
        if (this.pool) {
            this.pool.end();
            this.pool = null;
        } else {
            if (this.connection) {
                this.connection.end();
                this.connection = null;
            }
        }
    }
};
