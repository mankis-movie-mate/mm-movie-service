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
        this.checkInterval = '10s'
        this.tags = config.lb_tags.split('\n').map(line => line.trim()).filter(Boolean);
    }

    async register() {
        const consulUrl = `http://${this.dsHost}:${this.dsPort}/v1/agent/service/register`;
        const serviceDefinition = {
            Name: this.serviceName,
            ID: this.serviceId,
            Address: this.serviceHost,
            Port: this.servicePort,
            Tags: this.tags,
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