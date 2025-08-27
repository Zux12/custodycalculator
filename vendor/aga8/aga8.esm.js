var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _AGA8wasm from "./aga8.js";
import { Polyfit } from "@sctg/polyfitjs";
import _nistGasMixture from "./NG_Compositions.json" with { type: "json" };
export const R = 8.31446261815324; // Universal gas constant in J/(mol·K)
export const nistGasMixture = _nistGasMixture;
export const pureGasMixtures = [
    {
        name: "Air",
        gasMixture: {
            methane: 0,
            nitrogen: 0.7808,
            carbon_dioxide: 0,
            ethane: 0,
            propane: 0,
            isobutane: 0,
            n_butane: 0,
            isopentane: 0,
            n_pentane: 0,
            n_hexane: 0,
            n_heptane: 0,
            n_octane: 0,
            n_nonane: 0,
            n_decane: 0,
            hydrogen: 0,
            oxygen: 0.2095,
            carbon_monoxide: 0,
            water: 0.000400,
            hydrogen_sulfide: 0,
            helium: 0,
            argon: 0.009300,
        }
    },
    {
        /**
         * Pure methane gas mixture in mole fraction
         */
        name: "Methane",
        gasMixture: {
            methane: 1,
            nitrogen: 0,
            carbon_dioxide: 0,
            ethane: 0,
            propane: 0,
            isobutane: 0,
            n_butane: 0,
            isopentane: 0,
            n_pentane: 0,
            n_hexane: 0,
            n_heptane: 0,
            n_octane: 0,
            n_nonane: 0,
            n_decane: 0,
            hydrogen: 0,
            oxygen: 0,
            carbon_monoxide: 0,
            water: 0,
            hydrogen_sulfide: 0,
            helium: 0,
            argon: 0
        }
    },
    {
        /**
         * Pure nitrogen gas mixture in mole fraction
         */
        name: "Nitrogen",
        gasMixture: {
            methane: 0,
            nitrogen: 1,
            carbon_dioxide: 0,
            ethane: 0,
            propane: 0,
            isobutane: 0,
            n_butane: 0,
            isopentane: 0,
            n_pentane: 0,
            n_hexane: 0,
            n_heptane: 0,
            n_octane: 0,
            n_nonane: 0,
            n_decane: 0,
            hydrogen: 0,
            oxygen: 0,
            carbon_monoxide: 0,
            water: 0,
            hydrogen_sulfide: 0,
            helium: 0,
            argon: 0
        }
    },
    {
        name: "Hydrogen Sulfide",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 0.0,
            nitrogen: 0.0,
            carbon_dioxide: 0.0,
            water: 0.0,
            hydrogen_sulfide: 1.0,
            oxygen: 0,
            carbon_monoxide: 0,
            helium: 0,
            argon: 0,
        },
    },
    {
        name: "Carbon Monoxide",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 0.0,
            nitrogen: 0.0,
            carbon_dioxide: 0.0,
            water: 0.0,
            hydrogen_sulfide: 0.0,
            oxygen: 0,
            carbon_monoxide: 1.0,
            helium: 0.0,
            argon: 0.0,
        },
    },
    {
        name: "Carbon Dioxide",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 0.0,
            nitrogen: 0.0,
            carbon_dioxide: 1.0,
            water: 0.0,
            hydrogen_sulfide: 0.0,
            oxygen: 0,
            carbon_monoxide: 0,
            helium: 0,
            argon: 0,
        },
    },
    {
        name: "Hydrogen",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 1.0,
            nitrogen: 0.0,
            carbon_dioxide: 0.0,
            water: 0.0,
            hydrogen_sulfide: 0.0,
            oxygen: 0,
            carbon_monoxide: 0,
            helium: 0,
            argon: 0,
        },
    },
    { name: "Oxygen",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 0.0,
            nitrogen: 0.0,
            carbon_dioxide: 0.0,
            water: 0.0,
            hydrogen_sulfide: 0.0,
            oxygen: 1.0,
            carbon_monoxide: 0,
            helium: 0,
            argon: 0,
        },
    },
    {
        name: "Helium",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 0.0,
            nitrogen: 0.0,
            carbon_dioxide: 0.0,
            water: 0.0,
            hydrogen_sulfide: 0.0,
            oxygen: 0,
            carbon_monoxide: 0,
            helium: 1.0,
            argon: 0,
        },
    },
    {
        name: "Argon",
        gasMixture: {
            methane: 0.0,
            ethane: 0.0,
            propane: 0.0,
            n_butane: 0.0,
            isobutane: 0.0,
            n_pentane: 0.0,
            isopentane: 0.0,
            n_hexane: 0.0,
            n_heptane: 0.0,
            n_octane: 0.0,
            n_nonane: 0.0,
            n_decane: 0.0,
            hydrogen: 0.0,
            nitrogen: 0.0,
            carbon_dioxide: 0.0,
            water: 0.0,
            hydrogen_sulfide: 0.0,
            oxygen: 0,
            carbon_monoxide: 0,
            helium: 0,
            argon: 1.0,
        },
    }
];
/**
 * Available gas mixtures
 * Air, Nitrogen, Methane, NIST Reference Gas Mixture and all NIST Gas Mixtures
 * @see https://pages.nist.gov/AGA8/#:~:text=AGA8.xls%20%E2%80%93%20This%20Excel%20spreadsheet%20can%20be%20used,the%20DETAIL%2C%20GROSS%2C%20and%20GERG-2008%20equations%20of%20state.
 *
 */
export const availableGasMixtures = [
    ...pureGasMixtures,
    ...nistGasMixture,
];
/**
 * Compute the discharge coefficient for a toroidal nozzle given the Reynolds number
 * cf: https://www.methyinfra.ptb.de/fileadmin/documents/empir-2021/methyinfra/documents/MetHyInfra_Nozzle_WS_MacDonald_Introduction_to_Sonic_Nozzles_and_ISO_9300.pdf p16
 * @param Re_thoroidal - Reynolds number for thoroidal nozzle
 */
export function getThoroidalNozzleDischargeCoefficient(Re_thoroidal) {
    const Cd_a = 0.9959; // Constant for toroidal nozzle
    const Cd_b = 2.72; // Reynolds number factor for toroidal nozzle
    const Cd_n = 0.5; // Reynolds number exponent for toroidal nozzle
    const Cd = Cd_a - Cd_b * Math.pow(Re_thoroidal, (Cd_n * -1));
    return Cd;
}
/**
 * Compute the maximal outlet pressure for a given inlet pressure and critical flow
 * @param inletPressure
 * @param criticalFlow
 */
export function getMaximalOutletPressure(inletPressure, criticalFlow) {
    const p_crit = inletPressure * criticalFlow;
    return p_crit;
}
/**
* Compute the mass flow rate through a sonic nozzle at sonic conditions
* @param propertiesMethod - Method to compute properties
* @param gasMixture - Gas mixture composition
* @param inletPressure - Inlet pressure in kPa
* @param outletPressure - Outlet pressure in kPa
* @param temperature - Temperature in K
* @param orificeDiameter - Orifice diameter in mm
* @param orificeReynoldsNumber - Reynolds number for the orifice
* @param AGA8 - AGA8 module or undefined to load it
* @param datasetSteps - Number of elements for the dataset
* @returns {number} - Mass flow rate in kg/s
*/
export function getMassFlowRateDataset(propertiesMethod, gasMixture, inletPressureRange, outletPressure, temperature, orificeDiameter, orificeReynoldsNumber, AGA8, datasetSteps) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = [];
        const minPressure = inletPressureRange.min; //doubleSlider.value?.from || DoubleRange.props.defaultMin;
        const maxPressure = inletPressureRange.max; //doubleSlider.value?.to || DoubleRange.props.defaultMax;
        if (datasetSteps === undefined) {
            datasetSteps = 1000;
        }
        if (AGA8 === undefined) {
            AGA8 = yield AGA8wasm();
        }
        console.warn(`Pressure range: ${minPressure} to ${maxPressure}`);
        if (!AGA8) {
            console.warn("AGA8 module is not loaded");
            throw new Error("AGA8 module is not loaded");
        }
        let properties;
        let molarMass = 0; // Molar mass in g/mol
        /** Discharge coefficient for thoroidal nozzle */
        const Cd = getThoroidalNozzleDischargeCoefficient(orificeReynoldsNumber); // Discharge coefficient
        /** Orifice area */
        const A = Math.PI * Math.pow((orificeDiameter / 1000 / 2), 2); // m^2
        const SetupFunction = propertiesMethod === "DETAIL" ? AGA8.SetupDetail : AGA8.SetupGERG;
        const MolarMassFunction = propertiesMethod === "DETAIL" ? AGA8.MolarMassDetail : AGA8.MolarMassGERG;
        const PropertiesFunction = propertiesMethod === "DETAIL" ? AGA8.PropertiesDetail : AGA8.PropertiesGERG;
        SetupFunction();
        molarMass = MolarMassFunction(gasMixture); // g/mol
        const molarMassSI = molarMass / 1000; // kg/mol (SI units)
        const { D: D_out } = propertiesMethod === "DETAIL"
            ? AGA8.DensityDetail(temperature, outletPressure, gasMixture)
            : AGA8.DensityGERG(2, temperature, outletPressure, gasMixture); // mol/l
        const rho_out = D_out * 1000 * molarMassSI; // kg/m³
        const { D: D_1atm } = propertiesMethod === "DETAIL"
            ? AGA8.DensityDetail(temperature, 101.325, gasMixture)
            : AGA8.DensityGERG(2, temperature, 101.325, gasMixture); // mol/l
        const rho_1atm = D_1atm * 1000 * molarMassSI; // kg/m³
        for (let i = 0; i < datasetSteps; i++) {
            const P = minPressure + (i * (maxPressure - minPressure)) / datasetSteps;
            const { D } = propertiesMethod === "DETAIL"
                ? AGA8.DensityDetail(temperature, P, gasMixture)
                : AGA8.DensityGERG(2, temperature, P, gasMixture); // mol/l
            properties = PropertiesFunction(temperature, D, gasMixture);
            // Extract critical flow factor (Cf)
            const Cf = properties.Cf;
            /** Specific gas constant */
            const Rs = R / molarMassSI; // J/(kg·K)
            // Nozzle specific coefficient
            const Kn = (Cd * Cf * (P * 1000)) / Math.sqrt(Rs * temperature);
            // Calculate mass flow rate
            // Q = Cd * Cf * A * P / sqrt(Rs * T)
            // Q = Kn * A
            const massFlow = getMaximalOutletPressure(P, Cf) < outletPressure ? NaN : Kn * A; // kg/s
            output.push({
                massFlowRate: massFlow,
                volumeFlowRateAtOutputPressure: massFlow / rho_out,
                volumeFlowRateAt1atm: massFlow / rho_1atm,
                temperature,
                pressure: P,
                crticalPresure: getMaximalOutletPressure(P, Cf),
                specificNozzleCoefficient: Kn,
                kappa: properties.Kappa,
                Cf: properties.Cf,
                M: molarMassSI
            });
            //Kn is used for computing the diameter knowing the mass flow rate
            // A = Q / Kn
            // ∏ * (D/2)^2 = Q / Kn
            // D = sqrt(4 * Q / (Kn * ∏))
        }
        console.warn(`Mass flow rate at mid range: ${output[datasetSteps / 2].massFlowRate.toPrecision(4)} kg/s 
      Volume flow rate at mid range: ${output[datasetSteps / 2].volumeFlowRateAtOutputPressure.toPrecision(4)}m³/s Pressure: ${output[datasetSteps / 2].pressure} kPa, Temperature: ${output[datasetSteps / 2].temperature} K
        Critical pressure: ${output[datasetSteps / 2].crticalPresure} kPa`);
        // Polyfit
        const x = [];
        const y = [];
        for (let i = 0; i < output.length; i++) {
            if (!isNaN(output[i].massFlowRate)) {
                x.push(output[i].pressure);
                y.push(output[i].massFlowRate);
            }
        }
        return output;
    });
}
/**
 * Clean the dataset for removing NaN values and compute the polynomial fit
 * @param x the x values
 * @param y the f(x) values
 * @param maxDegree the maximum degree of the polynomial (optional default 100)
 * @param minCorrelation the minimum correlation coefficient (optional default 0.999)
 * @returns {terms: NumberArray, correlation: number} - Polynomial terms and correlation coefficient
 */
export function getPolyfitFlow(x, y, maxDegree, minCorrelation) {
    const _x = [];
    const _y = [];
    if (maxDegree === undefined) {
        maxDegree = 100;
    }
    if (minCorrelation === undefined) {
        minCorrelation = 0.999;
    }
    if (x.length !== y.length) {
        throw new Error("x and y arrays must have the same length");
    }
    else {
        for (let i = 0; i < x.length; i++) {
            if (!isNaN(y[i])) {
                _x.push(x[i]);
                _y.push(y[i]);
            }
        }
        const _x64 = new Float64Array(_x);
        const _y64 = new Float64Array(_y);
        const polyfit = new Polyfit(_x64, _y64);
        const terms = polyfit.computeBestFit(maxDegree, minCorrelation);
        return { terms, correlation: polyfit.correlationCoefficient(terms) };
    }
}
export function AGA8wasm() { return _AGA8wasm(); }
;
