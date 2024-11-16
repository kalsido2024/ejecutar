let activeInput = null;

// Altitud fija de 376 metros
const altitude = 376;

function openKeyboard(inputId) {
    activeInput = document.getElementById(inputId);
    document.getElementById("keyboard").style.display = "grid";
}

function addKey(key) {
    if (activeInput) {
        activeInput.value += key;
        calculate(); // Llama al cálculo después de cada entrada
    }
}

function clearKey() {
    if (activeInput) {
        activeInput.value = "";
        calculate(); // Llama al cálculo después de limpiar
    }
}

function calculate() {
    // Obtener valores de entrada
    const temp = parseFloat(document.getElementById("temp").value);
    const tbh = parseFloat(document.getElementById("tbh").value);
    const qfe = parseFloat(document.getElementById("qfe").value);

    // Verificar si todos los campos tienen valores válidos
    if (isNaN(temp) || isNaN(tbh) || isNaN(qfe)) {
        document.getElementById("results").style.display = "none";
        return;
    }

    // Constantes
    const lapseRate = 0.0065; // Gradiente de temperatura (°C/m)
    const g = 9.80665; // Gravedad (m/s²)
    const R = 287.05; // Constante específica del aire (J/(kg·K))
    const tempKelvin = temp + 273.15;

    // Cálculo de QNH
    const seaLevelTemp = tempKelvin + (lapseRate * altitude);
    const qnhHpa = qfe * Math.pow((1 - (lapseRate * altitude) / seaLevelTemp), -g / (R * lapseRate));
    const qnhInHg = qnhHpa * 0.02953;

    // Cálculo de QFF
    const qff = qfe * Math.exp((altitude * g) / (R * tempKelvin));

    // Cálculo del Punto de Rocío usando TBH
    const dewPoint = tbh;

    // Cálculo de Humedad Relativa (HR)
    const es = 6.112 * Math.exp((17.67 * temp) / (temp + 243.5)); // Presión de saturación
    const e = 6.112 * Math.exp((17.67 * dewPoint) / (dewPoint + 243.5)); // Presión de vapor
    const hr = (e / es) * 100;

    // Mostrar resultados (redondeados a un decimal y HR a entero)
    document.getElementById("qnhHpa").textContent = qnhHpa.toFixed(1);
    document.getElementById("qnhInHg").textContent = qnhInHg.toFixed(1);
    document.getElementById("qff").textContent = qff.toFixed(1);
    document.getElementById("dewPoint").textContent = dewPoint.toFixed(1);
    document.getElementById("hr").textContent = Math.round(hr); // Redondeo a entero
    document.getElementById("results").style.display = "block";
}