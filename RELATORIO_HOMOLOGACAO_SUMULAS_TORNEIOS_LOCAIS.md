# Relatório de cruzamento e homologação das súmulas

## 1. Escopo aprovado para o produto

O sistema será uma planilha com interface de sistema em Google Apps Script para **torneios locais**. Não tentará administrar federação, arbitragem completa, congresso técnico, indumentária, penalidades ou todas as jogadas internas.

O usuário fará quatro operações principais:

1. lançar manualmente os dados finais ou consolidados da súmula;
2. editar um lançamento;
3. excluir/cancelar um lançamento;
4. consultar rankings atualizados.

O sistema deverá calcular:

- resultado da súmula;
- vencedor quando a modalidade permitir;
- ranking individual quando a súmula atribuir pontos ao atleta;
- ranking da equipe dentro da modalidade;
- ranking geral da entidade/CTG no torneio.

### Princípio de simplicidade

O sistema deve emitir **avisos**, não bloqueios rígidos, para valores fora do padrão. O lançamento será salvo com um estado:

- `VALIDO`: segue as regras homologadas;
- `COM_ALERTA`: valor incomum, incompleto ou divergente, mas aceito pelo usuário;
- `CANCELADO`: excluído logicamente e retirado dos rankings.

Exclusão física não é recomendada. O botão “Excluir” deve cancelar o registro e manter o histórico para permitir correção de ranking e auditoria mínima.

---

# 2. Conclusão executiva

| Súmula recebida | Situação | Ranking individual | Ranking de equipe/entidade | Decisão | |---|---|---:|---:|---|
| TETARFE | Diverge do regulamento na Argola | Sim | Sim | Homologável após escolher a tabela de Argola |
| Tava | Registra 10 tiros; regulamento prevê 20 | Sim | Sim | Homologável após escolher 10 ou 20 tiros |
| Bocha 48 | Estrutura compatível | Sim | Sim | Homologável com pequenos ajustes |
| Bocha Campeira | Compatível para confronto | Não por pontos | Sim | Homologável para equipes; atleta só por participação |
| Truco de Amostra | Compatível com 30 tentos e regra dos 90 | Não por pontos | Sim | Homologável |
| Truco Cego | Compatível com 30 tentos e regra dos 90 | Não por pontos | Sim | Homologável | 

## Descoberta crítica

Os arquivos `SUMULA TRUCO CEGO` e `SUMULA TRUCO DE AMOSTRA` são **idênticos**. Ambos têm a regra de 90 tentos. 

---

# 3. Regra do ranking geral das entidades

## 3.1 O que não pode ser feito

Não se deve somar os pontos brutos das modalidades. Um tento de Truco, um ponto de TETARFE e um ponto de Bocha Campeira não representam a mesma coisa.

Exemplo: Bocha Campeira termina em 12; um atleta de TETARFE pode ultrapassar 80. Somar isso colocaria uma modalidade acima das outras por escala, não por desempenho.

## 3.2 Modelo recomendado

O ranking geral da entidade deve usar **pontos de colocação**, aplicados ao resultado final de cada modalidade:

| Colocação | Pontos gerais sugeridos |
|---:|---:|
| 1º | 12 |
| 2º | 9 |
| 3º | 6 |
| 4º | 3 |

Para torneio local, pode ser armazenado numa aba `CONFIG_RANKING`, permitindo mudar os valores sem alterar código.

```text
pontos_gerais_entidade = soma dos pontos de colocacao
```

### Desempate geral sugerido

1. Maior número de primeiros lugares.
2. Maior número de segundos lugares.
3. Maior número de terceiros lugares.
4. Maior número de modalidades com participação válida.
5. Empate mantido ou decisão manual da organização.

Não usar soma de pontos brutos dos jogos como desempate geral.

---

# 4. Relatório de homologação — TETARFE

## 4.1 O que a súmula registra

- MTG/Federação;
- nome/número da equipe;
- até 4 atletas;
- para cada atleta:
  - 10 resultados de Tejo;
  - 4 resultados de Tava;
  - 3 resultados de Argola;
  - 3 resultados de Ferradura;
  - subtotal por prova;
  - total geral individual;
- total dos quatro atletas;
- total da equipe;
- local, data e responsáveis.

## 4.2 Cruzamento com o regulamento

| Item | Regulamento MTG/RS 2025 | Súmula | Resultado | |---|---|---|---|
| Atletas | Equipe com 4; somam-se os 3 melhores | 4 atletas | Compatível |
| Tejo | 10 lançamentos | 10 campos | Compatível |
| Tava | 4 tiros | 4 campos | Compatível |
| Argola | 3 argolas | 3 campos | Compatível na quantidade |
| Ferradura | 3 lançamentos | 3 campos | Compatível |
| Total individual | Soma das quatro provas | Campo Total Geral | Compatível |
| Total coletivo | 3 maiores resultados | Súmula não explica o descarte | Precisa automatizar |

## 4.3 pontuação da Argola

| Arremesso | Rodapé da súmula CBTG ||---|---:|---:|
| Argola menor | 5 |
| Argola média | 3 |
| Argola maior | 1 |
| Máximo | 8 |

## 4.4 Dados mínimos do lançamento

### Cabeçalho

- `evento_id`
- `data`
- `entidade_id`
- `equipe_id`
- `numero_sumula`

### Por atleta

- `atleta_id`
- `tejo_1` a `tejo_10`
- `tava_1` a `tava_4`
- `argola_1` a `argola_3`
- `ferradura_1` a `ferradura_3`

## 4.5 Cálculos

```text
total_tejo = soma(tejo_1 ... tejo_10)
total_tava = soma(tava_1 ... tava_4)
total_argola = soma(argola_1 ... argola_3)
total_ferradura = soma(ferradura_1 ... ferradura_3)

total_atleta = total_tejo + total_tava + total_argola + total_ferradura
total_equipe = soma dos 3 maiores total_atleta
```

O quarto resultado permanece no ranking individual, mas é descartado somente do total coletivo.

## 4.6 Rankings possíveis

- Individual do TETARFE: ordenar `total_atleta` do maior para o menor.
- Equipes do TETARFE: ordenar `total_equipe` do maior para o menor.
- Entidade: recebe pontos gerais conforme colocação final da equipe.

## 4.7 Alertas flexíveis

- quantidade diferente de 10/4/3/3 lançamentos;
- resultado não pertencente à tabela homologada;
- atleta duplicado na mesma equipe;
- menos de 3 atletas: válido apenas para ranking individual;
- soma digitada divergente da soma calculada.

## 4.8 Status de homologação

**HOMOLOGÁVEL COM DECISÃO .** tabela única para Argola:

- `SUMULA_CBTG`: 5, 3 e 1.

---

# 5. Relatório de homologação — Tava

## 5.1 O que a súmula registra

- número e equipe;
- 4 atletas;
- nome de cada atleta;
- 10 resultados por atleta, divididos visualmente em 5 + 5;
- total individual;
- total geral da equipe;
- valores aceitos indicados: `2`, `1`, `0`, `-1`, `-2`.

## 5.2 Cruzamento com o regulamento

| Item | Regulamento MTG/RS 2025 | Súmula local | Resultado |
|---|---|---|---|
| Equipe | 3 a 4 atletas | 4 linhas | Compatível |
| Tiros por atleta | 20: 10 em cada cabeceira | 10: 5 em cada cabeceira | Divergente |
| Pontos possíveis | +2, +1, 0, -1, -2 | 2, 1, 0, -1, -2 | Compatível |
| Resultado coletivo | Soma das 3 maiores pontuações | Total Geral sem regra de descarte | Precisa automatizar |
| Individual | Todos concorrem | Total por atleta | Compatível |

## 5.3 Dados mínimos

- `evento_id`
- `data`
- `entidade_id`
- `equipe_id`
- `numero_sumula`
- para cada atleta:
  - `atleta_id`
  - `tiro_1` a `tiro_N`, sendo `N` configurável em 10 ou 20.

## 5.4 Cálculos

```text
total_atleta = soma dos tiros do atleta
total_equipe = soma dos 3 maiores totais individuais
```

Para desempate do regulamento, apenas guardar `2`, `1`, `-1` e `-2` não identifica se o ponto decorreu de sorte/culo e clavada/corrida? Na prática identifica pelo sinal e valor:

- `2` = sorte clavada;
- `1` = sorte corrida;
- `-2` = culo clavado;
- `-1` = culo corrido;
- `0` = jura, sorte fora ou outro tiro sem pontuação.

O zero não precisa ser detalhado para ranking, porque todas as hipóteses valem zero e consomem o tiro.

## 5.5 Ranking e desempate

### Individual

1. Maior total.
2. Maior quantidade de `2`.
3. Maior quantidade de `1`.
4. Menor quantidade de `-2`.
5. Menor quantidade de `-1`.
6. Empate mantido ou desempate manual.

### Equipe

Aplicar os mesmos critérios sobre a soma dos 3 atletas considerados no resultado coletivo.

## 5.6 Status de homologação

**HOMOLOGÁVEL COM DECISÃO PENDENTE.** Para torneio local, o sistema pode aceitar:

- `TAVA_CURTA_10`: 10 tiros, conforme a súmula; ou
- `TAVA_REGULAMENTO_20`: 20 tiros, conforme o MTG/RS.

O modo deve ser escolhido ao criar o torneio. Misturar equipes com 10 e 20 tiros no mesmo ranking é proibido matematicamente, porque destrói a comparabilidade.

---

# 6. Relatório de homologação — Bocha 48

## 6.1 O que a súmula registra

- fase e número do jogo;
- duas entidades/CTGs adversárias;
- identificação de cada dupla;
- 2 atletas por dupla;
- 8 arremessos por atleta, em duas séries de 4;
- total individual;
- total da dupla;
- vencedora e perdedora.

## 6.2 Cruzamento com o regulamento

| Item | Regulamento | Súmula | Resultado |---|---|---|---|
| Formação | Dupla | 2 atletas | Compatível |
| Arremessos | 8 por atleta, 2 séries de 4 | 8 campos | Compatível |
| Alvos | 2, 4, 6, 8 e 12 | Mesmos valores | Compatível |
| Resultado | Soma da dupla | Total Geral | Compatível |
| Desempate | 1 arremesso extra por atleta, repetindo se necessário | Sem campos extras | Incompleto |

## 6.3 Dados mínimos

- `evento_id`, `fase`, `jogo_numero`, `data`;
- `entidade_a_id`, `equipe_a_id`;
- `entidade_b_id`, `equipe_b_id`;
- para cada atleta: `arremesso_1` a `arremesso_8`;
- lista opcional de arremessos de desempate.

## 6.4 Regra do valor digitado

Um arremesso pode derrubar mais de um alvo. Portanto, o campo não deve aceitar apenas `2`, `4`, `6`, `8` ou `12`; deve aceitar a **soma dos alvos derrubados**. Os totais possíveis são `0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 ou 32`.

Exemplos válidos:

- frente + esquerda = 6;
- trás + balim = 20;
- todos os alvos = 32.

Como algumas combinações geram o mesmo total, o sistema não precisa saber quais peças caíram para calcular ranking. Basta o valor consolidado da súmula. Valor ímpar deve gerar alerta, pois não pode resultar da soma dos cinco alvos.

## 6.5 Cálculos e rankings

```text
total_atleta = soma dos 8 arremessos normais
total_dupla = total_atleta_1 + total_atleta_2
vencedora = maior total_dupla, após desempates se houver
```

- Ranking individual: total acumulado dos atletas, preferencialmente acompanhado por média por súmula.
- Ranking de duplas: vitórias, depois pontuação acumulada ou média, conforme regra do torneio.
- Ranking da modalidade por fase classificatória: maior total acumulado da dupla, quando o formato for por pontuação.

## 6.6 Ajuste necessário na tela

Adicionar seção repetível `Desempate`, com 1 arremesso por atleta a cada série extra. Não é necessário redesenhar toda a súmula.

## 6.7 Status de homologação

**HOMOLOGADA COM AJUSTE PEQUENO:** incluir arremessos de desempate e não limitar o campo aos cinco valores individuais dos alvos.

---

# 7. Relatório de homologação — Bocha Campeira

## 7.1 O que a súmula registra

- fase, cancha, modalidade, início, fim e duração;
- duas entidades/equipes;
- placar por passadas até 12 pontos;
- placar final;
- cor das bochas;
- 3 atletas titulares e 1 reserva por equipe;
- substituições;
- árbitro, local, data e observações.

## 7.2 Cruzamento com o regulamento

| Item | Regulamento | Súmula | Resultado |---|---|---|---|
| Equipe | Trio + 1 reserva | 3 titulares + reserva | Compatível |
| Placar | Partida até 12 | Colunas 1 a 12 | Compatível |
| Substituição | Até 2, entre passadas | Um bloco sem número da passada | Parcial |
| Pontos individuais | Regulamento não atribui ponto ao atleta | Súmula não atribui | Compatível |

## 7.3 Limite real para ranking individual

A Bocha Campeira pontua a **equipe na passada**, não o atleta. A súmula não informa qual atleta arrimou, bocheou ou produziu cada ponto.

Portanto:

- é possível ranking de equipes e entidades;
- não é possível ranking individual por desempenho usando apenas essa súmula;
- é possível exibir estatística individual de participação: jogos, vitórias, derrotas e aproveitamento nos jogos em que o atleta esteve inscrito.

Inventar pontos individuais dividindo o placar por três seria errado.

## 7.4 Dados mínimos para o sistema local

- `evento_id`, `fase`, `jogo_numero`, `data`;
- `equipe_a_id`, `equipe_b_id`;
- titulares e reserva de cada lado;
- `placar_a`, `placar_b`;
- `vencedor_equipe_id`;
- substituições opcionais: atleta que saiu, atleta que entrou e passada.

Horário, cancha, cor, árbitro e assinaturas podem ser opcionais. Eles não alteram ranking.

## 7.5 Ranking de equipes

Critério recomendado para torneio de grupos/pontos corridos:

1. Vitórias.
2. Saldo de pontos: `pontos_feitos - pontos_sofridos`.
3. Pontos feitos.
4. Confronto direto.
5. Decisão manual/sorteio.

```text
aproveitamento = vitorias / jogos
```

Se o torneio for eliminatório, o ranking deve usar a colocação final da chave, não a soma de placares.

## 7.6 Status de homologação

**HOMOLOGADA PARA RANKING COLETIVO.** Ranking individual fica limitado a participação e aproveitamento, sem pontos técnicos do atleta.

---

# 8. Relatório de homologação — Truco de Amostra

## 8.1 O que a súmula registra

- duas entidades/federações;
- nome e número de cada trio;
- tentos de cada lado em até 3 partidas;
- soma dos tentos;
- trio vencedor e perdedor;
- partidas vencidas;
- tentos marcados.

## 8.2 Cruzamento com o regulamento

| Item | Regulamento | Súmula | Resultado |
|---|---|---|---|
| Formação | Trio | Trio | Compatível |
| Limite por partida | 30 tentos | Observação usa 90 = 3 × 30 | Compatível |
| Confronto | Melhor de 3 | 3 linhas | Compatível |
| Vitória em 2 seguidas | Registra 3 partidas e 90 tentos | Mesma regra | Compatível |
| Pontos por atleta | Não existem na súmula | Não registra atletas | Impede ranking individual |

## 8.3 Dados mínimos

- `evento_id`, `fase`, `jogo_numero`, `data`;
- `entidade_a_id`, `trio_a_id`;
- `entidade_b_id`, `trio_b_id`;
- placares da 1ª, 2ª e, se necessária, 3ª partida;
- vencedor calculado;
- atletas do trio vindos do cadastro da equipe, não digitados novamente na súmula.

## 8.4 Cálculos

```text
vitorias_a = quantidade de partidas em que tentos_a > tentos_b
vitorias_b = quantidade de partidas em que tentos_b > tentos_a
vencedor = primeiro trio que alcançar 2 vitorias
```

Para manter fidelidade à súmula:

- se um trio vencer as duas primeiras, registrar estatística oficial do confronto como 3 partidas ganhas e 90 tentos para o vencedor;
- o perdedor registra 0 partidas e a soma dos tentos feitos nas duas partidas disputadas.

Convém guardar dois conjuntos de dados:

- `placar_real`: as partidas efetivamente jogadas;
- `placar_classificacao`: 3/90 conforme a convenção.

Assim o ranking não apaga o que realmente aconteceu.

## 8.5 Ranking

1. Vitórias em confrontos.
2. Partidas ganhas para classificação.
3. Saldo de tentos.
4. Tentos a favor.
5. Confronto direto.
6. Empate/decisão manual.

Não existe ranking individual técnico a partir dessa súmula. Pode haver apenas participação por atleta vinculado ao trio.

## 8.6 Status de homologação

**HOMOLOGADA PARA TRIOS/EQUIPES.** Não serve para ranking individual por pontos.

---

# 9. Relatório de homologação — Truco Cego

## 9.1 Problema do arquivo recebido

O arquivo chamado “Súmula Truco Cego”:

- possui cabeçalho “Súmula do Jogo de Truco de Amostra”;
- usa a regra de 90 tentos;
- é uma cópia digital exatamente igual ao arquivo de Truco de Amostra.

## 9.2 Por que não pode ser aproveitado

Aplicar a mesma regra do truvo de amostra com 90 tentos ao Cego sem contaminar o ranking.

## 9.3 Estrutura provisória esperada

- entidades e trios adversários;
- placar de até 3 partidas, com 0 a 24 tentos;
- vencedor do confronto;
- partidas ganhas;
- tentos a favor e contra;
- local e data.

## 9.4 Ranking esperado

1. Vitórias em confrontos.
2. Partidas ganhas.
3. Saldo de tentos.
4. Tentos a favor.
5. Confronto direto.
6. Empate/decisão manual.

## 9.5 Status de homologação

**HOMOLOGADA.** aprovar um novo modelo local baseado em 24 tentos conforme o truco de amostra.

---

# 10. Campos que realmente entram no MVP

## 10.1 Cadastros

### já criado.

## 10.2 Lançamento de súmula

### já criado.

- status `VALIDO`, `COM_ALERTA` ou `CANCELADO`.

Não entram no MVP, salvo decisão posterior:

- assinaturas digitais;
- pilcha;
- comissão federativa;
- congresso técnico;
- armas, bebidas e disciplina;
- gestão de cancha;
- arbitragem jogada a jogada;
- validação rígida que impeça salvar.

---

# 11. Estrutura mínima das abas da planilha

| Aba | Função |
|---|---|
| `CONFIG` | Regras escolhidas, pontuação geral e listas |
| `EVENTOS` | Torneios locais |
| `ENTIDADES` | CTGs/equipes institucionais |
| `ATLETAS` | Cadastro único |
| `EQUIPES` | Equipes por modalidade e evento |
| `EQUIPE_ATLETAS` | Composição das equipes |
| `SUMULAS` | Cabeçalho de cada lançamento |
| `SUMULA_RESULTADOS` | Linhas detalhadas por atleta/equipe/partida |
| `RANKING_INDIVIDUAL` | Visão calculada por modalidade |
| `RANKING_EQUIPES` | Visão calculada por modalidade |
| `RANKING_GERAL` | Pontos de colocação por entidade |
| `LOGS` | Inclusão, edição, cancelamento e restauração |

As abas de ranking devem ser tratadas como saídas calculadas. O usuário não deve editar seus valores diretamente.

---

# 12. homologação final

| ID | Decisão | Recomendação | ---|---|---|
| `HOM-01` | Argola do TETARFE: 5/3/1 | |
| `HOM-02` | Tava local: 10 tiros |
| `HOM-03` | Pontos gerais das entidades | Aprovar 12/9/6/3 |
| `HOM-04` | Desempate geral | Aprovado
| `HOM-05` | Truco Cego | criterios identicos ao de amostra|
| `HOM-06` | Bocha Campeira individual | Confirmado que será participação/aproveitamento, sem inventar pontos por atleta |
| `HOM-07` | Bocha 48 | Confirmar se ranking da dupla usa total, no formato do torneio |

## Parecer final

Para preservar simplicidade, recomenda-se que cada tela reproduza apenas os campos de resultado da súmula e em tabela para visualização:

- totais calculados em tempo real;
- aviso de divergência sem impedir o salvamento;
- botão Salvar;
- botão Editar;
- botão Cancelar/Restaurar;
- acesso imediato aos rankings.

Esse desenho atende ao torneio local sem carregar o peso burocrático de um sistema federativo.
