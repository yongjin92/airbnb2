var express = require('express'),
    Post = require('../models/Post'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

function validateForm(form, options) {
  var title = form.title || "";
  var city = form.city || "";
  var address = form.address || "";
  var price = form.price || "";
  var rule = form.rule || "";
  var content = form.content || "";
  
  title = title.trim();

if (!title) {
    return '숙소 이름을 입력해주세요.';
  }

  if (!city) {
    return '도시를 입력해주세요.';
  }
  
  if (!address) {
    return '주소 입력해주세요.';
  }

  if (!price) {
    return '요금을 입력해주세요.';
  }

  if (!rule) {
    return '규칙를 입력해주세요.';
  }

  if (!content) {
    return '주의사항을 입력해주세요.';
  }
  
  return null;
}

/* GET users listing. */
router.get('/',needAuth, function(req, res, next) {
  User.find({}, function(err, users){
    if (err) {
      return next(err);
    }
    Post.find({}, function(err, posts) {
      if(err){
        return next(err);
    }
    res.render('posts/index', {users: users, posts: posts});
    });
  });

});
router.get('/new', needAuth, function(req, res, next) {
  res.render('posts/new', {messages: req.flash()});
});

router.get('/:id/edit',needAuth, function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post, messages: req.flash()});
  });
});

router.put('/:id',needAuth, function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      req.flash('danger', '존재하지 않는 게시물입니다.');
      return res.redirect('back');
    }

    post.title = req.body.title;
    post.address = req.address;
    
    post.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '게시물 정보가 변경되었습니다.');
      res.redirect('/posts');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '게시물이 삭제되었습니다.');
    res.redirect('/posts');
  });
});

router.get('/:id',needAuth, function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/show', {post: post});
  });
});

router.post('/', needAuth, function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var newPost = new Post({
    title: req.body.title,
    city: req.body.city,
    address: req.body.address,
    price: req.body.price,
    rule: req.body.rule,
    content: req.body.content,
    owner: {
      _id: req.user._id,
      username: req.user.name
    }
  });
  
  newPost.save(function(err) {
    if (err) {
      return next(err);
    } else {
      req.flash('success', '작성이 완료되었습니다.');
      res.redirect('/posts');
    }
  });
});


module.exports = router;