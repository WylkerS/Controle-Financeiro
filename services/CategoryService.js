const db = require('../infra/database');

class CategoryService {
    constructor() {
        this.Category = db.models.Category;
        this.Transaction = db.models.Transaction;
    }

    async create(data) {
        return this.Category.create(data);
    }

    async findAll() {
        return this.Category.findAll({ order: [['name', 'ASC']] });
    }

    async update(id, data) {
        const category = await this.Category.findByPk(id);
        if (!category) throw new Error("Categoria não encontrada.");
        return category.update(data);
    }

    async delete(id) {
        await this.Transaction.destroy({ 
            where: { categoryId: id } 
        });

        return this.Category.destroy({ 
            where: { id: id } 
        });
    }
}

module.exports = new CategoryService();