# GabySummer E-commerce

Sistema de e-commerce completo para moda praia, fitness e acessórios, desenvolvido com Next.js e Supabase.

## 🏖️ Características

- **Tema Praia**: Design elegante com paleta laranja e branco
- **Fundos Dinâmicos**: Backgrounds que mudam por categoria
- **Carrinho e Favoritos**: Sistema completo de compras
- **Checkout WhatsApp**: Finalização via WhatsApp
- **Painel Admin**: Gerenciamento completo de produtos
- **Autenticação**: Sistema seguro com Supabase Auth

## 🚀 Como Usar

### 1. Configurar o Banco de Dados
Execute os scripts SQL na ordem:
1. `scripts/001_initial_schema.sql`
2. `scripts/002_seed_data.sql`
3. `scripts/003_profile_trigger.sql`
4. `scripts/004_admin_policies.sql`
5. `scripts/005_create_admin_user.sql`
6. `scripts/006_create_storage_bucket.sql`

### 2. Criar Conta de Administrador

**Opção 1: Via Interface Web**
1. Acesse `/admin/acesso`
2. Digite o email de um usuário já cadastrado
3. Clique em "Criar Administrador"

**Opção 2: Via SQL**
\`\`\`sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
\`\`\`

### 3. Acessar o Admin
1. Faça login normalmente no site
2. Acesse `/admin` ou use o menu do usuário
3. Gerencie produtos, pedidos e categorias

## 📱 Funcionalidades

### Para Clientes
- Catálogo de produtos por categoria
- Carrinho de compras persistente
- Lista de favoritos
- Checkout via WhatsApp
- Sistema de cupons
- Perfil do usuário

### Para Administradores
- Dashboard com métricas
- Gerenciamento de produtos (CRUD)
- Upload de múltiplas imagens
- Gerenciamento de pedidos
- Controle de estoque
- Sistema de cupons

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Estilização**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Estado**: Zustand
- **Notificações**: Sonner

## 🎨 Design System

- **Cores Primárias**: Laranja (#ff8c00) e Branco
- **Tipografia**: Geist Sans e Geist Mono
- **Tema**: Praia chique e elegante
- **Responsivo**: Mobile-first design

## 📞 Suporte

Para dúvidas ou problemas, acesse a documentação ou entre em contato através do WhatsApp integrado no sistema.
