const db = require('../infra/database');
const { Op } = require('sequelize');

class TransactionService {
    constructor() {
        this.Transaction = db.models.Transaction;
        this.Account = db.models.Account;
        this.Category = db.models.Category;
    }

    // Busca com filtros avançados
    async findAll(filters = {}) {
        const whereClause = {};

        // 1. Filtro de Data (Período)
        if (filters.startDate && filters.endDate) {
            whereClause.date = {
                [Op.between]: [filters.startDate, filters.endDate]
            };
        }

        // 2. Filtro de Conta
        if (filters.accountId) {
            whereClause.accountId = filters.accountId;
        }

        // 3. NOVO: Filtro de Categoria
        if (filters.categoryId) {
            whereClause.categoryId = filters.categoryId;
        }

        // 4. NOVO: Lógica de Ordenação
        let orderClause = [['date', 'ASC'], ['createdAt', 'DESC']]; // Padrão: Data da conta

        if (filters.sortBy === 'createdAt') {
            // Ordenar por Data de LANÇAMENTO (Inversão: mais recentes primeiro)
            orderClause = [['createdAt', 'DESC']];
        } else if (filters.sortBy === 'value') {
            // Ordenar por Valor (Maior para menor)
            orderClause = [['value', 'DESC']];
        }

        return this.Transaction.findAll({
            where: whereClause,
            include: [
                { model: this.Account, as: 'account', attributes: ['id', 'name'] },
                { model: this.Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: orderClause
        });
    }

    // Busca para saldo total (sem alterações)
    async findAllRaw(cutoffDate = null, accountId = null) {
        const whereClause = {};
        if (cutoffDate) whereClause.date = { [Op.lte]: cutoffDate };
        if (accountId) whereClause.accountId = accountId;
        return this.Transaction.findAll({ where: whereClause });
    }

    // ... create, update, delete (MANTÉM IGUAIS AO ANTERIOR) ...
    // Vou omitir aqui para economizar espaço, mas NÃO apague os métodos create/update/delete que já funcionam.
    // Apenas substitua o método findAll acima.
    
    async create(data) {
        // ... (Código do create com lógica de parcelas e T12:00:00) ...
        // Se precisar eu reposto, mas é o mesmo da resposta anterior.
        if (!data.accountId || !data.categoryId || !data.value || !data.date) throw new Error("Dados obrigatórios.");
        let loops = data.recurrence === 'FIXED' ? 120 : (parseInt(data.installments) || 1);
        const baseDate = new Date(data.date + 'T12:00:00');
        const createdTransactions = [];
        const groupId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        for (let i = 0; i < loops; i++) {
            const installmentDate = new Date(baseDate);
            installmentDate.setMonth(baseDate.getMonth() + i); 
            let description = data.description;
            if (data.recurrence === 'VARIABLE' && loops > 1) description = `${data.description} (${i+1}/${loops})`;

            await this.Transaction.create({
                accountId: data.accountId, categoryId: data.categoryId, value: data.value, 
                date: installmentDate, description, transactionType: data.transactionType,
                recurrence: data.recurrence, currentInstallment: i + 1,
                totalInstallments: data.recurrence === 'FIXED' ? 1 : loops, groupId
            });
        }
        return createdTransactions;
    }

    async update(id, data) {
        const transaction = await this.Transaction.findByPk(id);
        if (!transaction) throw new Error("Transação não encontrada.");
        
        if (transaction.recurrence === 'FIXED' && transaction.groupId) {
            return this.Transaction.update({
                value: data.value, description: data.description, accountId: data.accountId,
                categoryId: data.categoryId, transactionType: data.transactionType, recurrence: data.recurrence
            }, { where: { groupId: transaction.groupId } });
        } else {
            return transaction.update({
                value: data.value, description: data.description, date: data.date, 
                accountId: data.accountId, categoryId: data.categoryId,
                transactionType: data.transactionType, recurrence: data.recurrence
            });
        }
    }

    async delete(id) {
        const transaction = await this.Transaction.findByPk(id);
        if (!transaction) return null;
        if (transaction.recurrence === 'FIXED' && transaction.groupId) {
            return this.Transaction.destroy({ where: { groupId: transaction.groupId } });
        }
        return this.Transaction.destroy({ where: { id } });
    }
}

module.exports = new TransactionService();