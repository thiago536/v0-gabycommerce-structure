-- Criar um usuário administrador
-- Substitua 'admin@gabysummer.com' e 'senha123' pelos dados desejados

-- Primeiro, insira o usuário na tabela auth.users (isso normalmente é feito via signup)
-- Como não podemos inserir diretamente em auth.users via SQL, 
-- você deve se cadastrar normalmente no site com o email desejado

-- Depois de se cadastrar, execute este script para tornar o usuário admin:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@gabysummer.com';

-- Ou se você souber o user_id:
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE user_id = 'seu-user-id-aqui';
