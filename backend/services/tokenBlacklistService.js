const db = require('./databaseService');

module.exports = {
    add: async (token) => {
        const Blacklist = db.getModel('Blacklist');
        await Blacklist.create({ token });
    },
    isBlacklisted: async (token) => {
        const Blacklist = db.getModel('Blacklist');
        const blacklistedToken = await Blacklist.findOne({ where: { token } });
        return !!blacklistedToken;
    }
};
