import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

const request = supertest(app);

describe('Tests del módulo de Pets', function() {
    let testPetId;

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
        // Limpiar la mascota de prueba si existe
        if (testPetId) {
            try {
                await request.delete(`/api/pets/${testPetId}`);
            } catch (error) {
                // Ignorar errores de limpieza
            }
        }
    });

    describe('POST /api/pets - Crear mascota', () => {
        it('Debería crear una mascota correctamente', async () => {
            const petData = {
                name: 'Firulais',
                specie: 'Dog',
                birthDate: '2020-01-15'
            };

            const response = await request
                .post('/api/pets')
                .send(petData);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.name).to.equal('Firulais');
            expect(response.body.payload.specie).to.equal('Dog');
            
            testPetId = response.body.payload._id;
        });

        it('Debería rechazar mascota con datos incompletos', async () => {
            const incompleteData = {
                name: 'Test Pet'
                // Faltan campos requeridos
            };

            const response = await request
                .post('/api/pets')
                .send(incompleteData);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar especie inválida', async () => {
            const invalidSpecieData = {
                name: 'Test Pet',
                specie: 'Dragon', // Especie no válida
                birthDate: '2020-01-15'
            };

            const response = await request
                .post('/api/pets')
                .send(invalidSpecieData);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería crear mascota con diferentes especies válidas', async () => {
            const especies = ['Cat', 'Bird', 'Rabbit', 'Fish', 'Other'];
            
            for (const specie of especies) {
                const petData = {
                    name: `Test ${specie}`,
                    specie: specie,
                    birthDate: '2021-03-20'
                };

                const response = await request
                    .post('/api/pets')
                    .send(petData);

                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.specie).to.equal(specie);

                // Limpiar mascota creada
                await request.delete(`/api/pets/${response.body.payload._id}`);
            }
        });

        it('Debería crear mascota con nombre cortos válidos', async () => {
            const petData = {
                name: 'Bo', // 2 caracteres (mínimo)
                specie: 'Cat',
                birthDate: '2022-01-01'
            };

            const response = await request
                .post('/api/pets')
                .send(petData);

            expect(response.status).to.equal(200);
            expect(response.body.payload.name).to.equal('Bo');

            // Limpiar
            await request.delete(`/api/pets/${response.body.payload._id}`);
        });
    });

    describe('GET /api/pets - Obtener todas las mascotas', () => {
        it('Debería obtener todas las mascotas', async () => {
            const response = await request.get('/api/pets');

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
        });

        it('Debería incluir la mascota creada en la lista', async () => {
            const response = await request.get('/api/pets');

            expect(response.status).to.equal(200);
            const pets = response.body.payload;
            const createdPet = pets.find(pet => pet._id === testPetId);
            
            expect(createdPet).to.exist;
            expect(createdPet.name).to.equal('Firulais');
        });
    });

    describe('PUT /api/pets/:pid - Actualizar mascota', () => {
        it('Debería actualizar una mascota correctamente', async () => {
            const updateData = {
                name: 'Firulais Updated',
                specie: 'Dog',
                birthDate: '2020-01-15'
            };

            const response = await request
                .put(`/api/pets/${testPetId}`)
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
        });

        it('Debería rechazar actualización con especie inválida', async () => {
            const invalidUpdate = {
                specie: 'InvalidSpecie',
                name: 'Test',
                birthDate: '2020-01-01'
            };

            const response = await request
                .put(`/api/pets/${testPetId}`)
                .send(invalidUpdate);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería rechazar actualización con ID inválido', async () => {
            const response = await request
                .put('/api/pets/invalid-id')
                .send({ name: 'Test', specie: 'Dog', birthDate: '2020-01-01' });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería retornar 404 para mascota inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            const response = await request
                .put(`/api/pets/${fakeId}`)
                .send({ name: 'Test', specie: 'Dog', birthDate: '2020-01-01' });

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('DELETE /api/pets/:pid - Eliminar mascota', () => {
        it('Debería rechazar eliminación con ID inválido', async () => {
            const response = await request.delete('/api/pets/invalid-id');

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('Debería eliminar una mascota correctamente', async () => {
            const response = await request.delete(`/api/pets/${testPetId}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            
            testPetId = null;
        });

        it('Debería retornar 404 al intentar eliminar mascota inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            const response = await request.delete(`/api/pets/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('Validaciones de modelo Pet', () => {
        it('Debería aceptar mascotas con estado adopted por defecto en false', async () => {
            const petData = {
                name: 'Test Adopted',
                specie: 'Cat',
                birthDate: '2021-05-10'
            };

            const response = await request
                .post('/api/pets')
                .send(petData);

            expect(response.status).to.equal(200);
            expect(response.body.payload.adopted).to.equal(false);

            // Limpiar
            await request.delete(`/api/pets/${response.body.payload._id}`);
        });
    });
});
