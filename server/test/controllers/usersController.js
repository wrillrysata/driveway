import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';
const request = supertest(app)

const signupUrl = '/api/v1/users/signup';
const signinUrl = '/api/v1/users/signin';

const user1 = {
  username: 'Kart',
  email: 'kart@test.com',
  bio: 'A marketing firm',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890'
};
const user2 = {
  username: 'Paystack',
  email: 'paystack@test.com',
  bio: 'A leading Fintech organisation',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890'
};

describe('User API test', () => {
  describe('# Create user', () => {
    it('Should create a user', (done) => {
      request
        .post(signupUrl)
        .send(user1)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          expect(response.body.data).to.have.property('token')
          expect(response.body.data.token).to.be.a('string');
          done();
        });

    });
    it('Should not register a user with an already existing email', (done) => {
      request
        .post(signupUrl)
        .send(user1)
        .end((error, response) => {
          expect(response.statusCode).to.equal(409)
          expect(response.body).to.be('object');
          expect(response.body.errors.title).to.equal('Conflict');
          expect(response.body.errors.detail)
            .to.equal('Username or Email already exist, please login');
          done();
        });
    });
    it('Should not register a user with an empty username field', (done) => {
      request
        .post(signupUrl)
        .send({
          username: '',
          email: 'got@test.com',
          bio: 'A GOT squad movement organisation',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '1234567890'
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.be.an('object')
          expect(response.body.errors.username)
            .to.equal('Username is required');
          done();
        });
    });
    it('Should not register a user with an empty email field', (done) => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: '',
          bio: 'A transport organisation',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '1234567890'
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.be.an('object');
          expect(response.body.errors.email)
            .to.equal('Email is required');
          done();


        }
        );
    });

    it('Should not register a user with an empty password field', (done) => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: 'reels@test.com',
          bio: 'A transport organisation',
          location: 'Nigeria',
          password: '',
          confirmPassword: '1234567890'
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.be.an('object');
          expect(response.body.errors.password)
            .to.equal('Password is required');
          done();
        })
      it('Should not register a user with an empty confirm password field', (done) => {
        request
          .post(signupUrl)
          .send({
            username: 'Reels',
            email: 'reels@test.com',
            bio: 'A transport organisation',
            location: 'Nigeria',
            password: '1234567890',
            confirmPassword: ''
          })
          .end((error, response) => {
            expect(response.statusCode).to.equal(400)
            expect(response.body).to.be.an('object');
            expect(response.body.errors.confirmPassword)
              .to.equal('Please confirm your password');
            done();

          });
        it('Should not register a user if passwords don\'t match', (done) => {
          request
            .post(signupUrl)
            .send({
              username: 'Reels',
              email: 'reels@test.com',
              bio: 'A transport organisation',
              location: 'Nigeria',
              password: '1234567890',
              confirmPassword: '1234567'
            })
            .end((error, response) => {
              expect(response.statusCode).to.equal(400);
              expect(response.body).to.be.an('object');
              expect(response.body.errors.confirmPassword)
                .to.equal('Passwords don\'t match');
              done();
            });

        });

      });
    });
  });
  describe('# Sign in user', () => {
    before((done) => {
      request.post(signupUrl)
        .send(user2)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        });
    });
    it('Should sign in user', (done) => {
      request.post(signinUrl)
        .send({
          username: 'Paystack',
          password: '1234567890'
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body).to.be.an('object');
          expect(response.body.data).to.have.property('token');
          expect(response.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should not sign in user with the wrong password', (done) => {
      request.post(signinUrl)
        .send({
          username: 'paystack@test.com',
          password: '12345'
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(404);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.title).to.equal('Not Found');
          expect(response.body.errors.detail)
            .to.equal('These credentials do not match our record');
        });
      it('Should not sign in user with the wrong username', (done) => {
        request.post(signinUrl)
          .send({
            username: 'wrong username',
            password: '1234567890'
          })
          .end((error, response) => {
            expect(response.statusCode).to.equal(404);
            expect(response.body).to.be.an('object');
            expect(response.body.errors.title).to.equal('Not Found');
            expect(response.body.errors.detail)
              .to.equal('These credentials do not match our record');

          });
        it('Should not sign in user if no username is provided', (done) => {
          request.post(signinUrl)
            .send({
              username: '',
              password: '1234567890'
            })
            .end((error, response) => {
              expect(response.statusCode).to.equal(400);
              expect(response.body).to.be.an('object');
              expect(response.body.errors.username).to.equal('Please provide a username or email');
              done();
            });
          it('Should not sign in user if no password is provided', (done) => {
            request.post(signinUrl)
              .send({
                username: 'paystack@test.com',
                password: ''
              })
              .end((error, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object');
                expect(response.body.errors.password).to.equal('Password is required');
                done();
              });
          })
        });
      });
    });
  });
});
