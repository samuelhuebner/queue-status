module.exports = (sequelize, DataTypes) => {
    const callPickup = sequelize.define('callPickup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        callId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        callPickupTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, { tableName: 'callPickup', timestamps: false });

    callPickup.associate = (models) => {
        models.callPickup.hasOne(models.call, { foreignKey: 'callPickupId' });
    };

    return callPickup;
};