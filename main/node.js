const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  powerMonitor,
} = require("electron");
const utilities = require("../modules/utilities.js");
const fs = require("fs");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1250,
    height: 750,
    icon: "assets/task_list_19659.ico",
    fullscreen: utilities.readJSONValue("fullscreen"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (utilities.readJSONValue("fullscreen")) {
    mainWindow.maximize();
  }
  if (utilities.readJSONValue("developer_mode")) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile("main/index.html");
  Menu.setApplicationMenu(null);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  powerMonitor.addListener("lock-screen", () => {
    mainWindow.webContents.send("message-from-main", "Session_Lock");
  });
  powerMonitor.addListener("unlock-screen", () => {
    mainWindow.webContents.send("message-from-main", "Session_Unlock");
  });
}

app.on("ready", () => {
  createWindow();
  mainWindow.maximize();
});

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.on("chooseFile", (event, arg) => {
  const result = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
  });

  result.then(({ canceled, filePaths, bookmarks }) => {
    const base64 = fs.readFileSync(filePaths[0]).toString("base64");
    event.reply("chosenFile", filePaths[0]);
  });
});

ipcMain.on("dev", () => {
  mainWindow.webContents.openDevTools();
});
