module.exports = (sequelize, DataTypes) => {
    const keyEndedReason = sequelize.define('keyEndedReason', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        successful: {
            type: DataTypes.TINYINT(1),
            allowNull: false
        }
    }, { tableName: 'keyEndedReason', timestamps: false });

    keyEndedReason.associate = (models) => {
        models.keyEndedReason.hasMany(models.call, { foreignKey: 'keyEndedReasonId' });
    }

    return keyEndedReason;
}