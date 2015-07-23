var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.100.0.5/pitchhike');

mongoose.model('user', new mongoose.Schema({
  userid:       String,
  password:     String,
  name:		String,
  image:	String,
  language:     String,
  rate:         Number,
  location:	[Number],
  fullname:     String,
  birthday:     String,
  gender:       String,
  hobbies:      String,
  job:          String,
  dream:        String,
  from:         String
}));
User = mongoose.model('user');

mongoose.model('pitch', new mongoose.Schema({
  status:       String,
  student:      String,
  teacher:      String,
  arrive:       Number
}));
Pitch = mongoose.model('pitch');

mongoose.model('topic', new mongoose.Schema({
  topic:        String
}));
Topic = mongoose.model('topic');


// ログイン
app.get('/login', function(req, res, next){
});

// ユーザ一覧取得
app.get('/getUsers', function(req, res, next){
  User.find({}, function(err, docs){
    var list = [];
    docs.forEach(function(m){
      list.push(m);
    });
    res.send(list);
  });
});

// 最も近い教師をリクエスト
app.get('/requestTeacher', function(req, res, next){
  User.findOne({ location : { $near : [req.param("lng"), req.param("lat")] }, language:req.param("lang") }, function(err, doc){
    var teacher = doc.toObject();
    // studentの位置情報を更新
    User.findOne({ userid:req.param("userid") }, function(err, doc){
      doc.location = [req.param("lng"),req.param("lat")];
      doc.save(function(err){
      });
    });
    // pitchレコード（ステータス：リクエスト中）を作成
    var pitchRecord = new Pitch();
    pitchRecord.status = "req";
    pitchRecord.student = req.param("userid");
    pitchRecord.teacher = teacher.userid;
    pitchRecord.save(function(err){
      res.send(pitchRecord);
    });
  });
});

// ユーザ参照
app.get('/getUser', function(req, res, next){
  User.findOne({userid:req.param("userid")}, function(err, doc){
    res.send(doc);
  });
});

// 教師リクエスト状況取得
app.get('/getRequestStatus', function(req, res, next){
  Pitch.findOne({_id:req.param("_id")}, function(err, doc){
    res.send(doc);
  });
});

// 教師リクエスト受諾
app.get('/responseTeacher', function(req, res, next){
  // pitchレコードのステータスをレスポンス有に設定
  Pitch.findOne({ _id:req.param("_id") }, function(err, doc){
    doc.status = "res";
    doc.teacher = req.param("userid");
    doc.save(function(err){
    });
    res.send(doc);
  });
});

// 到着までの時間を更新
app.get('/updateArrive', function(req, res, next){
  Pitch.findOne({ _id:req.param("_id") }, function(err, doc){
    doc.arrive = req.param("arrive");
    doc.save(function(err){
    });
    res.send(doc);
  });
});

// ピッチング成立〜決済〜ルート案内開始
app.get('/createPitching', function(req, res, next){
});

// ピッチングキャンセル
app.get('/cancelPitching', function(req, res, next){
  // pitchレコードのステータスをキャンセルに設定
  Pitch.findOne({ _id:req.param("_id") }, function(err, doc){
    doc.status = "cancel";
    doc.save(function(err){
    });
    res.send(doc);
  });
});

// ピッチング開始
app.get('/startPitching', function(req, res, next){
});

// トピック取得
app.get('/getTopics', function(req, res, next){
  Topic.find({}, function(err, doc){
    res.send(doc);
  });
});

// ユーザ登録
app.get('/registUser', function(req, res, next){
});

// ユーザ更新
app.get('/updateUser', function(req, res, next){
});

// ユーザの評価更新
app.get('/updateUserRate', function(req, res, next){
  // userレコードのRateを更新
  User.findOne({ userid:req.param("userid") }, function(err, doc){
    if(!('rate' in doc) || !doc.rate){
      // 初評価の場合は3を基準にして計算
      doc.rate = 3;
    }
    doc.rate = (doc.rate + parseInt(req.param("rate"))) / 2;
    doc.save(function(err){
    });
    res.send(doc);
  });
});

// ユーザ削除
app.get('/deleteUser', function(req, res, next){
});

app.listen(8080);

