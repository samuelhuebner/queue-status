module.exports = (sequelize, DataTypes) => {
    const call = sequelize.define('call', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        callId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wasSuccessful: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0
        },
        calledNumber: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        tableName: 'call',
        timestamps: false
    });

    call.associate = (models) => {
        models.call.belongsTo(models.caller, { foreignKey: { name: 'callerId', allowNull: false } });
        models.call.belongsTo(models.callInitiation, { foreignKey: { name: 'callInitiationId', allowNull: true } });
        models.call.belongsTo(models.callRinging, { foreignKey: { name: 'callRingingId', allowNull: true } });
        models.call.belongsTo(models.callPickup, { foreignKey: { name: 'callPickupId', allowNull: true } });
        models.call.belongsTo(models.callTransfer, { foreignKey: { name: 'callTransferId', allowNull: true } });
        models.call.belongsTo(models.callEnding, { foreignKey: { name: 'callEndingId', allowNull: true } });
    }

    return call;
}