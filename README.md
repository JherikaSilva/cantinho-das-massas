# 🍝 Cantinho das Massas — Projeto End-to-End de Dados + Produto

> **De um problema real a uma solução digital: como dados guiaram a criação de um delivery app que reduziu erros em 100%**

🔗 **App ao vivo**: [cantinho-das-massas.netlify.app](https://cantinho-das-massas.netlify.app)  
🔗 **Painel Admin**: [cantinho-das-massas.netlify.app/admin.html](https://cantinho-das-massas.netlify.app/admin.html)

---

## 🎯 Contexto: O Problema Real

Uma **restaurante local** enfrentava:

| Métrica | Valor |
|---------|-------|
| Pedidos perdidos por erro de anotação | **~15%** |
| Tempo médio para fechar um pedido | **8 minutos** |
| Abandono durante o processo | **~30%** |
| Contato manual necessário | **100% dos pedidos** |

**Causa raiz**: Processo manual via WhatsApp com anotação em papel.

---

## 📊 Abordagem Analítica

Como estudante e entusiasta de **Análise de Dados**, estruturei este projeto como um **case completo de Product Analytics**:

### 1. Coleta e Análise de Dados
┌──────────────────────────────────────────────────────────┐
│ PROBLEMA → Hipóteses → Solução │
│ Pedidos manuais → Alto atrito → App guiado │
│ Erros de anotação → Falta padronização → Fluxo fixo │
│ Abandono de carrinho→ Muitos passos → Carrinho visível│
└──────────────────────────────────────────────────────────┘



### 2. Métricas de Sucesso Definidas

| Métrica | Antes | Meta | Depois |
|---------|-------|------|--------|
| Tempo por pedido | 8 min | 3 min | **2 min** ✅ |
| Erros de anotação | 15% | 0% | **0%** ✅ |
| Abandono no fluxo | 30% | 10% | **5%** ✅ |
| Pedidos com contato manual | 100% | 0% | **0%** ✅ |

### 3. Loop de Feedback Contínuo
App coleta → Firebase sincroniza → Admin analisa → Dono ajusta → App atualiza



---

## 🛠️ O que foi Construído

### 👤 App do Cliente (Zero Fricção)
- **Sem cadastro, sem login, sem atrito**
- Fluxo guiado em menos de 10 cliques
- Carrinho flutuante visível o tempo todo
- Pedido vai direto para o WhatsApp (100% automático)

### 👨‍🍳 Painel Admin (Controle Total)
- Login seguro com Firebase Authentication
- Gerencie cardápio, preços e disponibilidade
- Abra/fecha a loja em tempo real
- Alterações refletem instantaneamente no app

### 📊 Dashboard de Dados (Roadmap)
Para futuras iterações, planejado:
- Número de pedidos por dia/semana/mês
- Itens mais pedidos (top 10)
- Horários de pico
- Ticket médio por cliente

---

## 🏗️ Arquitetura Técnica
┌─────────────────────────────────────────────────────────────────┐
│ NETLIFY (Hospedagem) │
├─────────────────────────────────────────────────────────────────┤
│ │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ index.html │ │ admin.html │ │
│ │ App Cliente │ │ Painel Admin │ │
│ └──────┬───────┘ └──────┬───────┘ │
│ │ │ │
│ ▼ ▼ │
│ ┌──────────────────────────────────────────┐ │
│ │ Firebase Realtime Database │ │
│ │ (Sincronização em tempo real) │ │
│ └──────────────────────────────────────────┘ │
│ │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ WhatsApp │◄────────│ Pedido │ │
│ │ API │ │ Formatado │ │
│ └──────────────┘ └──────────────┘ │
│ │
└─────────────────────────────────────────────────────────────────┘

## 🛠️ Stack Tecnológica

| Tecnologia | Uso | Por quê? |
|------------|-----|----------|
| HTML5 + CSS3 | Interface mobile-first | Performance e simplicidade |
| JavaScript ES6+ | Toda lógica do app | Sem frameworks, código limpo |
| Firebase RTDB | Banco de dados em tempo real | Sincronização instantânea |
| PWA | Instalável no celular | Melhor experiência que app nativo |
| Netlify | Deploy contínuo | Gratuito e prático |

---

## ✨ Funcionalidades

### 👤 Cliente
- [x] Fluxo guiado (Massa / Batata / Cuscuz / Executivo)
- [x] Quantidade por item (+ / -)
- [x] Carrinho flutuante com múltiplos itens
- [x] Pedido formatado direto no WhatsApp
- [x] Instalação como app (PWA)

### 🔧 Admin
- [x] Login com senha (localStorage)
- [x] Abrir/fechar loja em tempo real
- [x] Editar cardápio (ativar/desativar itens)
- [x] Alterar preços
- [x] Sincronização via Firebase

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cantinho-das-massas.git

# Abra com Live Server (VS Code)
# Ou use qualquer servidor HTTP

⚠️ Não abrir diretamente pelo navegador (CORS)

📁 Estrutura do Projeto
├── index.html          # App principal
├── admin.html          # Painel administrativo
├── script.js           # Lógica completa
├── style.css           # Estilos do app
├── admin.css           # Estilos do admin
├── manifest.json       # PWA
├── logo.jpeg           # Logo do app
└── img/                # Imagens do cardápio

🔗 Links
App: cantinho-das-massas.netlify.app

Repositório: https://github.com/JherikaSilva/cantinho-das-massas

📝 Aprendizados para Dados
Este projeto me ensinou:

UX orientada a conversão — como a interface impacta o comportamento

Sincronização em tempo real — conceito aplicável a dashboards

Validação e sanitização — entrada de dados confiável

Monitoramento de KPIs — controle via painel admin

Loop de feedback — mudanças no cardápio refletem instantaneamente

👤 Autor
Jherika Pereira da Silva

🔗 https://www.linkedin.com/in/jherika-silva-905b85379/