const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const db = require('../config/db');
const Proyecto = require('../models/Proyecto');


const Usuario = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull : false, 
        validate: {
            isEmail: {
                msg : 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'El e-mail no puede ir vacio'
            },
        }, 
        unique: {
            args: true,
            msg: 'Usuario Ya Registrado'
        }
    },  
    password: {
        type: DataTypes.STRING(60), 
        allowNull: false, 
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    }, 
    activo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }, 
    token: DataTypes.STRING, 
    expiracion: DataTypes.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
        }
    }
});

Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

Usuario.hasMany(Proyecto);

module.exports = Usuario;
