module.exports = (sequelize, DataTypes) => {
    const callInitiation = sequelize.define('callInitiation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        callId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        callInitiationTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, { tableName: 'callInitiation', timestamps: false });

    callInitiation.associate = (models) => {
        models.callInitiation.hasOne(models.call, { foreignKey: 'callInitiationId' });
    };

    return callInitiation;
};