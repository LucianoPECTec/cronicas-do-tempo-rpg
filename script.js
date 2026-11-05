/**
 * ============================================================================
 * CRÔNICAS DO TEMPO — MOTOR INTERATIVO (HUB + FICHA DO LIVRO + D6 + DIÁRIO)
 * Autor: Prof. Luciano Julio da Silva — URE de São José do Rio Preto (SEDUC-SP)
 * ============================================================================
 */

// 1. LISTA OFICIAL DE CHAVES VÁLIDAS
const VALID_KEYS = {
    "ED1-MESTRE-2026-SP": "Chave Mestra do Autor (Prof. Luciano Julio)",
    "PROF-REVISAO-URE": "Credencial Docente — Revisão URE São José do Rio Preto",
    "TESTE-PEDAGOGICO": "Credencial de Avaliação Pedagógica",
    "ED1-LOTE1-7A9X": "1ª Edição • Exemplar Lote 01",
    "ED1-LOTE2-4B2M": "1ª Edição • Exemplar Lote 02",
    "ED1-LOTE3-9C5K": "1ª Edição • Exemplar Lote 03",
    "ED1-LOTE4-2F8H": "1ª Edição • Exemplar Lote 04",
    "ED1-LOTE5-6W3P": "1ª Edição • Exemplar Lote 05",
    "ED2-LOTE1-8K4R": "2ª Edição • Exemplar Lote 01",
    "ED2-LOTE2-5M9T": "2ª Edição • Exemplar Lote 02"
};

const START_NODES = {
    "aventura1.json": "s_1",
    "aventura2.json": "s_12",
    "aventura3.json": "s_24",
    "aventura4.json": "s_29"
};

let gameState = {
    file: "aventura1.json",
    currentId: "s_1",
    sustento: 3,
    coesao: 3,
    memoria: 3,
    stepCount: 1,
    historyStack: [],
    diaryEntries: []
};

let adventureData = {};

// ============================================================================
// 2. CAMADA DE SEGURANÇA E MARCA D'ÁGUA
// ============================================================================
function initSecurityLayer() {
    document.addEventListener("contextmenu", e => e.preventDefault());

    document.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
            (e.ctrlKey && (key === "u" || key === "s"))
        ) {
            e.preventDefault();
            alert("🔒 Obra Didática Protegida — Crônicas do Tempo (Prof. Luciano Julio da Silva • URE São José do Rio Preto).");
        }
    });

    const inputEl = document.getElementById("access-code");
    if (inputEl) {
        inputEl.addEventListener("keydown", e => {
            if (e.key === "Enter") validateCode();
        });
    }
}

function renderWatermark(keyCode) {
    const wm = document.getElementById("watermark-overlay");
    if (!wm) return;
    const label = `CRÔNICAS DO TEMPO • ${keyCode} • PROF. LUCIANO JULIO • URE S. J. RIO PRETO`;
    let html = "";
    for (let i = 0; i < 24; i++) {
        html += `<span>${label}</span>`;
    }
    wm.innerHTML = html;
}

// ============================================================================
// 3. AUTENTICAÇÃO E NAVEGAÇÃO ENTRE HUB INICIAL E JOGO
// ============================================================================
function validateCode() {
    const inputEl = document.getElementById("access-code");
    const errorEl = document.getElementById("error-msg");
    const code = inputEl.value.trim().toUpperCase();

    if (VALID_KEYS[code]) {
        localStorage.setItem("cronicas_auth_key", code);
        unlockPortal(code);
    } else {
        errorEl.textContent = "❌ Chave inválida. Verifique o código exato impresso no seu exemplar.";
        errorEl.classList.remove("hidden");
    }
}

function unlockPortal(code) {
    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("game-app").classList.remove("hidden");
    document.getElementById("active-key-badge").textContent = `${VALID_KEYS[code]} (${code})`;
    renderWatermark(code);
    showHomeScreen(); // Abre sempre na Página Inicial de Apresentação e Escolha!
}

function showHomeScreen() {
    document.getElementById("home-screen").classList.remove("hidden");
    document.getElementById("gameplay-screen").classList.add("hidden");
    document.getElementById("btn-back-hub").classList.add("hidden");
    document.getElementById("btn-reset-adv").classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function startAdventureFromHub(filename) {
    syncPlayerIdentification();
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("gameplay-screen").classList.remove("hidden");
    document.getElementById("btn-back-hub").classList.remove("hidden");
    document.getElementById("btn-reset-adv").classList.remove("hidden");
    switchAdventure(filename, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function syncPlayerIdentification() {
    const duplaVal = document.getElementById("input-dupla")?.value.trim();
    const turmaVal = document.getElementById("input-turma")?.value.trim();

    document.getElementById("sheet-dupla-name").textContent = duplaVal || "Investigadores do Tempo";
    document.getElementById("sheet-turma-name").textContent = turmaVal || "6º Ano";
}

function logoutSession() {
    localStorage.removeItem("cronicas_auth_key");
    document.getElementById("game-app").classList.add("hidden");
    document.getElementById("auth-screen").classList.remove("hidden");
    document.getElementById("access-code").value = "";
    document.getElementById("error-msg").classList.add("hidden");
}

// ============================================================================
// 4. FICHA DO JOGADOR (MARCADORES DE 5 BOLINHAS + DADO D6 + DIÁRIO)
// ============================================================================
function updateCharacterSheet() {
    const renderMarker = (statName, value) => {
        const valEl = document.getElementById(`val-${statName}`);
        const pipsContainer = document.getElementById(`pips-${statName}`);
        const statusEl = document.getElementById(`status-${statName}`);
        const boxEl = document.getElementById(`box-${statName}`);

        if (valEl) valEl.textContent = value;

        // Gera as 5 casas/bolinhas idênticas à ficha impressa do livro
        if (pipsContainer) {
            let pipsHtml = "";
            for (let i = 1; i <= 5; i++) {
                const isFilled = i <= value;
                const isCritical = value <= 1 && isFilled;
                pipsHtml += `<span class="pip-circle ${isFilled ? 'filled' : ''} ${isCritical ? 'critical' : ''}"></span>`;
            }
            pipsContainer.innerHTML = pipsHtml;
        }

        // Rótulo qualitativo do marcador
        if (statusEl) {
            if (value === 0) {
                statusEl.textContent = "💀 EM COLAPSO (0/5)";
                statusEl.style.color = "#f87171";
            } else if (value === 1) {
                statusEl.textContent = "⚠️ Estado Crítico";
                statusEl.style.color = "#fca5a5";
            } else if (value === 2) {
                statusEl.textContent = "⚡ Em Alerta";
                statusEl.style.color = "#fde68a";
            } else if (value === 3) {
                statusEl.textContent = "⚖️ Estável (Base)";
                statusEl.style.color = "#a7f3d0";
            } else if (value === 4) {
                statusEl.textContent = "✨ Fortalecido";
                statusEl.style.color = "#6ee7b7";
            } else {
                statusEl.textContent = "🏆 Ápice Histórico (5/5)";
                statusEl.style.color = "#fbbf24";
            }
        }

        if (boxEl) {
            if (value <= 1) boxEl.classList.add("danger");
            else boxEl.classList.remove("danger");
        }
    };

    renderMarker("sustento", gameState.sustento);
    renderMarker("coesao", gameState.coesao);
    renderMarker("memoria", gameState.memoria);

    // Atualiza contador do Diário de Bordo
    const countEl = document.getElementById("diary-count");
    if (countEl) countEl.textContent = gameState.diaryEntries.length;
    renderDiaryEntries();
}

function manualStatChange(statName, delta) {
    gameState[statName] = Math.max(0, Math.min(5, gameState[statName] + delta));
    updateCharacterSheet();
}

function toggleDiceModal() {
    document.getElementById("dice-drawer")?.classList.toggle("hidden");
}

function rollD6() {
    const rawRoll = Math.floor(Math.random() * 6) + 1;
    const bonus = parseInt(document.getElementById("dice-bonus")?.value || "0", 10);
    const total = rawRoll + bonus;

    let outcome = "";
    if (total >= 5) outcome = "🌟 Sucesso Crítico!";
    else if (total >= 3) outcome = "✅ Sucesso Parcial";
    else outcome = "⚠️ Dificuldade no Teste";

    const display = document.getElementById("dice-result-display");
    if (display) {
        display.innerHTML = `🎲 Dado: <strong>${rawRoll}</strong> + Bônus: <strong>${bonus}</strong> = <strong>${total}</strong> (${outcome})`;
    }
}

function toggleDiaryPanel() {
    document.getElementById("diary-drawer")?.classList.toggle("hidden");
}

function renderDiaryEntries() {
    const listEl = document.getElementById("diary-log-list");
    if (!listEl) return;

    if (gameState.diaryEntries.length === 0) {
        listEl.innerHTML = `<p class="empty-diary">Nenhuma decisão registrada ainda nesta aventura.</p>`;
        return;
    }

    listEl.innerHTML = gameState.diaryEntries.map((item, i) => `
        <div class="diary-entry">
            <strong>${i + 1}. ${item.title}:</strong> ${item.choice}<br>
            <small style="color: #fbbf24;">🔍 Fonte: ${item.evidence}</small>
        </div>
    `).join("");
}

// ============================================================================
// 5. CARREGAMENTO E RENDERIZAÇÃO DAS AVENTURAS
// ============================================================================
async function switchAdventure(filename, resetResources = true) {
    gameState.file = filename;
    gameState.currentId = START_NODES[filename] || "s_1";

    if (resetResources) {
        gameState.sustento = 3;
        gameState.coesao = 3;
        gameState.memoria = 3;
        gameState.stepCount = 1;
        gameState.historyStack = [];
        gameState.diaryEntries = [];
    }

    try {
        const response = await fetch(`data/${filename}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        adventureData = await response.json();
        renderSession();
    } catch (err) {
        if (window.OFFLINE_ADVENTURES && window.OFFLINE_ADVENTURES[filename]) {
            adventureData = window.OFFLINE_ADVENTURES[filename];
            renderSession();
            return;
        }
        document.getElementById("game-container").innerHTML = `
            <div class="feedback-box crisis">
                <h2 class="scene-title">⚠️ Arquivo <code>data/${filename}</code> não encontrado</h2>
                <p class="scene-narrative">
                    Verifique se os 4 arquivos JSON estão salvos dentro da pasta <code>data/</code> no seu repositório.
                </p>
            </div>
        `;
    }
}

function resetCurrentAdventure() {
    switchAdventure(gameState.file, true);
}

function renderSession() {
    updateCharacterSheet();
    const container = document.getElementById("game-container");
    const session = adventureData[gameState.currentId];

    const undoBtn = document.getElementById("btn-undo");
    if (undoBtn) {
        if (gameState.historyStack.length > 0) undoBtn.classList.remove("hidden");
        else undoBtn.classList.add("hidden");
    }

    if (!session) {
        container.innerHTML = `
            <h2 class="scene-title">Fim deste Caminho (${gameState.currentId})</h2>
            <div class="choices-list">
                <button onclick="resetCurrentAdventure()" class="btn-gold-large">🔄 Reiniciar Aventura</button>
                <button onclick="showHomeScreen()" class="btn-header-action">🏠 Voltar ao Menu Principal</button>
            </div>
        `;
        return;
    }

    document.getElementById("step-counter").textContent = session.stepLabel || `Etapa ${gameState.stepCount}`;
    document.getElementById("bncc-badge").textContent = session.bncc || "Currículo Paulista • 6º Ano";

    const sceneBanner = `
        <div class="scene-visual-banner">
            <div class="visual-art-icons">${session.sceneArt || "⏳ 🗺️ 🏺 🔦"}</div>
            <div class="visual-location-meta">
                <span class="visual-era">${session.era || "Investigação Histórica"}</span>
                <span class="visual-place">📍 ${session.location || "Cenário em Estudo"}</span>
            </div>
        </div>
    `;

    const questionHtml = session.question ? `
        <div class="question-prompt">
            <strong>💬 Questão Norteadora para a Dupla:</strong> ${session.question}
        </div>
    ` : "";

    let choicesHtml = "";
    session.choices.forEach((choice, idx) => {
        let impactTags = [];
        if (choice.effect) {
            if (choice.effect.sustento) impactTags.push(`🍖 Sustento ${choice.effect.sustento > 0 ? "+" + choice.effect.sustento : choice.effect.sustento}`);
            if (choice.effect.coesao) impactTags.push(`🤝 Coesão ${choice.effect.coesao > 0 ? "+" + choice.effect.coesao : choice.effect.coesao}`);
            if (choice.effect.memoria) impactTags.push(`📜 Memória ${choice.effect.memoria > 0 ? "+" + choice.effect.memoria : choice.effect.memoria}`);
        }

        const impactHtml = impactTags.length > 0
            ? `<span class="choice-impact">${impactTags.join("  |  ")}</span>`
            : `<span class="choice-impact">Transição de Jornada</span>`;

        choicesHtml += `
            <button onclick="selectChoice(${idx})" class="choice-btn">
                <div>
                    <span class="choice-text">${choice.text}</span>
                    ${impactHtml}
                </div>
                <span class="choice-arrow">Decidir →</span>
            </button>
        `;
    });

    container.innerHTML = `
        ${sceneBanner}
        <span class="scene-module-tag">${session.module}</span>
        <h2 class="scene-title">${session.title}</h2>
        <div class="scene-narrative">${session.text}</div>
        <div class="evidence-box">
            <strong>🔍 Fonte & Evidência Histórica:</strong> ${session.evidence}
        </div>
        ${questionHtml}
        <div class="choices-heading">🤔 Qual caminho a dupla escolhe seguir? (${session.choices.length} opções)</div>
        <div class="choices-list">
            ${choicesHtml}
        </div>
    `;
}

// ============================================================================
// 6. PROCESSAMENTO DE DECISÃO, FEEDBACK E CRISE HISTÓRICA
// ============================================================================
function selectChoice(choiceIndex) {
    const session = adventureData[gameState.currentId];
    if (!session || !session.choices[choiceIndex]) return;

    const choice = session.choices[choiceIndex];

    if (choice.reset) {
        resetCurrentAdventure();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    if (choice.goHome) {
        showHomeScreen();
        return;
    }

    if (choice.nextAdventure) {
        startAdventureFromHub(choice.nextAdventure);
        return;
    }

    gameState.historyStack.push({
        currentId: gameState.currentId,
        sustento: gameState.sustento,
        coesao: gameState.coesao,
        memoria: gameState.memoria,
        stepCount: gameState.stepCount
    });

    gameState.diaryEntries.push({
        title: session.title,
        choice: choice.text,
        evidence: session.evidence
    });

    const eff = choice.effect || {};
    let pillsHtml = "";

    if (eff.sustento) {
        gameState.sustento = Math.max(0, Math.min(5, gameState.sustento + eff.sustento));
        pillsHtml += `<span class="delta-pill ${eff.sustento > 0 ? 'delta-pos' : 'delta-neg'}">🍖 Sustento ${eff.sustento > 0 ? '+' + eff.sustento : eff.sustento}</span>`;
    }
    if (eff.coesao) {
        gameState.coesao = Math.max(0, Math.min(5, gameState.coesao + eff.coesao));
        pillsHtml += `<span class="delta-pill ${eff.coesao > 0 ? 'delta-pos' : 'delta-neg'}">🤝 Coesão ${eff.coesao > 0 ? '+' + eff.coesao : eff.coesao}</span>`;
    }
    if (eff.memoria) {
        gameState.memoria = Math.max(0, Math.min(5, gameState.memoria + eff.memoria));
        pillsHtml += `<span class="delta-pill ${eff.memoria > 0 ? 'delta-pos' : 'delta-neg'}">📜 Memória ${eff.memoria > 0 ? '+' + eff.memoria : eff.memoria}</span>`;
    }

    updateCharacterSheet();

    if (gameState.sustento <= 0 || gameState.coesao <= 0 || gameState.memoria <= 0) {
        renderCrisisScreen(choice);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    const container = document.getElementById("game-container");
    const feedbackText = choice.feedback || "A decisão da dupla provocou desdobramentos diretos na trajetória histórica do grupo.";

    container.innerHTML = `
        <span class="scene-module-tag">⚖️ Desdobramento Historiográfico da Escolha</span>
        <h2 class="scene-title">Consequências Registradas na Ficha</h2>
        <div class="delta-pills">${pillsHtml || '<span class="delta-pill delta-pos">⚖️ Equilíbrio Mantido</span>'}</div>
        <div class="feedback-box">
            <p>${feedbackText}</p>
        </div>
        <button onclick="advanceToTarget('${choice.target}')" class="btn-gold-large">
            Continuar Investigação Histórica →
        </button>
    `;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function advanceToTarget(targetId) {
    gameState.currentId = targetId;
    gameState.stepCount += 1;
    renderSession();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCrisisScreen(choice) {
    let collapseReason = "";
    if (gameState.sustento <= 0) {
        collapseReason = "💀 <strong>Colapso de Sustento (0/5):</strong> A falta crítica de recursos materiais, água e alimentos inviabilizou a sobrevivência física do grupo.";
    } else if (gameState.coesao <= 0) {
        collapseReason = "⚔️ <strong>Colapso de Coesão (0/5):</strong> A ruptura dos acordos coletivos e os conflitos internos desintegraram a comunidade.";
    } else if (gameState.memoria <= 0) {
        collapseReason = "🌫️ <strong>Colapso de Memória (0/5):</strong> O esquecimento das técnicas ancestrais e a perda dos registros impediram o grupo de superar a crise.";
    }

    const container = document.getElementById("game-container");
    container.innerHTML = `
        <div class="scene-visual-banner">
            <div class="visual-art-icons">⚠️ 🔥 🏚️ ⏳</div>
            <div class="visual-location-meta">
                <span class="visual-era">Crise Histórica Aguda</span>
                <span class="visual-place">Colapso de Marcador na Ficha</span>
            </div>
        </div>
        <span class="scene-module-tag">🚨 Limite Crítico Atingido na Ficha do Jogador</span>
        <h2 class="scene-title">A Comunidade Entrou em Colapso!</h2>
        <div class="feedback-box crisis">
            <p style="margin-bottom: 0.8rem;">${choice.feedback || ""}</p>
            <p>${collapseReason}</p>
        </div>
        <div class="choices-list">
            <button onclick="undoLastStep()" class="choice-btn">
                <div>
                    <span class="choice-text">↩ Voltar 1 Etapa e Repensar a Decisão com a Dupla</span>
                    <span class="choice-impact">Restaura os pontos anteriores da ficha</span>
                </div>
                <span class="choice-arrow">Corrigir →</span>
            </button>
            <button onclick="resetCurrentAdventure()" class="choice-btn">
                <div>
                    <span class="choice-text">🔄 Reiniciar esta Aventura desde a Sessão 1</span>
                    <span class="choice-impact">Restaura Sustento: 3 | Coesão: 3 | Memória: 3</span>
                </div>
                <span class="choice-arrow">Recomeçar →</span>
            </button>
            <button onclick="showHomeScreen()" class="choice-btn">
                <div>
                    <span class="choice-text">🏠 Voltar ao Menu Principal de Aventuras</span>
                    <span class="choice-impact">Escolher outro bimestre</span>
                </div>
                <span class="choice-arrow">Menu →</span>
            </button>
        </div>
    `;
}

function undoLastStep() {
    if (gameState.historyStack.length === 0) return;
    const prev = gameState.historyStack.pop();
    gameState.diaryEntries.pop();
    gameState.currentId = prev.currentId;
    gameState.sustento = prev.sustento;
    gameState.coesao = prev.coesao;
    gameState.memoria = prev.memoria;
    gameState.stepCount = prev.stepCount;
    renderSession();
}

document.addEventListener("DOMContentLoaded", () => {
    initSecurityLayer();
    const savedKey = localStorage.getItem("cronicas_auth_key");
    if (savedKey && VALID_KEYS[savedKey]) {
        unlockPortal(savedKey);
    }
});
