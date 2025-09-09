const voices = [
    { id: 'v_feminina_br', name: 'Marina', description: 'Voz feminina natural e expressiva.', audio: 'audio/sample_Maria.ogg' },
    { id: 'v_masculina_br', name: 'Gustavo', description: 'Voz masculina profissional e forte.', audio: 'audio/sample_Andre.ogg' }
];

const API_URL = 'https://cebf8eb11a45.ngrok-free.app/'; // 🚨 COLE O SEU NOVO LINK DA API AQUI

const voiceOptionsContainer = document.getElementById('voice-options-container');
const ttsAudioPlayer = document.getElementById('tts-audio-player');
const generateTtsBtn = document.getElementById('generate-tts-btn');
const textInput = document.getElementById('text-input');
const cloneUpload = document.getElementById('clone-upload');
const cloneMicBtn = document.getElementById('clone-mic-btn');
const modifyUpload = document.getElementById('modify-upload');
const modifyMicBtn = document.getElementById('modify-mic-btn');
const cloneStatusMessage = document.getElementById('clone-status-message');
const modifyStatusMessage = document.getElementById('modify-status-message');
const globalStatusMessage = document.getElementById('global-status-message');

let selectedVoiceId = null;

// Função para renderizar as opções de voz
function renderVoices() {
    voiceOptionsContainer.innerHTML = '';
    voices.forEach(voice => {
        const div = document.createElement('div');
        div.className = 'voice-option';
        div.setAttribute('data-voice-id', voice.id);
        div.innerHTML = `
            <h3>${voice.name}</h3>
            <p>${voice.description}</p>
            <button class="play-button" data-audio="${voice.audio}">Ouvir</button>
        `;
        voiceOptionsContainer.appendChild(div);

        div.addEventListener('click', () => {
            document.querySelectorAll('.voice-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedVoiceId = voice.id;
        });
        div.querySelector('.play-button').addEventListener('click', (e) => {
            e.stopPropagation();
            const audioSrc = e.target.getAttribute('data-audio');
            const audio = new Audio(audioSrc);
            audio.play();
        });
    });
}

// Evento para a funcionalidade de texto para fala
generateTtsBtn.addEventListener('click', async () => {
    if (!selectedVoiceId) {
        globalStatusMessage.textContent = 'Por favor, selecione uma voz para continuar.';
        return;
    }
    const text = textInput.value.trim();
    if (text === '') {
        globalStatusMessage.textContent = 'Por favor, digite algum texto.';
        return;
    }

    globalStatusMessage.textContent = 'Gerando áudio...';
    generateTtsBtn.disabled = true;

    try {
        let apiUrl = API_URL;
        if (!apiUrl.endsWith('/')) {
            apiUrl += '/';
        }

        const response = await fetch(`${apiUrl}generate_audio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, voice_id: selectedVoiceId })
        });

        if (!response.ok) {
            let errMsg = `Status ${response.status}`;
            try {
                const j = await response.json();
                errMsg += ` — ${j.error || JSON.stringify(j)}`;
            } catch (e) {
                const txt = await response.text();
                errMsg += ` — ${txt}`;
            }
            globalStatusMessage.textContent = `❌ Erro: ${errMsg}`;
            console.error("Erro na API:", errMsg);
            return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('audio')) {
            const text = await response.text();
            globalStatusMessage.textContent = `❌ Resposta inesperada do servidor: ${text}`;
            console.error("Resposta sem audio:", text);
            return;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        ttsAudioPlayer.src = audioUrl;
        ttsAudioPlayer.style.display = 'block';
        await ttsAudioPlayer.play();
        globalStatusMessage.textContent = '✅ Áudio gerado com sucesso!';
    } catch (error) {
        console.error(error);
        globalStatusMessage.textContent = `❌ Ocorreu um erro na conexão: ${error.message}`;
    } finally {
        generateTtsBtn.disabled = false;
    }
});

// Eventos para as outras funcionalidades (ainda não implementadas)
cloneUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        cloneStatusMessage.textContent = `Arquivo "${file.name}" pronto para clonagem.`;
    }
});

cloneMicBtn.addEventListener('click', () => {
    cloneStatusMessage.textContent = 'Funcionalidade ainda não implementada.';
});

modifyUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        modifyStatusMessage.textContent = `Arquivo "${file.name}" pronto para modificação.`;
    }
});

modifyMicBtn.addEventListener('click', () => {
    modifyStatusMessage.textContent = 'Funcionalidade ainda não implementada.';
});

document.addEventListener('DOMContentLoaded', renderVoices);
