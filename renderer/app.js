let content;

document.addEventListener("DOMContentLoaded", () => {
    content = document.getElementById("content");
    navigate("dashboard");
});

async function navigate(page) {
    // Update Sidebar Active UI
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-page') === page);
    });

    content.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading...</div>';

    switch(page) {
        case 'dashboard': await renderDashboard(content); break;
        case 'inventory': await renderInventory(content); break;
        case 'add': renderAddBale(content); break;
        case 'sales': await renderSales(content); break;
        case 'analytics': await renderAnalytics(content); break;
    }
}