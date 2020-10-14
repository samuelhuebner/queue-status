module.exports = (sequelize, DataTypes) => {
    const keyAllowedDomain = sequelize.define('keyAllowedDomain', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        domainName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { tableName: 'keyAllowedDomain', timestamps: false });

    return keyAllowedDomain;
};