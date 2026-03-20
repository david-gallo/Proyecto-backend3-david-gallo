import adoptionModel from "./models/Adoption.js";
import GenericDAO from "./GenericDAO.js";

export default class Adoption extends GenericDAO {
    constructor() {
        super(adoptionModel);
    }
}