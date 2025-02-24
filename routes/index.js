var express = require('express');
var router = express.Router();
var authRoutes = require('./authRoutes')
var blogs = require('./blogs')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', authRoutes)
router.use('/blog', blogs)
module.exports = router;
