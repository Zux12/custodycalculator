/* Browser loader for self-hosted AGA8 (exposes window.AGA8) */
const wasmUrl = window.AGA8_WASM_URL || '/vendor/aga8/aga8.wasm';
let mod = null;
try {
  mod = await import('/vendor/aga8/aga8.esm.js');
} catch (e) {
  console.warn('[AGA8] ESM import failed:', e);
  window.AGA8 = { ready:false };
  export default null;
}
function normalize(core){
  const api = {
    ready: true,
    PropertiesDetailPT: (P_psia, T_R, mix) => {
      if (core && typeof core.PropertiesDetailPT === 'function') return core.PropertiesDetailPT(P_psia, T_R, mix);
      if (core && typeof core.DetailPT === 'function')        return core.DetailPT(P_psia, T_R, mix);
      if (core && typeof core.PropertiesGERG_PT === 'function') return core.PropertiesGERG_PT(P_psia, T_R, mix);
      if (core && typeof core.calculate === 'function')       return core.calculate({ P_psia, T_R, mix });
      throw new Error('AGA8 API not found in module.');
    }
  };
  window.AGA8 = api;
  return api;
}
async function ensureInit() {
  if (window.AGA8 && window.AGA8.ready) return window.AGA8;
  const cand = (mod && mod.default) ? mod.default : mod;
  if (typeof cand === 'function')      return normalize(await cand(wasmUrl)); // default export as init
  if (cand && typeof cand.init === 'function') return normalize(await cand.init(wasmUrl));
  if (cand && cand.AGA8)               return normalize(cand.AGA8);
  return normalize(cand);
}
ensureInit().then(()=>console.log('[AGA8] Ready')).catch(e=>console.warn('[AGA8] Init warn:', e));
export async function AGA8wasm(){ return await ensureInit(); }
export default null;
