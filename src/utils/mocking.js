import { faker } from '@faker-js/faker';
import { createHash } from './index.js';
export const generateMockUser = async (role = 'user') => {
    const password = role === 'admin' ? 'coder123' : faker.internet.password();
    
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await createHash(password),
        role: role,
        pets: [] 
    };
};

export const generateMockUsers = async (num = 50) => {
    const users = [];
    for (let i = 0; i < num; i++) {
        const role = i === 0 ? 'admin' : 'user';
        users.push(await generateMockUser(role));
    }
    return users;
};

export const generateMockPet = () => {
    const species = ['dog', 'cat', 'bird', 'hamster', 'rabbit', 'fish'];
    const randomSpecie = species[Math.floor(Math.random() * species.length)];
    
    return {
        name: faker.animal.petName(),
        specie: randomSpecie,
        birthDate: faker.date.past({ years: 10 }),
        adopted: false,
        image: faker.image.url()
    };
};

export const generateMockPets = (num = 100) => {
    const pets = [];
    for (let i = 0; i < num; i++) {
        pets.push(generateMockPet());
    }
    return pets;
};
