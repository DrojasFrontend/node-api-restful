'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();
var multipart = require('connect-multiparty');
// Middleware (funcionalidad que se ejecuta antes de que llegue al metodo)
var md_upload = multipart({ uploadDir: './upload/articles' });

router.get('/test-de-controlador', ArticleController.test);
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;