const Usuario = require('../models/Usuario');
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        title: 'Crear Cuenta en UpTask'
    });
};

exports.crearCuenta = async (req, res) => {
    const { email, password} = req.body;

    try {
        await Usuario.create({
            email, 
            password
        });

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email
        };

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        });
        
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        return res.redirect('/iniciar-sesion');
    } catch (error) {
        const err = error.errors.map(error => error.message) || [];
        req.flash('error', err);
        res.render('crear-cuenta', {
            title : 'Crear Cuenta en Uptask', 
            mensajes: req.flash(),
            email,
            password
        });
    }
};

exports.formIniciarSesion = (req,res) => {
    // const {error} = req.locals.mensajes;

    res.render('iniciar-sesion', {
        title: 'Iniciar Sesión en UpTask',
        // error
    });
};

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        title: 'Reestablecer tu Contraseña'
    });
};

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuario.findOne({
        where: {
            email: req.params.email
        }
    });

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

};
