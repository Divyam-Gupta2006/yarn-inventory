// renderer/pages/analytics.js
async function renderAnalytics(container) {
    const bales = await window.api.getBales();
    const sales = await window.api.getSales();
    const adv = await window.api.getAdvancedAnalytics();

    const totalStock = bales.reduce((s, b) => s + (b.remaining_weight || 0), 0);
    const deadStockWeight = adv.deadStock.reduce((s, b) => s + (b.remaining_weight || 0), 0);
    const lowStockCount = bales.filter(b => b.remaining_weight < 20).length;
    
    const totalKgSold = sales.reduce((s, x) => s + x.weight_sold, 0);
    const avgSale = sales.length > 0 ? (totalKgSold / sales.length).toFixed(1) : 0;
    const maxSaleVal = adv.trends.length > 0 ? Math.max(...adv.trends.map(t => t.total)) : 100;

    container.innerHTML = `
        <h1>Business Intelligence</h1>
        <p class="subtitle">Operational insights for JJ Woollen Industries.</p>

        <div class="stat-grid">
            <div class="card stat-card">
                <div>
                    <span class="stat-label">Inventory Value</span>
                    <span class="stat-value">${totalStock.toFixed(1)}<small>kg</small></span>
                </div>
                <div class="stat-icon-circle blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </div>
            </div>
            <div class="card stat-card">
                <div>
                    <span class="stat-label">Dead Stock</span>
                    <span class="stat-value" style="color:var(--danger)">${deadStockWeight.toFixed(1)}<small>kg</small></span>
                </div>
                <div class="stat-icon-circle red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                </div>
            </div>
            <div class="card stat-card">
                <div>
                    <span class="stat-label">Low Stock</span>
                    <span class="stat-value">${lowStockCount}</span>
                </div>
                <div class="stat-icon-circle orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
            </div>
            <div class="card stat-card">
                <div>
                    <span class="stat-label">Avg. Sale</span>
                    <span class="stat-value">${avgSale}<small>kg</small></span>
                </div>
                <div class="stat-icon-circle green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            
            <div class="card">
                <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom:15px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <h3 style="margin:0;">Stock Health Alerts</h3>
                </div>
                <label style="font-size:0.65rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px;">Dead Stock (> 30 Days)</label>
                <div style="margin-top:10px;">
                    ${adv.deadStock.length === 0 ? '<p class="empty">Excellent! No dead stock found.</p>' : 
                        adv.deadStock.map(b => `
                        <div class="alert-item" style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc;">
                            <span><strong>#${b.bale_number}</strong> — ${b.shade}</span>
                            <span style="font-weight:700;">${b.remaining_weight.toFixed(1)}kg</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom:15px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <h3 style="margin:0;">Top Customers</h3>
                </div>
                <table style="margin-top: 10px;">
                    <thead>
                        <tr><th>Party Name</th><th style="text-align:right">Total Vol.</th></tr>
                    </thead>
                    <tbody>
                        ${adv.customers.length === 0 ? '<tr><td colspan="2" class="empty">No sales recorded.</td></tr>' : 
                            adv.customers.map(c => `
                            <tr>
                                <td><strong>${c.party_name}</strong><br><small style="color:var(--text-muted)">${c.visit_count} transactions</small></td>
                                <td style="text-align:right; font-weight:700;">${c.total_kg.toFixed(1)} kg</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <h3 style="margin:0;">Sales Trend (Last 7 Days)</h3>
            </div>
            <div style="display:flex; align-items:flex-end; gap:20px; height:200px; padding:20px 10px 10px 10px; background: #fdfdfd; border-radius: 8px;">
                ${adv.trends.length === 0 ? '<p class="empty" style="width:100%; text-align:center;">Insufficient data for trends.</p>' : 
                    adv.trends.map(t => {
                        const height = Math.max((t.total / maxSaleVal) * 100, 5); 
                        return `
                            <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content: flex-end;">
                                <span style="font-size:0.7rem; font-weight:700; margin-bottom:5px;">${t.total.toFixed(0)}</span>
                                <div style="width:100%; max-width:40px; background:var(--accent); height:${height}%; border-radius:4px 4px 0 0; transition: height 0.3s ease;"></div>
                                <small style="font-size:0.6rem; color:var(--text-muted); margin-top:8px; font-weight:600;">${t.day.split('-')[2]}/${t.day.split('-')[1]}</small>
                            </div>
                        `;
                    }).join('')
                }
            </div>
        </div>
    `;
}