const CategoryService = require("../services/CategoryService");

class CategoryController {
    
    async renderCategoryView(req, res) {
        try {
            const categories = await CategoryService.findAll();
            res.render('layout/main', {
                title: 'Categorias',
                pageType: 'category',
                categories: categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar categorias.");
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.findAll();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createCategory(req, res) {
        try {
            await CategoryService.create(req.body);
            return res.status(201).json({ message: "Categoria criada." });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            await CategoryService.update(req.params.id, req.body);
            return res.status(200).json({ message: "Categoria atualizada." });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            await CategoryService.delete(req.params.id);
            return res.status(200).send();
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();