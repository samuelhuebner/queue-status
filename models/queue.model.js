module.exports = (sequelize, DataTypes) => {
    const queue = sequelize.define('queue', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phoneNumber: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        callsWaiting: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        }
    }, { tableName: 'queue', timestamps: false });

    return queue;
};