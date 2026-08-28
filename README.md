\# Multi-Model AI Assistant

Assistente de IA preparado para trabalhar com múltiplos modelos em uma única aplicação. O projeto centraliza o envio de prompts, facilita a comparação de respostas e permite escolher o modelo mais adequado para cada tarefa.

## Principais recursos

- Seleção entre diferentes provedores e modelos de IA.
- Interface para envio de prompts e visualização das respostas.
- Configuração por variáveis de ambiente, mantendo chaves de API fora do código.
- Arquitetura extensível para adicionar novos modelos sem alterar o fluxo principal.
- Comparação de respostas para apoiar a escolha do melhor resultado.

## Requisitos

- Git
- Runtime e gerenciador de pacotes definidos pelo projeto (por exemplo, Node.js/npm ou Python/pip).
- Chaves de API dos provedores de IA que serão utilizados.

## Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd multi-model-ai-assistant
```

Instale as dependências usando o gerenciador correspondente ao projeto:

```bash
# Node.js
npm install

# Python
pip install -r requirements.txt
```

## Configuração

Crie um arquivo `.env` na raiz do projeto e informe as credenciais e opções exigidas pelos modelos configurados. Use os nomes das variáveis presentes nos arquivos de configuração do projeto. Nunca versione esse arquivo nem exponha chaves de API.

Exemplo:

```env
PROVIDER_API_KEY=sua_chave_aqui
MODEL_NAME=nome_do_modelo
```

## Execução

Inicie a aplicação com o comando definido no projeto, por exemplo:

```bash
npm run dev
# ou
python <arquivo_de_entrada>.py
```

Abra no navegador o endereço exibido no terminal, caso a aplicação disponibilize uma interface web.

## Como usar

1. Configure as credenciais dos provedores desejados.
2. Inicie a aplicação.
3. Selecione o modelo ou os modelos que participarão da consulta.
4. Escreva o prompt e envie a solicitação.
5. Analise as respostas e escolha o resultado mais adequado.

Use prompts objetivos e evite enviar informações sensíveis. A qualidade, o custo e o tempo de resposta dependem do modelo selecionado.

## Desenvolvimento

Antes de abrir uma alteração, valide o projeto com os scripts disponíveis no `package.json`, `pyproject.toml` ou configuração equivalente:

```bash
npm test
npm run lint
```

Para adicionar um novo provedor, siga a abstração existente de integração, mantenha as credenciais em variáveis de ambiente e inclua tratamento de erros, limites de requisição e testes.

## Segurança

- Não faça commit de `.env`, tokens ou chaves privadas.
- Valide entradas antes de encaminhá-las aos provedores.
- Restrinja logs para que prompts e respostas sensíveis não sejam persistidos.
- Configure limites de uso para evitar custos inesperados.

## Licença

Projeto desenvolvido para fins educacionais.

