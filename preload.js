const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("api", {
  test: () => "API working",

  addBale: (data) => ipcRenderer.invoke("add-bale", data),

  getBales: () => ipcRenderer.invoke("get-bales"),

  sellBale: (data) => ipcRenderer.invoke("sell-bale", data),

  getSales: () => ipcRenderer.invoke("get-sales"),

  getAnalytics: () => ipcRenderer.invoke("get-analytics"),

  getAdvancedAnalytics: () => ipcRenderer.invoke('get-advanced-analytics')
});