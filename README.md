# 💰 Gerenciador de Finanças Pessoais (PWEB)

Um sistema web completo para controle financeiro pessoal, desenvolvido com foco em usabilidade, projeção de gastos futuros e gestão de múltiplas contas.

![Status do Projeto](https://img.shields.io/badge/status-concluído-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📸 Screenshots

*(Adicione prints das telas aqui futuramente: Dashboard, Transações, etc)*

## 🚀 Sobre o Projeto

Este projeto foi desenvolvido como parte da disciplina de Programação Web. O objetivo é oferecer uma visão clara do patrimônio acumulado e do fluxo de caixa mensal, permitindo o lançamento inteligente de despesas parceladas e contas fixas recorrentes.

### Diferenciais
* **Lógica de Parcelamento:** Criação automática de transações futuras para compras parceladas.
* **Contas Fixas Inteligentes:** Projeção automática de contas fixas (ex: Aluguel, Salário) para os próximos 10 anos, permitindo edição em lote.
* **Dashboard Temporal:** Navegação entre meses para visualizar o saldo previsto no futuro.
* **Cálculo de Patrimônio Real:** O saldo total considera o histórico acumulado até o final do mês visualizado.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, Express.js
* **Banco de Dados:** SQLite (via Sequelize ORM)
* **Frontend:** EJS (Embedded JavaScript Templating)
* **Estilização:** Tailwind CSS (via CDN)
* **Ícones:** Lucide Icons
* **Arquitetura:** MVC (Model-View-Controller) + Services Layer

## ✨ Funcionalidades Principais

### 1. Dashboard (Home)
* Visualização do **Patrimônio Total** (Saldo acumulado até o mês selecionado).
* Resumo de **Entradas** e **Saídas** exclusivas do mês atual.
* Navegação rápida entre meses (passado e futuro).
* Extrato das últimas movimentações.

### 2. Gestão de Contas
* Cadastro de entidades financeiras.
* Definição de saldo inicial.

### 3. Transações
* **Tipos:** Receita (Entrada) ou Despesa (Saída).
* **Recorrência:**
    * **Variável:** Permite definir número de parcelas (ex: 10x). O sistema gera registros individuais para cada mês.
    * **Fixa:** O sistema gera automaticamente lançamentos para os próximos 120 meses (10 anos) e os agrupa por um `groupId`.
* **Edição/Exclusão Inteligente:**
    * Ao editar/excluir uma conta fixa, o sistema pergunta se deseja aplicar a alteração a todas as recorrências futuras.
* **Filtros:** Tabela ordenável por data, valor e detalhes.

### 4. Categorias
* Classificação por tipo (Entrada ou Saída) para facilitar o lançamento.
* Exclusão em cascata (avisa e remove transações associadas para manter a integridade).

## 👤 Team
-   Wylker Esperidião
-   Roberto Matheus

## 📂 Estrutura do Projeto

```bash
Personal-Expense-PWEB/
├── controllers/      # Lógica de controle das requisições
├── infra/            # Configuração do Banco de Dados (SQLite)
├── models/           # Modelos do Sequelize (Account, Category, Transaction)
├── public/           # Arquivos estáticos (CSS, JS, Images)
├── routes/           # Rotas da API e Views
├── services/         # Regras de negócio (Cálculos, Validações, Queries)
├── views/            # Templates EJS
│   ├── accounts/     # Telas de Contas
│   ├── categories/   # Telas de Categorias
│   ├── layout/       # Layout base (Navbar/Sidebar)
│   ├── transactions/ # Telas de Transações
│   └── index.ejs     # Dashboard
├── seed.js           # Dados iniciais para teste
├── server.js         # Ponto de entrada da aplicação
└── package.json

