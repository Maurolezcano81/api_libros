const express = require('express');
const libRout = express.Router();
const libros = require('../data');
const Joi = require('joi');

const libroFormato = Joi.object({
    titulo: Joi.string().required().label('Título'),
    autor: Joi.string().required().label('Autor'),
})

libRout.get('/', (req, res, next) => {
    try{
        res.json(libros)
    } catch(err){
        next(err);
    }
});

libRout.get('/:id', (req, res, next) => {
    try{
        const id = req.params.id;
        const libro = libros.find(l => l.id === id
        );

        if(!libro){
            const error = new Error("Libro no encontrado");
            error.status = 404;
            throw error;
        }

        res.json(libro);
    }   
    catch(err){
        next(err);
    }
});

libRout.post('/', (req, res, next)=>{
    try{
        const {error, value} = libroFormato.validate(req.body);
        if(error){
            const errorValidacion = new Error("Error en la validacion");
            errorValidacion.status = 400;
            errorValidacion.details = error.details.map( detail => detail.message);
            throw errorValidacion;
        }
        const {autor, titulo} = value;

        const nuevoLibro = {
            id: libros.length+1,
            titulo,
            autor
        }

        libros.push(nuevoLibro);
        res.status(201).json(nuevoLibro);
    } catch(error){
        next(error);
    }
})

libRout.put('/:id', (req, res,next) =>{
    try{
        const id = req.params.id;
        const {error, value} = libroFormato.validate(req.body);

        if(error){
            const errorValidacion = new Error("Error en la validacion");
            errorValidacion.status = 400;
            errorValidacion.details = error.details.map( detail => detail.message);
            throw errorValidacion;
        }

        const {autor, titulo} =value;
        const libro = libros.find(l => l.id === id);

        if(!libro){
            const error = new Error("Libro no encontrado");
            error.status = 404;
            throw error;
        }


        libro.titulo = titulo || libro.titulo;
        libro.autor = autor || libro.autor;

        res.json({ message: "Libro actualizado correctamente" });
    } catch(error){
        next(error);
    }
});

libRout.delete('/:id', (req, res,next) =>{
    try{
        const id = req.params.id;
        const index = libros.findIndex((libro) => libro.id === id);

        if(index === -1){
            const error = new Error("Libro no encontrado");
            error.status = 404;
            throw error;
        };

        const libroEliminado = libros.splice(index, 1);
        res.json(libroEliminado[0]);
    } catch(error){
        next(error);
    }
});

module.exports = libRout;