import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';

const request = supertest(app);

let adminToken;
const admin = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD,
};
const spot1 = {
    spotname:'Spot XDF',
    status:'Free'
}
describe('Admin spot test', () => {
    describe('# Generate a parking spot', () => {
        it('Should not generate a parking spot for non auth user', done => {
            request
              .post('/api/v1/parks/:parkId/spot/new')
              .send(spot1)
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
        it('Should generate a parking spot for auth user', done=>{
            request
              .post('/api/v1/parks/:parkId/spot/new')
              .send(spot1)
              .end((error, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object');

              })


        })
    })
    describe('# Delete a parking spot', () => {
        it('Should not delete a parking spot if id is not a number', done=>{
            request
              .delete('/api/v1/spot/:spotId')
              .set(token, adminToken)
              .end((error, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object');
                expect(response.body.errors.spotId).to.equal(
                  'Spot Id must be a number'
                );
                done();

              })

        })
        it('Should not delete a parking spot that does not exist',done=>{
            request
              .delete('/api/v1/spot/11')
              .set(token, adminToken)
              .end((error, response) => {
                expect(response.statusCode).to.equal(404);
                expect(response.body).to.be.an('object');
                expect(response.body.errors.title).to.equal('Not Found');
                expect(response.body.errors.detail).to.equal(
                  'A spot with that Id is not found'
                );
                done();

              })
        })
        it('Should not delete a parking spot for non auth user', done => {
            request
              .delete('/api/v1/spot/1')
              .end((error, response) => {
                expect(response.statusCode).to.equal(401);
                expect(response.body).to.be.an('object');
                expect(response.body.errors.title).to.equal('Unauthorized');
                expect(response.body.errors.detail).to.equal(
                  'You are not authorized to perform this action'
                );
        
                done();

              })

        })
        it('Should delete a parking spot for auth user', done => {
            request
              .delete('/api/v1/spot/1')
              .set('token', adminToken)
              .end((error, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object');
       
                done();
              })

        })

    })
})