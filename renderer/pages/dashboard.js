async function renderDashboard(container) {
    const bales = await window.api.getBales();
    const sales = await window.api.getSales();
    const analytics = await window.api.getAnalytics();
    const adv = await window.api.getAdvancedAnalytics();
    
    // Logic Calculations
    const totalStock = bales.reduce((sum, b) => sum + (b.remaining_weight || 0), 0);
    const lowStockCount = bales.filter(b => b.remaining_weight < 20).length;
    
    // Monthly Sales Calculation (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlySales = sales
        .filter(s => new Date(s.date) >= thirtyDaysAgo)
        .reduce((sum, s) => sum + s.weight_sold, 0);

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
                <h1>Dashboard</h1>
                <p class="subtitle">Welcome back, Cutie. Here is what's happening today.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-primary" onclick="navigate('add')" style="background: var(--accent); display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Bale
                </button>
                <button class="btn-primary" onclick="navigate('sales')" style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Record Sale
                </button>
            </div>
        </div>

        <div class="stat-grid">
            <div class="card stat-card">
                <div>
                    <span class="stat-label">Total Bales</span>
                    <span class="stat-value">${bales.length}</span>
                </div>
                <div class="stat-icon-circle orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                </div>
            </div>

            <div class="card stat-card">
                <div>
                    <span class="stat-label">Stock On Hand</span>
                    <span class="stat-value">${totalStock.toFixed(2)} <small style="font-size: 14px;">kg</small></span>
                </div>
                <div class="stat-icon-circle blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10v12h10V10M5 10h14l-1-7H6l-1 7Z"/><path d="M12 10v12"/></svg>
                </div>
            </div>

            <div class="card stat-card">
                <div>
                    <span class="stat-label">Monthly Sales</span>
                    <span class="stat-value" style="color: var(--success);">${monthlySales.toFixed(1)} <small style="font-size: 14px;">kg</small></span>
                </div>
                <div class="stat-icon-circle green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
            </div>

            <div class="card stat-card">
                <div>
                    <span class="stat-label">Dead Stock</span>
                    <span class="stat-value" style="color: var(--danger);">${adv.deadStock.length}</span>
                </div>
                <div class="stat-icon-circle red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Low Stock Alerts
                    </h3>
                    <button class="btn-secondary" onclick="navigate('inventory')" style="font-size: 12px; padding: 4px 8px;">View All</button>
                </div>
${lowStockCount === 0 ? '<p class="empty">All stock levels healthy.</p>' : 
    bales.filter(b => b.remaining_weight < 20).slice(0, 5).map(b => `
        <div class="alert-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <span><strong>#${b.bale_number}</strong> - ${b.shade} (${b.brand})</span>
            <span style="color: var(--danger); font-weight: 700;">${b.remaining_weight.toFixed(2)}kg</span>
        </div>
    `).join('')
}
            </div>

            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Recent Sales
                    </h3>
                    <button class="btn-secondary" onclick="navigate('sales')" style="font-size: 12px; padding: 4px 8px;">Full Ledger</button>
                </div>
                ${sales.length === 0 ? '<p class="empty">No recent transactions.</p>' : 
                    sales.slice(0, 5).map(s => `
                        <div class="sale-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                            <div>
                                <strong style="display: block;">${s.party_name}</strong>
                                <small style="color: var(--text-muted);">${s.shade} — #${s.bale_number}</small>
                            </div>
                            <span style="color: var(--success); font-weight: 700;">-${s.weight_sold.toFixed(2)} kg</span>
                        </div>
                    `).join('')
                }
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                Top Moving Shades
            </h3>
            <div style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px;">
                ${analytics.length === 0 ? '<p class="empty">Not enough data yet.</p>' : 
                    analytics.slice(0, 6).map(a => `
                    <div style="min-width: 140px; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid var(--border);">
                        <span style="font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">SHADE ${a.shade}</span>
                        <div style="font-size: 18px; font-weight: 800; margin-top: 5px;">${a.total_sold.toFixed(1)} <small style="font-size: 12px; color: var(--text-muted);">kg</small></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}