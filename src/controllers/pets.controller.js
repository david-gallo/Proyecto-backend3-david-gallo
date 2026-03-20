import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async(req,res)=>{
    try {
        const pets = await petsService.getAll();
        res.send({status:"success",payload:pets});
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        res.status(500).send({status:"error",error:"Error al obtener mascotas"});
    }
}

const createPet = async(req,res)=> {
    try {
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) {
            return res.status(400).send({status:"error",error:"Incomplete values"});
        }
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result});
    } catch (error) {
        console.error('Error al crear mascota:', error);
        res.status(500).send({status:"error",error:"Error al crear mascota"});
    }
}

const updatePet = async(req,res) =>{
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        
        const pet = await petsService.getBy({_id: petId});
        if (!pet) {
            return res.status(404).send({status:"error",error:"Pet not found"});
        }
        
        const result = await petsService.update(petId,petUpdateBody);
        res.send({status:"success",message:"pet updated"});
    } catch (error) {
        console.error('Error al actualizar mascota:', error);
        res.status(500).send({status:"error",error:"Error al actualizar mascota"});
    }
}

const deletePet = async(req,res)=> {
    try {
        const petId = req.params.pid;
        
        const pet = await petsService.getBy({_id: petId});
        if (!pet) {
            return res.status(404).send({status:"error",error:"Pet not found"});
        }
        
        const result = await petsService.delete(petId);
        res.send({status:"success",message:"pet deleted"});
    } catch (error) {
        console.error('Error al eliminar mascota:', error);
        res.status(500).send({status:"error",error:"Error al eliminar mascota"});
    }
}

const createPetWithImage = async(req,res) =>{
    try {
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) {
            return res.status(400).send({status:"error",error:"Incomplete values"});
        }
        if(!file) {
            return res.status(400).send({status:"error",error:"Image is required"});
        }
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result});
    } catch (error) {
        console.error('Error al crear mascota con imagen:', error);
        res.status(500).send({status:"error",error:"Error al crear mascota con imagen"});
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}