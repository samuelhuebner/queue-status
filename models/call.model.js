module.exports = (sequelize, DataTypes) => {
    const call = sequelize.define('car', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        call_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        call_initiation_time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        call_pickup_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        call_ending_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        called_number: {
            type: DataTypes.INTEGER(30),
            allowNull: false
        }
    }, { tableName: 'snippets_call', timestamps: false });

    call.associate = (models) => {
        models.call.belongsTo(models.caller, { foreignKey: { name: 'caller_id', allowNull: false } });
        models.call.belongsTo(models.callDestionation, { foreignKey: { name: 'destination_id', allowNull: true } });
    }

    return call;
}