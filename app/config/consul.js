const axios = require('axios');
const config = require('./config');


class Consul {
    constructor(logger) {
        this.logger = logger;
        this.base_url = config.base_url;
        this.dsHost = config.ds_host;
        this.dsPort = config.ds_port;
        this.serviceHost = config.host;
        this.servicePort = parseInt(config.port);
        this.serviceName = 'mm-movie-service';
        this.serviceId = `${this.serviceName}-${Date.now()}`;
        this.healthCheckUrl = `http://${this.serviceHost}:${this.servicePort}/health`;
        this.checkInterval = '10s';
    }

    async register() {
        const consulUrl = `http://${this.dsHost}:${this.dsPort}/v1/agent/service/register`;

        const serviceDefinition = {
            Name: this.serviceName,
            ID: this.serviceId,
            Address: this.serviceHost,
            Port: this.servicePort,
            Tags: [
                "traefik.enable=true",
                `traefik.http.routers.${this.serviceName}.rule=PathPrefix(\`/${this.serviceName}\`)`,
                `traefik.http.routers.${this.serviceName}.middlewares=mm-movie-rewrite@consulcatalog`,
                `traefik.http.middlewares.mm-movie-rewrite.replacepathregex.regex=^/${this.serviceName}(.*)`,
                `traefik.http.middlewares.mm-movie-rewrite.replacepathregex.replacement=${this.base_url}$1`,
                `traefik.http.services.${this.serviceName}.loadbalancer.server.port=3000`
            ],
            Check: {
                HTTP: this.healthCheckUrl,
                Interval: this.checkInterval,
                Timeout: '3s'
            }
        };

        try {
            const res = await axios.put(consulUrl, serviceDefinition);
            if (res.status === 200) {
                this.logger.info(`[CONSUL] Registered service ${this.serviceId} with Consul at ${consulUrl}`);
            } else {
                this.logger.error(`[CONSUL] Failed to register service. Status: ${res.status}, Response: ${res.data}`);
            }
        } catch (err) {
            this.logger.error(`[CONSUL] Error registering service: ${err.message}`);
        }
    }

    async deregister() {
        const consulUrl = `http://${this.dsHost}:${this.dsPort}/v1/agent/service/deregister/${this.serviceId}`;

        try {
            const res = await axios.put(consulUrl);
            if (res.status === 200) {
                this.logger.info(`[CONSUL] Deregistered service ${this.serviceId} from Consul at ${consulUrl}`);
            } else {
                this.logger.error(`[CONSUL] Failed to deregister service. Status: ${res.status}, Response: ${res.data}`);
            }
        } catch (err) {
            this.logger.error(`[CONSUL] Error deregistering service: ${err.message}`);
        }
    }
}

module.exports = Consul;