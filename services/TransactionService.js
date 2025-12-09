const db = require('../infra/database');
const { Op } = require('sequelize');

class TransactionService {
    constructor() {
        this.Transaction = db.models.Transaction;
        this.Account = db.models.Account;
        this.Category = db.models.Category;
    }

    async findAll(filters = {}) {
        const whereClause = {};
        if (filters.startDate && filters.endDate) {
            whereClause.date = { [Op.between]: [filters.startDate, filters.endDate] };
        }
       return this.Transaction.findAll({
            where: whereClause,
            include: [
                { model: this.Account, as: 'account', attributes: ['id', 'name'] },
                { model: this.Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }

    async findAllRaw(cutoffDate = null) {
        const whereClause = {};
        if (cutoffDate) {
            whereClause.date = { [Op.lte]: cutoffDate };
        }
        return this.Transaction.findAll({ where: whereClause });
    }

    async create(data) {
        if (!data.accountId || !data.categoryId || !data.value || !data.date) {
            throw new Error("Dados obrigatórios faltando.");
        }
        
        let loops = 1;
        if (data.recurrence === 'FIXED') loops = 120; 
        else loops = parseInt(data.installments) || 1;

        const baseDate = new Date(data.date + 'T12:00:00');
        
        const createdTransactions = [];
        const groupId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        for (let i = 0; i < loops; i++) {
            const installmentDate = new Date(baseDate);
            
            installmentDate.setMonth(baseDate.getMonth() + i); 
            
            let description = data.description;
            if (data.recurrence === 'VARIABLE' && loops > 1) {
                description = `${data.description} (${i+1}/${loops})`;
            }

            const transactionData = {
                accountId: data.accountId,
                categoryId: data.categoryId,
                value: data.value, 
                date: installmentDate, 
                description: description,
                transactionType: data.transactionType,
                recurrence: data.recurrence,
                currentInstallment: i + 1,
                totalInstallments: data.recurrence === 'FIXED' ? 1 : loops,
                groupId: groupId 
            };

            const t = await this.Transaction.create(transactionData);
            createdTransactions.push(t);
        }

        return createdTransactions;
    }

    async update(id, data) {
        const transaction = await this.Transaction.findByPk(id);
        if (!transaction) throw new Error("Transação não encontrada.");

        let newDate = data.date;
        if (newDate && !newDate.includes('T')) {
        }

        if (transaction.recurrence === 'FIXED' && transaction.groupId) {
            return this.Transaction.update({
                value: data.value,
                description: data.description,
                accountId: data.accountId,
                categoryId: data.categoryId,
                transactionType: data.transactionType,
                recurrence: data.recurrence
            }, {
                where: { groupId: transaction.groupId }
            });
        } else {
            return transaction.update({
                value: data.value,
                description: data.description,
                date: data.date, 
                accountId: data.accountId,
                categoryId: data.categoryId,
                transactionType: data.transactionType,
                recurrence: data.recurrence
            });
        }
    }

    async delete(id) {
        const transaction = await this.Transaction.findByPk(id);
        if (!transaction) return null;

        if (transaction.recurrence === 'FIXED' && transaction.groupId) {
            return this.Transaction.destroy({
                where: { groupId: transaction.groupId }
            });
        }

        return this.Transaction.destroy({ where: { id } });
    }
}

module.exports = new TransactionService();