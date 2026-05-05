/* =======================================================
   CANTINHO DAS MASSAS — script.js v7 (LIMPO)
   Sistema com WhatsApp Direto
   Massa: 1 por vez | Outros: quantidade | Gratis: sem quantidade
   ======================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBn1ES36a48KjBYXtqRxOCqrAomS8t8bmY",
  authDomain:        "cantinho-das-massas-f089d.firebaseapp.com",
  databaseURL:       "https://cantinho-das-massas-f089d-default-rtdb.firebaseio.com",
  projectId:         "cantinho-das-massas-f089d",
  storageBucket:     "cantinho-das-massas-f089d.firebasestorage.app",
  messagingSenderId: "603348403182",
  appId:             "1:603348403182:web:74a8eb6f1e626005a604ff"
};

const _app = initializeApp(firebaseConfig);
const _db  = getDatabase(_app);

// ── ESTADO GLOBAL ────────────────────────────────────────
let historico    = [];
let carrinho     = [];
let tipoAtual    = '';
let pedidoAtual  = { itens: [] };
let bairroSelecionado = null;

// ── CARDÁPIO PADRÃO ──────────────────────────────────────
const CARDAPIO_DEFAULT = {
  lojaAberta: true,
  whatsapp: '5521980812220',
  
  massas: [
    { nome: 'Espaguete', img: 'img/espaguete.jpeg', desc: 'Clássico e delicioso, perfeito com qualquer molho' },
    { nome: 'Talharim',  img: 'img/talharim.jpeg',  desc: 'Massa larga e macia, absorve muito bem os molhos' },
    { nome: 'Penne',     img: 'img/penne.jpeg',      desc: 'Tubinhos crocantes por fora, macios por dentro' },
    { nome: 'Gravata',   img: 'img/gravata.jpeg',    desc: 'Formato divertido que prende o molho nas dobras' },
    { nome: 'Parafuso',  img: 'img/parafuso.jpeg',  desc: 'Espiral que segura cada gota de molho' },
  ],

  molhos: [
    { nome: 'Bolonhesa',              img: 'img/molho_bolonhesa.jpeg', desc: 'Carne moída, tomate e temperos — o favorito' },
    { nome: 'Branco (Bechamel)',       img: 'img/molho_branco.jpeg',   desc: 'Cremoso e suave, feito com leite e manteiga' },
    { nome: 'Vermelho com Manjericão', img: 'img/molho_vermelho.jpeg', desc: 'Tomate fresco, alho e manjericão' },
    { nome: '4 Queijos',              img: 'img/molho_4queijos.jpeg', desc: 'Mussarela, parmesão, gorgonzola e catupiry' },
    { nome: 'Sem molho',              img: 'img/fundo_branco.jpeg',   desc: 'Massa simples' },
  ],

  adicionaisGratis: [
    { nome: 'Bacon com Calabresa', img: 'img/bacon_calabresa.jpeg',  desc: 'Defumado e crocante' },
    { nome: 'Milho e Ervilha',     img: 'img/milho_ervilha.jpeg',    desc: 'Crocância e leveza' },
    { nome: 'Brócolis',            img: 'img/brocolis.jpeg',         desc: 'Refogado no alho' },
    { nome: 'Pimenta Biquinho',    img: 'img/pimenta_biquinho.jpeg', desc: 'Suave e adocicada' },
    { nome: 'Presunto Picado',     img: 'img/presunto_picado.jpeg',  desc: 'Pedaços generosos' },
    { nome: 'Mussarela Ralada',    img: 'img/mussarela.jpeg',        desc: 'Queijo derretendo 🧀' },
  ],

  proteinas: [
    { nome: 'Frango Cremoso',          img: 'img/frango.jpeg',          desc: 'Frango desfiado no molho especial da casa',         preco: 25.00 },
    { nome: 'Carne Moída',             img: 'img/carne_moida.jpeg',     desc: 'Temperada e refogada com ervas frescas',            preco: 25.00 },
    { nome: 'Carne Seca com Catupiry', img: 'img/carne_seca.jpeg',      desc: 'Carne seca desfiada com catupiry — infalível',      preco: 27.90 },
    { nome: 'Brasileirinha',           img: 'img/bacon_calabresa.jpeg', desc: 'Bacon, calabresa e cream cheese',                   preco: 23.90 },
  ],

  saboresBatata: [
    { nome: 'Brasileirinha',               img: 'img/fundo_batata.jpeg', desc: '🥓 Bacon + calabresa + milho + azeitona + catupiry + mussarela + batata palha', preco: 23.00 },
    { nome: 'Strogonoff de Carne Cremoso', img: 'img/carne_moida.jpeg',  desc: '🥩 Carne cremosa + catupiry + mussarela + batata palha',                         preco: 25.90 },
    { nome: 'Carne Seca com Catupiry',     img: 'img/carne_seca.jpeg',   desc: '🤤 Carne seca desfiada + cebola + molho + mussarela + catupiry + cheiro verde',  preco: 26.90 },
    { nome: 'Camarão com Catupiry',        img: 'img/frango.jpeg',       desc: '🦐 Camarão ao molho + catupiry + mussarela + cheiro verde',                      preco: 27.90 },
  ],

  saboresCuscuz: [
    { nome: 'Da Casa — O Mais Pedido', img: 'img/fundo_cuscuz.jpeg', desc: '🌽 Bacon + calabresa + requeijão + milho + catupiry + cheiro verde', preco: 23.00 },
    { nome: 'Carne Seca com Catupiry', img: 'img/carne_seca.jpeg',   desc: '🤤 Carne seca + mussarela + catupiry + cheiro verde',                preco: 25.90 },
    { nome: 'Camarão',                 img: 'img/frango.jpeg',       desc: '🦐 Camarão no azeite + mussarela + catupiry + requeijão',           preco: 27.90 },
  ],

  executivos: [
    { nome: 'Frango à Parmegiana',     img: 'img/parmegiana.jpeg', desc: '🍗 Arroz, feijão, macarrão, farofa e salada', preco: 20.00 },
    { nome: 'Linguiça Mineira com Couve', img: 'img/linguica.jpeg', desc: '🌿 Arroz, feijão, macarrão, farofa e couve refogada', preco: 20.00 },
    { nome: 'Isca de Alcatra com Fritas', img: 'img/alcatra.jpeg', desc: '🥩 Arroz, feijão, macarrão, farofa e fritas', preco: 24.00 },
    { nome: 'Churrasco Misto',         img: 'img/fundo_carne.jpeg', desc: '🔥 Arroz, feijão, macarrão, farofa e salada', preco: 22.90 },
  ],

  adicionaisPagos: [
    { nome: 'Bacon com Calabresa', img: 'img/bacon_calabresa.jpeg',  desc: 'Defumado e crocante', preco: 2.00 },
    { nome: 'Milho e Ervilha',     img: 'img/milho_ervilha.jpeg',    desc: 'Levinho e crocante',  preco: 2.00 },
    { nome: 'Brócolis',            img: 'img/brocolis.jpeg',         desc: 'Refogado no alho',    preco: 2.00 },
    { nome: 'Pimenta Biquinho',    img: 'img/pimenta_biquinho.jpeg', desc: 'Suave e especial',    preco: 2.00 },
    { nome: 'Presunto Picado',     img: 'img/presunto_picado.jpeg',  desc: 'Pedaços generosos',   preco: 2.00 },
    { nome: 'Mussarela Ralada',    img: 'img/mussarela.jpeg',        desc: 'Queijo derretendo 🧀', preco: 2.00 },
  ],
};

let CARDAPIO = JSON.parse(JSON.stringify(CARDAPIO_DEFAULT));

// ── FIREBASE LISTENER ────────────────────────────────────
function iniciarEscutaCardapio() {
  onValue(ref(_db, 'cardapio'), (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
      CARDAPIO = { ...CARDAPIO_DEFAULT, ...dados };
      if (!CARDAPIO.executivos?.length) CARDAPIO.executivos = CARDAPIO_DEFAULT.executivos;
    } else {
      CARDAPIO = JSON.parse(JSON.stringify(CARDAPIO_DEFAULT));
    }
    const aviso = document.getElementById('aviso-fechado');
    if (aviso) aviso.style.display = CARDAPIO.lojaAberta ? 'none' : 'block';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  iniciarEscutaCardapio();
  atualizarCarrinhoPill();
});

// ── NAVEGAÇÃO ────────────────────────────────────────────
const TELAS_SEM_PILL = ['tela-inicio', 'tela-tipo', 'tela-dados'];

function mostrarTela(id) {
  const atual = document.querySelector('.tela.active');
  if (atual) { historico.push(atual.id); atual.classList.remove('active'); }
  const dest = document.getElementById(id);
  if (!dest) return;
  dest.classList.add('active');
  const scroll = dest.querySelector('.tela-scroll');
  if (scroll) scroll.scrollTop = 0;
  atualizarVisibilidadePill(id);
}

window.voltar = function() {
  const ant = historico.pop();
  if (!ant) return;
  const atual = document.querySelector('.tela.active');
  if (atual) atual.classList.remove('active');
  const dest = document.getElementById(ant);
  if (dest) { dest.classList.add('active'); atualizarVisibilidadePill(ant); }
};

function atualizarVisibilidadePill(telaId) {
  const pill = document.getElementById('carrinho-flutuante');
  if (!pill) return;
  pill.classList.toggle('visivel', carrinho.length > 0 && !TELAS_SEM_PILL.includes(telaId));
}

window.abrirCarrinho = function() {
  mostrarTela('tela-carrinho');
  renderizarCarrinho();
};

// ── TELA INICIAL ─────────────────────────────────────────
window.iniciarPedido = function() {
  if (!CARDAPIO.lojaAberta) { mostrarToast('🔴 Loja fechada no momento!'); return; }
  pedidoAtual = { itens: [] };
  tipoAtual = '';
  mostrarTela('tela-tipo');
};

// ── ESCOLHA DE TIPO ──────────────────────────────────────
window.escolherTipo = function(tipo) {
  tipoAtual = tipo;
  pedidoAtual = { tipo, itens: [] };

  if (tipo === 'massa') {
    renderizarOpcoes('lista-massas', CARDAPIO.massas, 'massa');
    mostrarTela('tela-massas');
  } else if (tipo === 'batata') {
    document.getElementById('titulo-sabores').innerHTML = '🥔 Batata Recheada<span class="sub">Quantos quiser!</span>';
    renderizarOpcoes('lista-sabores', CARDAPIO.saboresBatata, 'sabor');
    mostrarTela('tela-sabores');
  } else if (tipo === 'cuscuz') {
    document.getElementById('titulo-sabores').innerHTML = '🌽 Sabor do Cuscuz<span class="sub">Quantos quiser!</span>';
    renderizarOpcoes('lista-sabores', CARDAPIO.saboresCuscuz, 'sabor');
    mostrarTela('tela-sabores');
  } else if (tipo === 'executivo') {
    renderizarOpcoes('lista-executivos', CARDAPIO.executivos, 'executivo');
    mostrarTela('tela-executivos');
  }
};

// ── RENDERIZAR OPÇÕES ────────────────────────────────────
function renderizarOpcoes(containerId, itens, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  // Habilita/desabilita botões conforme o tipo
  if (tipo === 'massa') {
    const btn = document.getElementById('btn-ir-molhos');
    if (btn) btn.disabled = true;
  }
  if (tipo === 'sabor') {
    const btn = document.getElementById('btn-ir-pagos-sabor');
    if (btn) btn.disabled = true;
  }
  if (tipo === 'executivo') {
    const btn = document.getElementById('btn-ir-resumo-exec');
    if (btn) btn.disabled = true;
  }
  if (tipo === 'molho') {
    const btn = document.getElementById('btn-ir-gratis');
    if (btn) btn.disabled = true;
  }
  if (tipo === 'proteina') {
    const btn = document.getElementById('btn-ir-pagos-prot');
    if (btn) btn.disabled = true;
  }
  
  (itens || []).forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'card-op';
    div.dataset.nome = item.nome;
    div.dataset.preco = item.preco || 0;
    div.dataset.idx = idx;
    
    const precoHtml = item.preco && item.preco > 0 ? 
      `<span class="preco-tag">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>` : '';
    
    // MASSA: sem botões de quantidade, com check
    if (tipo === 'massa') {
      div.innerHTML = `
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
        <div class="info">
          <div class="nome">${item.nome}</div>
          ${item.desc ? `<div class="descricao">${item.desc}</div>` : ''}
          ${precoHtml}
          <div style="font-size:11px; color:#8A6A5A; margin-top:4px;">✅ Clique para selecionar</div>
        </div>
        <div class="info-right">
          <div class="check">✓</div>
        </div>
      `;
      div.addEventListener('click', () => {
        container.querySelectorAll('.card-op').forEach(c => c.classList.remove('selecionado'));
        div.classList.add('selecionado');
        const btn = document.getElementById('btn-ir-molhos');
        if (btn) btn.disabled = false;
      });
    }
    
    // MOLHO: sem botões de quantidade, com check
    else if (tipo === 'molho') {
      div.innerHTML = `
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
        <div class="info">
          <div class="nome">${item.nome}</div>
          ${item.desc ? `<div class="descricao">${item.desc}</div>` : ''}
          ${precoHtml}
        </div>
        <div class="info-right">
          <div class="check">✓</div>
        </div>
      `;
      div.addEventListener('click', () => {
        container.querySelectorAll('.card-op').forEach(c => c.classList.remove('selecionado'));
        div.classList.add('selecionado');
        const btn = document.getElementById('btn-ir-gratis');
        if (btn) btn.disabled = false;
      });
    }
    
    // PROTEINA: sem botões de quantidade, com check
    else if (tipo === 'proteina') {
      div.innerHTML = `
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
        <div class="info">
          <div class="nome">${item.nome}</div>
          ${item.desc ? `<div class="descricao">${item.desc}</div>` : ''}
          ${precoHtml}
        </div>
        <div class="info-right">
          <div class="check">✓</div>
        </div>
      `;
      div.addEventListener('click', () => {
        container.querySelectorAll('.card-op').forEach(c => c.classList.remove('selecionado'));
        div.classList.add('selecionado');
        const btn = document.getElementById('btn-ir-pagos-prot');
        if (btn) btn.disabled = false;
      });
    }
    
    // ADICIONAIS GRÁTIS: sem botões de quantidade, com check (limite 3)
    else if (tipo === 'adicionalGratis') {
      div.innerHTML = `
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
        <div class="info">
          <div class="nome">${item.nome}</div>
          ${item.desc ? `<div class="descricao">${item.desc}</div>` : ''}
        </div>
        <div class="info-right">
          <div class="check">✓</div>
        </div>
      `;
      div.addEventListener('click', () => {
        const selecionados = container.querySelectorAll('.card-op.selecionado');
        
        if (div.classList.contains('selecionado')) {
          div.classList.remove('selecionado');
        } else {
          if (selecionados.length >= 3) {
            mostrarToast('⚠️ Máximo de 3 adicionais grátis!');
            return;
          }
          div.classList.add('selecionado');
        }
        atualizarContadorGratis();
      });
    }
    
    // SABORES (batata/cuscuz) e EXECUTIVOS: com botões de quantidade, SEM check
    else if (tipo === 'sabor' || tipo === 'executivo') {
      div.innerHTML = `
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
        <div class="info">
          <div class="nome">${item.nome}</div>
          ${item.desc ? `<div class="descricao">${item.desc}</div>` : ''}
          ${precoHtml}
        </div>
        <div class="info-right">
          <div class="quantidade-box">
            <button class="qtd-minus">-</button>
            <span class="qtd">0</span>
            <button class="qtd-plus">+</button>
          </div>
        </div>
      `;
      
      const minusBtn = div.querySelector('.qtd-minus');
      const plusBtn = div.querySelector('.qtd-plus');
      const qtdSpan = div.querySelector('.qtd');
      
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let qtd = parseInt(qtdSpan.innerText);
        if (qtd > 0) qtd--;
        qtdSpan.innerText = qtd;
        if (qtd > 0) {
          div.classList.add('selecionado');
        } else {
          div.classList.remove('selecionado');
        }
        verificarBotaoAvancar(containerId, tipo);
      });
      
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let qtd = parseInt(qtdSpan.innerText);
        qtd++;
        qtdSpan.innerText = qtd;
        div.classList.add('selecionado');
        verificarBotaoAvancar(containerId, tipo);
      });
      
      container.appendChild(div);
      return;
    }
    
    // ADICIONAIS PAGOS: com botões de quantidade, SEM check
    else if (tipo === 'adicionalPago') {
      div.innerHTML = `
        ${item.img ? `<img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
        <div class="info">
          <div class="nome">${item.nome}</div>
          ${item.desc ? `<div class="descricao">${item.desc}</div>` : ''}
          ${precoHtml}
        </div>
        <div class="info-right">
          <div class="quantidade-box">
            <button class="qtd-minus">-</button>
            <span class="qtd">0</span>
            <button class="qtd-plus">+</button>
          </div>
        </div>
      `;
      
      const minusBtn = div.querySelector('.qtd-minus');
      const plusBtn = div.querySelector('.qtd-plus');
      const qtdSpan = div.querySelector('.qtd');
      
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let qtd = parseInt(qtdSpan.innerText);
        if (qtd > 0) qtd--;
        qtdSpan.innerText = qtd;
        if (qtd > 0) {
          div.classList.add('selecionado');
        } else {
          div.classList.remove('selecionado');
        }
        atualizarContadorPago();
      });
      
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let qtd = parseInt(qtdSpan.innerText);
        qtd++;
        qtdSpan.innerText = qtd;
        div.classList.add('selecionado');
        atualizarContadorPago();
      });
      
      container.appendChild(div);
      return;
    }
    
    container.appendChild(div);
  });
}

function verificarBotaoAvancar(containerId, tipo) {
  const container = document.getElementById(containerId);
  const hasSelecionado = Array.from(container.querySelectorAll('.card-op')).some(card => {
    const qtdSpan = card.querySelector('.qtd');
    if (qtdSpan) {
      return parseInt(qtdSpan.innerText) > 0;
    }
    return card.classList.contains('selecionado');
  });
  
  let btnId = null;
  if (tipo === 'sabor') btnId = 'btn-ir-pagos-sabor';
  if (tipo === 'executivo') btnId = 'btn-ir-resumo-exec';
  
  if (btnId) {
    const btn = document.getElementById(btnId);
    if (btn) btn.disabled = !hasSelecionado;
  }
}

// ── FUNÇÃO PARA COLETAR ITENS COM QUANTIDADE ──────────────
function coletarItensComQuantidade(containerId, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return [];
  
  const resultados = [];
  
  if (tipo === 'massa' || tipo === 'molho' || tipo === 'proteina') {
    const selecionado = container.querySelector('.card-op.selecionado');
    if (selecionado) {
      resultados.push({
        nome: selecionado.dataset.nome,
        preco: parseFloat(selecionado.dataset.preco) || 0,
        quantidade: 1
      });
    }
    return resultados;
  }
  
  if (tipo === 'adicionalGratis') {
    const selecionados = container.querySelectorAll('.card-op.selecionado');
    selecionados.forEach(sel => {
      resultados.push({
        nome: sel.dataset.nome,
        preco: 0,
        quantidade: 1
      });
    });
    return resultados;
  }
  
  container.querySelectorAll('.card-op').forEach(card => {
    const qtdSpan = card.querySelector('.qtd');
    const quantidade = qtdSpan ? parseInt(qtdSpan.innerText) : 0;
    if (quantidade > 0) {
      resultados.push({
        nome: card.dataset.nome,
        preco: parseFloat(card.dataset.preco) || 0,
        quantidade: quantidade
      });
    }
  });
  return resultados;
}

function coletarItemUnico(containerId, tipo) {
  const itens = coletarItensComQuantidade(containerId, tipo);
  return itens.length > 0 ? itens[0] : null;
}

// ── FLUXO COMPLETO ───────────────────────────────────────
window.irParaMolhos = function() {
  const itens = coletarItensComQuantidade('lista-massas', 'massa');
  if (itens.length === 0) { 
    mostrarToast('Escolha uma massa!'); 
    return; 
  }
  pedidoAtual.itens = itens;
  renderizarOpcoes('lista-molhos', CARDAPIO.molhos, 'molho');
  mostrarTela('tela-molhos');
};

window.irParaAdicionaisGratis = function() {
  const molho = coletarItemUnico('lista-molhos', 'molho');
  if (!molho) { 
    mostrarToast('Escolha um molho!'); 
    return; 
  }
  pedidoAtual.molho = molho;
  renderizarOpcoes('lista-adicionais-gratis', CARDAPIO.adicionaisGratis, 'adicionalGratis');
  mostrarTela('tela-adicionais-gratis');
  atualizarContadorGratis();
};

window.irParaProteinas = function() {
  const gratis = coletarItensComQuantidade('lista-adicionais-gratis', 'adicionalGratis');
  if (gratis.length > 3) {
    mostrarToast('⚠️ Máximo de 3 adicionais grátis!');
    return;
  }
  pedidoAtual.adicionaisGratis = gratis;
  renderizarOpcoes('lista-proteinas', CARDAPIO.proteinas, 'proteina');
  mostrarTela('tela-proteinas');
};

window.irParaAdicionaisPagosMassa = function() {
  const proteina = coletarItemUnico('lista-proteinas', 'proteina');
  if (!proteina) { 
    mostrarToast('Escolha uma proteína!'); 
    return; 
  }
  pedidoAtual.proteina = proteina;
  renderizarOpcoes('lista-adicionais-pagos', CARDAPIO.adicionaisPagos, 'adicionalPago');
  mostrarTela('tela-adicionais-pagos');
  atualizarContadorPago();
};

window.irParaAdicionaisPagosSabor = function() {
  const sabores = coletarItensComQuantidade('lista-sabores', 'sabor');
  if (sabores.length === 0) { 
    mostrarToast('Escolha pelo menos um sabor!'); 
    return; 
  }
  pedidoAtual.itens = sabores;
  renderizarOpcoes('lista-adicionais-pagos', CARDAPIO.adicionaisPagos, 'adicionalPago');
  mostrarTela('tela-adicionais-pagos');
  atualizarContadorPago();
};

window.irParaResumoExecutivo = function() {
  const executivos = coletarItensComQuantidade('lista-executivos', 'executivo');
  if (executivos.length === 0) { 
    mostrarToast('Escolha pelo menos um prato executivo!'); 
    return; 
  }
  pedidoAtual.itens = executivos;
  pedidoAtual.tipo = 'executivo';
  
  let total = 0;
  pedidoAtual.itens.forEach(item => {
    total += item.preco * item.quantidade;
  });
  pedidoAtual.total = total;
  
  renderizarResumo();
  mostrarTela('tela-resumo');
};

window.pularAdicionaisPagos = function() {
  pedidoAtual.adicionaisPagos = [];
  calcularTotalEResumo();
  mostrarTela('tela-resumo');
};

window.irParaResumo = function() {
  pedidoAtual.adicionaisPagos = coletarItensComQuantidade('lista-adicionais-pagos', 'adicionalPago');
  calcularTotalEResumo();
  mostrarTela('tela-resumo');
};

function calcularTotalEResumo() {
  let total = 0;
  
  pedidoAtual.itens?.forEach(item => {
    total += item.preco * (item.quantidade || 1);
  });
  
  if (pedidoAtual.proteina) {
    total += pedidoAtual.proteina.preco;
  }
  
  pedidoAtual.adicionaisPagos?.forEach(item => {
    total += item.preco * item.quantidade;
  });
  
  pedidoAtual.total = total;
  renderizarResumo();
}

function renderizarResumo() {
  const d = pedidoAtual;
  const div = document.getElementById('resumo-content');
  if (!div) return;
  
  const tituloMap = {
    massa: '🍝 Massa',
    batata: '🥔 Batata Recheada',
    cuscuz: '🌽 Cuscuz',
    executivo: '🍱 Prato Executivo'
  };
  const titulo = tituloMap[d.tipo] || 'Pedido';
  
  let html = `<div class="resumo-header-card">${titulo}</div>`;
  
  if (d.itens?.length) {
    d.itens.forEach(item => {
      html += `<div class="resumo-linha">
        <span class="resumo-emoji">🍽️</span>
        <div>
          <div class="resumo-label">${item.quantidade}x ${item.nome}</div>
          <div class="resumo-valor">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</div>
        </div>
      </div>`;
    });
  }
  
  if (d.molho) {
    html += `<div class="resumo-linha">
      <span class="resumo-emoji">🍅</span>
      <div><div class="resumo-label">Molho</div><div class="resumo-valor">${d.molho.nome}</div></div>
    </div>`;
  }
  
  if (d.proteina) {
    html += `<div class="resumo-linha">
      <span class="resumo-emoji">🥩</span>
      <div><div class="resumo-label">Proteína</div><div class="resumo-valor">${d.proteina.nome} +R$ ${d.proteina.preco.toFixed(2).replace('.', ',')}</div></div>
    </div>`;
  }
  
  if (d.adicionaisGratis?.length) {
    html += `<div class="resumo-secao">🎁 Grátis</div>`;
    d.adicionaisGratis.forEach(item => {
      html += `<div class="resumo-linha"><div><div class="resumo-valor">${item.nome}</div></div></div>`;
    });
  }
  
  if (d.adicionaisPagos?.length) {
    html += `<div class="resumo-secao">🔥 Extras (+R$2)</div>`;
    d.adicionaisPagos.forEach(item => {
      html += `<div class="resumo-linha"><div><div class="resumo-valor">${item.quantidade}x ${item.nome}</div></div></div>`;
    });
  }
  
  html += `<div class="resumo-total-row">
    <span class="resumo-total-label">Total</span>
    <span class="resumo-total-val">R$ ${(d.total || 0).toFixed(2).replace('.', ',')}</span>
  </div>`;
  
  div.innerHTML = html;
}

// ── CARRINHO ─────────────────────────────────────────────
window.adicionarAoCarrinho = function() {
  carrinho.push(JSON.parse(JSON.stringify(pedidoAtual)));
  pedidoAtual = { itens: [] };
  atualizarCarrinhoPill();
  mostrarToast('✅ Item adicionado ao carrinho!');
  mostrarTela('tela-carrinho');
  renderizarCarrinho();
};

window.finalizarDireto = function() {
  carrinho = [JSON.parse(JSON.stringify(pedidoAtual))];
  atualizarCarrinhoPill();
  irParaDados();
};

window.irParaDados = function() {
  if (!carrinho.length) { mostrarToast('Carrinho vazio!'); return; }
  bairroSelecionado = null;
  atualizarTotalComEntrega();
  mostrarTela('tela-dados');
};

function renderizarCarrinho() {
  const div = document.getElementById('carrinho-content');
  const sub = document.getElementById('sub-carrinho');
  if (!div) return;
  sub.textContent = `${carrinho.length} ${carrinho.length === 1 ? 'item' : 'itens'}`;
  
  if (!carrinho.length) {
    div.innerHTML = `<div class="carr-vazio">🛒<br><br>Carrinho vazio!</div>`;
    return;
  }
  
  let html = '', totalGeral = 0;
  carrinho.forEach((item, idx) => {
    let subTotal = item.total || 0;
    totalGeral += subTotal;
    
    let itensText = '';
    if (item.itens?.length) {
      itensText = item.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
    }
    
    html += `
      <div class="item-carr">
        <div class="item-carr-header">
          <div class="item-carr-titulo">${itensText}</div>
          <button class="btn-remover" onclick="removerItem(${idx})">✕</button>
        </div>
        <div class="item-carr-body">
          ${item.molho ? `🍅 ${item.molho.nome}<br>` : ''}
          ${item.proteina ? `🥩 ${item.proteina.nome}<br>` : ''}
          ${item.adicionaisGratis?.length ? `🎁 ${item.adicionaisGratis.map(i => i.nome).join(', ')}<br>` : ''}
          ${item.adicionaisPagos?.length ? `🔥 ${item.adicionaisPagos.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}` : ''}
        </div>
        <div class="item-carr-footer">
          <span class="item-carr-preco">R$ ${subTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>`;
  });
  
  html += `<div class="carrinho-total-card">
    <span>Total do carrinho</span>
    <span>R$ ${totalGeral.toFixed(2).replace('.', ',')}</span>
  </div>`;
  div.innerHTML = html;
}

window.removerItem = function(i) {
  carrinho.splice(i, 1);
  atualizarCarrinhoPill();
  renderizarCarrinho();
  mostrarToast('Item removido');
};

window.continuarComprando = function() {
  pedidoAtual = { itens: [] };
  mostrarTela('tela-tipo');
};

// ── CARRINHO FLUTUANTE ───────────────────────────────────
function atualizarCarrinhoPill() {
  const pill = document.getElementById('carrinho-flutuante');
  const count = document.getElementById('carr-count');
  const tot = document.getElementById('carr-total-pill');
  if (!pill) return;
  
  const qtd = carrinho.length;
  const total = carrinho.reduce((s, i) => s + (i.total || 0), 0);
  count.textContent = qtd;
  tot.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  
  const telaId = document.querySelector('.tela.active')?.id || '';
  pill.classList.toggle('visivel', qtd > 0 && !TELAS_SEM_PILL.includes(telaId));
}

// ── BAIRROS ROLÁVEIS ─────────────────────────────────────
window.selecionarBairro = function(btn) {
  document.querySelectorAll('.bairro-btn').forEach(b => b.classList.remove('selecionado'));
  btn.classList.add('selecionado');
  
  bairroSelecionado = {
    nome: btn.dataset.bairro,
    taxa: parseFloat(btn.dataset.taxa) || 0
  };
  
  document.getElementById('err-bairro')?.classList.remove('visivel');
  
  const resumo = document.getElementById('taxa-resumo');
  if (resumo) {
    resumo.innerHTML = `✅ ${bairroSelecionado.nome} — Taxa: R$ ${bairroSelecionado.taxa.toFixed(2).replace('.', ',')}`;
    resumo.style.display = 'block';
  }
  
  atualizarTotalComEntrega();
};

function atualizarTotalComEntrega() {
  const totalPedido = carrinho.reduce((s, i) => s + (i.total || 0), 0);
  const taxa = bairroSelecionado ? bairroSelecionado.taxa : 0;
  const totalGeral = totalPedido + taxa;
  
  const box = document.getElementById('total-com-entrega');
  if (!box) return;
  
  if (bairroSelecionado) {
    document.getElementById('total-pedido-val').innerHTML = `R$ ${totalPedido.toFixed(2).replace('.', ',')}`;
    document.getElementById('total-taxa-val').innerHTML = `R$ ${taxa.toFixed(2).replace('.', ',')}`;
    document.getElementById('bairro-nome-resumo').innerHTML = bairroSelecionado.nome;
    document.getElementById('total-geral-val').innerHTML = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
}

// ── FINALIZAR WHATSAPP ───────────────────────────────────
window.finalizar = function() {
  const nome = document.getElementById('f-nome').value.trim();
  const endereco = document.getElementById('f-endereco').value.trim();
  const pagamento = document.getElementById('f-pagamento').value;
  const troco = document.getElementById('f-troco')?.value.trim();
  const obs = document.getElementById('f-obs').value.trim();
  
  let ok = true;
  if (!nome) { marcarErro('f-nome', 'err-nome', true); ok = false; }
  else { marcarErro('f-nome', 'err-nome', false); }
  
  if (!endereco) { marcarErro('f-endereco', 'err-endereco', true); ok = false; }
  else { marcarErro('f-endereco', 'err-endereco', false); }
  
  if (!bairroSelecionado) {
    document.getElementById('err-bairro')?.classList.add('visivel');
    ok = false;
  }
  
  if (!ok) { mostrarToast('⚠️ Preencha todos os campos obrigatórios'); return; }
  
  const totalPedido = carrinho.reduce((s, i) => s + (i.total || 0), 0);
  const totalGeral = totalPedido + bairroSelecionado.taxa;
  
  const dataHora = new Date().toLocaleString('pt-BR');
  
  let msg = `🍝 *PEDIDO — Cantinho das Massas*\n📅 ${dataHora}\n${'─'.repeat(30)}\n\n`;
  
  carrinho.forEach((item, idx) => {
    msg += `*📦 Item ${idx + 1}*\n`;
    
    if (item.itens?.length) {
      msg += `📌 ${item.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}\n`;
    }
    if (item.molho) msg += `🍅 Molho: ${item.molho.nome}\n`;
    if (item.proteina) msg += `🥩 Proteína: ${item.proteina.nome}\n`;
    if (item.adicionaisGratis?.length) {
      msg += `🎁 Grátis: ${item.adicionaisGratis.map(i => i.nome).join(', ')}\n`;
    }
    if (item.adicionaisPagos?.length) {
      msg += `🔥 Extras: ${item.adicionaisPagos.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}\n`;
    }
    msg += `💰 Subtotal: R$ ${(item.total || 0).toFixed(2).replace('.', ',')}\n${'─'.repeat(30)}\n\n`;
  });
  
  msg += `*👤 Cliente:* ${nome}\n*📍 Endereço:* ${endereco}\n*🛵 Bairro:* ${bairroSelecionado.nome}\n`;
  msg += `*💳 Pagamento:* ${pagamento}\n`;
  if (pagamento === 'Dinheiro' && troco) msg += `*💵 Troco para:* R$ ${Number(troco).toFixed(2).replace('.', ',')}\n`;
  if (obs) msg += `*📝 Obs:* ${obs}\n`;
  
  msg += `\n🛒 *Pedido:* R$ ${totalPedido.toFixed(2).replace('.', ',')}\n`;
  msg += `🛵 *Entrega:* R$ ${bairroSelecionado.taxa.toFixed(2).replace('.', ',')}\n`;
  msg += `🔥 *TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*`;
  
  const numero = (CARDAPIO.whatsapp || '').replace(/\D/g, '');
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ── VALIDAÇÃO ────────────────────────────────────────────
function marcarErro(inputId, errId, isErro) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.classList.toggle('erro', isErro);
  if (err) err.classList.toggle('visivel', isErro);
}

window.validarCampo = function(input, campo) {
  const val = input.value.trim();
  if (campo === 'nome') marcarErro('f-nome', 'err-nome', val.length < 2);
  if (campo === 'endereco') marcarErro('f-endereco', 'err-endereco', val.length < 5);
};

window.verificarTroco = function() {
  const pag = document.getElementById('f-pagamento').value;
  const grp = document.getElementById('troco-group');
  if (grp) grp.style.display = pag === 'Dinheiro' ? 'block' : 'none';
};

window.mascaraTel = function(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  input.value = v;
};

// ── CONTADORES ───────────────────────────────────────────
function atualizarContadorGratis() {
  const container = document.getElementById('lista-adicionais-gratis');
  if (!container) return;
  const selecionados = container.querySelectorAll('.card-op.selecionado').length;
  const el = document.getElementById('contador-gratis');
  if (el) el.textContent = `${selecionados} / 3 selecionados`;
  
  if (selecionados > 3) {
    mostrarToast('⚠️ Máximo de 3 adicionais grátis!');
  }
}

function atualizarContadorPago() {
  const container = document.getElementById('lista-adicionais-pagos');
  if (!container) return;
  let total = 0;
  container.querySelectorAll('.card-op').forEach(card => {
    const qtdSpan = card.querySelector('.qtd');
    if (qtdSpan) {
      total += parseInt(qtdSpan.innerText);
    }
  });
  const el = document.getElementById('contador-pagos');
  if (el) {
    if (total === 0) {
      el.textContent = 'Nenhum adicional selecionado';
    } else {
      el.textContent = `${total} adicional(is) — +R$ ${(total * 2).toFixed(2).replace('.', ',')}`;
    }
  }
}

// ── TOAST ────────────────────────────────────────────────
let _toastTimer = null;
function mostrarToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}