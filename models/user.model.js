module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isValidated: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0
        },
        validationToken: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return user;
};