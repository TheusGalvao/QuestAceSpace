// script.js

// Suas perguntas aqui
const perguntas = [
  {
    imagem: "images/astronauta.png",
    pergunta: "Quem eram os Guarus e como eles viviam?",
    opcoes: [
      "Eram pessoas que cortavam as árvores",
      "Eram indígenas espertos e gentis, e viviam com a natureza",
      "Eram pessoas que jogavam lixo nas ruas",
      "Eram pessoas comuns só que com capa"
    ],
    correta: "Eram indígenas espertos e gentis, e viviam com a natureza"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "O ar costumava ser...",
    opcoes: ["Limpo e fresco", "Cheio de poluição", "Muito abafado", "Cheiroso"],
    correta: "Limpo e fresco"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "Como era a Terra dos Guarus há muito tempo, antes de se tornar Guarulhos?",
    opcoes: [
      "A noisy city with cars",
      "A dry and empty place",
      "Full of big buildings and cars",
      "Full of nature and magic"
    ],
    correta: "Full of nature and magic"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "Por que Guarulhos está pedindo ajuda?",
    opcoes: [
      "Because it rains",
      "Because it is sad",
      "Because of pollution",
      "Because t-rex"
    ],
    correta: "Because of pollution"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "O que é um “dirty river”?",
    opcoes: [
      { texto: "img1", imagem: "images/dirty.jpg" },
      { texto: "img2", imagem: "images/river.jpg" },
      { texto: "img3", imagem: "images/tree.jpeg" },
      { texto: "img4", imagem: "images/background.png" }
    ],
    correta: "img1"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "Global warming is...",
    opcoes: [
      "Quando cuidamos bem da natureza e dos animais",
      "Quando os rios estão limpos e as florestas felizes",
      "Quando a Terra fica mais quente e o clima muda porque as pessoas esqueceram de cuidar da natureza",
      "Quando erram a temperatura local"
    ],
    correta: "Quando a Terra fica mais quente e o clima muda porque as pessoas esqueceram de cuidar da natureza"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "What does “nature” give us?",
    opcoes: [
      "Noise and smoke",
      "Robots and buildings",
      "Cake and soda",
      "Clean air and water"
    ],
    correta: "Clean air and water"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "Who are the new heroes?",
    opcoes: [
      "Adults from space",
      "Children like me",
      "Animals of the forest",
      "Guitar Players"
    ],
    correta: "Children like me"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "How can you help Guarulhos?",
    opcoes: [
      "Becoming an Environmental Agent and taking care of the Earth",
      "Throwing garbage on the floor",
      "Cutting trees",
      "Playing guitar"
    ],
    correta: "Becoming an Environmental Agent and taking care of the Earth"
  }
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
