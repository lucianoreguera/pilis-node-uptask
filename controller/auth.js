const passport = require('passport');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const Usuario = require('../models/Usuario');
const enviarEmail = require('../handlers/email');


const Op = Sequelize.Op;


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {

    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/iniciar-sesion');
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
};

exports.enviarToken = async (req, res) => {
    const {email} = req.body;
    const usuario = await Usuario.findOne({where: { email }});

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    console.log(resetUrl);
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset', 
        resetUrl, 
        archivo : 'reestablecer-password'
    });

    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token
        }
    });

    if(!usuario) {
        req.flash('error', 'No Válido');
        return res.redirect('/reestablecer');
    }

    res.render('reset-password', {
        title : 'Reestablecer Contraseña'
    });
};

exports.actualizarPassword = async (req, res) => {

    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!usuario) {
        req.flash('error', 'No Válido');
        return res.redirect('/reestablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
};
