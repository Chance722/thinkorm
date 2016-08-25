var knex = require('knex');
var Test = require('../support/test-runner');
describe('Query Generation ::', function () {
    describe('Grouping statements with AND', function () {
        it('should generate a query when an AND statement', function (done) {
            Test({
                outcomes: [
                    {
                        dialect: 'mysql',
                        config: {
                            db_type: 'mysql',
                            db_host: '192.168.99.100',
                            db_port: 3306,
                            db_name: 'test',
                            db_user: 'root',
                            db_pwd: '',
                            db_prefix: 'think_',
                            db_charset: 'utf8',
                            db_ext_config: {safe: true, db_log_sql: true, db_pool_size: 10}
                        },
                        options: {method: 'SELECT'},
                        client: knex({client: 'mysql'}).select().from('think_user AS User'),
                        query: {
                            where: {firstName: 'foo', lastName: 'bar'}
                        },
                        sql: "select * from `think_user` as `User` where `User`.`firstName` = 'foo' and `User`.`lastName` = 'bar'"
                    },
                    {
                        dialect: 'postgresql',
                        config: {
                            db_type: 'postgresql',
                            db_host: '192.168.99.100',
                            db_port: 5432,
                            db_name: 'test',
                            db_user: 'root',
                            db_pwd: '',
                            db_prefix: 'think_',
                            db_charset: 'utf8',
                            db_ext_config: {safe: true, db_log_sql: true, db_pool_size: 10}
                        },
                        options: {method: 'SELECT'},
                        client: knex({client: 'postgresql'}).select().from('think_user AS User'),
                        query: {
                            where: {firstName: 'foo', lastName: 'bar'}
                        },
                        sql: "select * from \"think_user\" as \"User\" where \"User\".\"firstName\" = 'foo' and \"User\".\"lastName\" = 'bar'"
                    }
                ]
            }, done);
        });
    });
});