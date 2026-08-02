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
