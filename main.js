const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Debug safety
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

// Load DB
require("./database/db");

function createWindow() {
  console.log("Creating window...");

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    show: true, // force show
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // ✅ Use absolute path (IMPORTANT FIX)
  const filePath = path.join(__dirname, "renderer", "index.html");
  console.log("Loading file:", filePath);

  win.loadFile(filePath);

  // Open DevTools to catch errors
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  console.log("App ready");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


// ================= IPC (Add Bale) =================
const db = require("./database/db");

ipcMain.handle("add-bale", (event, data) => {
  return new Promise((resolve, reject) => {
const query = `
  INSERT INTO bales 
  (brand, yarn_type, shade, lot, weight_per_bundle, bundles, nett_weight, gross_weight, bale_number, date, remaining_weight)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

db.run(
  query,
  [
    data.brand,
    data.yarn_type,
    data.shade,
    data.lot,
    data.weight_per_bundle,
    data.bundles,
    data.nett_weight,
    data.gross_weight,
    data.bale_number,
    data.date,
    data.nett_weight
  ],
      function (err) {
        if (err) reject(err.message);
        else resolve({ id: this.lastID });
      }
    );
  });
});

ipcMain.handle("get-bales", () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM bales ORDER BY id DESC", [], (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });
});

ipcMain.handle("sell-bale", (event, data) => {
  return new Promise((resolve, reject) => {

    // 1. Get current remaining weight
    db.get(
      "SELECT remaining_weight FROM bales WHERE id = ?",
      [data.bale_id],
      (err, row) => {
        if (err) return reject(err.message);
        if (!row) return reject("Bale not found");

        const remaining = row.remaining_weight;

        // 2. Validation
        if (data.weight_sold <= 0) {
          return reject("Invalid weight");
        }

        if (data.weight_sold > remaining) {
          return reject("Not enough stock");
        }

        const newRemaining = remaining - data.weight_sold;

        // 3. Update bale
        db.run(
          "UPDATE bales SET remaining_weight = ? WHERE id = ?",
          [newRemaining, data.bale_id],
          function (err) {
            if (err) return reject(err.message);

            // 4. Create sale
            db.run(
              "INSERT INTO sales (party_name) VALUES (?)",
              [data.party],
              function (err) {
                if (err) return reject(err.message);

                const saleId = this.lastID;

                // 5. Add sale item
                db.run(
                  "INSERT INTO sale_items (sale_id, bale_id, weight_sold) VALUES (?, ?, ?)",
                  [saleId, data.bale_id, data.weight_sold],
                  function (err) {
                    if (err) return reject(err.message);

                    resolve({
                      success: true,
                      remaining: newRemaining
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

ipcMain.handle("get-sales", () => {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT 
        sales.id,
        sales.party_name,
        sales.date,
        sale_items.weight_sold,
        bales.bale_number,
        bales.brand,
        bales.shade
      FROM sale_items
      JOIN sales ON sale_items.sale_id = sales.id
      JOIN bales ON sale_items.bale_id = bales.id
      ORDER BY sales.id DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });

  });
});

ipcMain.handle("get-analytics", () => {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT 
        bales.shade,
        SUM(sale_items.weight_sold) as total_sold,
        COUNT(*) as sales_count
      FROM sale_items
      JOIN bales ON sale_items.bale_id = bales.id
      GROUP BY bales.shade
      ORDER BY total_sold DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });

  });
});

// Add these to your main.js IPC handlers
ipcMain.handle("get-advanced-analytics", async () => {
  return new Promise((resolve, reject) => {
    const data = {};
    
    // 1. Dead Stock (No sales in 30 days)
    const deadStockQuery = `
      SELECT * FROM bales 
      WHERE remaining_weight > 0 
      AND id NOT IN (SELECT bale_id FROM sale_items)
      AND date <= date('now', '-30 days')
    `;

    // 2. Sales Trends (Last 7 Days)
    const trendsQuery = `
      SELECT date(sales.date) as day, SUM(sale_items.weight_sold) as total
      FROM sale_items
      JOIN sales ON sale_items.sale_id = sales.id
      WHERE sales.date >= date('now', '-7 days')
      GROUP BY day
    `;

    // 3. Top Customers
    const topCustomersQuery = `
      SELECT party_name, SUM(weight_sold) as total_kg, COUNT(*) as visit_count
      FROM sales
      JOIN sale_items ON sales.id = sale_items.sale_id
      GROUP BY party_name
      ORDER BY total_kg DESC LIMIT 5
    `;

    // Run queries (Simplified for example - in production use a helper to run all)
    db.all(deadStockQuery, [], (err, dead) => {
      data.deadStock = dead;
      db.all(trendsQuery, [], (err, trends) => {
        data.trends = trends;
        db.all(topCustomersQuery, [], (err, customers) => {
          data.customers = customers;
          resolve(data);
        });
      });
    });
  });
});