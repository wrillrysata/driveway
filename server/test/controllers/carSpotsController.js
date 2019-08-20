import supertest from 'supertest';
import { expect } from 'chai';
import moment from 'moment';
import app from '../../app';

const request = supertest(app);

const signinUrl = '/api/v1/users/signin';
const parkUrl = '/api/v1/parks';

let adminToken;
const admin = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD,
};
const spot = {
  status: 'Free',
};
describe('Admin carSpots test', () => {
  describe('# Assign a carSpot', () => {
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
          parkname: 'Test CarSpots',
          initialSpots: 2,
          status: 'active',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('Should add a spot to park', done => {
      request
        .post('/api/v1/parks/1/spot/new')
        .set('token', adminToken)
        .send(spot)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        });
    });
    it('Should not assign a carSpot for non auth user', done => {
      request
        .post('/api/v1/spot/3/car-spot')
        .send({
          entry_timestamp: moment.utc(),
          allocated_duration: '5400',
          occupant_id: 'NXY5678',
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
    it('Should not assign a carSpot without allocating duration of stay', done => {
      request
        .post('/api/v1/spot/3/car-spot')
        .set('token', adminToken)
        .send({
          entry_timestamp: moment.utc(),
          allocated_duration: '',
          occupant_id: 'NXY5678',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.allocatedDuration).to.equal(
            'Please specify assigned duration of stay'
          );
          done();
        });
    });
    it('Should assign a carSpot for auth user', done => {
      request
        .post('/api/v1/spot/3/car-spot')
        .set('token', adminToken)
        .send({
          entry_timestamp: moment.utc(),
          allocated_duration: '5400',
          occupant_id: 'NXY5678',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(
            'Successfully assigned car to spot'
          );
          done();
        });
    });
    it('Should not assign a carSpot without occupant id', done => {
      request
        .post('/api/v1/spot/3/car-spot')
        .set('token', adminToken)
        .send({
          entry_timestamp: moment.utc(),
          allocated_duration: '5400',
          occupant_id: '',
        })
        .end((error, response) => {
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors.occupantId).to.equal(
            'Please enter occupant identification'
          );
          done();
        });
    });
  });
  describe('# Remove a carSpot', () => {
    it('Should not remove a carSpot for non auth user', done => {
      request
        .delete('/api/v1/car-spot/1')
        .send()
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
    it('Should remove a carSpot for auth user', done => {
      request
        .delete('/api/v1/car-spot/1')
        .set('token', adminToken)
        .send()
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          done();
        });
    });
  });
});
