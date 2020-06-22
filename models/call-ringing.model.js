module.exports = (sequelize, DataTypes) => {
    const callRinging = sequelize.define('callRinging', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        callId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        callRingingTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, { tableName: 'callRinging', timestamps: false });

    callRinging.associate = (models) => {
        models.callRinging.hasOne(models.call, { foreignKey: 'callRingingId' });

        models.callRinging.belongsTo(models.callDestination, { foreignKey: { name: 'destinationId', allowNull: false } });
    };

    return callRinging;
};