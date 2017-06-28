/** Modele users */
module.exports = function(sequelize, DataTypes) {

    var Users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id', 
            autoIncrement: true,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        login: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
          type: DataTypes.ENUM,
          values: ['SADMIN', 'ADMIN', 'USER']
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
    }, {
        deletedAt: false,
        freezeTableName: true 
    });
    return Users;
};
