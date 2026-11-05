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


🕹️ Como Executar o Projeto
Opção 1: Rodar Online via GitHub Pages (Recomendado)
Vá até a aba Settings (Configurações) do seu repositório no GitHub.

No menu lateral, clique em Pages.

Na seção Build and deployment, selecione a branch main e a pasta / (root). Clique em Save.

Acesse o link gerado pelo GitHub e o livro-jogo estará online para qualquer aluno ou professor acessar pelo celular ou computador.

Opção 2: Rodar Offline na Escola (Direto do Pendrive)
Baixe todos os arquivos deste repositório para uma pasta no seu computador.

Copie a pasta para o seu pendrive.

Na escola, insira o pendrive no computador conectado à TV ou projetor e dê dois cliques no arquivo index.html (ele abrirá instantaneamente no navegador Google Chrome ou Microsoft Edge, mesmo sem internet).

📚 Conteúdo Pedagógico das Aventuras
Aventura 1: O Fogo do Pleistoceno, domínio do fogo, arte rupestre, as rotas de povoamento da América (Beríngia, Serra da Capivara, Lagoa Santa) e a monumentalidade dos sambaquis litorâneos.

Aventura 2: As Águas de Duas Terras, o controle das cheias no Tigre e no Eufrates, a escrita cuneiforme, o Código de Hamurabi, o nilômetro egípcio e as forjas de ferro do Reino de Kush em Meroé.

Aventura 3: Vozes na Ágora e Sombras no Senado, o intercâmbio comercial no Mediterrâneo, os limites da democracia direta em Atenas, a estrutura espartana e as conquistas da plebe em Roma (Lei das Doze Tábuas).

Aventura 4: A Queda das Fronteiras, a crise do escravismo romano, o colonato, a fusão romano-germânica, o Império Bizantino, o legado científico do Mundo Islâmico e a estruturação do senhorio feudal medieval.

👨‍🏫 Autor e Licenciamento
Autor: Professor Luciano Julio da Silva

Função: Professor de História/Geografia e Professor Especialista em Currículo (PEC) em Tecnologia, Inovação e Robótica (SEDUC-SP).

Portal Oficial: NerdWeek (nerdweek@nerdweek.com.br)

Este projeto é disponibilizado sob os princípios de recursos educacionais abertos para uso pedagógico nas redes públicas e privadas de ensino.
