module.exports = (sequelize, DataTypes) => {
    const callEnding = sequelize.define('callEnding', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        callId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        callEndingTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, { tableName: 'callEnding', timestamps: false });

    callEnding.associate = (models) => {
        models.callEnding.hasOne(models.call, { foreignKey: 'callEndingId' });

        models.callEnding.belongsTo(models.keyEndedReason, { foreignKey: { name: 'keyEndedReasonId', allowNull: true } });
    };

    return callEnding;
};