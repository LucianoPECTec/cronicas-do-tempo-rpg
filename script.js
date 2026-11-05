/**
 * CRONICAS DO TEMPO - MOTOR DO LIVRO-JOGO (JAVASCRIPT MODULAR)
 * Autor: Professor Luciano Julio da Silva
 * Descrição: Gerencia o carregamento de JSONs modulares, transição de sessões e ficha de personagem.
 */

let gameState = {
    sustento: 3,
    coesao: 3,
    memoria: 3,
    currentId: "s_1"
};

let adventureData = {};
let currentAventuraFile = "aventura1.json";

/**
 * Carrega o arquivo JSON da aventura selecionada na pasta /data/
 */
async function loadAdventure(filename) {
    currentAventuraFile = filename;
    try {
        const response = await fetch(`data/${filename}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar data/${filename}: ${response.statusText}`);
        }
        adventureData = await response.json();
        
        // Define o ponto de partida dependendo do arquivo carregado
        if (filename === "aventura1.json") gameState.currentId = "s_1";
        if (filename === "aventura2.json") gameState.currentId = "s_12";
        if (filename === "aventura3.json") gameState.currentId = "s_24";
        if (filename === "aventura4.json") gameState.currentId = "s_29";

        renderSession();
    } catch (error) {
        console.error("Falha ao carregar o módulo:", error);
        document.getElementById("game-container").innerHTML = `
            <div class="p-4 bg-red-950 border border-red-800 rounded-xl text-red-200">
                <h3 class="font-bold mb-1">Arquivo JSON não encontrado</h3>
                <p class="text-sm">Certifique-se de que o arquivo <code>${filename}</code> foi criado dentro da pasta <code>data/</code> no GitHub.</p>
            </div>
        `;
    }
}

/**
 * Renderiza a sessão atual do livro-jogo na tela
 */
function renderSession() {
    const container = document.getElementById("game-container");
    const session = adventureData[gameState.currentId];

    if (!session) {
        container.innerHTML = `
            <h2 class="font-title text-2xl font-bold text-amber-400 mb-4">Fim do Ciclo Atual</h2>
            <p class="text-slate-300 mb-6">Você concluiu este módulo das Crônicas do Tempo.</p>
            <div class="flex flex-wrap gap-3">
                <button onclick="loadAdventure('aventura1.json')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Aventura 1</button>
                <button onclick="loadAdventure('aventura2.json')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Aventura 2</button>
                <button onclick="loadAdventure('aventura3.json')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Aventura 3</button>
                <button onclick="loadAdventure('aventura4.json')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Aventura 4</button>
            </div>
        `;
        return;
    }

    let htmlOutput = `
        <div class="flex justify-between items-center mb-3">
            <span class="text-xs uppercase tracking-widest text-amber-500 font-semibold">${session.module}</span>
            <div class="flex gap-2 text-xs">
                <button onclick="loadAdventure('aventura1.json')" class="text-slate-400 hover:text-amber-400 underline">Av.1</button>
                <button onclick="loadAdventure('aventura2.json')" class="text-slate-400 hover:text-amber-400 underline">Av.2</button>
                <button onclick="loadAdventure('aventura3.json')" class="text-slate-400 hover:text-amber-400 underline">Av.3</button>
                <button onclick="loadAdventure('aventura4.json')" class="text-slate-400 hover:text-amber-400 underline">Av.4</button>
            </div>
        </div>
        <h2 class="font-title text-2xl md:text-3xl text-amber-400 mb-4">${session.title}</h2>
        <p class="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">${session.text}</p>
        
        <div class="bg-slate-950 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8 text-sm text-amber-200/90 italic" role="note">
            <strong>Evidência / Fonte Histórica:</strong> ${session.evidence}
        </div>

        <div class="space-y-3">
            <h3 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">O que a sua dupla decide fazer?</h3>
    `;

    session.choices.forEach((choice) => {
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
    updateScoreboard();
}

function makeChoice(targetId, effects) {
    if (effects) {
        if (effects.sustento) gameState.sustento = Math.max(0, Math.min(5, gameState.sustento + effects.sustento));
        if (effects.coesao) gameState.coesao = Math.max(0, Math.min(5, gameState.coesao + effects.coesao));
        if (effects.memoria) gameState.memoria = Math.max(0, Math.min(5, gameState.memoria + effects.memoria));
    }

    gameState.currentId = targetId;
    renderSession();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateScoreboard() {
    document.getElementById("stat-sustento").innerText = gameState.sustento;
    document.getElementById("stat-coesao").innerText = gameState.coesao;
    document.getElementById("stat-memoria").innerText = gameState.memoria;
}

// Inicializa carregando a Aventura 1 ao abrir a página
document.addEventListener("DOMContentLoaded", () => loadAdventure('aventura1.json'));
