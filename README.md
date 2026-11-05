# ⏳ Crônicas do Tempo — O RPG e a Narrativa Interativa no Ensino de História (6º Ano)

> *"Uma história ganha força quando quem escuta é colocado dentro de um conflito real e precisa decidir o próximo passo."*

Bem-vindo ao repositório oficial do projeto **Crônicas do Tempo**, uma ferramenta pedagógica e digital desenvolvida para transformar o ensino de História no 6º Ano do Ensino Fundamental através da metodologia ativa de **Livro-Jogo (RPG baseada em escolhas e árvores de decisão)**.

---

## 🚀 Sobre o Projeto

Este repositório armazena o motor web interativo e a base de dados modularizada das quatro aventuras anuais do livro. O projeto foi desenhado para ser executado diretamente pelo **GitHub Pages** (na nuvem) ou rodado de forma **100% offline via pendrive** nas escolas da rede pública, sem depender de conexão com a internet na sala de aula.

O sistema conta com:
* **Ficha de Personagem Dinâmica:** Gerenciamento em tempo real dos recursos de **Sustento**, **Coesão** e **Memória** da turma.
* **Feedback de Consequências Históricas:** Cada escolha exibe o impacto imediato e o desdobramento historiográfico da decisão tomada pelos estudantes.
* **Identidade Visual Imersiva:** Uso de marcadores gráficos e emojis temáticos baseados no *Teatro da Mente*.

---

## 📁 Estrutura de Pastas do Repositório

O projeto segue um padrão profissional de separação de responsabilidades (HTML, CSS, JavaScript e Dados Modulares):

```text
cronicas-do-tempo-rpg/
├── index.html         # Esqueleto semântico principal da aplicação
├── style.css          # Folha de estilos dedicada e tipografia editorial
├── script.js          # Motor assíncrono de jogo e gestão da ficha
└── data/              # Pasta com os arquivos JSON das 4 aventuras
    ├── aventura1.json # 1º Bimestre: Pleistoceno, Povoamento da América e Sambaquis
    ├── aventura2.json # 2º Bimestre: Mesopotâmia, Egito e Reino de Kush
    ├── aventura3.json # 3º Bimestre: Grécia Antiga e República Romana
    └── aventura4.json # 4º Bimestre: Antiguidade Tardia e Feudalismo
