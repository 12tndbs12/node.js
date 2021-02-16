const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'),
                allowNull: false,
            },
            clientSecret: {
                // 올바른 uuid타입인지를 검사하고 싶다면
                // type: Sequelize.UUIDV4, 를 사용
                type: Sequelize.STRING(36),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        });
    }
    static associate(db) {
        db.Domain.belongsTo(db.User);
    }
}