process.env.NODE_ENV = 'test';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');

const config = require('../config');

let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
const {
    expect
} = require('chai');

let should = chai.should();

chai.use(chaiHttp);

describe('Call.js', () => {
    beforeEach((done) => { //Before each test we empty the database
        db.run(`DELETE FROM calls WHERE 1`, function(err) {
            if (err) return console.log(err.message);

            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/call POST', () => {
        it('it should return an ERROR with "Please post all the informations needed." : we sent no post data', (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Please post all the informations needed.');
                    done();
                });
        });

        it('it should return an ERROR with "Please post all the informations needed." : we sent 1 post data', (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    to: '3312345678'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Please post all the informations needed.');
                    done();
                });
        });

        it('it should return an ERROR with "Please post all the informations needed." : we sent 2 post data', (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    to: '3312345678',
                    user: 'test'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Please post all the informations needed.');
                    done();
                });
        });

        it("it should return an ERROR with \"The service wasn't recognised.\" : we sent 3 post data (but bad service)", (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    to: '3312345678',
                    user: 'test',
                    service: 'test'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql("The service wasn't recognised.");
                    done();
                });
        });

        it("it should return an ERROR with \"Bad phone number.\" : we sent 3 post data (but bad phone number)", (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    to: '33123',
                    user: 'test',
                    service: 'default'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql("Bad phone number.");
                    done();
                });
        });

        it("it should return the callSid : everything's fine", (done) => {
            chai.request(server)
                .post('/call')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    to: '33612345678',
                    user: 'test',
                    service: 'default'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.not.have.property('error');
                    res.body.should.have.property('callSid');

                    done();
                });
        });
    });

});