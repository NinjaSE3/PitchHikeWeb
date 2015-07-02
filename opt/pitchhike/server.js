var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.100.0.5/pitchhike');

mongoose.model('teacher', new mongoose.Schema({
  name:		String,
  image:	String,
  language:     String,
  rank:		Number,
  location:	[Number]
}));
Teacher = mongoose.model('teacher');

app.get('/nearestTeacher', function(req, res, next){
  Teacher.findOne({ location : { $near : [req.param("lng"), req.param("lat")] }, language:req.param("lang") }, function(err, doc){
    var teacher = doc.toObject();
    teacher.distance=120; // 距離を計算
    teacher.time=5; // 距離を計算
    res.send(teacher);
  });
});

app.get('/teachers', function(req, res, next){
  Teacher.find({}, function(err, docs){
    var list = [];
    docs.forEach(function(m){
      list.push(m);
    });
    res.send(list);
  });
});

app.listen(8080);
