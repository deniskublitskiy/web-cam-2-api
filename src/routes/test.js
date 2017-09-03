import express from 'express';
const {TestType, TestTypes} = require('../models');

const router = express.Router();

export default function (io) {
    router.get('/types', async (req, res, next) => {
        try {
            let testTypes = await TestType.fetchAll();
            res.status(200).json(testTypes.toJSON());
        } catch (e) {
            next(e);
        }
    });

    function findSocketByUserId(userId) {
        let connected = io.sockets.connected;
        let socketId = Object.keys(connected)
            .find(key => connected[key].handshake.query.userId == userId);

        return connected[socketId];
    }

    return router;
}