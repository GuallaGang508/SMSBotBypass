process.env.NODE_ENV = 'test';

const config = require('../config');

let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
const {
    expect
} = require('chai');

let should = chai.should();

chai.use(chaiHttp);

describe('Authentification.js', () => {
    /*
     * Test the /GET route
     */
    describe('/get POST to check authentification.js middleware', () => {
        it('it should return "Please send the password API." : we are not sending any password post', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Please send the password API.');

                    done();
                });
        });

        it('it should return "The password you sent is empty." : we are not sending an empty password', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: ' '
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('The password you sent is empty.');

                    done();
                });
        });

        it('it should return "Invalid password." : we are sending a bad password', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: 'badpassword'
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Invalid password.');

                    done();
                });
        });

        it('it should return be good : no error', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;

                    done();
                });
        });
    });

});