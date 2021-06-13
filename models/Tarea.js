const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Proyecto = require('../models/Proyecto');


const Tarea = db.define('tareas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: DataTypes.STRING(100),
    estado: DataTypes.INTEGER(1)
});

Tarea.belongsTo(Proyecto);

module.exports = Tarea;
