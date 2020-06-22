module.exports = (sequelize, DataTypes) => {
    const callTransfer = sequelize.define('callTransfer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        callId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        callTransferTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, { tableName: 'callTransfer', timestamps: false });

    callTransfer.associate = (models) => {
        models.callTransfer.hasOne(models.call, { foreignKey: 'callTransferId' });
        models.callTransfer.belongsTo(models.callDestination, { foreignKey: { name: 'destinationId', allowNull: false } });
    };

    return callTransfer;
};