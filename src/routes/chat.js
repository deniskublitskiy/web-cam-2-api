import express from 'express';
import { Message, User } from '../models/index';
import xlsx from 'xlsx';

const faker = require('faker');

const {Chats, Chat} = require('../models/index');

const router = express.Router();
import delay from '../utils/delay-promise'

export default function (io, transporter) {
    router.get('/', async (req, res, next) => {
        try {
            let chats = await new Chats().fetch();
            res.status(200).json(chats.toJSON());
        } catch (e) {
            next(e);
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            let chat = await new Chat({
                id: req.params.id
            }).fetch({
                withRelated: ['members', 'messages'],
                require: true
            });

            res.status(200).json(chat);
        } catch (e) {
            next(e);
        }

    });

    router.post('/', async (req, res, next) => {
        try {
            let chat = await new Chat(req.body).save();
            res.status(201).json(chat);
        } catch (e) {
            next(e);
        }
    });

    router.post('/:id/members', async (req, res, next) => {
        let {members} = req.body;
        let {id} = req.params;

        if (!members || !members.length) {
            return next({status: 400, message: 'Member id must be specified in body'});
        }

        try {
            let chat = await new Chat({id}).fetch({withRelated: ['members']});
            chat.members().attach(members);

            let memberSockets = members
                .map(id => findSocketByUserId(id));

            memberSockets
                .forEach(socket => {
                    if (parseInt(socket.handshake.query.userId) !== chat.get('createdById')) {
                        io.to(socket.id).emit('chat_invite', chat);
                    }
                    socket.join(`chat-room-${chat.get('id')}`);
                });

            res.status(201).send();
        } catch (e) {
            next(e);
        }
    });

    router.delete('/:id', async (req, res, next) => {
        try {
            let chat = await new Chat({
                id: req.params.id
            }).fetch();
            chat.destroy();
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    });

    router.post('/:id/messages', async (req, res, next) => {
        let chatId = req.params.id;
        let params = {
            chatId,
            ...req.body
        };

        await delay(1000);
        try {
            let message = await new Message(params).save();
            let socket = findSocketByUserId(req.body.authorId);
            socket && socket.to(`chat-room-${chatId}`).emit('chat_message', message);
            res.status(201).json(message);
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

    /**
     * TODO: Refactor!!! Optimize!!!
     */
    router.post('/import/xlsx', async (req, res) => {
        let obj = xlsx.read(req.body.file, {
            type: 'base64'
        });
        const options = {
            header: 1,
            raw: true
        };
        const groups = obj.SheetNames.reduce((result, name) =>
                result.set(name, xlsx.utils.sheet_to_json(obj.Sheets[name], options)),
            new Map()
        );

        let me = await User.forge({id: req.body.userId}).fetch();
        groups.forEach(async (group, key) => {
            let members = [];
            await Promise.all(group.map(async member => {
                if (member.length > 0) {
                    let fullName = member[0].split(' ');
                    let user, password = Math.random().toString(36).slice(-8);
                    try {
                        user = await User.forge({
                            firstName: fullName[1],
                            lastName: fullName[0],
                            email: member[1],
                            password
                        }).save();
                        let mailOptions = {
                            from: '"web-cam support" <webcamera.sup@gmail.com>',
                            to: member[1],
                            subject: 'Account information',
                            html: `<b>${me.get('fullName')}</b> create account for you. <div>password: <b>${password}</b></div>`
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                    } catch(e) {
                        user = await User.forge({
                            email: member[1]
                        }).fetch();
                    } finally {
                        members.push(user);
                    }
                }
            }));
            let chat = await new Chat({name: key}).save();
            chat = await new Chat({id: chat.get('id')}).fetch({withRelated: ['members']});
            members.push(me);
            chat.members().attach(members);

            let memberSockets = members
                .map(member => findSocketByUserId(member.get('id')))
                .filter(socketId => !!socketId);

            memberSockets
                .forEach(socket => {
                    io.to(socket.id).emit('chat_invite', chat);
                    socket.join(`chat-room-${chat.get('id')}`);
                });

            res.status(200).send();
        });
    });

    return router;
}