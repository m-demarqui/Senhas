const numeroSenha = document.querySelector('.parametro-senha__texto');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const valorEntropia = document.querySelector('.entropia');
const botoes = document.querySelectorAll('.parametro-senha__botao');

let tamanhoSenha = 12;

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolos = '!@#$%&*?';

if (numeroSenha) numeroSenha.textContent = tamanhoSenha;

// Atualiza ano do footer
const anoAtual = document.getElementById('ano-atual');
if (anoAtual) anoAtual.textContent = new Date().getFullYear();

// Eventos dos botões
if (botoes[0]) botoes[0].addEventListener('click', diminuiTamanho);
if (botoes[1]) botoes[1].addEventListener('click', aumentaTamanho);

// Eventos dos checkboxes
checkbox.forEach((item) => {
  item.addEventListener('click', geraSenha);
});

function diminuiTamanho() {
  if (tamanhoSenha > 1) {
    tamanhoSenha--;
    if (numeroSenha) numeroSenha.textContent = tamanhoSenha;
    geraSenha();
  }
}

function aumentaTamanho() {
  if (tamanhoSenha < 30) {
    tamanhoSenha++;
    if (numeroSenha) numeroSenha.textContent = tamanhoSenha;
    geraSenha();
  }
}

function geraSenha() {
  let alfabeto = '';

  if (checkbox[0]?.checked) alfabeto += letrasMaiusculas;
  if (checkbox[1]?.checked) alfabeto += letrasMinusculas;
  if (checkbox[2]?.checked) alfabeto += numeros;
  if (checkbox[3]?.checked) alfabeto += simbolos;

  if (alfabeto.length === 0) {
    if (campoSenha) campoSenha.value = 'Selecione uma opção';
    if (valorEntropia) valorEntropia.textContent = '';
    if (forcaSenha) {
      forcaSenha.classList.remove('fraca', 'media', 'forte');
      forcaSenha.classList.add('fraca');
    }
    return;
  }

  let senha = '';
  for (let i = 0; i < tamanhoSenha; i++) {
    const indice = Math.floor(Math.random() * alfabeto.length);
    senha += alfabeto[indice];
  }

  if (campoSenha) campoSenha.value = senha;

  classificaSenha(alfabeto.length);
}

function classificaSenha(tamanhoAlfabeto) {
  const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);

  if (forcaSenha) {
    forcaSenha.classList.remove('fraca', 'media', 'forte');

    if (entropia >= 57) {
      forcaSenha.classList.add('forte');
    } else if (entropia >= 35) {
      forcaSenha.classList.add('media');
    } else {
      forcaSenha.classList.add('fraca');
    }
  }

  const dias = Math.floor((2 ** entropia) / (100000000 * 60 * 60 * 24));

  if (valorEntropia) {
    valorEntropia.textContent =
      'Um computador pode levar até ' +
      dias.toLocaleString('pt-BR') +
      ' dias para descobrir essa senha.';
  }
}

// Copiar senha ao clicar
if (campoSenha) {
  campoSenha.addEventListener('click', async () => {
    if (!campoSenha.value || campoSenha.value === 'Selecione uma opção') return;

    try {
      await navigator.clipboard.writeText(campoSenha.value);

      const textoOriginal = campoSenha.value;
      campoSenha.value = 'Senha copiada!';

      setTimeout(() => {
        campoSenha.value = textoOriginal;
      }, 1000);
    } catch (e) {
      alert('Não foi possível copiar automaticamente. Seu navegador pode bloquear o clipboard.');
    }
  });
}

geraSenha();
