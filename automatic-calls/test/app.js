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

describe('App.js', () => {
    /*
     * Test the /GET route
     */
    describe('test the APP routes', () => {
        it('test /voice/ : we are looking for a 200 status', (done) => {
            chai.request(server)
                .post('/voice/' + config.apipassword)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('test /get/ : we are looking for a 200 status', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('test /sms/ : we are looking for a 200 status', (done) => {
            chai.request(server)
                .post('/sms')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('test /status/ : we are looking for a 200 status', (done) => {
            chai.request(server)
                .post('/status/' + config.apipassword)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('test /stream/default : we are looking for a 200 status', (done) => {
            chai.request(server)
                .get('/stream/fakeservice')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('test /call/ : we are looking for a 200 status', (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

});