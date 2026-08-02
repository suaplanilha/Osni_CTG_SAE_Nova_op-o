# Osni_CTG_SAE_Nova_op-o
desenvolvimento de uma segunda versão para o Jogos

SAE - Sistema de Acompanhamento Esportivo (Jogos Tradicionalistas Gaúchos)

O SAE - JTG é um sistema web responsivo e integrado para gestão de inscrições e preenchimento de súmulas oficiais dos Jogos Tradicionalistas Gaúchos, padronizado conforme os regulamentos do MTG (Movimento Tradicionalista Gaúcho) e da CBTG (Confederação Brasileira da Tradição Gaúcha).
O sitema tem por objetivo principal cadastrar competidores/equipes e demais por eventos, armazenar dados, contabilziar pontuações, ranquiar os competidores por modalidades/atletas/geral por equipes/piquetes.
O usuario deverá ter controle e flexibildiades nos lançamentos dos dados, onde se cadastre, edite e eventualmente utilize o excluir / reset quando necessários. 
O sistema deverá ser confiavel e auxiliar o usuario a minimizar erros. Trazendo um gestão confiavel e agil. 


🚀 Funcionalidades Desenvolvidas

1. Gestão e Inscrição de Equipes / Piquetes

Formulário Completo: Cadastro da entidade/piquete, nome do Capataz responsável e lista de até 5 atletas titulares e reservas.

Persistência de Dados: Armazenamento automático via localStorage no navegador.

Proteção contra Duplo Clique: Trava no botão de envio para evitar registros duplicados.

Tabela Dinâmica: Visualização instantânea das equipes cadastradas com opção de remoção individual.

2. Súmulas Oficiais das Modalidades (6 Oficializadas)

Todas as súmulas contam com interface modal própria, cálculo automático de pontos e formatação otimizada para impressão física em papel.

Tava

Lançamento de 10 arremessos por atleta divididos em duas etapas (1ª a 5ª e 6ª a 10ª rodada).

Suporte a pontuações oficiais ($2, 1, 0, -1, -2$).

Totalização automática por atleta e Total Geral da Equipe.

Bocha Campeira (Modalidade Trio)

Marcação de pontos partida a partida (escala de 1 a 12 pontos).

Identificação de cores de bochas por equipe.

Registro de substituições (atleta que entrou e saiu).

Campo para observações e parecer da arbitragem.

Tetarfe (Tejo, Tava, Argola e Ferradura)

Súmula integrada para 4 atletas por equipe.

Detalhamento de arremessos individuais por jogo:

Tejo: 10 fichas (pontuação $5, 4, 3, 2, -1$).

Tava: 4 arremessos ($2, 1, 0, -1, -2$).

Argola: 3 arremessos ($5, 3, 1$).

Ferradura: 3 arremessos ($5, 3, 2$).

Quadro resumo com soma automática por atleta e Total Geral da Equipe.

Truco de Amostra (Modalidade Trio)

Registro de pontuações de até 3 partidas por confronto.

Soma de tentos marcados automatizada.

Bloco de encerramento com dados do Trio Vencedor e Trio Perdedor.

Truco Cego (Modalidade Trio)

Estrutura análoga à súmula de Truco de Amostra adaptada para as regras do Truco Cego.

Controles de tentos por rodada e assinaturas dos capatazes e árbitros.

Bocha 48 (Modalidade Dupla)

Controle de arremessos divididos em duas séries (8 jogadas por atleta).

Legenda guia de pontuações (Frente = 2, Esquerda = 4, Direita = 6, Atrás = 8, Bolim = 12).

Cálculo automático por atleta, por dupla e comparativo do confronto.

🛠️ Recursos de Interface e Usabilidade (UI/UX)

Layout Responsivo: Sidebar lateral adaptável com suporte a menu gaveta em dispositivos móveis.

Visual Tradicionalista: Identidade visual construída com as cores símbolo da bandeira gaúcha (Verde #008751, Amarelo #FDB813 e Vermelho #BC2C2D).

Navegação Dinâmica (SPA): Transição suave entre seções sem recarregamento de página.

Notificações em Toast: Avisos visuais ao salvar inscrições, gravar súmulas ou remover registros.

Pronto para Impressão (@media print): Esconde elementos de menu e botões de navegação, ajustando a súmula em folha A4 com bordas e linhas oficiais.

💻 Tecnologias Utilizadas

HTML5: Semântica completa de formulários, tabelas e janelas modais.

Tailwind CSS: Estilização moderna e utilitária via CDN.

FontAwesome 6: Ícone temáticos para todas as modalidades e ações do sistema.

Vanilla JavaScript (ES6+): Lógica sem dependências externas, responsável pelo cálculo matemático de pontos, manipulação do DOM e controle do localStorage.

Proximos passos desenvolver regras de negocios. 
criar tabelas/entidades
Melhoriar <style>
corrigir erros
desenvolver backend e contratos e regras dos negocios e demais features necessarias. 
