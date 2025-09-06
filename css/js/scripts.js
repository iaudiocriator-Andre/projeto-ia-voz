const voices = [
    { id: 'v_feminina_br', name: 'Marina', description: 'Voz feminina natural e expressiva.', audio: 'audio/sample_marina.mp3' },
    { id: 'v_masculina_br', name: 'Gustavo', description: 'Voz masculina profissional e forte.', audio: 'audio/sample_gustavo.mp3' },
    { id: 'v_jovem_br', name: 'Leticia', description: 'Voz jovem e alegre, com sotaque carioca.', audio: 'audio/sample_leticia.mp3' },
    { id: 'v_norte_br', name: 'Pedro', description: 'Voz masculina com sotaque do norte do Brasil.', audio: 'audio/sample_pedro.mp3' }
];

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

// Eventos para as funcionalidades
generateTtsBtn.addEventListener('click', async () => {
    if (!selectedVoiceId) {
        globalStatusMessage.textContent = 'Por favor, selecione uma voz para continuar.';
        return;
    }
    if (textInput.value.trim() === '') {
        globalStatusMessage.textContent = 'Por favor, digite algum texto.';
        return;
    }
    globalStatusMessage.textContent = `Voz selecionada: ${selectedVoiceId}. Texto: "${textInput.value}"`;
    // FUTURO: CHAMADA PARA A API DO COLAB PARA TTS
});

cloneUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        cloneStatusMessage.textContent = `Arquivo "${file.name}" pronto para clonagem.`;
        // FUTURO: CHAMADA PARA A API DO COLAB PARA CLONAGEM DE ARQUIVO
    }
});

cloneMicBtn.addEventListener('click', () => {
    cloneStatusMessage.textContent = 'Aguardando permissão do microfone para clonar...';
    // FUTURO: CÓDIGO PARA ACESSAR O MICROFONE E CHAMAR A API DO COLAB
});

modifyUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        modifyStatusMessage.textContent = `Arquivo "${file.name}" pronto para modificação.`;
        // FUTURO: CHAMADA PARA A API DO COLAB PARA MODIFICAR ARQUIVO
    }
});

modifyMicBtn.addEventListener('click', () => {
    modifyStatusMessage.textContent = 'Aguardando permissão do microfone para modificar...';
    // FUTURO: CÓDIGO PARA ACESSAR O MICROFONE E CHAMAR A API DO COLAB
});

document.addEventListener('DOMContentLoaded', renderVoices);
