import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

const request = supertest(app);

describe('Tests del módulo de Users', function() {
    let testUserId;
    let testUserEmail;

    // Hook antes de todos los tests
    before(function(done) {
        // Esperar a que MongoDB se conecte
        if (mongoose.connection.readyState === 1) {
            done();
        } else {
            mongoose.connection.on('connected', () => done());
        }
    });

    // Hook después de todos los tests
    after(async function() {
        // Limpiar el usuario de prueba si existe
        if (testUserId) {
            try {
                await request.delete(`/api/users/${testUserId}`);
            } catch (error) {
                // Ignorar errores de limpieza
            }
        }
    });

    describe('POST /api/sessions/register - Crear usuario', () => {
        it('Debería crear un usuario correctamente', async () => {
            testUserEmail = `test${Date.now()}@test.com`;
            
            const userData = {
                first_name: 'Test',
                last_name: 'User',
                email: testUserEmail,
                password: 'test123'
            };

            const response = await request
                .post('/api/sessions/register')
                .send(userData);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.a('string'); // Retorna solo el ID
            
            testUserId = response.body.payload;
        });

        it('Debería rechazar usuario con datos incompletos', async () => {
            const incompleteData = {
                first_name: 'Test'
                // Faltan campos requeridos
            };

            const response = await request
                .post('/api/sessions/register')
                .send(incompleteData);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar email con formato inválido', async () => {
            const invalidEmailData = {
                first_name: 'Test',
                last_name: 'User',
                email: 'invalid-email',
                password: 'test123'
            };

            const response = await request
                .post('/api/sessions/register')
                .send(invalidEmailData);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar password muy corto', async () => {
            const shortPasswordData = {
                first_name: 'Test',
                last_name: 'User',
                email: `test${Date.now()}@test.com`,
                password: '123' // Menos de 6 caracteres
            };

            const response = await request
                .post('/api/sessions/register')
                .send(shortPasswordData);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar email duplicado', async () => {
            const duplicateEmail = {
                first_name: 'Test',
                last_name: 'Duplicate',
                email: testUserEmail, // Email ya usado
                password: 'test123'
            };

            const response = await request
                .post('/api/sessions/register')
                .send(duplicateEmail);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.include('already exists');
        });
    });

    describe('GET /api/users - Obtener todos los usuarios', () => {
        it('Debería obtener todos los usuarios', async () => {
            const response = await request.get('/api/users');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
        });
    });

    describe('GET /api/users/:uid - Obtener usuario por ID', () => {
        it('Debería obtener un usuario existente', async () => {
            const response = await request.get(`/api/users/${testUserId}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload._id).to.equal(testUserId);
        });

        it('Debería retornar 404 para usuario inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439011'; // ID válido pero inexistente

            const response = await request.get(`/api/users/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar ID con formato inválido', async () => {
            const response = await request.get('/api/users/invalid-id');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('PUT /api/users/:uid - Actualizar usuario', () => {
        it('Debería actualizar un usuario correctamente', async () => {
            const updateData = {
                first_name: 'Updated',
                last_name: 'Name'
            };

            const response = await request
                .put(`/api/users/${testUserId}`)
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
        });

        it('Debería rechazar actualización con email inválido', async () => {
            const invalidUpdate = {
                email: 'not-an-email'
            };

            const response = await request
                .put(`/api/users/${testUserId}`)
                .send(invalidUpdate);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar actualización con ID inválido', async () => {
            const response = await request
                .put('/api/users/invalid-id')
                .send({ first_name: 'Test' });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('DELETE /api/users/:uid - Eliminar usuario', () => {
        it('Debería rechazar eliminación con ID inválido', async () => {
            const response = await request.delete('/api/users/invalid-id');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería eliminar un usuario correctamente', async () => {
            const response = await request.delete(`/api/users/${testUserId}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            
            // Marcar como eliminado para que no intente limpiar en after()
            testUserId = null;
        });

        it('Debería retornar 404 al intentar eliminar usuario inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            const response = await request.delete(`/api/users/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });
    });
});
