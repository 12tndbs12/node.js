const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
    // 방 제목
    title: {
        type: String,
        required: true,
    },
    // 방 인원 최대 10명, 최소 2명
    max: {
        type: Number,
        required: true,
        default:10,
        min: 2,
    },
    // 방장
    owner: {
        type: String,
        required: true,
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', roomSchema);