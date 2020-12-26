module.exports = function(m) {
    if (m.command === "call") {
        if(m.args.length != 2) return m.message.reply('You need to give 2 arguments, example : !call 33612345678 paypal');

        if(!m.args['0'].match(/^\d{8,14}$/g)) return m.message.reply('This phone number is not good, a good one : 33612345678');
        if(!m.args['1'].match(/[a-zA-Z]+/gm)) return m.message.reply('This service name is not good, a good one : paypal');
    }
}