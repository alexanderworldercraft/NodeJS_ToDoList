module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',  // Permet l'accès depuis n'importe quelle adresse IP
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    },
    historyApiFallback: true,  // Pour gérer le mode history de Vue Router
  }
};