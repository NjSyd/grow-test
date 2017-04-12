import http from 'http';

import app from './app';

const server = http.createServer(app);

server.listen(process.env.PORT || parseInt(process.env.npm_package_config_port) || 3000);
server.on('error', (error) => {
    throw error;
});
