import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';

const request = supertest(app);

const signupUrl = '/api/v1/users/signup';
const signinUrl = '/api/v1/users/signin';

const user1 = {
  username: 'test1',
  email: 'test1@test.com',
  bio: 'Test 1',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890',
};
const user2 = {
  username: 'test2',
  email: 'test2@test.com',
  bio: 'Test 2',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890',
};
const user3 = {
  username: 'test3',
  email: 'test3@test.com',
  bio: 'Test 3',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890',
};
const user4 = {
  username: 'test4',
  email: 'test4@test.com',
  bio: 'Test 4',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890',
};
const user6 = {
  username: 'test6',
  email: 'test6@test.com',
  bio: 'Test 6',
  location: 'Nigeria',
  password: '1234567890',
  confirmPassword: '1234567890',
};

let userToken;
let userToken2;
let userToken3;

describe('User API test', () => {
  describe('# Create user', () => {
    it('Should create a user', done => {
      request
        .post(signupUrl)
        .send(user1)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          expect(response.body.data).to.have.property('token');
          expect(response.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should not register a user with an already existing email', done => {
      request
        .post(signupUrl)
        .send(user1)
        .end((error, response) => {
          expect(response.statusCode).to.equal(409);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.title).to.equal('Conflict');
          expect(response.body.errors.detail).to.equal(
            'Username or Email already exist, please login'
          );
          done();
        });
    });
    it('Should not register a user with an empty username field', done => {
      request
        .post(signupUrl)
        .send({
          username: '',
          email: 'got@test.com',
          bio: 'A GOT squad movement organisation',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '1234567890',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.username).to.equal(
            'Username is required'
          );
          done();
        });
    });
    it('Should not register a user with an empty email field', done => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: '',
          bio: 'A transport organisation',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '1234567890',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.email).to.equal('Email is required');
          done();
        });
    });
    it('Should not register a user with an empty location field', done => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: 'reels@test.com',
          bio: 'A transport organisation',
          location: '',
          password: '1234567890',
          confirmPassword: '1234567890',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.location).to.equal(
            'Location is required'
          );
          done();
        });
    });
    it('Should register a user if bio is not available', done => {
      request
        .post(signupUrl)
        .send({
          username: 'testee',
          email: 'testee@test.com',
          bio: '',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '1234567890',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          expect(response.body.data).to.have.property('token');
          expect(response.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should not register a user with an empty password field', done => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: 'reels@test.com',
          bio: 'A transport organisation',
          location: 'Nigeria',
          password: '',
          confirmPassword: '1234567890',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.password).to.equal(
            'Password is required'
          );
          done();
        });
    });
    it('Should not register a user with an empty confirm password field', done => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: 'reels@test.com',
          bio: 'A transport organisation',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.confirmPassword).to.equal(
            'Please confirm your password'
          );
          done();
        });
    });

    it("Should not register a user if passwords don't match", done => {
      request
        .post(signupUrl)
        .send({
          username: 'Reels',
          email: 'reels@test.com',
          bio: 'A transport organisation',
          location: 'Nigeria',
          password: '1234567890',
          confirmPassword: '1234567',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.confirmPassword).to.equal(
            "Passwords don't match"
          );
          done();
        });
    });
  });
});
describe('# Sign in user', () => {
  before(done => {
    request
      .post(signupUrl)
      .send(user2)
      .end((error, response) => {
        expect(response.statusCode).to.equal(201);
        done();
      });
  });
  it('Should sign in user', done => {
    request
      .post(signinUrl)
      .send({
        username: 'test2',
        password: '1234567890',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body.data).to.have.property('token');
        expect(response.body.data.token).to.be.a('string');
        done();
      });
  });
  it('Should not sign in user with the wrong password', done => {
    request
      .post(signinUrl)
      .send({
        username: 'test2',
        password: '12345',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Not Found');
        expect(response.body.errors.detail).to.equal(
          'Wrong username or password'
        );
        done();
      });
  });
  it('Should not sign in user with the wrong username', done => {
    request
      .post(signinUrl)
      .send({
        username: 'wrong username',
        password: '1234567890',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Not Found');
        expect(response.body.errors.detail).to.equal(
          'These credentials do not match our record'
        );
        done();
      });
  });
  it('Should not sign in user if no username is provided', done => {
    request
      .post(signinUrl)
      .send({
        username: '',
        password: '1234567890',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.username).to.equal(
          'Please provide a username or email'
        );
        done();
      });
  });
  it('Should not sign in user if no password is provided', done => {
    request
      .post(signinUrl)
      .send({
        username: 'test2',
        password: '',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.password).to.equal('Password is required');
        done();
      });
  });
});
describe('# Get user Profile ', () => {
  before(done => {
    request
      .post(signupUrl)
      .send(user3)
      .end((error, response) => {
        expect(response.statusCode).to.equal(201);
        userToken = response.body.data.token;
        done();
      });
  });
  it('Should not get profile of a non-existing user', done => {
    request
      .get('/api/v1/users/15/profile')
      .set('token', userToken)
      .end((error, response) => {
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Not Found');
        expect(response.body.errors.detail).to.equal(
          'A user with that Id is not found'
        );
        done();
      });
  });
  it('Should not get profile if the user id is not a number', done => {
    request.get('/api/v1/users/number/profile').end((error, response) => {
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.be.an('object');
      expect(response.body.errors.id).to.equal('Id must be a number');
      done();
    });
  });
  it('Should not get profile if no token is provided', done => {
    request.get('/api/v1/users/9/profile').end((error, response) => {
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.be.an('object');
      expect(response.body.errors.title).to.equal('Unauthorized');
      expect(response.body.errors.detail).to.equal(
        'You are not allowed to perform this action'
      );
      done();
    });
  });
  it('Should not get profile if the token id does not match user id', done => {
    request
      .get('/api/v1/users/1/profile')
      .set('token', userToken)
      .end((error, response) => {
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Unauthorized');
        expect(response.body.errors.detail).to.equal(
          'You are not allowed to perform this action'
        );
        done();
      });
  });
  it('Should get profile details if the token id matches user id', done => {
    request
      .get('/api/v1/users/5/profile')
      .set('token', userToken)
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.body.data.user).to.have.property('username');
        expect(response.body.data.user).to.have.property('email');
        expect(response.body.data.user).to.have.property('bio');
        expect(response.body.data.user).to.have.property('location');
        done();
      });
  });
});
describe('# Update user Profile ', () => {
  before(done => {
    request
      .post(signupUrl)
      .send(user4)
      .end((error, response) => {
        expect(response.statusCode).to.equal(201);
        userToken2 = response.body.data.token;
        done();
      });
  });
  it('Should not allow a non authenticated user edit their profile', done => {
    request
      .put('/api/v1/users/profile')
      .send({
        bio: 'new test bio',
        location: 'Austria',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Unauthorized');
        expect(response.body.errors.detail).to.equal(
          'You are not authorized to perform this action'
        );
        done();
      });
  });

  it('Should allow an authenticated user to edit their profile', done => {
    request
      .put('/api/v1/users/profile')
      .set('token', userToken2)
      .send({
        bio: 'new test bio',
        location: 'Austria',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body.data.user).to.have.property('username');
        expect(response.body.data.user.bio).to.equal('new test bio');
        expect(response.body.data.user.location).to.equal('Austria');
        expect(response.body.data.user).to.have.property('email');
        done();
      });
  });
});
describe('# Recover lost user password ', () => {
  it('Should not send recovery link with an empty email field', done => {
    request
      .post('/api/v1/users/recover-password')
      .send({
        email: '',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.email).to.equal('Email is required');
        done();
      });
  });
  it('Should not send recovery link with an invalid email address', done => {
    request
      .post('/api/v1/users/recover-password')
      .send({
        email: 'testtest.com',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.email).to.equal(
          'Email is invalid or empty'
        );
        done();
      });
  });
  it('Should not send recovery link for an email that does not exist', done => {
    request
      .post('/api/v1/users/recover-password')
      .send({
        email: 'nonexisting@test.com',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Not Found');
        expect(response.body.errors.detail).to.equal('Email not found');
        done();
      });
  });
});
describe('# Reset user password ', () => {
  before(done => {
    request
      .post(signupUrl)
      .send(user6)
      .end((error, response) => {
        expect(response.statusCode).to.equal(201);
        userToken3 = response.body.data.token;
        done();
      });
  });
  it('Should not reset password if password field is empty', done => {
    request
      .put('/api/v1/users/password-reset')
      .set('token', userToken3)
      .send({
        password: '',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.password).to.equal('Password is required');
        done();
      });
  });
  it('Should not reset password if confirm password field is empty', done => {
    request
      .put('/api/v1/users/password-reset')
      .set('token', userToken3)
      .send({
        password: '1234567890',
        confirmPassword: '',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.confirmPassword).to.equal(
          'Please confirm your password'
        );
        done();
      });
  });
  it("Should not reset password if passwords don't match", done => {
    request
      .put('/api/v1/users/password-reset')
      .set('token', userToken3)
      .send({
        password: '1234567890',
        confirmPassword: '12345',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.confirmPassword).to.equal(
          "Passwords don't match"
        );
        done();
      });
  });
  it('Should not reset password for a non-authenticated user', done => {
    request
      .put('/api/v1/users/password-reset')
      .send({
        password: '12345',
        confirmPassword: '12345',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Unauthorized');
        expect(response.body.errors.detail).to.equal(
          'You are not authorized to perform this action'
        );
        done();
      });
  });
  it('Should reset password for an authenticated user', done => {
    request
      .put('/api/v1/users/password-reset')
      .set('token', userToken3)
      .send({
        password: '12345',
        confirmPassword: '12345',
      })
      .end((error, response) => {
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.equal(
          'You do not have the permission to perform this action'
        );
        done();
      });
  });
});
