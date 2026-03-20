import supertest from 'supertest';
import chai from 'chai';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing del módulo de Adoptions', function() {
    this.timeout(10000);

    let testUser;
    let testPet;
    let testAdoption;

    // Limpiar y preparar datos de prueba antes de los tests
    before(async function() {
        // Conectar a la base de datos si no está conectada
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('URL DE MONGO');
        }
    });

    // Limpiar datos de prueba después de los tests
    after(async function() {
        // Limpiar datos de prueba si es necesario
        if (testUser && testUser._id) {
            await requester.delete(`/api/users/${testUser._id}`);
        }
    });

    describe('POST /api/adoptions/:uid/:pid', function() {
        
        // Crear usuario y mascota de prueba antes de cada test de adopción
        beforeEach(async function() {
            // Crear un usuario de prueba usando la API de mocks
            const userResponse = await requester.get('/api/mocks/mockingusers').query({ num: 1 });
            const users = userResponse.body.payload;
            
            if (users && users.length > 0) {
                // Registrar el usuario en la base de datos
                const sessionResponse = await requester.post('/api/sessions/register').send({
                    first_name: users[0].first_name,
                    last_name: users[0].last_name,
                    email: users[0].email,
                    password: 'password123'
                });
                
                // Obtener el usuario creado
                const allUsers = await requester.get('/api/users');
                testUser = allUsers.body.payload.find(u => u.email === users[0].email);
            }

            // Crear una mascota de prueba
            const petResponse = await requester.get('/api/mocks/mockingpets').query({ num: 1 });
            const pets = petResponse.body.payload;
            
            if (pets && pets.length > 0) {
                // Crear la mascota en la base de datos (si tienes endpoint para esto)
                // O usar directamente el ID del mock si está en la base de datos
                const allPets = await requester.get('/api/pets');
                testPet = allPets.body.payload.find(p => !p.adopted);
                
                // Si no hay mascotas disponibles, crear una
                if (!testPet) {
                    testPet = pets[0];
                }
            }
        });

        it('Debe crear una adopción exitosamente con usuario y mascota válidos', async function() {
            if (!testUser || !testPet) {
                this.skip();
                return;
            }

            const { statusCode, body } = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status').that.equals('success');
            expect(body).to.have.property('message').that.equals('Pet adopted');
        });

        it('Debe retornar error 404 si el usuario no existe', async function() {
            const fakeUserId = '507f1f77bcf86cd799439011';
            
            if (!testPet) {
                this.skip();
                return;
            }

            const { statusCode, body } = await requester
                .post(`/api/adoptions/${fakeUserId}/${testPet._id}`);

            expect(statusCode).to.equal(404);
            expect(body).to.have.property('status').that.equals('error');
            expect(body).to.have.property('error').that.equals('user Not found');
        });

        it('Debe retornar error 404 si la mascota no existe', async function() {
            const fakePetId = '507f1f77bcf86cd799439011';
            
            if (!testUser) {
                this.skip();
                return;
            }

            const { statusCode, body } = await requester
                .post(`/api/adoptions/${testUser._id}/${fakePetId}`);

            expect(statusCode).to.equal(404);
            expect(body).to.have.property('status').that.equals('error');
            expect(body).to.have.property('error').that.equals('Pet not found');
        });

        it('Debe retornar error 400 si la mascota ya está adoptada', async function() {
            if (!testUser || !testPet) {
                this.skip();
                return;
            }

            // Adoptar la mascota primero
            await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            // Intentar adoptarla de nuevo
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(statusCode).to.equal(400);
            expect(body).to.have.property('status').that.equals('error');
            expect(body).to.have.property('error').that.equals('Pet is already adopted');
        });
    });

    describe('GET /api/adoptions', function() {
        
        it('Debe obtener todas las adopciones', async function() {
            const { statusCode, body } = await requester.get('/api/adoptions');

            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status').that.equals('success');
            expect(body).to.have.property('payload').that.is.an('array');
        });

        it('El payload debe ser un array', async function() {
            const { body } = await requester.get('/api/adoptions');

            expect(body.payload).to.be.an('array');
        });

        it('Si hay adopciones, deben tener la estructura correcta', async function() {
            const { body } = await requester.get('/api/adoptions');

            if (body.payload && body.payload.length > 0) {
                const adoption = body.payload[0];
                expect(adoption).to.have.property('_id');
                expect(adoption).to.have.property('owner');
                expect(adoption).to.have.property('pet');
            }
        });
    });

    describe('GET /api/adoptions/:aid', function() {
        
        beforeEach(async function() {
            // Obtener una adopción existente para los tests
            const response = await requester.get('/api/adoptions');
            if (response.body.payload && response.body.payload.length > 0) {
                testAdoption = response.body.payload[0];
            }
        });

        it('Debe obtener una adopción por ID', async function() {
            if (!testAdoption) {
                this.skip();
                return;
            }

            const { statusCode, body } = await requester
                .get(`/api/adoptions/${testAdoption._id}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status').that.equals('success');
            expect(body).to.have.property('payload').that.is.an('object');
        });

        it('La adopción obtenida debe tener la estructura correcta', async function() {
            if (!testAdoption) {
                this.skip();
                return;
            }

            const { body } = await requester
                .get(`/api/adoptions/${testAdoption._id}`);

            expect(body.payload).to.have.property('_id');
            expect(body.payload).to.have.property('owner');
            expect(body.payload).to.have.property('pet');
        });

        it('Debe retornar error 404 si la adopción no existe', async function() {
            const fakeAdoptionId = '507f1f77bcf86cd799439011';

            const { statusCode, body } = await requester
                .get(`/api/adoptions/${fakeAdoptionId}`);

            expect(statusCode).to.equal(404);
            expect(body).to.have.property('status').that.equals('error');
            expect(body).to.have.property('error').that.equals('Adoption not found');
        });

        it('Debe retornar error si el ID tiene formato inválido', async function() {
            const invalidId = 'invalid-id-format';

            const { statusCode } = await requester
                .get(`/api/adoptions/${invalidId}`);

            // Mongoose lanzará un error de casteo, esperamos un código de error
            expect(statusCode).to.not.equal(200);
        });
    });

    describe('Tests de integración completos', function() {
        
        it('Debe completar el flujo completo: crear adopción y verificarla', async function() {
            // Crear usuario
            const userResponse = await requester.get('/api/mocks/mockingusers').query({ num: 1 });
            const users = userResponse.body.payload;
            
            if (!users || users.length === 0) {
                this.skip();
                return;
            }

            await requester.post('/api/sessions/register').send({
                first_name: users[0].first_name,
                last_name: users[0].last_name,
                email: users[0].email,
                password: 'password123'
            });

            const allUsers = await requester.get('/api/users');
            const newUser = allUsers.body.payload.find(u => u.email === users[0].email);

            // Obtener mascota disponible
            const petsResponse = await requester.get('/api/pets');
            const availablePet = petsResponse.body.payload.find(p => !p.adopted);

            if (!newUser || !availablePet) {
                this.skip();
                return;
            }

            // Crear adopción
            const adoptionResponse = await requester
                .post(`/api/adoptions/${newUser._id}/${availablePet._id}`);

            expect(adoptionResponse.statusCode).to.equal(200);

            // Verificar que la adopción existe
            const adoptionsResponse = await requester.get('/api/adoptions');
            const createdAdoption = adoptionsResponse.body.payload.find(
                a => a.owner === newUser._id && a.pet === availablePet._id
            );

            expect(createdAdoption).to.exist;

            // Verificar que se puede obtener por ID
            if (createdAdoption) {
                const singleAdoptionResponse = await requester
                    .get(`/api/adoptions/${createdAdoption._id}`);
                
                expect(singleAdoptionResponse.statusCode).to.equal(200);
                expect(singleAdoptionResponse.body.payload._id).to.equal(createdAdoption._id);
            }
        });
    });
});
