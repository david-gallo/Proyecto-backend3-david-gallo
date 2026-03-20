import userModel from "./models/User.js";
import GenericDAO from "./GenericDAO.js";

export default class Users extends GenericDAO {
    constructor() {
        super(userModel);
    }
}