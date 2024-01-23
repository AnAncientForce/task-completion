const os = require("os");
const fs = require("fs");
const path = require("path");

var jSettings = null;
try {
  jSettings = path.join(path.dirname(__dirname), "settings.json");
} catch (error) {
  console.error("Error reading JSON file:", error.message);
  return null;
}

var booleanStorage = {};

function saveBoolean(key, value) {
  booleanStorage[key] = value;
}
function checkBoolean(key) {
  return booleanStorage[key];
}

function arrayPick(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function log(txt) {
  const textarea = document.getElementById("logger");
  textarea.value += "\n" + txt;
  textarea.scrollTop = textarea.scrollHeight;
}

function removeElementFromDiv(elementToRemove, divId) {
  var elements = divId.getElementsByTagName(elementToRemove);

  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

function removal(args) {
  var elements;
  if (args?.type == "class") {
    const x = document.querySelector(`.${args.target}`);
    if (x) {
      Array.from(x.children).forEach((childElement) => {
        x.removeChild(childElement);
      });
    }
    return;
  } else {
    elements = divId.getElementsByTagName(elementToRemove);
  }
  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function quick_exec(caArgs) {
  powershell = "";
  if (!caArgs?.command) {
    log("No command given.");
    return;
  }
  if (caArgs?.powershell) {
    powershell =
      "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
  }
  exec(`${powershell} ${caArgs.command}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
    }
    log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

function filterStringByBlacklist(inputString, blacklist) {
  return blacklist.reduce((filteredString, item) => {
    return filteredString.replace(new RegExp(item, "g"), "");
  }, inputString);
}

function readJSONValue(valueKey) {
  try {
    const rawData = fs.readFileSync(jSettings);
    const jsonData = JSON.parse(rawData);

    if (jsonData && jsonData.hasOwnProperty(valueKey)) {
      return jsonData[valueKey] === true;
    } else {
      console.log(`Value "${valueKey}" not found in JSON file.`);
      return null;
    }
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    return null;
  }
}

function getSettings() {
  return JSON.parse(fs.readFileSync(jSettings, "utf8"));
}
function writeSettings(data) {
  // fs.writeFileSync(jSettings, JSON.stringify(data));
  fs.writeFileSync(jSettings, JSON.stringify(data, null, 2));
}

module.exports = {
  saveBoolean: saveBoolean,
  checkBoolean: checkBoolean,
  log: log,
  arrayPick: arrayPick,
  removeElementFromDiv: removeElementFromDiv,
  removal: removal,
  formatTime: formatTime,
  quick_exec: quick_exec,
  filterStringByBlacklist: filterStringByBlacklist,
  readJSONValue: readJSONValue,
  getSettings: getSettings,
  writeSettings: writeSettings,
};
