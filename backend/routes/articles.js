var express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/articles', function (req, res, next) {
  res.json({
    articles: "articles"
  });
});

module.exports = router;
