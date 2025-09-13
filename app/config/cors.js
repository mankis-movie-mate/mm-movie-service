const config = require('./config');

function parseOrigins(originsStr) {
    if (!originsStr) return [];
    return originsStr
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean);
}

const allowedOrigins = parseOrigins(config.allowed_origins);

// For debugging (you can remove in prod)
console.log('[CORS] Allowed origins:', allowedOrigins);

module.exports = {
    allowedOrigins,
};
