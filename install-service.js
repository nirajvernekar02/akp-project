const Service = require('node-windows').Service;
const path = require('path');
const schedule = require('node-schedule');

const svc = new Service({
    name: 'AKP Backend Service',
    description: 'AKP Project Backend Server (Expires Jan 1, 2026)',
    script: path.join('D:', 'AKP Project', 'Backend', 'index.js'),
    env: [{
        name: "NODE_ENV",
        value: "production"
    }, {
        name: "EXPIRY_DATE",
        value: "2026-01-01"
    }]
});

// Check expiry date on service start
const checkExpiry = () => {
    const expiryDate = new Date('2026-01-01');
    const currentDate = new Date();
    
    if (currentDate >= expiryDate) {
        console.log('Service has expired. Initiating shutdown...');
        // Uninstall the service
        svc.uninstall();
        return false;
    }
    return true;
};

// Schedule the service termination
const scheduleTermination = () => {
    // Schedule for exactly midnight on Jan 1, 2026
    schedule.scheduleJob('0 0 1 1 *', function() {
        console.log('Scheduled termination triggered. Stopping service...');
        svc.stop();
        setTimeout(() => {
            svc.uninstall();
        }, 5000); // Wait 5 seconds before uninstalling
    });
};

// Install event handler
svc.on('install', function() {
    if (checkExpiry()) {
        svc.start();
        scheduleTermination();
        console.log('Service installed and scheduled for termination on Jan 1, 2026');
    }
});

// Start event handler
svc.on('start', function() {
    if (!checkExpiry()) {
        svc.stop();
    }
});

// Error handler
svc.on('error', function(err) {
    console.error('Service error:', err);
});

// Install the service if not expired
if (checkExpiry()) {
    svc.install();
} else {
    console.log('Service expiry date has passed. Installation aborted.');
}