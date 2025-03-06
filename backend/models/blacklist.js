module.exports = (sequelize, DataTypes) => {
    const Blacklist = sequelize.define('Blacklist', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Blacklist;
};
