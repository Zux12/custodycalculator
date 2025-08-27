const unitToM3 = { m3:1, L:0.001, bbl:0.1589872949, galUS:0.003785411784 };

document.getElementById("ctlMode").addEventListener("change", e=>{
  document.getElementById("alphaBox").style.display = e.target.value==="approx"?"block":"none";
  document.getElementById("ctlBox").style.display   = e.target.value==="manual"?"block":"none";
});

function calcCTLApprox(alpha, T, Tref){ return Math.exp(-alpha*(T-Tref)); }

function calc(){
  const V = parseFloat(document.getElementById("V").value);
  const unitV = document.getElementById("unitV").value;
  const T = parseFloat(document.getElementById("T").value);
  const Tref = parseFloat(document.getElementById("Tref").value);
  const mode = document.getElementById("ctlMode").value;
  const alpha = parseFloat(document.getElementById("alpha").value);
  const CTLmanual = parseFloat(document.getElementById("CTL").value);
  const rho = parseFloat(document.getElementById("rho").value);
  const hhv = parseFloat(document.getElementById("hhv").value);

  if(isNaN(V)||isNaN(T)||isNaN(Tref)){ alert("Enter values"); return; }

  let CTL;
  if(mode==="manual"){
    if(!(CTLmanual>0)){ alert("Enter CTL"); return; }
    CTL=CTLmanual;
  } else {
    CTL=calcCTLApprox(alpha,T,Tref);
  }

  const V_m3 = V*unitToM3[unitV];
  const Vcorr_m3 = V_m3*CTL;
  const Vcorr_inUnit = Vcorr_m3/unitToM3[unitV];
  let massKg=null,energyMJ=null;
  if(rho>0){ massKg=Vcorr_m3*rho; if(hhv>0) energyMJ=massKg*hhv; }

  const res = `
    <p><b>CTL:</b> ${CTL.toPrecision(6)}</p>
    <p><b>Corrected Volume:</b> ${Vcorr_inUnit.toPrecision(6)} ${unitV}</p>
    ${massKg? `<p><b>Mass:</b> ${massKg.toFixed(2)} kg</p>`:""}
    ${energyMJ? `<p><b>Energy:</b> ${energyMJ.toFixed(2)} MJ</p>`:""}
  `;
  document.getElementById("results").innerHTML=res;

  // Save to localStorage
  localStorage.setItem("lastResult",JSON.stringify({V,unitV,T,Tref,CTL,Vcorr_inUnit,massKg,energyMJ}));
}

function exportXLSX(){
  const res = JSON.parse(localStorage.getItem("lastResult")||"{}");
  if(!res.V){ alert("No result to export"); return; }
  const data=[["Input Volume",res.V,res.unitV],
              ["Measured Temp",res.T,"°C"],
              ["Reference Temp",res.Tref,"°C"],
              ["CTL",res.CTL,""],
              ["Corrected Volume",res.Vcorr_inUnit,res.unitV],
              ["Mass (kg)",res.massKg||"",""],
              ["Energy (MJ)",res.energyMJ||"",""]];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"CustodyCalc");
  XLSX.writeFile(wb,"custody_calculation.xlsx");
}

function openDoc(){
  const url=document.getElementById("docSelect").value;
  if(url) window.open(url,"_blank");
}

function openDisclaimer(){ document.getElementById("disclaimerModal").style.display="block"; }
function closeDisclaimer(){ document.getElementById("disclaimerModal").style.display="none"; }
