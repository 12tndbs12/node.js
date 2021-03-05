const Sequelize = require('sequelize');

module.exports = class Good extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        // 상품이름
        name: {
            type: Sequelize.STRING(40),
            allowNull: false,
        },
        // 상품사진
        img: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        // 상품 가격
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Good',
            tableName: 'goods',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // 누가 등록했는지
        db.Good.belongsTo(db.User, { as: 'Owner' });
        // 누가 낙찰받았는지
        db.Good.belongsTo(db.User, { as: 'Sold' });
        db.Good.hasMany(db.Auction);
    }
};