const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
		},
		//hinding the menu, change to true
		fullscreen: false,
		autoHideMenuBar: false,
	});

	// Menu.setApplicationMenu(null);

	//save button
	ipcMain.on("saveText", (event, txtsave) => {
		// rename title// file a path
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);
		win.setTitle(title);
	});
	win.webContents.openDevTools(); //remove when done
	win.loadFile("index.html");

	return win;
}

// START FUNCTIONS

// File Open
const handleFileOpen = async () => {
	console.log("main.handleFileOpen");
	const { filePaths, canceled } = await dialog.showOpenDialog({
		properties: ["openFile"],
	});
	let fileObj;
	if (canceled) {
		fileObj = {
			filePath: undefined,
			fileContent: "",
		};
		return fileObj;
	} else {
		let fileContent = fs.readFileSync(filePaths[0], 'utf8');
		fileObj = {
			filePath: filePaths[0],
			fileContent,
		};
		return fileObj;
	}
};

// File Save 
const handleFileSave = (event, fileContent, filePath) => {
	return fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });
};

// File Save As
const handleFileSaveAs = async (event, fileContent) => {
	const { filePath, canceled } = await dialog.showSaveDialog();
	if (canceled) {
		return undefined;
	} else {
		fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });
		return filePath;
	}
};

// END FUNCTIONS

// EVENTS
app.whenReady().then(() => {
	ipcMain.handle("dialog:openFile", handleFileOpen);
	ipcMain.handle("dialog:saveFile", handleFileSave);
	ipcMain.handle("dialog:saveFileAs", handleFileSaveAs);
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
