/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2016 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    16/7/26
 */
var path = require('path');
var thinkorm = require('../index.js');

var config = {
    db_type: 'mongo',
    db_host: '127.0.0.1',
    db_port: 27017,
    db_name: 'test',
    db_user: 'root',
    db_pwd: 'richenlin',
    db_prefix: 'think_',
    db_charset: 'utf8',
    db_ext_config: {safe: false, db_log_sql: true, db_pool_size: 10, read_write: false}
};

//thinkorm.require需要使用绝对路径
var User = thinkorm.require(path.dirname(__dirname) + '/exmple/model/lib/User.js');
var Profile = thinkorm.require(path.dirname(__dirname) + '/exmple/model/lib/Profile.js');
var Pet = thinkorm.require(path.dirname(__dirname) + '/exmple/model/lib/Pet.js');
var Group = thinkorm.require(path.dirname(__dirname) + '/exmple/model/lib/Group.js');
var UserGroup = thinkorm.require(path.dirname(__dirname) + '/exmple/model/lib/UserGroup.js');

//加载模型类
thinkorm.setCollection(User, config);
thinkorm.setCollection(Profile, config);
thinkorm.setCollection(Pet, config);
thinkorm.setCollection(Group, config);
thinkorm.setCollection(UserGroup, config);

//数据结构迁移
// thinkorm.migrate(config);

//实例化模型
var model = new User(config);

//查询语言测试
return model
// .where({id: {'<>': 1, '>=': 0}, name: 'rrrrrrr', or: [{name: 'aa'},{name: 'aaa'}], not: {name: 1, id: 2}, notin: {name: [1,2,3]}}).find()
// .where({num: {'>=': 0}}).count()
// .where({id: {'>=': 0}}).sum('num')
// .where({num: {'>=': 0}}).select()
// .where({name: {'like': 'r%'}}).find()
// .where({not: {name: 'rrrrrrrrrrrrr', id: 1}}).select()
// .where({notin: {'id': [1,2,3]}}).select()
// .where({name: {'like': '%a'}}).select()
// .where({id: [1,2,3]}).select()
//
// .where({id: {'<>': 1, '>=': 0, notin: [1,2,3]}, name: ['aa', 'rrrrrrr'], notin: {'id': [1,2,3], num: [1,2,3]}, not: {name: '', num: [1,2,3]}, memo: {'like': '%a'}, or: [{name: 'aa', id: 1}, {name: 'rrrrrrr', id: {'>': 1}}]}).find()
// .where({'and': {id: 1, name: 'aa'}}).find()//and做key
// .where({or: [{id: 1, name: {or: [{name: 'aa'}, {memo: 'aa'}]}}, {memo: 'aa'}]}).find()//or嵌套
// .where({in: {id: [1,2,3], num: [2,3]}}).find()//in做key
// .where({'operator': {id: {'<>': 1, '>=': 0}}}).find()//operator做key
.select({field: 'id', limit: 1, order: {id: 'desc'}, where: {name: {'<>': '', not: 'aa', notin: ['aa', 'rrr'], like: '%a'}}}) //options高级用法

// .where({id: {'<>': 1, '>=': 2, '>': 0,'<': 100, '<=': 10}}).alias('test').select()
// .countSelect()
// .join([{from: 'Profile', alias: 'pfile', on: {or: [{profile: 'id'}], profile: 'id'}, field: ['id as aid', 'test'], type: 'left'}]).find({field: ['id']})
// .field(['id','name']).join([{from: 'Profile', on: {or: [{profile: 'id'}, {name: 'test'}], profile: 'id'}, field: ['id', 'test'], type: 'left'}]).countSelect({field: ['name', 'num']})
//     .select({field: ['id','name'], join: [{from: 'Profile', on: {or: [{profile: 'id'}, {name: 'test'}], profile: 'id'}, field: ['Profile.id as pid', 'test'], type: 'left'}]})
//     .field(['id', 'name']).where({id: {'>=': 0}}).group('name').countSelect()
    // .rel(true).where({id: 4}).find()
    // .add({name: 'rrrrrrrrrrrrr',Prof、ile: {test: ['rrrtest']},Pet: [{types: 'ssfsssss'}],Group: [{name: 'ssfsssss'}]})
    // .where({id: 3}).update({name: 'ttttttrrrrr',Profile: {test: ['ttttttt']}})
    // .add({name: 'rrrrrrrrrrrrr',Pet: [{types: 'ssfsssss'}]})
    // .where({id: 1}).update({name: 'ttrrrrrtttt',Pet: [{id: 1,types: 'ttttttt'}]})
    //     .where({id: 1}).update({name: 'ttrrrrrtttt',Pet: [{types: 'ttttttt'}]})
    // .add({name: 'rrrrrrrrrrr',Group: [{name: 'ssfsssss', type: ''}]})
    // .where({id: 1}).update({name: 'ttttrrrrrtt',Group: [{id: 1,name: 'ttttttt'}]})
    //     .where({id: 1}).update({name: 'ttttrrrrrtt',Group: [{name: 'ttttttt'}]})
    // .where({id: 1}).update({name: 'ttttrrrrrtt',Group: [{userid: 115, groupid: 15}]})
    // .query('select * from think_user where id = 1')
    // .where({id:1}).increment('num', 1)
    //     .where({id:1}).decrement('num', 1)

    //.add({name: 'qqqesddfsdqqq'})

    .then(res => {
        echo(res);
    });


//事务测试
/*return model.transaction(function *(t) {
 // for (var i = 1; i < 5; i++) {
 //     yield model.add({name: 'rrrrrrrrrrrrr'});
 //     yield model.add({name: 'rrrrrrr'});
 //     yield model.add({name: 'rrrrrrrrrrrrr'});
 // }
 //Promise.all并行
 var ps = [];
 for (var i = 1; i < 5; i++) {
 ps.push(model.add({name: 'rrrrrrrrrrrrr'}));
 ps.push(model.add({name: 'rrrr'}));
 ps.push(model.add({name: 'rrrrrrrrrrrrr'}));
 }
 return Promise.all(ps);

 //跨模型执行
 // yield model.add({name: 'rrrrrrrrrrrrr'});
 // let profileModel = new Profile(config);
 // yield profileModel.initDB(t).add({test: ['rrrtest']});
 });*/


//function requireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//var lib = requireDefault(require('../lib/Util/lib.js')).default;
//
//console.log(parseInt(''))
//console.log(lib.isJSONStr(111))
//console.log(lib.isJSONStr(undefined))
//console.log(lib.isJSONStr(''))
//console.log(lib.isJSONStr(null))
//console.log(lib.isJSONStr(false))
//console.log(lib.isJSONStr('[]'))
//console.log(lib.isJSONObj([ RowDataPacket { userid: 1, groupid: 1 } ]))