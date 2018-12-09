var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')(databaseString);

/* GET home page. */
router.get('/', function(req, res, next) {
  var db =req.db;
  var posts= db.get('posts');
  posts.find({},{ sort : { date : -1 } },function(err,posts){
    res.render('index', { title: 'Home', posts : posts});
  })
});

module.exports = router;
