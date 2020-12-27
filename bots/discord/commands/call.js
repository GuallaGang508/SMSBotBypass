module.exports = function(m) {
    const axios = require('axios');
    const qs = require('qs');
    const embed = require('../embed');
    const config = require('../config');

    if (m.command !== "call") return false;

    if(m.args.length != 2) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 2 arguments, example : **!call 33612345678 paypal**', m.user);
    
    if(!m.args['0'].match(/^\d{8,14}$/g)) return embed(m.message, 'Bad phone number', 15158332, 'This phone number is not good, a good one : **33612345678**', m.user);
    if(!m.args['1'].match(/[a-zA-Z]+/gm)) return embed(m.message, 'Bad service name', 15158332, 'This service name is not good, a good one : **paypal**', m.user);
    
    axios.post(config.apiurl + '/call/', qs.stringify({
        password: config.apipassword,
        to: m.args['0'],
        user: m.user,
        service: m.args['1']
    }))
    .catch(error => {
        console.error(error)
    })

    return embed(m.message, 'Call sent', 3066993, 'The api call has been sent to **' + m.args['0'] + '** using **' + m.args['1'] + '** service.', m.user)
}