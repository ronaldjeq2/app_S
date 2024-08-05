const proxy = require('http-proxy-middleware');

var options = {
    target: 'http://localhost:3001', // target host
    ws: true, // proxy websockets
    logLevel: "debug",
    pathRewrite: {
        '/api/': '/', // rewrite path
    },

}

module.exports = function (app) {
    app.use(proxy('/api', options));
};


