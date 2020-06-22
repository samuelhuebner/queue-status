module.exports = (sequelize, DataTypes) => {
    const callDestination = sequelize.define('callDestination', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        accountNumber: {
            type: DataTypes.SMALLINT(3).UNSIGNED
        },
        userName: {
            type: DataTypes.STRING()
        },
        number: {
            type: DataTypes.STRING(30)
        }
    }, { tableName: 'callDestination', timestamps: false });

    callDestination.associate = (models) => {
        models.callDestination.hasMany(models.callRinging, { foreignKey: { name: 'destinationId' } });
        models.callDestination.hasMany(models.callTransfer, { foreignKey: { name: 'destinationId' } });
    }

    return callDestination;
}