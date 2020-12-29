process.env.NODE_ENV = 'test';

const config = require('../config');

let server = require('../app');
let chai = require('chai');
const fs = require('fs');
const {
    expect
} = require('chai');
const {
    response
} = require('express');

let should = chai.should();

describe('Config.js', () => {
    /*
     * Test the /GET route
     */
    describe('twilio INFORMATIONS', () => {
        it('checking the twilio logins using the api : should allow to use it', () => {
            let login = config.accountSid.startsWith('AC');
            let pass = !!config.authToken;

            login.should.equal(true);
            pass.should.equal(true);
        });
    });

    describe('api INFORMATIONS', () => {
        it('check the api password', () => {
            let length = config.apipassword.length > 16;

            config.apipassword.should.not.equal('4ZMSTeSpX8FD9er9ymNKAHUms74fFjAf');
            length.should.equal(true);
        });
    });

    describe('services FILEPATH', () => {
        it('check the services FILEPATH and if the files exists', () => {
            let services = ['amazon', 'cdiscount', 'twitter', 'whatsapp', 'paypal', 'google', 'snapchat', 'instagram', 'facebook', 'end', 'default'];

            services.forEach(e => {
                fs.existsSync(config[e + 'filepath']).should.equal(true);
            });
        });
    });

});