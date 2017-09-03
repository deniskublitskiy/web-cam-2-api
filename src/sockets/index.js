const {User} = require('../models/index');

export default function(io) {
    io.on('connection', async socket => {
        console.log('Connected');
        socket.on('disconnect', () => console.log('Disconnected'));

        let params = {
            id: socket.handshake.query.userId
        };
        let options = {
            withRelated: ['chats'],
            require: true
        };

        try {
            let user = await User.forge(params).fetch(options);
            user.related('chats').forEach(chat => socket.join(`chat-room-${chat.get('id')}`));
        } catch (e) {
            console.log(e);
        }

        socket.on('start_calling', chatId => {
            socket.to(`chat-room-${chatId}`).emit('start_calling', chatId)
        });
    })
}