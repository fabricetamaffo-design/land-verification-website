const path = require('path');
const http = require('http');
const https = require('https');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const backendUrl = (process.env.EXPO_PUBLIC_API_URL || 'https://land-verification-website-production.up.railway.app').replace(/\/$/, '');

config.watchFolders = [
  path.resolve(__dirname, '../shared'),
];

config.server = {
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (!req.url || (!req.url.startsWith('/api/') && !req.url.startsWith('/uploads/'))) {
        return middleware(req, res, next);
      }

      const target = new URL(req.url, backendUrl);
      const client = target.protocol === 'https:' ? https : http;
      const headers = { ...req.headers, host: target.host };
      delete headers.origin;
      delete headers.referer;
      delete headers.referrer;
      const proxyReq = client.request(target, {
        method: req.method,
        headers,
        agent: target.protocol === 'https:' ? new https.Agent({ rejectUnauthorized: false }) : undefined,
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (error) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Mobile dev proxy failed.', details: error.message }));
      });

      req.pipe(proxyReq);
    };
  },
};

module.exports = config;
