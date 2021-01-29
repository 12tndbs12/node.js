const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
    return super.init({
        // 컬럼들
        name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true,
        },
        age: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        married: {
            type: Sequelize.BOOLEAN,    // true, false
            allowNull: false,
        },
        comment: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    }, {
        // 모델에 대한 설정
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'User',      //예를 들어, 모델이름이 Bird면
        tableName: 'users',     // 테이블명이 자동으로 birds로 된다.
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    }

    static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }
};