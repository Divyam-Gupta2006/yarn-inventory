// renderer/pages/inventory.js

/**
 * RENDER INVENTORY
 * Aggregates individual bales into unique "Stock Positions"
 */
async function renderInventory(container) {
    const allBales = await window.api.getBales();

    // 1. Get unique values for dropdowns (Only from active stock)
    const activeBales = allBales.filter(b => b.remaining_weight > 0);
    const uniqueBrands = [...new Set(activeBales.map(b => b.brand))].sort();
    const uniqueTypes = [...new Set(activeBales.map(b => b.yarn_type))].sort();
    const uniqueShades = [...new Set(activeBales.map(b => b.shade))].sort((a, b) => 
        a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );

    // 2. Grouping logic
    const stockMap = {};
    activeBales.forEach(b => {
        const key = `${b.brand}-${b.yarn_type}-${b.shade}`;
        if (!stockMap[key]) {
            stockMap[key] = {
                brand: b.brand,
                type: b.yarn_type,
                shade: b.shade,
                totalWeight: 0,
                totalBundles: 0,
                bales: []
            };
        }
        stockMap[key].totalWeight += b.remaining_weight;
        // Calculate estimated bundles based on remaining weight / weight per bundle
        stockMap[key].totalBundles += (b.remaining_weight / (b.weight_per_bundle || 1));
        stockMap[key].bales.push(b);
    });

    const stockItems = Object.values(stockMap);

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px;">
            <div>
                <h1>Inventory Stock</h1>
                <p class="subtitle">Aggregated stock positions by brand, type, and shade.</p>
            </div>
            <button class="btn-primary" onclick="navigate('add')" style="display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add New Bale
            </button>
        </div>

        <div class="card" style="margin-bottom: 30px; display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr auto; gap: 12px; align-items: end; padding: 20px;">

            <div class="input-group">
                <label style="font-size: 0.65rem; color: var(--text-muted); font-weight: 800; text-transform:uppercase; letter-spacing:0.5px;">Brand</label>
                <select id="filterBrand" onchange="applyStockFilters()">
                    <option value="All">All Brands</option>
                    ${uniqueBrands.map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
            </div>
            <div class="input-group">
                <label style="font-size: 0.65rem; color: var(--text-muted); font-weight: 800; text-transform:uppercase; letter-spacing:0.5px;">Type</label>
                <select id="filterType" onchange="applyStockFilters()">
                    <option value="All">All Types</option>
                    ${uniqueTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </div>
            <div class="input-group">
                <label style="font-size: 0.65rem; color: var(--text-muted); font-weight: 800; text-transform:uppercase; letter-spacing:0.5px;">Shade No.</label>
                <select id="filterShade" onchange="applyStockFilters()">
                    <option value="All">All Shades</option>
                    ${uniqueShades.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </div>
            <button class="btn-secondary" onclick="clearStockFilters()" style="height: 42px; background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-weight: 600; padding: 0 20px;">
                Reset
            </button>
        </div>

        <div id="stockGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
            ${stockItems.length === 0 ? '<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No stock currently available in the warehouse.</div>' : 
                stockItems.map(item => `
                <div class="card stock-card" 
                     data-brand="${item.brand}" 
                     data-type="${item.type}" 
                     data-shade="${item.shade}"
                     onclick='openStockDetail(${JSON.stringify(item).replace(/'/g, "&apos;")})'
                     style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid var(--border);">
                    
                    <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span class="stat-label" style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem;">${item.brand}</span>
                            <h3 style="margin: 10px 0 2px 0; font-size: 1.5rem; font-weight: 800; color: var(--text-main);">${item.shade}</h3>
                            <div style="font-size: 0.85rem; font-weight: 600; color: var(--accent);">${item.type}</div>
                        </div>
                        <div style="background: #fff7ed; color: var(--accent); padding: 8px; border-radius: 8px;">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 5px;">
                        <div>
                            <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Weight</div>
                            <div style="font-size: 1.3rem; font-weight: 800;">${item.totalWeight.toFixed(2)} <small style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">kg</small></div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Estimated Bundles</div>
                            <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">${Math.floor(item.totalBundles)} <small style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">pcs</small></div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div id="stockOverlay" class="modal-overlay" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); align-items: center; justify-content: center; z-index: 1000;" onclick="closeStockDetail()">
            <div class="modal-content card" style="width: 700px; max-height: 90vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <div id="overlayContent"></div>
                <button class="btn-primary" onclick="closeStockDetail()" style="width: 100%; margin-top: 25px; background: var(--text-main);">Close Details</button>
            </div>
        </div>
    `;
}

/* ================= FILTER LOGIC ================= */
function applyStockFilters() {
    const search = document.getElementById('searchShade')?.value.toLowerCase() || "";
    const brand = document.getElementById('filterBrand')?.value || "All";
    const type = document.getElementById('filterType')?.value || "All";
    const shadeDropdown = document.getElementById('filterShade')?.value || "All";

    const cards = document.querySelectorAll('.stock-card');

    cards.forEach(card => {
        const cBrand = card.getAttribute('data-brand');
        const cType = card.getAttribute('data-type');
        const cShade = card.getAttribute('data-shade');
        
        const matchesSearch = cShade.toLowerCase().includes(search);
        const matchesBrand = (brand === "All" || cBrand === brand);
        const matchesType = (type === "All" || cType === type);
        const matchesShadeDropdown = (shadeDropdown === "All" || cShade === shadeDropdown);

        if (matchesSearch && matchesBrand && matchesType && matchesShadeDropdown) {
            card.style.display = "flex";
            card.style.flexDirection = "column";
        } else {
            card.style.display = "none";
        }
    });
}

function clearStockFilters() {
    if (document.getElementById('searchShade')) document.getElementById('searchShade').value = "";
    if (document.getElementById('filterBrand')) document.getElementById('filterBrand').value = "All";
    if (document.getElementById('filterType')) document.getElementById('filterType').value = "All";
    if (document.getElementById('filterShade')) document.getElementById('filterShade').value = "All";
    applyStockFilters();
}

/* ================= MODAL LOGIC ================= */
function openStockDetail(item) {
    const overlay = document.getElementById('stockOverlay');
    const content = document.getElementById('overlayContent');

    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--accent); padding-bottom: 20px; margin-bottom: 25px;">
            <div>
                <span class="stat-label" style="background: #f1f5f9; padding: 4px 10px; border-radius: 6px;">${item.brand}</span>
                <h2 style="margin: 10px 0 0 0; font-size: 2.5rem; letter-spacing: -1px;">${item.shade}</h2>
                <div style="font-weight: 700; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; margin-top: 5px;">${item.type}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--accent);">${item.totalWeight.toFixed(2)} kg</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Inventory across ${item.bales.length} Bales</div>
            </div>
        </div>

        <div style="margin-bottom: 15px; font-weight: 800; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Specific Bale Breakdown</div>
        
        <div style="border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
            <table style="width: 100%; border-spacing: 0;">
                <thead style="background: #f8fafc;">
                    <tr>
                        <th style="border-bottom: 1px solid var(--border);">Bale Number</th>
                        <th style="border-bottom: 1px solid var(--border);">Lot Number</th>
                        <th style="border-bottom: 1px solid var(--border); text-align: right;">Current Stock</th>
                    </tr>
                </thead>
                <tbody>
                    ${item.bales.map(b => `
                        <tr>
                            <td style="border-bottom: 1px solid var(--border);"><strong>#${b.bale_number}</strong></td>
                            <td style="border-bottom: 1px solid var(--border);"><span class="badge" style="background: #eff6ff; color: #1e40af; border: none; font-weight: 700;">${b.lot}</span></td>
                            <td style="border-bottom: 1px solid var(--border); text-align: right; font-weight: 800; font-size: 1rem;">${b.remaining_weight.toFixed(2)} <small>kg</small></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    overlay.style.display = 'flex';
}

function closeStockDetail() {
    const overlay = document.getElementById('stockOverlay');
    if (overlay) overlay.style.display = 'none';
}