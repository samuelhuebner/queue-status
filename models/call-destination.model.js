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
    }, { tableName: 'snippets_callDestination', timestamps: false });

    callDestination.associate = (models) => {
        models.callDestination.hasMany(models.call);
    }

    return callDestination;
}