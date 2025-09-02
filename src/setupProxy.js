const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.football-data.org/v4/competitions',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Отбрасываем префикс "/api"
      },
    })
  );
};