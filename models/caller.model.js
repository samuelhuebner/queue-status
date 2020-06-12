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
        }
    }, { tableName: 'caller', timestamps: false });

    caller.associate = (models) => {
        models.caller.hasMany(models.call, { foreignKey: { name: 'callerId'} });
    }

    return caller;
}