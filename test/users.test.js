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

describe('User routes', () => {
    before(done => {
        createTestUser(testUser)
            .then(() => done())
            .catch(() => done());
    });

    after(done => {
        removeTestUser(testUser)
            .then(() => done())
            .catch(() => done());
    });

    it('GET users/:id', done => {
        chai.request(server)
            .get(`/api/v1/users/${testUser.id}`)
            .set('Authorization', testUser.token)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('email');
                expect(res.body.id).to.equal(testUser.id);
                expect(res.body.email).to.equal(testUser.email);
                return done();
            })
            .catch(() => done());
    });

    it('GET users/:id No password in response', done => {
        chai.request(server)
            .get(`/api/v1/users/${testUser.id}`)
            .set('Authorization', testUser.token)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.not.have.property('password');
                return done();
            })
            .catch(() => done());
    })
});


function createTestUser(credentials) {
    return chai.request(server)
        .post('/auth/signup')
        .send(credentials)
        .then(res => {
            credentials.id = res.body.data.id;
            credentials.token = res.body.token;
            return Promise.resolve()
        });
}

function removeTestUser(credentials) {
    return chai.request(server)
        .delete(`/api/v1/users/${credentials.id}`)
        .set('Authorization', credentials.token)
}
