/**
 * Clase base genérica para operaciones DAO
 * Elimina la duplicación de código entre diferentes DAOs
 */
export default class GenericDAO {
    constructor(model) {
        this.model = model;
    }

    get = (params = {}) => {
        return this.model.find(params);
    }

    getBy = (params) => {
        return this.model.findOne(params);
    }

    save = (doc) => {
        return this.model.create(doc);
    }

    update = (id, doc) => {
        return this.model.findByIdAndUpdate(id, { $set: doc }, { new: true, runValidators: true });
    }

    delete = (id) => {
        return this.model.findByIdAndDelete(id);
    }
}
