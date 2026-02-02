import { generateMockUsers, generateMockPets } from '../utils/mocking.js';
import { usersService, petsService } from '../services/index.js';

const getMockingPets = async (req, res) => {
    try {
        const pets = generateMockPets(100);
        res.send({ status: 'success', payload: pets });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
};

const getMockingUsers = async (req, res) => {
    try {
        const users = await generateMockUsers(50);
        res.send({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
};

const generateData = async (req, res) => {
    try {
        const { users, pets } = req.body;

        if (!users || !pets) {
            return res.status(400).send({ 
                status: 'error', 
                error: 'Se requieren los parámetros "users" y "pets"' 
            });
        }

        const numUsers = parseInt(users);
        const numPets = parseInt(pets);

        if (isNaN(numUsers) || isNaN(numPets) || numUsers < 0 || numPets < 0) {
            return res.status(400).send({ 
                status: 'error', 
                error: 'Los parámetros deben ser números válidos positivos' 
            });
        }

        const mockUsers = await generateMockUsers(numUsers);
        
        const mockPets = generateMockPets(numPets);

        const insertedUsers = [];
        for (const user of mockUsers) {
            const result = await usersService.create(user);
            insertedUsers.push(result);
        }

        const insertedPets = [];
        for (const pet of mockPets) {
            const result = await petsService.create(pet);
            insertedPets.push(result);
        }

        res.send({ 
            status: 'success', 
            message: `Se insertaron ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas en la base de datos`,
            payload: {
                users: insertedUsers.length,
                pets: insertedPets.length
            }
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
};

export default {
    getMockingPets,
    getMockingUsers,
    generateData
};
