/* asianloop gas module: Z-factor + standardization + mass/energy
   Sources:
   - AGA8 reference & detail method (optional WASM bridge if present). :contentReference[oaicite:1]{index=1}
   - Papay Z correlation (approximate) and Kay’s mixing for Ppc/Tpc from composition (engineering use).
   - Typical natural gas composition datasets exist publicly; paste mole % as needed. :contentReference[oaicite:2]{index=2}
*/

// ---------- Public API (used by index.html) ----------
window.ASIANLOOP_GAS = {
  calcGas,        // main calculator
  parseCompo,     // parse mole% text to object
  useAGA8Detail: false // will auto-enable if @sctg/aga8-js is detected
};

// Try to detect optional AGA8 WASM (from @sctg/aga8-js) if loaded via <script type="module"> or bundler
(function detectAGA8(){
  // If someone exposes window.AGA8 or window.AGA8wasm, we’ll mark detail available.
  if (typeof window !== 'undefined' && (window.AGA8 || window.AGA8wasm)) {
    ASIANLOOP_GAS.useAGA8Detail = true;
  }
})();

// ---------- Constants & helpers ----------
const CRIT = {
  CH4:{Tc:343.0, Pc:667.0},  // °R, psia
  C2H6:{Tc:549.8, Pc:708.0},
  C3H8:{Tc:666.0, Pc:616.0},
  iC4:{Tc:735.4, Pc:527.9},
  nC4:{Tc:765.3, Pc:550.7},
  iC5:{Tc:829.9, Pc:490.4},
  nC5:{Tc:845.4, Pc:488.6},
  C6:{Tc:913.4, Pc:436.9},
  N2:{Tc:227.2, Pc:492.3},
  CO2:{Tc:547.6, Pc:1071.0},
  H2S:{Tc:672.4, Pc:1306.0},
  H2:{Tc:59.7,  Pc:188.0},
  O2:{Tc:278.6, Pc:731.4},
  He:{Tc:12.9,  Pc:33.3},
  Ar:{Tc:268.9, Pc:706.6},
  CO:{Tc:239.9, Pc:507.1}
};

function bar_to_psia(p){ return p*14.5037738; }
function kpa_to_psia(p){ return p*0.145037738; }
function C_to_R(tC){ return (tC + 273.15)*9/5; }
function m3h_to_scfh(q){ return q*35.3146667; }   // volumetric conversion
function scfh_to_m3h(q){ return q/35.3146667; }
function rhoStdFromSG(sg){ return sg*1.225; }     // ~air density at 15°C, 1 atm

function fmt(x, d=7){ if (x==null || isNaN(x)) return '—'; return Number(x).toPrecision(d); }

// Parse composition text -> normalized mole fractions (0..1)
function parseCompo(text){
  const lines = (text||'').split(/\n|,|;/).map(s=>s.trim()).filter(Boolean);
  let sum=0, comp={};
  for(const ln of lines){
    const m = ln.match(/^([A-Za-z0-9]+)\s*[:=]\s*([\d.]+)%?$/);
    if(!m) continue;
    const key = m[1].toUpperCase();
    const val = parseFloat(m[2]);
    if(isNaN(val)) continue;

    // map synonyms
    const map = {
      CH4:'CH4', C1:'CH4',
      C2:'C2H6', C2H6:'C2H6',
      C3:'C3H8', C3H8:'C3H8',
      IC4:'iC4', NC4:'nC4',
      IC5:'iC5', NC5:'nC5',
      C6:'C6',
      N2:'N2', CO2:'CO2', H2S:'H2S',
      H2:'H2', O2:'O2',
      HE:'He', AR:'Ar', CO:'CO'
    };
    const k2 = map[key] || key;
    if(CRIT[k2]) { comp[k2]=(comp[k2]||0)+val; sum+=val; }
  }
  if(sum>0){ for(const k in comp){ comp[k]=comp[k]/sum; } }
  return comp;
}

// Kay’s mixing rule for pseudo-critical properties
function kayPseudoCritical(comp){
  let Tpc=0, Ppc=0, sum=0;
  for(const k in comp){ const x=comp[k]; if(CRIT[k]){ Tpc += x*CRIT[k].Tc; Ppc += x*CRIT[k].Pc; sum+=x; } }
  if(sum<=0) return {Tpc:null,Ppc:null};
  return {Tpc,Ppc};
}

// Papay Z correlation (approx) with reduced vars
// Z = 1 - 3.52*Pr*exp(-2.26*Tr) + 0.247*Pr^2*exp(-1.878*Tr)
function zPapay(Pr, Tr){
  return 1 - 3.52*Pr*Math.exp(-2.26*Tr) + 0.247*Math.pow(Pr,2)*Math.exp(-1.878*Tr);
}

// Ppc/Tpc from gas gravity γg (Lee-Kesler style approx for sweet gas)
function pseudoCritFromGamma(gamma){
  const Ppc = 677 + 15*gamma - 37.5*gamma*gamma;     // psia
  const Tpc = 168 + 325*gamma - 12.5*gamma*gamma;    // °R
  return {Ppc,Tpc};
}

// Optionally call AGA8-Detail if available
async function zAGA8Detail_ifAvailable(P_psia, T_R, comp){
  try{
    // Expect either window.AGA8 (pre-initialized) or window.AGA8wasm() to init
    let AGA8 = window.AGA8;
    if(!AGA8 && typeof window.AGA8wasm==='function'){
      AGA8 = await window.AGA8wasm(); // init WASM
      window.AGA8 = AGA8;
    }
    if(!AGA8) return {Z:null, used:false, meta:"Papay (fallback)"};

    // Map composition to AGA8 mixture names (subset)
    const mix = {
      methane: comp.CH4||0,
      ethane: comp.C2H6||0,
      propane: comp.C3H8||0,
      isobutane: comp.iC4||0,
      n_butane: comp.nC4||0,
      isopentane: comp.iC5||0,
      n_pentane: comp.nC5||0,
      n_hexane: comp.C6||0,
      nitrogen: comp.N2||0,
      carbon_dioxide: comp.CO2||0,
      hydrogen_sulfide: comp.H2S||0,
      hydrogen: comp.H2||0,
      oxygen: comp.O2||0,
      helium: comp.He||0,
      argon: comp.Ar||0,
      carbon_monoxide: comp.CO||0,
      water: 0, n_heptane:0, n_octane:0, n_nonane:0, n_decane:0
    };

    // Use AGA8 DETAIL at (P,T) to get Z:
    // Many libs want density iteration; we can use GERG/Detail helper if exposed.
    if(AGA8.SetupDetail) AGA8.SetupDetail(); // switch method if supported
    // Use PropertiesDetailPT if available; otherwise use GERG density iteration fallback
    if(AGA8.PropertiesDetailPT){
      const props = AGA8.PropertiesDetailPT(P_psia, T_R, mix);
      return {Z: props.Z, used:true, meta:"AGA8-Detail"};
    } else if(AGA8.PropertiesGERG_PT){
      const props = AGA8.PropertiesGERG_PT(P_psia, T_R, mix);
      return {Z: props.Z, used:true, meta:"GERG-2008"};
    }
    return {Z:null, used:false, meta:"Papay (fallback)"};
  }catch(e){
    console.warn("AGA8 detail not available:", e);
    return {Z:null, used:false, meta:"Papay (fallback)"};
  }
}

// Main calculator
async function calcGas(inputs){
  const {
    Qline, Qunit, P, Punit, T_C,
    Zmode, Zmanual, gamma, compoText,
    rhoStdInput, gcv, stdPreset
  } = inputs;

  if(!(Qline>0) || isNaN(P) || isNaN(T_C)) throw new Error("Please provide Q_line, P, and T.");

  // Convert to psia & Rankine
  let P_psia = P;
  if(Punit==='bar') P_psia = bar_to_psia(P);
  if(Punit==='kpa') P_psia = kpa_to_psia(P);
  const T_R = C_to_R(T_C);
  const {Pstd_psia, Tstd_R} = (stdPreset==='60F')
    ? {Pstd_psia:14.696, Tstd_R:(60+459.67)}
    : {Pstd_psia:14.6959, Tstd_R:C_to_R(15)};

  // Determine Z
  let Z=null, meta="";

  if(Zmode==='manual'){
    if(!(Zmanual>0 && Zmanual<2)) throw new Error("Enter a valid manual Z.");
    Z=Zmanual; meta="Manual Z";
  } else if(Zmode==='gravity'){
    if(!(gamma>0 && gamma<2)) throw new Error("Enter a valid gas specific gravity (γg).");
    const {Ppc,Tpc} = pseudoCritFromGamma(gamma);
    const Pr = P_psia / Ppc;
    const Tr = T_R / Tpc;
    Z = zPapay(Pr,Tr);
    meta = `Papay via γg=${gamma}`;
  } else { // 'compo'
    const comp = parseCompo(compoText);
    const kc = kayPseudoCritical(comp);
    if(!(kc.Ppc>0 && kc.Tpc>0)) throw new Error("Composition parse failed. Provide mole% lines like CH4=93.2, CO2=0.8, ...");

    // If AGA8-Detail available, prefer it
    if (ASIANLOOP_GAS.useAGA8Detail) {
      const det = await zAGA8Detail_ifAvailable(P_psia, T_R, comp);
      if(det.used && det.Z>0 && det.Z<2){ Z = det.Z; meta = det.meta; }
    }

    // Fallback to Papay with Kay mixing if detail not available
    if(!Z){
      const Pr = P_psia / kc.Ppc;
      const Tr = T_R / kc.Tpc;
      Z = zPapay(Pr,Tr);
      meta = `Papay via Kay mix (Ppc=${fmt(kc.Ppc,5)} psia, Tpc=${fmt(kc.Tpc,5)} °R)`;
    }
  }

  // Convert Qline to SCFH-like base for equation (we’ll normalize afterward)
  let Qline_scfh;
  if(Qunit==='m3h')      Qline_scfh = m3h_to_scfh(Qline);
  else if(Qunit==='mscfh') Qline_scfh = Qline*1000;
  else                    Qline_scfh = Qline; // assume already scfh-like

  // Real gas law standardization:
  // Qstd = Qline * (P/(Z*Pstd)) * (Tstd/T)
  const Qstd_scfh = Qline_scfh * (P_psia/(Z*Pstd_psia)) * (Tstd_R/T_R);
  const Qstd_sm3h = scfh_to_m3h(Qstd_scfh);

  // Optional mass & energy
  let rhoStd=null, mdot=null, edot=null;
  if(rhoStdInput>0){
    rhoStd = (rhoStdInput<=2) ? rhoStdFromSG(rhoStdInput) : rhoStdInput; // treat ≤2 as SG
    mdot = rhoStd * Qstd_sm3h;             // kg/h
    if(gcv>0) edot = gcv * Qstd_sm3h;      // MJ/h
  }

  return {
    Z, meta, Qstd_sm3h, P_psia, T_R, Pstd_psia, Tstd_R,
    rhoStd, mdot, edot
  };
}
