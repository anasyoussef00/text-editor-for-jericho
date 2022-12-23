const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electronAPI", {
//   openFile: () => ipcRenderer.invoke("dialog:openFile"),
//   openSaveAs: () => ipcRenderer.send("dialog:openSaveAs"),
//   openSave: () => ipcRenderer.send("dialog:openSave"),
//   setTitle: (title) => ipcRenderer.send("set-title", title), // rename title
// });

contextBridge.exposeInMainWorld("electronAPI", {
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	saveFile: (fileContent, filePath) => ipcRenderer.invoke("dialog:saveFile", fileContent, filePath),
	saveFileAs: (fileContent) => ipcRenderer.invoke("dialog:saveFileAs", fileContent),
});
