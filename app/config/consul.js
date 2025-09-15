// File: ./Consul.js

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

    let tags = [];
    if (config.lb_tags) {
      tags = config.lb_tags
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    }

    const serviceDefinition = {
      Name: this.serviceName,
      ID: this.serviceId,
      Address: this.serviceHost,
      Port: this.servicePort,
      Tags: tags,
      Check: {
        HTTP: this.healthCheckUrl,
        Interval: this.checkInterval,
        Timeout: '3s',
      },
    };

    let attempt = 0;
    let success = false;

    while (!success) {
      attempt++;
      try {
        this.logger.info(`[CONSUL] Attempt ${attempt} to register service...`);
        const res = await axios.put(consulUrl, serviceDefinition);

        if (res.status === 200) {
          this.logger.info(
            `[CONSUL] ✅ Successfully registered service ${this.serviceId} with Consul`
          );
          success = true;
        } else {
          this.logger.warn(
            `[CONSUL] ❌ Attempt ${attempt} failed. Status: ${res.status}`
          );
        }
      } catch (err) {
        this.logger.warn(
          `[CONSUL] ❌ Attempt ${attempt} failed: ${err.message}`
        );
      }

      if (!success) {
        await this.#delay(2000); // wait 2 seconds before next try
      }
    }

    if (!success) {
      this.logger.error(
        `[CONSUL] ❌ Failed to register service after ${attempt} attempts`
      );
    }
  }

  async deregister() {
    const consulUrl = `http://${this.dsHost}:${this.dsPort}/v1/agent/service/deregister/${this.serviceId}`;

    try {
      const res = await axios.put(consulUrl);
      if (res.status === 200) {
        this.logger.info(
          `[CONSUL] ✅ Deregistered service ${this.serviceId} from Consul`
        );
      } else {
        this.logger.error(
          `[CONSUL] ❌ Failed to deregister. Status: ${res.status}, Response: ${res.data}`
        );
      }
    } catch (err) {
      this.logger.error(`[CONSUL] ❌ Error during deregister: ${err.message}`);
    }
  }

  // Private helper for delays
  async #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = Consul;
