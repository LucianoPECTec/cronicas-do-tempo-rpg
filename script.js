/**
 * CRONICAS DO TEMPO - MOTOR DO LIVRO-JOGO (JAVASCRIPT MODULAR)
 * Autor: Professor Luciano Julio da Silva
 * Descrição: Gerencia o carregamento de JSONs, transição de sessões e ficha de personagem.
 */

// Estado global da ficha de personagem e progresso atual
let gameState = {
    sustento: 3,
    coesao: 3,
    memoria: 3,
    currentId: "s_1" // ID inicial da Aventura 1
};

// Banco de dados local em memória carregado via fetch
let adventureData = {};

/**
 * Inicializa a aplicação buscando o arquivo JSON na pasta /data/
 */
async function initGame() {
    try {
        // Por padrão, carrega a Aventura 1 ao iniciar a página
        const response = await fetch('data/aventura1.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar os dados da aventura: ${response.statusText}`);
        }
        adventureData = await response.json();
        renderSession();
    } catch (error) {
        console.error("Falha crítica ao inicializar o motor de jogo:", error);
        document.getElementById("game-container").innerHTML = `
            <div class="p-4 bg-red-950 border border-red-800 rounded-xl text-red-200">
                <h3 class="font-bold mb-1">Erro de Carregamento</h3>
                <p class="text-sm">Não foi possível carregar o arquivo JSON da aventura. Verifique se a pasta <code>data/</code> e o arquivo <code>aventura1.json</code> estão no diretório correto.</p>
            </div>
        `;
    }
}

/**
 * Renderiza a sessão atual do livro-jogo na tag <article id="game-container">
 */
function renderSession() {
    const container = document.getElementById("game-container");
    const session = adventureData[gameState.currentId];

    // Tratamento caso a chave do nó não seja encontrada
    if (!session) {
        container.innerHTML = `
            <h2 class="font-title text-2xl font-bold text-amber-400 mb-4">Fim da Sessão Atual</h2>
            <p class="text-slate-300 mb-6">Você concluiu este bloco da jornada ou o caminho levou a um desfecho encerravel.</p>
            <button onclick="restartGame()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition duration-200">
                Reiniciar Jornada
            </button>
        `;
        return;
    }

    // Montagem do HTML semântico da sessão
    let htmlOutput = `
        <span class="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2 block">${session.module}</span>
        <h2 class="font-title text-2xl md:text-3xl text-amber-400 mb-4">${session.title}</h2>
        <p class="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">${session.text}</p>
        
        <div class="bg-slate-950 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8 text-sm text-amber-200/90 italic" role="note">
            <strong>Evidência / Fonte Histórica:</strong> ${session.evidence}
        </div>

        <div class="space-y-3">
            <h3 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">O que a sua dupla decide fazer?</h3>
    `;

    // Renderização iterativa dos botões de escolha
    session.choices.forEach((choice) => {
        // Converte o objeto de efeito para string segura escapando as aspas
        const effectString = choice.effect ? JSON.stringify(choice.effect).replace(/"/g, '&quot;') : '{}';
        
        htmlOutput += `
            <button onclick="makeChoice('${choice.target}', ${effectString})" 
                class="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 p-4 rounded-xl transition duration-200 flex items-center justify-between group">
                <span class="text-sm md:text-base text-slate-200 group-hover:text-amber-300">${choice.text}</span>
                <span class="text-amber-500 text-xs font-bold uppercase tracking-wider ml-2 shrink-0">Escolher →</span>
            </button>
        `;
    });

    htmlOutput += `</div>`;
    container.innerHTML = htmlOutput;

    // Atualiza visualmente o placar dos marcadores na Ficha de Personagem
    updateScoreboard();
}

/**
 * Processa a escolha da dupla, atualiza os recursos da Ficha e avança para o próximo ID
 * @param {string} targetId - Identificador do próximo nó no JSON
 * @param {Object} effects - Alterações numéricas em Sustento, Coesão ou Memória
 */
function makeChoice(targetId, effects) {
    if (effects) {
        if (effects.sustento) {
            gameState.sustento = Math.max(0, Math.min(5, gameState.sustento + effects.sustento));
        }
        if (effects.coesao) {
            gameState.coesao = Math.max(0, Math.min(5, gameState.coesao + effects.coesao));
        }
        if (effects.memoria) {
            gameState.memoria = Math.max(0, Math.min(5, gameState.memoria + effects.memoria));
        }
    }

    gameState.currentId = targetId;
    renderSession();

    // Rola a tela suavemente de volta ao topo da caixa de texto
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Atualiza os valores numéricos no cabeçalho do HTML
 */
function updateScoreboard() {
    document.getElementById("stat-sustento").innerText = gameState.sustento;
    document.getElementById("stat-coesao").innerText = gameState.coesao;
    document.getElementById("stat-memoria").innerText = gameState.memoria;
}

/**
 * Reinicia o estado do jogo para a Sessão 1
 */
function restartGame() {
    gameState.sustento = 3;
    gameState.coesao = 3;
    gameState.memoria = 3;
    gameState.currentId = "s_1";
    renderSession();
}

// Executa a inicialização do motor assim que o DOM estiver carregado
document.addEventListener("DOMContentLoaded", initGame);
