# Configuração do Tailwind CSS - MonitoraJa

## 📋 Visão Geral

Este projeto está configurado com Tailwind CSS v4 para permitir que cada desenvolvedor trabalhe em suas respectivas pastas de forma independente, mantendo consistência visual em todo o projeto.

## 🗂️ Estrutura do Projeto

```
MonitoraJa/
├── src/
│   └── input.css          # Arquivo CSS principal com diretivas do Tailwind
├── output.css             # CSS compilado (gerado automaticamente)
├── tailwind.config.js     # Configuração do Tailwind
├── package.json           # Scripts de build
└── [pastas de desenvolvimento]/
    ├── cadastroMonitor/   # Pessoa 1
    ├── detalhesMonitor/   # Pessoa 2
    ├── frontend/          # Pessoa 3
    ├── frontend2/         # Pessoa 4
    └── Telas/             # Pessoa 5
```

## 🚀 Como Usar

### 1. Instalação de Dependências
```bash
npm install
```

### 2. Desenvolvimento (Modo Watch)
Para compilar o CSS automaticamente durante o desenvolvimento:
```bash
npm run build-css
```

### 3. Visualização com Live Server
Cada desenvolvedor pode usar a extensão Live Preview (a live server deu problema pro Tony com tailwind, tinha que ficar resetando o server pra ver as alterações) do VS Code:

1. **Instale a extensão Live Preview** no VS Code
2. **Abra sua pasta específica** (ex: `cadastroMonitor/`)
3. **Clique com botão direito** no arquivo HTML
4. **Selecione "Show Preview"**
5. **O navegador abrirá automaticamente** com hot reload
6. **Caso queira ver no seu navegador de escolha, basta copiar a url do navegador e colar no seu**

### 4. Produção
Para gerar o CSS minificado para produção:
```bash
npm run build-css-prod
```

## 📝 Como Usar o Tailwind nas Suas Páginas

### 1. Incluir o CSS Compilado
Em cada arquivo HTML, inclua o CSS compilado:
```html
<link rel="stylesheet" href="../output.css">
```

**Exemplo para cada pasta:**
- `cadastroMonitor/index.html`: `<link rel="stylesheet" href="../output.css">`
- `detalhesMonitor/detalhesMonitor/detalhesMonitor.html`: `<link rel="stylesheet href="../../output.css">`
- `frontend/login/index.html`: `<link rel="stylesheet" href="../../output.css">`

### 2. Usar Classes do Tailwind
```html
<!-- Exemplo de uso -->
<div class="bg-white rounded-lg shadow-md p-6">
  <h1 class="text-2xl font-bold text-gray-800 mb-4">Título</h1>
  <button class="btn-primary">Botão Primário</button>
  <input class="input-field" type="text" placeholder="Digite aqui">
</div>
```

## 🎨 Componentes Customizados

O projeto inclui componentes pré-definidos que você pode usar:

### Botões
```html
<button class="btn-primary">Botão Primário</button>
<button class="btn-secondary">Botão Secundário</button>
```

### Campos de Input
```html
<input class="input-field" type="text" placeholder="Digite aqui">
```

### Cards
```html
<div class="card">
  <!-- Conteúdo do card -->
</div>
```

## 🎯 Cores Personalizadas

O projeto tem um sistema de cores customizado:

### Cores Primárias
- `bg-primary-500` - Azul principal
- `text-primary-600` - Texto azul
- `border-primary-300` - Borda azul clara

### Cores Secundárias
- `bg-secondary-100` - Cinza muito claro
- `text-secondary-800` - Cinza escuro
- `border-secondary-300` - Borda cinza

## 📱 Responsividade

Use as classes responsivas do Tailwind:
```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Conteúdo responsivo -->
</div>
```

## 🔧 Configuração por Pasta

Cada desenvolvedor deve:

1. **Manter o CSS compilado atualizado**: Sempre que fizer mudanças, execute `npm run build-css`
2. **Usar o arquivo correto**: Incluir `output.css` no HTML com o caminho correto
3. **Seguir o padrão**: Usar as classes do Tailwind e componentes customizados
4. **Testar responsividade**: Verificar em diferentes tamanhos de tela

## 🖥️ Fluxo de Trabalho com Live Server

### Para cada desenvolvedor:

1. **Abra o terminal** na raiz do projeto
2. **Execute o build do CSS**: `npm run build-css` (deixe rodando)
3. **Abra sua pasta** no VS Code (ex: `cadastroMonitor/`)
4. **Instale a extensão Live Preview** se ainda não tiver
5. **Clique com botão direito** no arquivo HTML
6. **Selecione "Open preview"**
7. **O navegador abrirá** com hot reload automático

## ⚠️ Importante

- **NÃO edite** o arquivo `output.css` diretamente
- **SEMPRE** execute o build após mudanças no CSS
- **MANTENHA** a consistência visual entre as páginas
- **USE** os componentes customizados quando possível

## 🆘 Problemas Comuns

### CSS não está sendo aplicado
1. Verifique se o caminho para `output.css` está correto
2. Execute `npm run build-css` para recompilar
3. Verifique se as classes estão escritas corretamente

### Classes do Tailwind não funcionam
1. Verifique se a classe está no arquivo `tailwind.config.js`
2. Execute o build novamente
3. Verifique a sintaxe da classe

## 📞 Suporte

Se tiver dúvidas sobre o uso do Tailwind CSS, consulte:
- [Documentação oficial do Tailwind CSS](https://tailwindcss.com/docs)
- [Cheat Sheet do Tailwind](https://tailwindcomponents.com/cheatsheet/)
