import supertest from 'supertest';
import { expect } from 'chai';
import moment from 'moment';
import app from '../../app';

const request = supertest(app);

const signinUrl = '/api/v1/users/signin';
const parkUrl = '/api/v1/parks';
const spotUrl = '/api/v1/parks/3/spot/new';
let adminToken;
const admin = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD,
};
const spot = {
  status: 'Free',
};
const park = {
  parkname: 'Binary',
  initialSpots: 2,
  status: 'active',
};
describe.skip('Admin carSpots test', () => {
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
    before(done => {
      request
        .post(parkUrl)
        .set('token', adminToken)
        .send(park)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        });
    });
    before(done => {
      request
        .post(spotUrl)
        .set('token', adminToken)
        .send(spot)
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        });
    });
    it('Should not assign a carSpot for non auth user', done => {
      request
        .post('/api/v1/spot/11/assign-car-spot')
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
        .post('/api/v1/spot/11/assign-car-spot')
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
            'Please enter assigned duration of stay'
          );
          done();
    })
  })
  it('Should not assign a carSpot without occupant id', done => {
    request
        .post('/api/v1/spot/11/assign-car-spot')
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
    })
  })
  it('Should assign a carSpot for auth user', done => {
    request
        .post('/api/v1/spot/11/assign-car-spot')
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
    })
  })
  });
  describe('# Remove a carSpot', () => {
    it('Should not remove a carSpot for non auth user', done => {
      request
        .put('/api/v1/spot/11/remove-car-spot')
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
    })
    it('Should remove a carSpot for auth user', done => {
      request
        .put('/api/v1/spot/11/remove-car-spot')
        .send()
        .end((error, response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.body).to.be.an('object');
          done();
        });
    })
  })
});
