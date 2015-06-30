var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.100.0.24/royalcustomers');

mongoose.model('rank', new mongoose.Schema({
  sid:		String,
  image:	String,
  rank:		Number,
  period:	{
    from:	String,
    to:		String
  },
  area:		{
    shopid:	[Number]
  }
}));
Ranks = mongoose.model('rank');

app.get('/in', function(req, res, next){
  var m = new Ranks();
  m.sid = req.query.sid;
  m.save(function(err){
    res.send('OK');
  });
});

app.get('/myrank', function(req, res, next){
  Ranks.find({}, function(err, docs){
    var list = [];
    docs.forEach(function(m){
      list.push(m);
    });
    res.send(list);
  });
});


app.listen(8080);
