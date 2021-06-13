const express = require('express');
const { body } = require('express-validator');
const proyectos = require('../controller/proyectos');
const tareas = require('../controller/tareas');
const usuarios = require('../controller/usuarios');
const auth = require('../controller/auth');


const router = express.Router();

module.exports = function() {
    router.get(
        '/', 
        auth.usuarioAutenticado, 
        proyectos.home
    );
    router.get(
        '/nuevo-proyecto',
        auth.usuarioAutenticado,
        proyectos.formularioProyecto
    );
    router.post(
        '/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        auth.usuarioAutenticado,
        proyectos.nuevoProyecto
    );

    router.get(
        '/proyectos/:url', 
        auth.usuarioAutenticado,
        proyectos.ProyectoPorUrl
    );
    router.get(
        '/proyecto/editar/:id',
        auth.usuarioAutenticado,
        proyectos.formularioEditar
    );
    router.post(
        '/nuevo-proyecto/:id',
        body('nombre').not().isEmpty().trim().escape(),
        auth.usuarioAutenticado,
        proyectos.actualizarProyecto);
    router.delete(
        '/proyectos/:url', 
        auth.usuarioAutenticado,
        proyectos.eliminarProyecto
    );

    router.post(
        '/proyectos/:url', 
        auth.usuarioAutenticado,
        tareas.agregarTarea
    );

    router.patch(
        '/tareas/:id', 
        auth.usuarioAutenticado,
        tareas.cambiarEstadoTarea
    );
    router.delete(
        '/tareas/:id', 
        auth.usuarioAutenticado,
        tareas.eliminarTarea
    );

    router.get('/crear-cuenta', usuarios.formCrearCuenta);
    router.post('/crear-cuenta', usuarios.crearCuenta);
    router.get('/confirmar/:email', usuarios.confirmarCuenta);

    router.get('/iniciar-sesion', usuarios.formIniciarSesion);
    
    router.get('/reestablecer', usuarios.formRestablecerPassword);
    router.post('/reestablecer', auth.enviarToken);
    router.get('/reestablecer/:token', auth.validarToken);
    router.post('/reestablecer/:token', auth.actualizarPassword);

    router.post('/iniciar-sesion', auth.autenticarUsuario);
    router.get('/cerrar-sesion', auth.cerrarSesion);

    return router;
};
