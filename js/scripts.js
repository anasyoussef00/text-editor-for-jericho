let filePath = "";

const filePathElement = document.getElementById("filePath");
const btnShowPath = document.getElementById("btnShowFilePath");
const textEditor = document.getElementById("text-editor");

const btnNew = document.getElementById("new-btn");
const btnOpen = document.getElementById("open-btn");
const btnSave = document.getElementById("save-btn");
const btnSaveAs = document.getElementById("save-as-btn");

// File Open
btnOpen.addEventListener("click", async () => {
	textEditor.disabled = false;
	const fileObj = await window.electronAPI.openFile();
	console.log(fileObj.fileContent);
	textEditor.innerHTML = fileObj.fileContent;
	sessionStorage.setItem("filePath", fileObj.filePath);
});

// File Save
btnSave.addEventListener("click", async () => {
	if (!textEditor.disabled) {
		const filePath = sessionStorage.getItem("filePath");
		if (!filePath || filePath === undefined) {
			const fileP = await window.electronAPI.saveFileAs(textEditor.value);
			if (fileP || fileP !== undefined) {
				sessionStorage.setItem("filePath", fileP);
			}
		} else {
			await window.electronAPI.saveFile(textEditor.value, filePath);
		}
	}
});

// File Save As
btnSaveAs.addEventListener("click", async () => {
	console.log("nsaveas");
	if (!textEditor.disabled) {
		const filePath = await window.electronAPI.saveFileAs(textEditor.value);
		if (filePath || filePath !== undefined) {
			sessionStorage.setItem("filePath", filePath);
			console.log(filePath);
		}
	}
});

// File New
btnNew.addEventListener("click", async () => {
	textEditor.disabled = false;
	sessionStorage.removeItem("filePath");
	console.log("newfile");
});
