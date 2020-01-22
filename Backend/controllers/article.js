'use strict'

var controller = {

    datosCurso: (req, res) => {
        return res.status(200).send({
            message: 'Hello'
        })
    }
}

module.exports = controller;