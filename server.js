const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.listen(PORT, ()=> console.log("Server running on port "+PORT));


// === AGA8 Z-factor API (server-side, avoids browser ESM/CORS headaches) ===
app.use(express.json({ limit: '100kb' }));

app.post('/api/aga8-z', async (req, res) => {
  try {
    const { P_psia, T_R, mix } = req.body || {};
    if (!(P_psia > 0) || !(T_R > 0) || !mix || typeof mix !== 'object') {
      return res.status(400).json({ ok:false, error:'Invalid input' });
    }

    // dynamic import to keep startup light
    const mod = await import('@sctg/aga8-js'); // Node side; okay to use package main
    // Common init shapes:
    let core = null;
    if (typeof mod.default === 'function') {
      core = await mod.default();          // Some builds expose init() as default
    } else if (typeof mod.init === 'function') {
      core = await mod.init();
    } else if (mod.AGA8) {
      core = mod.AGA8;
    } else {
      core = mod;
    }

    let Z = null, method = 'AGA8-Detail';
    if (core && typeof core.PropertiesDetailPT === 'function') {
      Z = core.PropertiesDetailPT(P_psia, T_R, mix).Z;
    } else if (core && typeof core.DetailPT === 'function') {
      Z = core.DetailPT(P_psia, T_R, mix).Z;
    } else if (core && typeof core.PropertiesGERG_PT === 'function') {
      const r = core.PropertiesGERG_PT(P_psia, T_R, mix);
      Z = r.Z; method = 'GERG-2008';
    } else if (core && typeof core.calculate === 'function') {
      const r = core.calculate({ P_psia, T_R, mix });
      Z = r.Z; method = r.method || method;
    }

    if (!(Z > 0) || Z > 2) {
      return res.status(500).json({ ok:false, error:'AGA8 returned invalid Z' });
    }
    res.json({ ok:true, Z, method });
  } catch (e) {
    console.error('AGA8 error:', e);
    res.status(500).json({ ok:false, error:String(e && e.message || e) });
  }
});
