// renderer/pages/sales.js
async function renderSales(container) {
    const sales = await window.api.getSales();
    const bales = await window.api.getBales();

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px;">
            <div>
                <h1>Sales Ledger</h1>
                <p class="subtitle">Record sales by Weight or by Bundles.</p>
            </div>
            <button class="btn-primary" onclick="openSaleModal()">Record New Sale</button>
        </div>

        <div class="card no-padding">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Party Name</th>
                        <th>Bale & Shade</th>
                        <th>Quantity Sold</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted)">No sales recorded yet.</td></tr>' : 
                        sales.map(s => `
                        <tr>
                            <td style="color: var(--text-muted)">${new Date(s.date).toLocaleDateString()}</td>
                            <td><strong>${s.party_name}</strong></td>
                            <td>${s.brand} (#${s.bale_number}) <small style="display:block; color:var(--text-muted)">Shade: ${s.shade}</small></td>
                            <td><span style="font-weight: 700; color: #16a34a;">-${s.weight_sold.toFixed(2)} kg</span></td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>

        <div id="saleModal" class="modal-overlay" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000;">
            <div class="modal-content card" style="width: 400px; background: white; padding: 25px; border-radius: 12px;">
                <h3 style="margin-top:0">New Sales Entry</h3>
                
                <div class="input-group" style="margin-bottom:15px;">
                    <label>Party Name</label>
                    <input id="sale_party" placeholder="Buyer Name" style="width:100%">
                </div>

                <div class="input-group" style="margin-bottom:15px;">
                    <label>Select Bale</label>
                    <select id="sale_bale_id" onchange="updateBaleInfo()" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border)">
                        <option value="">-- Select Bale --</option>
                        ${bales.filter(b => b.remaining_weight > 0).map(b => `
                            <option value="${b.id}" data-wpb="${b.weight_per_bundle}" data-max="${b.remaining_weight}">
                                #${b.bale_number} - ${b.shade} (Avail: ${b.remaining_weight.toFixed(2)}kg)
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-bottom:15px; background:#f1f5f9; padding:5px; border-radius:8px;">
                    <button id="btnWeight" onclick="setSaleType('weight')" style="flex:1; border:none; padding:8px; border-radius:6px; cursor:pointer; background:var(--accent); color:white; font-weight:600;">By Weight</button>
                    <button id="btnBundles" onclick="setSaleType('bundles')" style="flex:1; border:none; padding:8px; border-radius:6px; cursor:pointer; background:transparent; color:var(--text-muted); font-weight:600;">By Bundles</button>
                </div>

                <div class="input-group" style="margin-bottom:20px;">
                    <label id="inputLabel">Weight to Sell (kg)</label>
                    <input id="sale_input_value" type="number" step="0.01" oninput="calculateSaleWeight()" style="width:100%">
                    <input id="final_weight" type="hidden"> 
                    <p id="calc_hint" style="font-size:0.8rem; color:var(--accent); margin-top:8px; font-weight:600;"></p>
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="btn-primary" onclick="submitSale()" style="flex:1;">Confirm Sale</button>
                    <button onclick="closeSaleModal()" style="flex:1; background:#f1f5f9; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Cancel</button>
                </div>
            </div>
        </div>
    `;
}

/* ================= MODAL & SALE LOGIC ================= */
let saleType = 'weight'; 

function openSaleModal() {
    const modal = document.getElementById('saleModal');
    if (modal) modal.style.display = 'flex';
}

function closeSaleModal() {
    const modal = document.getElementById('saleModal');
    if (modal) modal.style.display = 'none';
}

function setSaleType(type) {
    saleType = type;
    const isWeight = type === 'weight';
    
    document.getElementById('btnWeight').style.background = isWeight ? 'var(--accent)' : 'transparent';
    document.getElementById('btnWeight').style.color = isWeight ? 'white' : 'var(--text-muted)';
    document.getElementById('btnBundles').style.background = !isWeight ? 'var(--accent)' : 'transparent';
    document.getElementById('btnBundles').style.color = !isWeight ? 'white' : 'var(--text-muted)';
    
    document.getElementById('inputLabel').innerText = isWeight ? "Weight to Sell (kg)" : "Number of Bundles";
    document.getElementById('sale_input_value').value = "";
    document.getElementById('calc_hint').innerText = "";
    document.getElementById('final_weight').value = "";
}

function calculateSaleWeight() {
    const select = document.getElementById('sale_bale_id');
    if (select.selectedIndex === 0) return;

    const selected = select.options[select.selectedIndex];
    const inputValue = parseFloat(document.getElementById('sale_input_value').value) || 0;
    const wpb = parseFloat(selected.getAttribute('data-wpb')) || 0;
    
    let totalWeight = 0;

    if (saleType === 'bundles') {
        totalWeight = inputValue * wpb;
        document.getElementById('calc_hint').innerText = `Total weight: ${totalWeight.toFixed(2)} kg (${inputValue} bundles × ${wpb}kg)`;
    } else {
        totalWeight = inputValue;
        document.getElementById('calc_hint').innerText = "";
    }

    document.getElementById('final_weight').value = totalWeight;
}

function updateBaleInfo() {
    calculateSaleWeight();
}

async function submitSale() {
    const party = document.getElementById('sale_party').value;
    const bale_id = document.getElementById('sale_bale_id').value;
    const finalWeight = parseFloat(document.getElementById('final_weight').value);
    
    const select = document.getElementById('sale_bale_id');
    const max = parseFloat(select.options[select.selectedIndex].getAttribute('data-max'));

    if (!party || !bale_id || isNaN(finalWeight) || finalWeight <= 0) {
        alert("Please enter a valid party name and quantity.");
        return;
    }

    if (finalWeight > max) {
        alert(`Insufficient stock! You only have ${max.toFixed(2)}kg available.`);
        return;
    }

    try {
        const result = await window.api.sellBale({
            party: party,
            bale_id: parseInt(bale_id),
            weight_sold: finalWeight
        });

        if (result.success) {
            closeSaleModal();
            navigate('sales'); // Refresh view
        }
    } catch (error) {
        console.error("Sale Error:", error);
        alert("Transaction failed. Check console for details.");
    }
}