import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';

const request = supertest(app);

let adminToken;
const signinUrl = '/api/v1/users/signin';
const parkUrl = '/api/v1/parks';
const admin = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD,
};
const spot = {
  status: 'Free',
};
const park = {
  parkname: 'The Lounge',
  initialSpots: 2,
  status: 'active',
};
describe('Admin spot test', () => {
  describe('# Generate a parking spot', () => {
    before(done => {
      request
        .post(signinUrl)
        .send(admin)
        .end((error, response) => {
          expect(response.statusCode).to.equal(200);
          adminToken = response.body.data.token;
          done();
        });
    });
    it('Should add park', done => {
      request
        .post('/api/v1/parks')
        .set('token', adminToken)
        .send({
          parkname: 'Test Spot',
          initialSpots: 2,
          status: 'active',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          done();
        });
    });
    it('Should not generate a parking spot for non auth user', done => {
      request
        .post('/api/v1/parks/:parkId/spot/new')
        .send(spot)
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
    it('Should generate a parking spot for auth user', done => {
      request
        .post('/api/v1/parks/3/spot/new')
        .set('token', adminToken)
        .send(spot)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');

          done();
        });
    });
  });
  describe('# Delete a parking spot', () => {
    before(done => {
      request
        .post(signinUrl)
        .send(admin)
        .end((error, response) => {
          expect(response.statusCode).to.equal(200);
          adminToken = response.body.data.token;
          done();
        });
    });
    it('Should not delete a parking spot if id is not a number', done => {
      request
        .delete('/api/v1/spot/:id')
        .set('token', adminToken)
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.id).to.equal(
            'Id must be a number'
          );
          done();
        });
    });
    it('Should not delete a parking spot that does not exist', done => {
      request
        .delete('/api/v1/spot/50')
        .set('token', adminToken)
        .end((error, response) => {
          expect(response.statusCode).to.equal(404);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.title).to.equal('Not Found');
          expect(response.body.errors.detail).to.equal(
            'A spot with that Id is not found'
          );
          done();
        });
    });
    it('Should not delete a parking spot for non auth user', done => {
      request.delete('/api/v1/spot/1').end((error, response) => {
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.be.an('object');
        expect(response.body.errors.title).to.equal('Unauthorized');
        expect(response.body.errors.detail).to.equal(
          'You are not authorized to perform this action'
        );

        done();
      });
    });
    it('Should delete a parking spot for auth user', done => {
      request
        .delete('/api/v1/spot/8')
        .set('token', adminToken)
        .end((error, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body).to.be.an('object');

          done();
        });
    });
  });
});
