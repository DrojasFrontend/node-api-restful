'use strict'

var validator = require('validator');
var Article = require('../models/article');

var controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: 'Hello'
        })
    },

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content)
        } catch (err) {
            return res.status(200).send({
                status: 'Error',
                message: 'Faltan datos por enviar',
            })
        }

        if(validate_title && validate_content) {

            // Crear el objeto a guardar
            var article = new Article();
            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el articulo
            article.save((err, articleStored) => {
                if(err || !articleStored) {
                    return res.status(404).send({
                        status: 'Error',
                        message: 'el articulo no se ha guardado'
                    })
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'Success',
                    article: articleStored
                })
            })            
        } else {
            return res.status(400).send({
                status: 'Error',
                message: 'los datos no son validos'
            })
        }

        
        
    },

    getArticles: (req, res) => {
        var query =Article.find({})
        var last = req.params.last;
        if(last || last != undefined) {
            query.limit(5)
        }
        // Sacar datos de la base datos
        query.sort('-_id').exec((err, articles) => {
            if(err) {
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al devolver los articulos'
                })
            }

            if(!articles) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay articulos para mostrar'
                })
            }

            return res.status(200).send({
                status: 'Success',
                articles
            })
        })

        
    },

    getArticle: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;
        if(!articleId || articleId == null) {
            return res.status(404).send({
                status: 'Error',
                message: 'No existe el articulo'
            })
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if(err) {
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al devolver los datos'
                })
            }

            if(!article) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'No existe el articulo'
                })
            }

            return res.status(404).send({
                status: 'Success',
                article
            })
        });
    },

    update: (req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id
        // Recoger los datos que llegan por put
        var params = req.body

        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'Error',
                message: 'Faltan datos por enviar'
            })
        }

        if(validate_title && validate_content) {
            // Buscar y actualizar articulo
            Article.findByIdAndUpdate({_id: articleId}, params, 
                { new: true },
                ( err, articleUpdated ) => {
                    if(err) {
                        return res.status(500).send({
                            status: 'Error',
                            message: 'Error al actualizar'
                        })
                    }

                    if(!articleUpdated) {
                        return res.status(500).send({
                            status: 'Error',
                            message: 'No existe el articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'Success',
                        article: articleUpdated
                    });
                });

        } else {
            // Devolver respuesta
            return res.status(200).send({
                status: 'Error',
                message: 'La validacion no es correcta'
            })
        }

       

    },

    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;
        // Encontrar y borrar
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err) {
                return res.status(500).send({
                    status: 'Success',
                    message: 'Error al borrar'
                })
            }

            if(!articleRemoved) {
                return res.status(404).send({
                    status: 'Success',
                    message: 'No se ha borrado el articulo, posiblemente no existe'
                })
            }

            return res.status(200).send({
                status: 'Success',
                message: articleRemoved
            })
        })
    }
}

module.exports = controller;