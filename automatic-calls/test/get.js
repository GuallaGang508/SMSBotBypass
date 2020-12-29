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

describe('Get.js', () => {
    beforeEach((done) => { //Before each test we empty the database
        db.run(`DELETE FROM calls WHERE 1`, function(err) {
            if (err) return console.log(err.message);
        });

        db.run(`INSERT INTO calls(itsfrom, itsto, callSid, digits, status,  date, user, service) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, ['33123456789', '33123456789', 'fakecallsid', '123456', 'test', 'testdate', 'test', 'default'], function(err) {
            if (err) {
                return console.log(err.message);
            }
            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/get POST', () => {
        it('it should return "Invalid callSid." : we are not sending any callSid', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Invalid callSid.');

                    done();
                });
        });

        it('it should return "Invalid callSid." : we are sending a bad callSid', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    callSid: 'badcallSid'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Invalid callSid.');

                    done();
                });
        });

        it('it should return the call info\'s : we are sending a good callSid', (done) => {
            chai.request(server)
                .post('/get')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    password: config.apipassword,
                    callSid: 'fakecallsid'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;

                    res.body.should.have.property('itsfrom').eql('33123456789');
                    res.body.should.have.property('itsto').eql('33123456789');
                    res.body.should.have.property('callSid').eql('fakecallsid');
                    res.body.should.have.property('digits').eql('123456');
                    res.body.should.have.property('status').eql('test');
                    res.body.should.have.property('date').eql('testdate');
                    res.body.should.have.property('user').eql('test');
                    res.body.should.have.property('service').eql('default');

                    done();
                });
        });
    });

});