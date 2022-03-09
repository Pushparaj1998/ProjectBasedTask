const semver = require('semver');

class ServiceRegistry {
    constructor() {
        this.servies = {}
        this.timeout = 30;
    }

    get(name, version) {
        this.cleanup();
        const candidates =  Object.values(this.servies)
        .filter(service => service.name === name && semver.satisfies(service.version, version))

        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    register(name, version, ip, port ){
        this.cleanup();
        const key = name + version + ip + port;

        if(!this.servies[key]) {
            this.servies[key] = {};
            this.servies[key].timestamp = Math.floor(new Date() / 1000);
            this.servies[key].ip = ip;
            this.servies[key].port = port;
            this.servies[key].name = name;
            this.servies[key].version = verison;
            console.log(`Added Service ${name}, version ${version} at ${ip}:${port}`);
            return key;
        }
    }

    unregister(name, version, ip, port) {
        const key = name + version + ip + port;
        delete this.servies[key];
        console.log(`Unregistred Service ${name}, version ${version} at ${ip} : ${port}`);
        return key;
    }
    cleanup() {
        const now = Math.floor(new Date() / 1000);
        Object.keys(this.servies).forEach(key => {
            if (this.servies[key].timestamp + this.timeout < now) {
                delete this.servies[key];
                console.log(`Removed Service ${key}`);
            }
        })
    }
}

module.exports = ServiceRegistry;