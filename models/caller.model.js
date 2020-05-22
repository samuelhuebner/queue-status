module.exports = (sequelize, DataTypes) => {
    const caller = sequelize.define('caller', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone_number: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        contact_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        first_contact_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        last_contact_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    caller.associate = (models) => {
        models.caller.hasMany(models.call, { foreignKey: { name: 'caller_id'} });
    }

    return caller;
}