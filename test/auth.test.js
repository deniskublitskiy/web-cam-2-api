const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const server = require('../dist/server');
const {User} = require('../dist/models');

const testUser = {
    email: 'test_user@gmail.com',
    password: 'test_user'
};

describe('Authentication', () => {
    afterEach(done => {
        deleteUser()
            .then(() => done())
            .catch(() => done());
    });

    it('Sign up', done => {
        chai.request(server)
            .post('/auth/signup')
            .send(testUser)
            .then(res => {
                expect(res).to.have.status(203);
                expect(res.body).to.have.property('token');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('id');
                done();
            })
    });
    it('Login', done => {
        chai.request(server)
            .post('/auth/signup')
            .send(testUser)
            .then(res => {
                chai.request(server)
                    .post('/auth/login')
                    .send(testUser)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('token');
                        expect(res.body).to.have.property('data');
                        expect(res.body.data).to.have.property('id');
                        done();
                    })
            })
    });
    it('Login with incorrect password', done => {
        chai.request(server)
            .post('/auth/signup')
            .send(testUser)
            .then(res => {
                chai.request(server)
                    .post('/auth/login')
                    .send({
                        email: testUser.email,
                        password: 'incorrect'
                    })
                    .then(res => {
                        expect(res).to.have.status(401);
                        done();
                    })
                    .catch(res => {
                        expect(res).to.have.status(401);
                        done();
                    })
            })
    });
    it('Login user is not found', done => {
        chai.request(server)
            .post('/auth/signup')
            .send(testUser)
            .then(res => {
                chai.request(server)
                    .post('/auth/login')
                    .send({
                        email: 'not_exist_user',
                        password: testUser.password
                    })
                    .then(res => {
                        expect(res).to.have.status(404);
                        done();
                    })
                    .catch(res => {
                        expect(res).to.have.status(404);
                        done();
                    })
            })
    })
});

function deleteUser() {
    return new User({
        email: testUser.email
    })
        .fetch()
        .then(user => {
            if (user) {
                return user.destroy()
            }
        })
        .catch(e => {

        })
}