// renderer/pages/addBale.js

async function renderAddBale(container) {
    // 1. Fetch existing bales to extract unique suggestions
    const allBales = await window.api.getBales();
    
    // 2. Extract unique values for suggestions
    const brands = [...new Set(allBales.map(b => b.brand))].sort();
    const types = [...new Set(allBales.map(b => b.yarn_type))].sort();
    const shades = [...new Set(allBales.map(b => b.shade))].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

    container.innerHTML = `
        <h1>Add Bale</h1>
        <p class="subtitle">Register a new bale. Suggestions are pulled from your current database.</p>

        <div class="card" style="max-width: 800px;">
            <div class="form-grid">
                <div class="input-group">
                    <label>Bale Number *</label>
                    <input id="bale_no" placeholder="e.g., B-115806">
                </div>

                <div class="input-group">
                    <label>Brand *</label>
                    <input id="brand" list="brand-suggestions" placeholder="Select or type brand">
                    <datalist id="brand-suggestions">
                        ${brands.map(b => `<option value="${b}">`).join('')}
                    </datalist>
                </div>

                <div class="input-group">
                    <label>Yarn Type *</label>
                    <input id="type" list="type-suggestions" placeholder="Select or type type">
                    <datalist id="type-suggestions">
                        ${types.map(t => `<option value="${t}">`).join('')}
                    </datalist>
                </div>

                <div class="input-group">
                    <label>Shade Number *</label>
                    <input id="shade" list="shade-suggestions" placeholder="Select or type shade">
                    <datalist id="shade-suggestions">
                        ${shades.map(s => `<option value="${s}">`).join('')}
                    </datalist>
                </div>

                <div class="input-group">
                    <label>Lot Number</label>
                    <input id="lot_no" placeholder="e.g., L-502">
                </div>

                <div class="input-group">
                    <label>Weight per Bundle (kg) *</label>
                    <input id="wpb" type="number" step="0.01" oninput="calcNet()" placeholder="0.00">
                </div>
                <div class="input-group">
                    <label>Number of Bundles *</label>
                    <input id="bundles" type="number" oninput="calcNet()" placeholder="0">
                </div>
                <div class="input-group">
                    <label>Gross Weight (kg) *</label>
                    <input id="gross" type="number" step="0.01" placeholder="0.00">
                </div>
                <div class="input-group">
                    <label>Net Weight (kg)</label>
                    <input id="net_disp" disabled class="disabled-input" value="0.00">
                </div>
            </div>
            <button class="btn-primary" onclick="saveBale()" style="width:100%; margin-top:30px;">Add Bale</button>
        </div>
    `;
}

function calcNet() {
    const w = parseFloat(document.getElementById('wpb').value) || 0;
    const b = parseInt(document.getElementById('bundles').value) || 0;
    document.getElementById('net_disp').value = (w * b).toFixed(2);
}

async function saveBale() {
    const data = {
        bale_number: document.getElementById('bale_no').value,
        brand: document.getElementById('brand').value,
        yarn_type: document.getElementById('type').value,
        shade: document.getElementById('shade').value,
        lot: document.getElementById('lot_no').value || "N/A",
        weight_per_bundle: parseFloat(document.getElementById('wpb').value),
        bundles: parseInt(document.getElementById('bundles').value),
        nett_weight: parseFloat(document.getElementById('net_disp').value),
        gross_weight: parseFloat(document.getElementById('gross').value),
        date: new Date().toISOString()
    };

    if (!data.bale_number || !data.brand || isNaN(data.nett_weight)) {
        alert("Please fill all required fields correctly.");
        return;
    }

    await window.api.addBale(data);
    navigate('inventory');
}