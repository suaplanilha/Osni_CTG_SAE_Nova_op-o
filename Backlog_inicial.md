Backlog inicial de desenvolvimento do SAE
As diretrizes estão aprovadas e consolidadas. O desenvolvimento começará pelo frontend, preservando temporariamente as estruturas e os cálculos que já existem nas seis modalidades. O backend GAS e a persistência no Google Sheets somente serão iniciados depois da validação visual e operacional do frontend.

O backlog abaixo está organizado em ordem de execução. Cada task deve resultar em uma entrega verificável antes do início da seguinte.

Fase 1 — Fundação visual e arquitetura frontend
T01 — Migrar o frontend para Vue 3 via CDN
Objetivo: estabelecer a arquitetura frontend obrigatória do SAE sem bundler e sem backend externo.

Escopo:

Adicionar Vue 3 via CDN.

Criar uma única instância Vue para controlar a aplicação.

Migrar o estado global atualmente mantido em variáveis e manipulação direta do DOM.

Substituir gradualmente:

onclick.

onsubmit.

onchange.

document.getElementById.

document.querySelectorAll.

document.write.

Montagem de HTML por innerHTML.

Organizar o JavaScript single-file em blocos claros:

Estado.

Constantes.

Dados temporários.

Navegação.

Modais e drawers.

Formulários.

Cálculos.

Tabelas.

Serviços futuros.

Preservar os cálculos e campos atuais durante a migração.

A implementação atual depende intensamente de eventos inline e manipulação imperativa do DOM. 

Critérios de aceite:

Vue 3 funcionando via CDN.

Aplicação abrindo normalmente pelo HtmlService.

Navegação controlada por estado Vue.

Nenhum bundler, JSX, React ou Babel.

Nenhuma integração com backend nesta task.

Cálculos existentes continuam funcionando.

Console do navegador sem erros.

T02 — Implementar o design system SAE
Objetivo: criar a identidade visual oficial do SAE em padrão dark glassmorphism.

Escopo:

Definir tokens visuais para:

Fundo principal.

Superfícies glass.

Bordas translúcidas.

Sombras.

Tipografia.

Espaçamentos.

Estados de foco.

Cores semânticas.

Criar padrões reutilizáveis:

Glass Card.

Glass Sidebar.

Glass Header.

Glass Modal.

Glass Drawer.

Glass List.

Botões.

Inputs.

Selects.

Textareas.

Badges.

Toasts.

Estados vazios.

Skeleton loading.

Loader estilo Google.

Manter as cores das modalidades como acentos visuais.

Preservar contraste adequado para leitura e operação.

Aplicar animações leves e objetivas.

Padronizar o nome oficial do sistema como:

CTG Rodeio dos Palmares.

O frontend atual possui um tema predominantemente claro e utiliza as cores tradicionalistas e das modalidades diretamente nos elementos. 

Critérios de aceite:

Identidade dark glass consistente.

Nome oficial padronizado.

Cores particulares das modalidades preservadas.

Layout legível em celular, tablet e desktop.

Foco de teclado visível.

Sem animações excessivas.

Sem alteração das regras esportivas.

T03 — Criar o shell responsivo da aplicação
Objetivo: implementar a estrutura permanente de navegação do SAE.

Escopo:

Sidebar desktop.

Drawer de navegação mobile.

Header principal.

Identificação do evento atual.

Área principal de conteúdo.

Breadcrumb ou título contextual simples.

Menu organizado em:

Dashboard.

Cadastros.

Inscrições.

Modalidades.

Rankings.

Configurações.

Estado ativo da navegação.

Comportamento responsivo.

Área global para toast, modal e loader.

A aplicação já possui sidebar, overlay mobile e header, mas esses componentes ainda são controlados por manipulação direta de classes. 

Critérios de aceite:

Navegação funcionando com Vue.

Menu mobile abre e fecha corretamente.

Conteúdo não fica inacessível em telas pequenas.

Header mantém o nome oficial.

Todas as áreas planejadas ficam acessíveis.

As modalidades continuam livres, sem bloqueios.

Fase 2 — Dashboard e componentes operacionais
T04 — Construir o Dashboard do evento atual
Objetivo: oferecer uma visão rápida da operação sem criar regras de backend.

Escopo:

Cabeçalho do evento atual.

Cards de indicadores:

Quantidade de piquetes.

Quantidade de atletas.

Quantidade de inscrições.

Quantidade de súmulas lançadas.

Atalhos para:

Novo piquete.

Novo atleta.

Nova inscrição.

Abrir modalidades.

Ranking por modalidade.

Ranking geral.

Lista opcional de lançamentos recentes.

Estado vazio para evento sem dados.

Skeletons para a futura leitura do backend.

Dados temporários ou derivados do estado local durante a etapa frontend.

Critérios de aceite:

Dashboard mobile-first.

Indicadores reativos.

Atalhos funcionais.

Estados vazio, carregando e preenchido representados.

Nenhum número fixo apresentado como dado real.

T05 — Criar os componentes reutilizáveis de Overlay
Objetivo: estabelecer o padrão que será utilizado pelos cadastros, inscrições e súmulas.

Escopo:

Componente de Modal central.

Componente de Drawer lateral ou inferior.

Cabeçalho do overlay.

Área rolável de conteúdo.

Rodapé fixo opcional com ações.

Botões:

Salvar.

Cancelar.

Fechar.

Fechamento por:

Botão.

Tecla Escape.

Clique no backdrop, quando seguro.

Bloqueio do scroll da página enquanto aberto.

Confirmação quando houver formulário alterado, sem criar bloqueios excessivos.

Tratamento de loading.

Tratamento de erro.

Responsividade:

Drawer ou tela quase completa em celular.

Modal ou drawer dimensionado em desktop.

Critérios de aceite:

Componente reutilizado em pelo menos um fluxo piloto.

Foco inicial e fechamento por teclado funcionando.

Conteúdo extenso rolável.

Botões importantes acessíveis no celular.

Formulário não fecha acidentalmente durante salvamento.

T06 — Criar tabelas e listas operacionais padronizadas
Objetivo: definir como os dados serão visualizados após o fechamento dos formulários.

Escopo:

Tabela responsiva para desktop.

Lista ou cards adaptados para celular.

Cabeçalho com:

Título.

Quantidade de registros.

Busca futura ou local.

Botão de novo lançamento.

Coluna de ações:

Visualizar.

Editar.

Excluir.

Imprimir, quando aplicável.

Estado vazio.

Skeleton.

Feedback de carregamento.

Confirmação simples para exclusão.

Paginação apenas se realmente necessária depois.

A tabela atual de piquetes já oferece uma referência básica de listagem e exclusão, mas ainda é montada com innerHTML e não possui edição. 

Critérios de aceite:

Visualização confortável em celular.

Ações claramente identificadas.

Exclusão exige confirmação objetiva.

Edição abre o mesmo overlay utilizado para cadastro.

Sem duplicação de componentes entre áreas.

Fase 3 — Cadastros e inscrições
T07 — Reorganizar o cadastro de piquetes/entidades
Objetivo: separar o cadastro da entidade da composição fixa atual de atletas.

Escopo frontend:

Tela de resumo dos piquetes.

Botão “Novo piquete”.

Formulário em Modal ou Drawer.

Campos essenciais:

Nome da entidade/piquete.

Nome do capataz.

Dados adicionais somente se forem realmente necessários.

Ações:

Criar.

Editar.

Excluir.

Indicador da quantidade de atletas vinculados.

Estado local temporário até o backend.

Confirmação simples de exclusão.

Atualmente piquete, capataz e até cinco atletas são cadastrados no mesmo formulário. 

Critérios de aceite:

Cadastro abre em overlay.

Tabela permanece visível como contexto principal.

Criação e edição usam o mesmo formulário.

Exclusão atualiza o resumo.

Nenhuma limitação arbitrária de cinco atletas no cadastro da entidade.

T08 — Criar o cadastro independente de atletas
Objetivo: permitir o reaproveitamento dos atletas em inscrições e equipes.

Escopo frontend:

Tabela/lista de atletas.

Formulário em overlay.

Vínculo obrigatório com piquete/entidade.

Campos iniciais:

Nome completo.

Entidade/piquete.

Observação opcional, se necessária.

Status simples, somente se houver utilidade.

Busca local por nome.

Filtro por piquete.

Ações de editar e excluir.

Indicação futura de vínculos existentes.

Critérios de aceite:

Atleta cadastrado separadamente.

Seleção de piquete funcionando.

Mesmo atleta disponível para futuras composições.

Busca e filtro funcionando no estado local.

Sem duplicação automática de nomes nas equipes.

T09 — Criar o fluxo de equipes e composições
Objetivo: permitir montar atletas conforme a modalidade.

Escopo frontend:

Seleção da modalidade.

Seleção da entidade/piquete.

Seleção de atletas já cadastrados.

Composição adaptável para:

Individual.

Dupla.

Trio.

Equipe.

Reservas, quando aplicável.

Nome ou identificação da equipe quando necessário.

Resumo dos componentes.

Edição e exclusão.

Validação apenas da composição mínima conhecida.

Importante: as quantidades e regras definitivas dependerão das regras oficiais que ainda serão fornecidas.

Critérios de aceite:

Nenhuma digitação duplicada de atleta.

Atletas filtrados pelo piquete selecionado.

Estrutura preparada para diferentes composições.

Sem inventar limites não aprovados.

Composição pode ser corrigida.

T10 — Criar a área de inscrições por modalidade
Objetivo: relacionar os cadastros às modalidades que alimentarão as súmulas.

Escopo frontend:

Lista das inscrições.

Filtros por modalidade e piquete.

Formulário em overlay.

Seleção de:

Modalidade.

Piquete.

Atleta ou composição.

Resumo da inscrição.

Ações de editar e excluir.

Indicador de disponibilidade para as súmulas.

Estado local temporário.

Critérios de aceite:

Inscrição utiliza dados já cadastrados.

Nenhum nome precisa ser digitado novamente.

Todas as modalidades ficam disponíveis.

Inscrição aparece no resumo da modalidade correspondente.

Fluxo permanece flexível para correções.

Fase 4 — Padronização e reorganização das súmulas
T11 — Padronizar o cabeçalho oficial das seis súmulas
Objetivo: unificar os títulos sem remover a identidade particular de cada modalidade.

Modelo obrigatório:

CONFEDERAÇÃO BRASILEIRA DA TRADIÇÃO GAÚCHA - CBTG
DEPARTAMENTO DE ESPORTES - JOGOS TRADICIONALISTAS
CTG Rodeio dos Palmares
SÚMULA DO JOGO DE [MODALIDADE] — [COMPLEMENTO DA MODALIDADE]

Aplicar em:

Tava.

Bocha Campeira.

Tetarfe.

Truco de Amostra.

Truco Cego.

Bocha 48.

Hoje existem diferenças entre os cabeçalhos. A Tava, por exemplo, começa diretamente com “Jogos Tradicionalista Gaúcho” e “CTG Rodeio dos Palmares”.  Já o Truco Cego utiliza o cabeçalho CBTG e Departamento de Esportes, mas ainda precisa receber a linha institucional padronizada do CTG. 

Preservar:

Cor específica da modalidade.

Estrutura específica dos campos.

Tabelas particulares.

Identidade visual particular.

Regras e cálculos existentes.

Critérios de aceite:

Todas as súmulas possuem as quatro linhas padronizadas.

Alinhamento visual idêntico.

Tipografia e espaçamento consistentes.

Nome oficial escrito exatamente como CTG Rodeio dos Palmares.

Nome e complemento específicos da modalidade preservados.

Cabeçalho funciona na tela e na impressão.

T12 — Criar o padrão de página para cada modalidade
Objetivo: retirar o formulário extenso do fluxo principal e apresentar primeiro um resumo dos lançamentos.

Estrutura de cada página:

Header da modalidade.

Cards resumidos opcionais.

Botão “Nova súmula”.

Tabela/lista das súmulas lançadas.

Coluna de ações:

Visualizar.

Editar.

Imprimir.

Excluir.

Formulário completo dentro de Modal ou Drawer.

Colunas mínimas sugeridas:

Data.

Identificação da disputa.

Piquete/equipe A.

Piquete/equipe B, quando houver.

Resultado ou pontuação.

Situação.

Ações.

As colunas deverão variar quando a modalidade não for um confronto direto.

Critérios de aceite:

Ao entrar em uma modalidade, o usuário visualiza primeiro os lançamentos.

Formulário abre apenas quando solicitado.

Edição abre o formulário preenchido.

Exclusão exige confirmação.

Impressão apresenta somente a súmula.

Estrutura funciona bem em celular.

T13 — Converter a Súmula de Tava para o novo padrão
Escopo:

Lista de lançamentos.

Overlay da súmula.

Seleção assistida dos inscritos.

Preservação dos dez arremessos por atleta.

Preservação dos cálculos individuais e geral.

Cabeçalho oficial padronizado.

Ações de editar, excluir e imprimir.

A estrutura atual possui quatro atletas, duas etapas e total geral. 

T14 — Converter a Súmula de Bocha Campeira
Escopo:

Lista de confrontos.

Overlay da súmula.

Seleção assistida dos trios.

Preservação de cores das bochas.

Preservação das substituições.

Observações e arbitragem.

Cabeçalho oficial.

Ações de editar, excluir e imprimir.

T15 — Converter a Súmula de Tetarfe
Escopo:

Lista de lançamentos.

Overlay da súmula.

Seleção assistida de equipe e atletas.

Preservação das quatro provas:

Tejo.

Tava.

Argola.

Ferradura.

Preservação dos totais por prova, atleta e equipe.

Cabeçalho oficial.

Ações de editar, excluir e imprimir.

O cálculo atual já separa os totais das quatro provas e gera o total da equipe. 

T16 — Converter a Súmula de Truco de Amostra
Escopo:

Lista de confrontos.

Overlay da súmula.

Seleção assistida dos trios.

Preservação das três partidas.

Soma dos tentos.

Campos de vencedor e perdedor.

Cabeçalho oficial.

Ações de editar, excluir e imprimir.

A interface atual já prevê três partidas e os blocos de vencedor e perdedor. 

T17 — Converter a Súmula de Truco Cego
Escopo:

Mesmo padrão operacional do Truco de Amostra.

Identidade azul preservada.

Título oficial:

SÚMULA DO JOGO DE TRUCO CEGO - Modalidade - TRIO

Lista de confrontos.

Overlay.

Edição.

Exclusão.

Impressão.

O título de modalidade informado já está presente na interface atual e deverá ser incorporado ao cabeçalho institucional padronizado. 

T18 — Converter a Súmula de Bocha 48
Escopo:

Lista de confrontos.

Overlay da súmula.

Seleção assistida das duplas.

Preservação dos oito lançamentos.

Preservação dos totais por atleta e dupla.

Cabeçalho oficial.

Ações de editar, excluir e imprimir.

O cálculo atual totaliza os dois atletas e depois produz o total de cada dupla. 

Fase 5 — Rankings e configurações
T19 — Criar a interface do Ranking por Modalidade
Objetivo: preparar a visualização sem inventar regras oficiais.

Escopo:

Seletor de modalidade.

Tabela de classificação.

Posição.

Participante ou equipe.

Entidade/piquete.

Pontuação ou resultado.

Critério adicional quando aplicável.

Estado vazio.

Aviso visual enquanto a regra definitiva não estiver configurada.

Dados mockados claramente identificados apenas durante o desenvolvimento, se necessários.

Critérios de aceite:

Troca de modalidade funciona.

Estrutura suporta indivíduo, dupla, trio e equipe.

Nenhuma fórmula esportiva não aprovada é apresentada como oficial.

Layout responsivo.

T20 — Criar a interface do Ranking Geral
Objetivo: preparar a consolidação por piquete sem definir prematuramente a fórmula.

Escopo:

Posição geral.

Piquete/entidade.

Modalidades disputadas.

Resultados considerados.

Pontuação geral.

Visualização detalhada por modalidade.

Estado vazio.

Indicação clara de que a pontuação dependerá das regras oficiais.

Critérios de aceite:

Visual consistente com o ranking por modalidade.

Detalhamento abre em overlay.

Sem soma arbitrária dos valores brutos das súmulas.

Preparado para receber a fórmula futura.

T21 — Criar Configurações do evento atual
Objetivo: centralizar as informações mínimas do evento.

Escopo frontend:

Nome oficial do sistema:

CTG Rodeio dos Palmares.

Nome ou edição do evento atual, se diferente.

Local.

Período.

Informações organizacionais essenciais.

Preferências mínimas de impressão.

Área separada para reset geral.

Critérios de aceite:

Formulário simples.

Sem excesso de parâmetros.

Alterações refletidas no frontend.

Estrutura pronta para persistência futura.

T22 — Criar o fluxo visual de reset geral
Objetivo: permitir finalizar o evento e limpar os dados sem risco de clique acidental.

Escopo frontend:

Área de perigo visualmente separada.

Explicação do que será removido.

Resumo das quantidades afetadas.

Confirmação explícita.

Estado de processamento.

Feedback de sucesso ou erro.

Nenhuma execução real no Google Sheets até o backend existir.

Critérios de aceite:

Reset não pode acontecer por um único clique.

Confirmação é clara, mas não burocrática.

Fluxo acessível em celular.

O usuário entende que a ação encerra os dados do evento atual.

Fase 6 — PWA, impressão e validação
T23 — Completar a camada PWA
Objetivo: transformar a intenção existente em uma experiência PWA funcional.

Escopo:

Conectar o manifesto ao frontend.

Registrar o service worker.

Definir estratégia compatível com o WebApp GAS.

Criar ícones adequados.

Tratar indisponibilidade de rede.

Não prometer salvamento offline antes de existir sincronização confiável.

Revisar start_url, escopo e comportamento no WebApp publicado.

O backend já possui respostas iniciais para manifesto e service worker, mas elas ainda não estão conectadas pelo frontend. 

Critérios de aceite:

Manifesto detectado pelo navegador.

Service worker registrado sem erro.

Aplicação instalável quando o ambiente GAS permitir.

Falhas de rede informadas corretamente.

Nenhum dado apresentado como salvo quando a gravação não ocorreu.

T24 — Revisar a impressão das súmulas
Objetivo: garantir que o uso de overlays não prejudique a impressão.

Escopo:

Imprimir apenas a súmula selecionada.

Ocultar:

Sidebar.

Header da aplicação.

Backdrop.

Botões.

Tabela de resumos.

Preservar o cabeçalho institucional.

Ajustar para A4.

Evitar cortes ruins de tabelas e assinaturas.

Testar as seis modalidades.

A aplicação já possui regras iniciais de impressão por .no-print e .print-area, que servirão como base. 

Critérios de aceite:

Cada súmula imprime isoladamente.

Cabeçalho padronizado aparece.

Campos e totais permanecem legíveis.

Nenhum elemento do overlay aparece indevidamente.

Resultado validado nas seis modalidades.

T25 — Auditoria técnica do frontend
Objetivo: concluir o frontend antes de iniciar o backend.

Escopo:

Validar Vue 3.

Validar navegação.

Validar overlays.

Validar formulários.

Validar tabelas.

Validar ações de edição e exclusão.

Validar cálculos existentes.

Validar rankings como estrutura visual.

Validar reset como fluxo visual.

Validar mobile.

Validar desktop.

Validar impressão.

Validar PWA.

Revisar mensagens e ortografia.

Eliminar mensagens de sucesso falsas.

A mensagem atual de salvamento de súmula é exibida sem persistência real; esse comportamento não poderá permanecer como confirmação definitiva. 

Critérios de aceite:

Console sem erros.

Nenhum botão sem ação prevista.

Nenhuma confirmação falsa de persistência.

Todos os fluxos utilizáveis por toque.

Cálculos preservados.

Interface aprovada antes do backend.

Fase 7 — Próxima etapa futura: backend
T26 — Especificar o contrato frontend/GAS
Esta task somente começará após a aprovação do frontend.

Ela definirá:

Respostas padronizadas.

Métodos chamados por google.script.run.

DTOs.

UUIDs.

Datas ISO.

Tratamento de erro.

Loading.

CRUD.

Auditoria básica.

Reset geral.

T27 — Modelar as abas do Google Sheets
Estrutura inicial candidata:

CONFIGURACAO

PIQUETES

ATLETAS

EQUIPES

INSCRICOES

SUMULAS

RESULTADOS

AUDITORIA

A modelagem definitiva dependerá das regras oficiais fornecidas durante a evolução.

T28 — Implementar um fluxo vertical completo no backend
Ordem proposta:

Configuração do evento atual.

Piquetes.

Atletas.

Equipes/composições.

Inscrições.

Uma modalidade piloto.

Resultado.

Ranking da modalidade.

Ranking geral.

Reset.

Ordem imediata de execução
As primeiras tasks de codificação deverão ser:

T01 — Vue 3 via CDN.

T02 — Design system SAE.

T03 — Shell responsivo.

T04 — Dashboard.

T05 — Componentes de overlay.

T06 — Tabelas e listas.

Depois dessa fundação, os cadastros e as seis modalidades poderão ser migrados sem repetir estruturas e estilos.

Definição de pronto da etapa frontend
O frontend estará pronto para receber o backend quando:

Estiver integralmente controlado por Vue 3.

Possuir identidade SAE consistente.

Funcionar bem em celular e desktop.

Cadastros abrirem em overlays.

Súmulas abrirem em overlays.

Cada área possuir tabela-resumo e coluna de ações.

Os seis cabeçalhos estiverem padronizados.

Os cálculos atuais estiverem preservados.

Ranking por modalidade e ranking geral tiverem interfaces definidas.

Configuração e reset estiverem visualmente definidos.

Impressão funcionar.

Não houver mensagens falsas de persistência.

O frontend estiver aprovado pelo usuário.

Nenhuma regra de classificação, desempate ou pontuação geral será inventada durante essas tasks.
