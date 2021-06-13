const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');


exports.agregarTarea = async (req, res) => {
    const proyecto = await Proyecto.findOne({where: { url: req.params.url }});

    const tarea = req.body.tarea;
    const estado = 0;
    const proyectoId = proyecto.id;

    // console.log({tarea, estado, proyectoId}); return;

    const resultado = await Tarea.create({tarea, estado, proyectoId});

    if (!resultado) return next();

    res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tarea.findOne({where: {id}});

    let estado = 0;

    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Tarea actualizada');
};

exports.eliminarTarea = async (req, res, next) => {
    const {id} = req.params;

    const resultado = await Tarea.destroy({where: {id}});

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada');
};
