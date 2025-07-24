// script.js

// Suas perguntas aqui
const perguntas = [
  // Exemplo
  {
    pergunta: "Qual é a capital do Brasil?",
    correta: "Brasília",
    opcoes: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    imagem: "https://exemplo.com/imagem1.jpg"
  },
  // Adicione mais perguntas
];

let respostas = [];
let perguntaAtual = 0;
let nome = "";
let idade = "";

// Firebase config - certifique-se de NÃO repetir isso
const firebaseConfig = {
  apiKey: "AIzaSyA4rFposZJqX_wYWgOysqzA7d2pOocx6s0",
  authDomain: "respostas-quest-acespace.firebaseapp.com",
  projectId: "respostas-quest-acespace",
  storageBucket: "respostas-quest-acespace.appspot.com",
  messagingSenderId: "274617764889",
  appId: "1:274617764889:web:52f80ad4caac5fa05c6e88",
  measurementId: "G-CCV98BK0RF"
};

// Inicializar Firebase apenas uma vez
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

function iniciarQuiz() {
  nome = document.getElementById("nome").value.trim();
  idade = document.getElementById("idade").value.trim();

  if (nome === "" || idade === "") {
    alert("Por favor, preencha o nome e a idade.");
    return;
  }

  mostrarPergunta();
}

function mostrarPergunta() {
  const container = document.getElementById("quiz-container");

  if (perguntaAtual >= perguntas.length) {
    container.innerHTML = "<h2>Obrigado por participar!</h2><p>Suas respostas foram enviadas com sucesso.</p>";
    enviarParaFirebase();
    return;
  }

  const pergunta = perguntas[perguntaAtual];
  const progresso = Math.round(((perguntaAtual + 1) / perguntas.length) * 100);

  container.innerHTML = `
    <div class="barra-progresso-container">
      <div class="barra-progresso" style="width: ${progresso}%;"></div>
    </div>
    <h2>${pergunta.pergunta}</h2>
    <img src="${pergunta.imagem}" class="imagem-intermediaria" alt="Imagem ilustrativa">
    <div class="respostas">
      ${pergunta.opcoes.map(opcao => {
        if (typeof opcao === "string") {
          return `<button class="resposta" onclick="responder('${opcao}')">${opcao}</button>`;
        } else {
          return `
            <button class="resposta" onclick="responder('${opcao.texto}')">
              <img src="${opcao.imagem}" alt="${opcao.texto}" class="opcao-img">
              <div>${opcao.texto}</div>
            </button>
          `;
        }
      }).join("")}
    </div>
  `;
}

function responder(opcao) {
  const pergunta = perguntas[perguntaAtual];
  const acertou = opcao === pergunta.correta;

  respostas.push({
    pergunta: pergunta.pergunta,
    respostaDada: opcao,
    respostaCorreta: pergunta.correta,
    acertou: acertou
  });

  perguntaAtual++;
  mostrarPergunta();
}

function enviarParaFirebase() {
  respostas.forEach(resposta => {
    db.collection("respostasQuiz")
      .add({
        nome: nome,
        idade: idade,
        pergunta: resposta.pergunta,
        resposta: resposta.respostaDada,
        correta: resposta.respostaCorreta,
        timestamp: new Date()
      })
      .then(() => {
        console.log("Resposta enviada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao enviar resposta:", error);
      });
  });
}
