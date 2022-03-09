const express = require('express');
const router = new express.Router();
const ServiceRegistry = require('../lib/ServiceRegistry')
const serviceRegistry = new ServiceRegistry();

router.put('/register/:servicename/:serviceversion/:serviceport', (req,res)=> {
    const { servicename, serviceversion, serviceport } = req.params;
    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const serviceKey = serviceRegistry.register(servicename, serviceversion, serviceip, serviceport);
    return res.json({ result: serviceKey })
})

router.delete('/register/:servicename/:serviceversion/:serviceport', (req,res)=> {
    const { servicename, serviceversion, serviceport } = req.params;
    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const serviceKey = serviceRegistry.unregister(servicename, serviceversion, serviceip, serviceport);
    return res.json({ result: serviceKey })
})

router.get('find/:servicename/:serviceversion', (req,res) => {
    const { servicename, serviceversion } = req.params;
    const svc = serviceRegistry.get(servicename,serviceversion);
    if(!svc) return res.status(404).josn({ result : 'Service Not Found'})
    return res.json(svc)
})

module.exports = router