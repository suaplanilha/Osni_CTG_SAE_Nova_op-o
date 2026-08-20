/** Controller público do WebApp SAE. */
function doGet(e) {
  const asset = e && e.parameter && e.parameter.asset;
  if (asset === 'manifest') {
    return ContentService.createTextOutput(JSON.stringify({
      name: 'SAE · CTG Rodeio dos Palmares', short_name: 'SAE Palmares', start_url: '?source=pwa#/inscricoes',
      display: 'standalone', background_color: '#0f172a', theme_color: '#4f46e5', lang: 'pt-BR',
      icons: [{ src: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/emoji_events/v12/24px.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
    })).setMimeType(ContentService.MimeType.JSON);
  }
  if (asset === 'sw') {
    return ContentService.createTextOutput("self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(fetch(e.request).catch(()=>new Response('Offline',{status:503})));});")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('SAE - CTG Rodeio dos Palmares')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

const SAE_SCHEMA = Object.freeze({
  CONFIG: ['chave', 'valor', 'atualizado_em'],
  ENTIDADES: ['id', 'evento_id', 'nome', 'capataz', 'contato', 'status', 'criado_em', 'atualizado_em'],
  ATLETAS: ['id', 'evento_id', 'entidade_id', 'nome', 'tipo', 'status', 'criado_em', 'atualizado_em'],
  ATLETA_MODALIDADES: ['id', 'evento_id', 'entidade_id', 'atleta_id', 'modalidade_id', 'status', 'criado_em', 'atualizado_em'],
  SUMULAS: ['id', 'evento_id', 'modalidade_id', 'status', 'criado_em', 'atualizado_em', 'payload_json'],
  LOGS: ['id', 'evento_id', 'entidade', 'entidade_id', 'acao', 'payload_json', 'criado_em']
});

/** Retorna os dados necessários para iniciar a SPA em uma única chamada. */
function getBootstrapData() {
  return executeApi_(function () {
    initializeDatabase_();
    return {
      eventoId: getCurrentEventId_(),
      entidades: listRegistrations_(),
      sumulas: listSumulas_()
    };
  });
}

/** Cria ou atualiza entidade, atletas e modalidades em uma transação protegida. */
function saveRegistration(payload) {
  return executeApi_(function () {
    validateRegistration_(payload);
    return withLock_(function () {
      initializeDatabase_();
      const now = new Date().toISOString();
      const eventId = getCurrentEventId_();
      const entityId = payload.id || Utilities.getUuid();
      const entities = readObjects_('ENTIDADES');
      const previousEntity = entities.find(function (row) { return row.id === entityId; });
      upsertObject_('ENTIDADES', {
        id: entityId,
        evento_id: eventId,
        nome: normalizeText_(payload.nome),
        capataz: normalizeText_(payload.capataz),
        contato: normalizeText_(payload.contato),
        status: 'ATIVO',
        criado_em: previousEntity ? previousEntity.criado_em : now,
        atualizado_em: now
      });

      const incomingAthletes = Array.isArray(payload.atletas) ? payload.atletas : [];
      const incomingIds = incomingAthletes.map(function (athlete) { return athlete.id || ''; }).filter(String);
      readObjects_('ATLETAS').filter(function (row) {
        return row.entidade_id === entityId && row.status === 'ATIVO' && incomingIds.indexOf(row.id) === -1;
      }).forEach(function (row) {
        upsertObject_('ATLETAS', Object.assign({}, row, { status: 'CANCELADO', atualizado_em: now }));
        cancelAthleteModalities_(row.id, now);
      });

      incomingAthletes.forEach(function (athlete) {
        const athleteId = athlete.id || Utilities.getUuid();
        const previousAthlete = readObjects_('ATLETAS').find(function (row) { return row.id === athleteId; });
        upsertObject_('ATLETAS', {
          id: athleteId,
          evento_id: eventId,
          entidade_id: entityId,
          nome: normalizeText_(athlete.nome),
          tipo: athlete.tipo === 'Reserva' || athlete.tipo === 'RESERVA' ? 'Reserva' : 'Titular',
          status: 'ATIVO',
          criado_em: previousAthlete ? previousAthlete.criado_em : now,
          atualizado_em: now
        });
        syncAthleteModalities_(eventId, entityId, athleteId, athlete.modalidades, now);
      });

      appendLog_('ENTIDADES', entityId, previousEntity ? 'ATUALIZAR' : 'CRIAR', payload);
      return listRegistrations_().find(function (item) { return item.id === entityId; });
    });
  });
}

/** Cancelamento lógico mantém histórico e retira a inscrição das seleções. */
function cancelRegistration(entityId) {
  return executeApi_(function () {
    if (!entityId) throw new Error('Identificador da entidade não informado.');
    return withLock_(function () {
      initializeDatabase_();
      const now = new Date().toISOString();
      const entity = readObjects_('ENTIDADES').find(function (row) { return row.id === entityId; });
      if (!entity) throw new Error('Entidade não encontrada.');
      upsertObject_('ENTIDADES', Object.assign({}, entity, { status: 'CANCELADO', atualizado_em: now }));
      readObjects_('ATLETAS').filter(function (row) { return row.entidade_id === entityId; }).forEach(function (row) {
        upsertObject_('ATLETAS', Object.assign({}, row, { status: 'CANCELADO', atualizado_em: now }));
        cancelAthleteModalities_(row.id, now);
      });
      appendLog_('ENTIDADES', entityId, 'CANCELAR', { id: entityId });
      return { id: entityId, status: 'CANCELADO' };
    });
  });
}

/** Persiste a súmula completa; os campos numéricos continuam normalizados no JSON. */
function saveSumula(payload) {
  return executeApi_(function () {
    if (!payload || !payload.modalidadeId) throw new Error('Modalidade da súmula não informada.');
    return withLock_(function () {
      initializeDatabase_();
      const now = new Date().toISOString();
      const eventId = getCurrentEventId_();
      const id = payload.id || Utilities.getUuid();
      const previous = readObjects_('SUMULAS').find(function (row) { return row.id === id; });
      const saved = Object.assign({}, payload, {
        id: id,
        criadoEm: payload.criadoEm || now,
        atualizadoEm: now,
        status: payload.status || 'VALIDO'
      });
      upsertObject_('SUMULAS', {
        id: id,
        evento_id: eventId,
        modalidade_id: saved.modalidadeId,
        status: saved.status,
        criado_em: previous ? previous.criado_em : saved.criadoEm,
        atualizado_em: now,
        payload_json: JSON.stringify(saved)
      });
      appendLog_('SUMULAS', id, previous ? 'ATUALIZAR' : 'CRIAR', { modalidadeId: saved.modalidadeId, status: saved.status });
      return saved;
    });
  });
}

function setSumulaStatus(sumulaId, status) {
  return executeApi_(function () {
    if (['VALIDO', 'COM_ALERTA', 'CANCELADO'].indexOf(status) === -1) throw new Error('Status de súmula inválido.');
    return withLock_(function () {
      initializeDatabase_();
      const row = readObjects_('SUMULAS').find(function (item) { return item.id === sumulaId; });
      if (!row) throw new Error('Súmula não encontrada.');
      const now = new Date().toISOString();
      const payload = JSON.parse(row.payload_json || '{}');
      payload.status = status;
      payload.atualizadoEm = now;
      payload.canceladoEm = status === 'CANCELADO' ? now : '';
      upsertObject_('SUMULAS', Object.assign({}, row, { status: status, atualizado_em: now, payload_json: JSON.stringify(payload) }));
      appendLog_('SUMULAS', sumulaId, status === 'CANCELADO' ? 'CANCELAR' : 'RESTAURAR', { status: status });
      return payload;
    });
  });
}

function initializeDatabase_() {
  const spreadsheet = getSpreadsheet_();
  Object.keys(SAE_SCHEMA).forEach(function (name) {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    const headers = SAE_SCHEMA[name];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0f766e').setFontColor('#ffffff');
      sheet.autoResizeColumns(1, headers.length);
    }
  });
}

function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const id = PropertiesService.getScriptProperties().getProperty('SAE_SPREADSHEET_ID');
  if (!id) throw new Error('Defina SAE_SPREADSHEET_ID nas propriedades do script ou vincule o projeto a uma planilha.');
  return SpreadsheetApp.openById(id);
}

function getCurrentEventId_() {
  const properties = PropertiesService.getScriptProperties();
  let id = properties.getProperty('SAE_EVENT_ID');
  if (!id) {
    id = Utilities.getUuid();
    properties.setProperty('SAE_EVENT_ID', id);
  }
  return id;
}

function listRegistrations_() {
  const eventId = getCurrentEventId_();
  const entities = readObjects_('ENTIDADES').filter(function (row) { return row.evento_id === eventId && row.status === 'ATIVO'; });
  const athletes = readObjects_('ATLETAS').filter(function (row) { return row.evento_id === eventId && row.status === 'ATIVO'; });
  const links = readObjects_('ATLETA_MODALIDADES').filter(function (row) { return row.evento_id === eventId && row.status === 'ATIVO'; });
  return entities.map(function (entity) {
    return {
      id: entity.id,
      nome: entity.nome,
      capataz: entity.capataz,
      contato: entity.contato,
      status: entity.status,
      criadoEm: entity.criado_em,
      atualizadoEm: entity.atualizado_em,
      atletas: athletes.filter(function (athlete) { return athlete.entidade_id === entity.id; }).map(function (athlete) {
        return {
          id: athlete.id,
          nome: athlete.nome,
          tipo: athlete.tipo,
          modalidades: links.filter(function (link) { return link.atleta_id === athlete.id; }).map(function (link) { return link.modalidade_id; })
        };
      })
    };
  });
}

function listSumulas_() {
  const eventId = getCurrentEventId_();
  return readObjects_('SUMULAS').filter(function (row) { return row.evento_id === eventId; }).map(function (row) {
    try { return JSON.parse(row.payload_json); } catch (error) { return null; }
  }).filter(Boolean);
}

function syncAthleteModalities_(eventId, entityId, athleteId, modalities, now) {
  const requested = Array.isArray(modalities) ? modalities.filter(String) : [];
  const current = readObjects_('ATLETA_MODALIDADES').filter(function (row) { return row.atleta_id === athleteId; });
  current.forEach(function (row) {
    if (requested.indexOf(row.modalidade_id) === -1 && row.status === 'ATIVO') {
      upsertObject_('ATLETA_MODALIDADES', Object.assign({}, row, { status: 'CANCELADO', atualizado_em: now }));
    }
  });
  requested.forEach(function (modalityId) {
    const previous = current.find(function (row) { return row.modalidade_id === modalityId; });
    upsertObject_('ATLETA_MODALIDADES', {
      id: previous ? previous.id : Utilities.getUuid(), evento_id: eventId, entidade_id: entityId,
      atleta_id: athleteId, modalidade_id: modalityId, status: 'ATIVO',
      criado_em: previous ? previous.criado_em : now, atualizado_em: now
    });
  });
}

function cancelAthleteModalities_(athleteId, now) {
  readObjects_('ATLETA_MODALIDADES').filter(function (row) { return row.atleta_id === athleteId && row.status === 'ATIVO'; }).forEach(function (row) {
    upsertObject_('ATLETA_MODALIDADES', Object.assign({}, row, { status: 'CANCELADO', atualizado_em: now }));
  });
}

function validateRegistration_(payload) {
  if (!payload) throw new Error('Dados da inscrição não informados.');
  if (!normalizeText_(payload.nome)) throw new Error('Nome do piquete é obrigatório.');
  if (!normalizeText_(payload.capataz)) throw new Error('Nome do capataz é obrigatório.');
  const athletes = Array.isArray(payload.atletas) ? payload.atletas : [];
  if (!athletes.some(function (athlete) { return normalizeText_(athlete.nome); })) throw new Error('Informe pelo menos um integrante.');
}

function readObjects_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  const headers = values.shift();
  return values.filter(function (row) { return row.some(function (value) { return value !== ''; }); }).map(function (row) {
    return headers.reduce(function (object, header, index) { object[header] = row[index]; return object; }, {});
  });
}

function upsertObject_(sheetName, object) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  const headers = SAE_SCHEMA[sheetName];
  const rows = readObjects_(sheetName);
  const index = rows.findIndex(function (row) { return row.id === object.id; });
  const values = headers.map(function (header) { return object[header] === undefined ? '' : object[header]; });
  if (index >= 0) sheet.getRange(index + 2, 1, 1, headers.length).setValues([values]);
  else sheet.appendRow(values);
}

function appendLog_(entity, entityId, action, payload) {
  const now = new Date().toISOString();
  getSpreadsheet_().getSheetByName('LOGS').appendRow([
    Utilities.getUuid(), getCurrentEventId_(), entity, entityId, action, JSON.stringify(payload || {}), now
  ]);
}

function withLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return callback(); } finally { lock.releaseLock(); }
}

function executeApi_(callback) {
  try { return { ok: true, data: callback(), error: null }; }
  catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return { ok: false, data: null, error: { message: error && error.message ? error.message : String(error) } };
  }
}

function normalizeText_(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}
