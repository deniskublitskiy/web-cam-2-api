const express = require('express');
const decode = require('urldecode');
const userRoutes = express.Router();
const {User, Users} = require('../models/index');
const _ = require('lodash');

function decodeURIComponentX( str ) {
    var out = '', arr, i = 0, l, x;
    arr = str.split(/(%(?:D0|D1)%.{2})/);
    for ( l = arr.length; i < l; i++ ) {
        try {
            x = decodeURIComponent( arr[i] );
        } catch (e) {
            x = arr[i];
        }
        out += x;
    }
    return out
}

export default function (io) {
    userRoutes.get('/', async (req, res, next) => {
        Object.keys(req.query).forEach(key => req.query[key] = decodeURIComponentX(req.query[key]));
        let {offset = 0, limit = 10} = req.query;
        let countQuery = Users.query(q => createSearchQuery(q, req.query));
        let searchQuery = Users.query(q => createSearchQuery(q, req.query)
            .limit(limit)
            .offset(offset)
        );

        try {
            let [users, count] = await Promise.all([
                searchQuery.fetch(),
                countQuery.count()
            ]);

            res.status(200).json({
                count,
                contacts: users.toJSON()
            });

        } catch (e) {
            next(e);
        }
    });

    userRoutes.get('/:id', async (req, res, next) => {
        let options = {
            require: true
        };
        let fields = req.query.fields;
        if (fields) {
            options.columns = fields.split(',')
        }

        try {
            let user = await new User({
                id: req.params.id
            }).fetch(options);

            res.status(200).json(user.toJSON());
        } catch (e) {
            next(e);
        }
    });

    userRoutes.put('/:id', async (req, res, next) => {
        let user = new User({
            id: req.params.id
        });

        try {
            user = await user.fetch();
            Object.keys(req.body).forEach(key => user.set(key, req.body[key]));
            user = await user.save();

            res.status(200).json(user.toJSON());
        } catch (e) {
            next({status: 500, e})
        }
    });

    userRoutes.delete('/:id', (req, res, next) => {
        new User({
            id: req.params.id
        })
            .fetch()
            .then(user => {
                if (user) {
                    user.destroy();
                    return res.status(200);
                }
                next({status: 404});
            })
    });

    userRoutes.get('/:id/contacts', (req, res, next) => {
        new User({
            id: req.params.id
        })
            .fetch({
                withRelated: ['contacts']
            })
            .then(user => {
                res.status(200).json(user.related('contacts'));
            })
            .catch(next)
    });

    userRoutes.get('/:id/chats', async (req, res, next) => {
        try {
            let user = await new User({
                id: req.params.id
            }).fetch({
                withRelated: ['chats']
            });
            res.status(200).json(user.related('chats'));
        } catch(e) {
            next(e);
        }
    });

    userRoutes.post('/:id/contacts', async (req, res, next) => {
        let {id: contactId} = req.body;
        let {id} = req.params;

        if (!id) {
            return next({status: 400, message: 'Contact user must be specified'});
        }
        if (id == contactId) {
            return next({status: 400, message: 'Impossible add yourself to contacts'});
        }

        try {
            let user = new User({id});
            user = await user.fetch();
            await user.contacts().attach(contactId);

            let contact = new User({id: contactId});
            contact = await contact.fetch();
            await contact.contacts().attach(id);

            io.to(findUserSocketId(contactId))
                .emit('connection_request', user.toJSON());

            res.status(203).json(contact.toJSON());
        } catch (e) {
            next(e);
        }

    });

    function findUserSocketId(userId) {
        let sockets = io.sockets.connected;
        return Object.keys(sockets)
            .find(key =>
                sockets[key].handshake.query.userId == userId
            );
    }

    /**
     * TODO Refactor it
     * @param query
     * @param params
     * @returns {*}
     */
    function createSearchQuery(query, params) {
        let reserved = ['sort', 'limit', 'offset'];
        _.difference(_.keys(params), reserved).forEach((paramName, i) => {
            let paramValue = params[paramName].split(',');
            paramName = _.snakeCase(paramName);
            if (paramValue.length === 1) {
                if (i === 0) {
                    query.where(paramName, 'LIKE', paramValue);
                } else {
                    query.andWhere(paramName, 'LIKE', paramValue);
                }
            } else {
                if (i === 0) {
                    query.whereIn(paramName, paramValue);
                } else {
                    query.andWhereIn(paramName, paramValue);
                }
            }
        });

        if (params.sort) {
            let sorts = params.sort.split(',');
            sorts.forEach(sort => {
                let direction = sort.charAt(0) === '-' ? 'desc' : 'asc';
                if (direction === 'desc') {
                    sort = sort.slice(1);
                }
                query.orderBy(sort, direction);

            });
        }

        return query;
    }

    return userRoutes;
}