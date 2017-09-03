module.exports = {
    development: {
        debug: true,
        client: 'mysql2',
        connection: {
            host: 'localhost',
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
            host: 'localhost',
            user: 'web-cam-dev',
            password: 'web-cam-dev',
            database: 'web-cam-dev'
        }
    },
};
