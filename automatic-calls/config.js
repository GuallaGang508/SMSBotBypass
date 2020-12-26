module.exports = {
    accountSid: 'ACbc3069f5618b8235e76c432377f0c6ee',
    authToken: '95a76e3483b08a734dd92bacc5232019',

    serverurl: 'http://8b518f0ae606.ngrok.io', 
    apipassword: '4ZMSTeSpX8FD9er9ymNKAHUms74fFjAf', 
    callerid: '+14793482584', 

    port: process.env.PORT || 1337, 

    paypal: 'http://8b518f0ae606.ngrok.io/stream/paypal',
    paypalfilepath: './voice/fr/pp/ask-pp.mp3',
    snapchat: '',
    snapchatfilepath: '',
    instagram: '',
    instagramfilepath: '',
    facebook: '',
    facebookfilepath: '',
    end: 'http://8b518f0ae606.ngrok.io/stream/end',
    endfilepath: './voice/fr/done/call-done.mp3',
    default :'',

    // Services : sms
    paypalsms: 'pp test 123'
};