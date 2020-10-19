module.exports = (sequelize, DataTypes) => {
    const caller = sequelize.define('caller', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phoneNumber: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        accountNumber: {
            type: DataTypes.STRING(10)
        },
        contact_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        firstContactDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        lastContactDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isExternal: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 1
        }
    }, { tableName: 'caller', timestamps: false });

    caller.associate = (models) => {
        models.caller.hasMany(models.call, { foreignKey: 'callerId' });
    };

    return caller;
};