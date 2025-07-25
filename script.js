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
      { texto: "Because it rains", imagem: "images/rain.jpg" },
      { texto: "Because it is sad", imagem: "images/sad.jpg" },
      { texto: "Because of pollution", imagem: "images/pulluition.jpg" },
      { texto: "Because t-rex", imagem: "images/trex.jpg" },
    ],
    correta: "Because of pollution"
  },
  {
    imagem: "images/astronauta.png",
    pergunta: "O que é um “dirty river”?",
    opcoes: [
      { texto: "1", imagem: "images/dirty.jpg" },
      { texto: "2", imagem: "images/river.jpg" },
      { texto: "3", imagem: "images/tree.jpeg" },
      { texto: "4", imagem: "images/background.png" }
    ],
    correta: "1"
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

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA4rFposZJqX_wYWgOysqzA7d2pOocx6s0",
  authDomain: "respostas-quest-acespace.firebaseapp.com",
  projectId: "respostas-quest-acespace",
  storageBucket: "respostas-quest-acespace.appspot.com",
  messagingSenderId: "274617764889",
  appId: "1:274617764889:web:52f80ad4caac5fa05c6e88",
  measurementId: "G-CCV98BK0RF"
};

// Inicializa Firebase uma única vez
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

function iniciarQuiz() {
  nome = document.getElementById("nome").value.trim();
  idade = document.getElementById("idade").value.trim();

  if (!nome || !idade) {
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

function responder(opcaoSelecionada) {
  const pergunta = perguntas[perguntaAtual];
  const botoes = document.querySelectorAll('.resposta');
  const respostaCerta = pergunta.correta;

  // Desativa botões e aplica estilos
  botoes.forEach(btn => {
    btn.classList.add('disabled');

    const textoBtn = btn.innerText.trim();
    const temImagem = btn.querySelector('img');
    const valor = temImagem ? btn.querySelector('div').innerText.trim() : textoBtn;

    if (valor === respostaCerta) {
      btn.classList.add('correta');
    }

    if (valor === opcaoSelecionada && valor !== respostaCerta) {
      btn.classList.add('errada');
    }
  });

  const acertou = opcaoSelecionada === respostaCerta;

  respostas.push({
    pergunta: pergunta.pergunta,
    respostaDada: opcaoSelecionada,
    respostaCorreta: respostaCerta,
    acertou: acertou
  });

  setTimeout(() => {
    perguntaAtual++;
    mostrarPergunta();
  }, 1000);
}

function enviarParaFirebase() {
  const dados = {
    nome: nome,
    idade: idade,
    respostas: respostas,
    timestamp: new Date()
  };

  db.collection("respostasQuiz")
    .add(dados)
    .then(() => {
      console.log("Todas as respostas foram enviadas com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao enviar as respostas:", error);
    });
}
