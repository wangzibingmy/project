var express = require('express');
var router = express.Router();
var mysql  =  require('mysql');
var dbConfig = require('../../db/db');
var method = require('../../db/method.js');
// var formidable = require('formidable');
var pool = mysql.createPool( dbConfig.mysql );
var Buffer = require('buffer').Buffer;
var fs=  require('fs');
var path = require('path');

router.post('/',function(req,res,next){
    var title = req.body.title;
    var lookforpic = req.body.lookforpic;
    var fileName = 'look_for_sth'+method.getNowFormatDate()+'.jpg';
    
    var base64Data = lookforpic.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    console.log(dataBuffer);
    fs.writeFile('./public/images/'+fileName, dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          pool.getConnection(function (err, connection) { 
                var avatarName =fileName;
                var sql = 'insert into look_for_sth (title,lookforpic) values(\''+title+'\',\''+avatarName+'\')';
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                        res.send('0');//修改失败
                        return;
                    }else{
                        res.send({avatar:avatarName});
                        return;
                    }
                });
                connection.release();
            }); 
        }
    });
    console.log(fileName);
});
module.exports = router;