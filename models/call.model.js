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
        callInitiationTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        callPickupTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        callEndingTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        calledNumber: {
            type: DataTypes.INTEGER(30),
            allowNull: false
        }
    }, { tableName: 'call', timestamps: false });

    call.associate = (models) => {
        models.call.belongsTo(models.caller, { foreignKey: { name: 'callerId', allowNull: false } });
        models.call.belongsTo(models.callDestination, { foreignKey: { name: 'destinationId', allowNull: true } });
    }

    return call;
}