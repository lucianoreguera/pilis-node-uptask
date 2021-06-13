const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');


exports.home = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({where: {usuarioId}});

    res.render('index', {
        title: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({where: {usuarioId}});

    res.render('nuevo-proyecto', {
        title: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {
    const { nombre } = req.body;
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({where: {usuarioId}});

    let errores = [];

    if (!nombre.trim()) {
        errores.push({'mensaje': 'El campo nombre es obligatorio'});
    }

    if (errores.length > 0) {
        return res.render('nuevo-proyecto', {
            title: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }

    await Proyecto.create({ nombre, usuarioId });

    res.redirect('/');
};

exports.ProyectoPorUrl = async (req, res, next) => {
    const url = req.params.url;

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyecto.findAll({where: {usuarioId}});
    
    const proyectoPromise = Proyecto.findOne({
        where: {
            url,
            usuarioId
        }
    });


    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    const tareas = await Tarea.findAll(
        {
            where: 
                { 
                    proyectoId: proyecto.id 
                },
                // Join a Proyecto
                // include: [
                //     { model:Proyecto }
                // ]
        });

    if (!proyecto) return next();

    res.render('tareas', {
        title: 'Tareas del Proyecto',
        proyecto,
        proyectos, 
        tareas
    });
};

exports.formularioEditar = async (req, res) => {
    
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyecto.findAll({where: {usuarioId}});
    
    const proyectoPromise = Proyecto.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevo-proyecto', {
        title: 'editar Proyecto',
        proyectos,
        proyecto
    });
};

exports.actualizarProyecto = async (req, res) => {
    const { nombre } = req.body;
    const proyectos = await Proyecto.findAll();

    let errores = [];

    if (!nombre.trim()) {
        errores.push({'mensaje': 'El campo nombre es obligatorio'});
    }

    if (errores.length > 0) {
        return res.render('nuevo-proyecto', {
            title: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }

    await Proyecto.update(
        { nombre },
        { where: {id: req.params.id} }
    );

    res.redirect('/');
};

exports.eliminarProyecto = async (req, res, next) => {
    const {urlProyecto} = req.query;

    const resultado = await Proyecto.destroy({where: { url: urlProyecto }});

    if (!resultado) return next();

    res.status(200).send('Proyecto eliminado correctamente');
};
