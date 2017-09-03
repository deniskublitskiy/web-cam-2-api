'use strict';

module.exports = {
    development: {
        debug: true,
        client: 'mysql2',
        connection: {
            host: '93.126.104.155',
            user: 'web-cam-dev',
            password: 'web-cam-dev',
            database: 'web-cam-dev'
        },
        migrations: {
            tableName: 'migrations'
        }
    },
    production: {
        client: 'mysql2',
        connection: {
            host: '93.126.104.155',
            user: 'web-cam-dev',
            password: 'web-cam-dev',
            database: 'web-cam-dev'
        }
    }
};
//# sourceMappingURL=knexfile.js.map
