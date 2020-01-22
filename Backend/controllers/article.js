'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
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
    },

    upload: (req, res) => {
        // Configurar el modulo del connect multiparty en router/article.js
        //console.log(req.body, req.files);

        // Recoger el fichero de la peticion
        var file_name = 'Imagen no subida .....';

        if(!req.files) {
            return res.status(404).send({
                status: 'Error',
                message: file_name
            })
        }

        // Conseguir nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA E LINUX O MAC
        //var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];
        // Extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1]

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'Error',
                    message: 'La extension de la imagen no es valida'
                }) 
            })
        } else {
            // Si todo es valido, sacando id de la url
            var articleId = req.params.id

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                if(err || !articleUpdated) {
                    return res.status(400).send({
                        status: 'Error',
                        message: 'Error al guardar la imagen de articulo'
                    }) 
                }

                return res.status(200).send({
                    status: 'success',
                    message: articleUpdated
                }) 
            })
            
        }

        
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            console.log(exists)
            if(exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'Error',
                    message: 'La imagen no existe'
                })
            }
        })
        
    },

    search: (req, res) => {
        // Sacar el string abuscar
        var searchString = req.params.search

        Article.find({ "$or" : [
            { "title": { "$regex": searchString, "$options": "i" } },
            { "content": { "$regex": searchString, "$options": "i" } }
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            
            if(err) {
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la peticion'
                })
            }

            if(!articles || articles.length <= 0) {
                return res.status(500).send({
                    status: 'Error',
                    message: 'No hay articulos que conincidan con tu busqueda'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            })
        })
    }
}

module.exports = controller;