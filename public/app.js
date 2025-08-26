// ===== Utilities & State =====
const unitToM3 = {
  m3: 1,
  L: 0.001,
  bbl: 0.1589872949,
  galUS: 0.003785411784
};

const $ = (id) => document.getElementById(id);
const LS_KEY = 'asianloop_calc_v1';

function loadState() {
  try {
    const j = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    ['V','unitV','T','Tref','ctlMode','alpha','CTL','rho','hhv'].forEach(k=>{
      if (j[k] !== undefined && $(k)) $(k).value = j[k];
    });
  } catch {}
}
function saveState() {
  const j = {
    V: $('V').value, unitV: $('unitV').value,
    T: $('T').value, Tref: $('Tref').value,
    ctlMode: $('ctlMode').value, alpha: $('alpha').value, CTL: $('CTL').value,
    rho: $('rho').value, hhv: $('hhv').value
  };
  localStorage.setItem(LS_KEY, JSON.stringify(j));
}

// ===== CTL helpers =====
function ctlApprox(alpha, T, Tref) {
  return Math.exp(-alpha * (T - Tref));
}
function fmt(x, digits=7) {
  if (x === null || x === undefined || isNaN(x)) return '—';
  return Number(x).toPrecision(digits);
}

// ===== Calculate & Output =====
function calculate() {
  const V = parseFloat($('V').value);
  const unitV = $('unitV').value;
  const T = parseFloat($('T').value);
  const Tref = parseFloat($('Tref').value);
  const mode = $('ctlMode').value;
  const alpha = parseFloat($('alpha').value);
  const CTLmanual = parseFloat($('CTL').value);
  const rho = parseFloat($('rho').value);
  const hhv = parseFloat($('hhv').value);

  if (!(V > 0) || !(unitV in unitToM3) || isNaN(T) || isNaN(Tref)) {
    alert('Please provide measured volume, unit, temperature, and reference temperature.');
    return null;
  }

  let CTL;
  if (mode === 'manual') {
    if (!(CTLmanual > 0)) { alert('Enter a valid manual CTL.'); return null; }
    CTL = CTLmanual;
  } else {
    if (!(alpha > 0 && alpha < 0.01)) { alert('Enter α between 0 and 0.01 per °C.'); return null; }
    CTL = ctlApprox(alpha, T, Tref);
  }

  const V_m3 = V * unitToM3[unitV];
  const Vcorr_m3 = V_m3 * CTL;
  const Vcorr_inUnit = Vcorr_m3 / unitToM3[unitV];

  let massKg = null, energyMJ = null;
  if (rho > 0) {
    massKg = Vcorr_m3 * rho; // kg
    if (hhv > 0) energyMJ = massKg * hhv; // MJ
  }

  // Outputs
  $('outCTL').textContent = fmt(CTL, 8);
  $('outVcorr').textContent = fmt(Vcorr_inUnit, 8);
  $('outUnit').textContent = unitV;
  $('outMass').textContent = (massKg!=null) ? (fmt(massKg, 8) + ' kg') : '—';
  $('outEnergy').textContent = (energyMJ!=null) ? (fmt(energyMJ, 8) + ' MJ') : '—';

  // Save state
  saveState();

  return {
    inputs: { V, unitV, T, Tref, mode, alpha, CTLmanual, rho, hhv },
    outputs: { CTL, Vcorr_inUnit, unitV, massKg, energyMJ, Vcorr_m3 }
  };
}

// ===== XLSX Export =====
function exportXLSX(result) {
  if (!result) { alert('Calculate first.'); return; }
  const {inputs, outputs} = result;
  const dataInputs = [
    ['Measured Volume (V)', inputs.V],
    ['Volume Unit', inputs.unitV],
    ['Measured Temperature (T, °C)', inputs.T],
    ['Reference Temperature (Tref, °C)', inputs.Tref],
    ['CTL Mode', inputs.mode],
    ['Alpha (per °C)', inputs.alpha],
    ['Manual CTL', inputs.CTLmanual],
    ['Density @ Ref (kg/m³)', inputs.rho],
    ['HHV (MJ/kg)', inputs.hhv]
  ];
  const dataOutputs = [
    ['CTL used', outputs.CTL],
    ['Corrected Volume (Vcorr)', outputs.Vcorr_inUnit],
    ['Volume Unit', outputs.unitV],
    ['Mass (kg)', outputs.massKg],
    ['Energy (MJ)', outputs.energyMJ],
