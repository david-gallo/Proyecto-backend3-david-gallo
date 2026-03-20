import petModel from "./models/Pet.js";
import GenericDAO from "./GenericDAO.js";

export default class Pet extends GenericDAO {
    constructor() {
        super(petModel);
    }
}