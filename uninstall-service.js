const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
    name: 'AKP Backend Service',
    script: path.join('D:', 'AKP Project', 'Backend', 'index.js')
});

svc.on('uninstall', function() {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.uninstall();