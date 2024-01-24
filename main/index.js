const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const sound = require("sound-play");

// modules
const utilities = require("../modules/utilities.js");

const path_root = path.join(__dirname, "..");
const path_assets = path.join(path_root, "assets");
const path_sfx = path.join(path_assets, "sfx");
const json_file = path.join(path_root, "tasks.json");

var currentIndex = -1;
var childDivs;
var total_tasks = 0;
var completed_tasks = 0;
var field_to_load;

function today() {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = daysOfWeek[dayOfWeek];
  return currentDay;
}

function setup() {
  let jsonData = JSON.parse(fs.readFileSync(json_file));

  const field = "bind";
  const day = today();

  if (jsonData.length > 0 && jsonData[0][field]) {
    jsonData[0][field].forEach((item) => {
      if (item.day === day) {
        console.log(item.day);
        field_to_load = item.link;
        console.log("Loading Field:", field_to_load);
      }
    });
  }
}

function write_json(args) {
  var field = args?.field;
  var txt = args?.txt;
  var task_div = args?.task_div;

  if (!fs.existsSync(json_file)) {
    fs.writeFileSync(json_file, "[]");
  }

  let jsonData = JSON.parse(fs.readFileSync(json_file));

  if (jsonData.length > 0 && jsonData[0][field]) {
    for (const item of jsonData[0][field]) {
      if (args?.init) {
        item.completed = false;
      } else {
        console.log(item.task);
        console.log(txt);
        if (item.task === txt) {
          console.log("Matched.");

          if (item.completed) {
            item.completed = false;
            completed_tasks--;
            task_div.classList.remove("completed");
            task_div.classList.add("uncompleted");
            get_status_img().src = "../assets/images/mark.png";
          } else {
            item.completed = true;
            completed_tasks++;
            task_div.classList.remove("uncompleted");
            task_div.classList.add("completed");
            get_status_img().src = "../assets/images/checkmark.png";
          }
          console.log("completed_tasks", completed_tasks);
          console.log(item.completed);
          break;
        } else {
          console.log("Did not match.");
        }
      }
    }
  }

  /*
  const block = {
    title: "Title",
    desc: "Desc",
    completed: false,
  };
  jsonData.push(block);
  */

  fs.writeFileSync(json_file, JSON.stringify(jsonData, null, 2));
  update_tasks_completed_count();
}

function read_json(field) {
  let jsonData = JSON.parse(fs.readFileSync(json_file));

  if (jsonData.length > 0 && jsonData[0][field]) {
    jsonData[0][field].forEach((item) => {
      append_task(item.task);
      total_tasks++;
    });
  }
  console.log("total_tasks", total_tasks);

  // reset all tasks to false
  write_json({
    field: field_to_load,
    init: true,
  });
}

function append_task(str) {
  const div = document.createElement("div");
  div.classList.add("task");
  document.getElementById("task-container").appendChild(div);

  const p = document.createElement("p");
  p.classList.add("txt");
  p.textContent = str;
  div.appendChild(p);

  const img = document.createElement("img");
  img.classList.add("status");
  img.src = "../assets/images/mark.png";
  div.appendChild(img);
}

function cycle_tasks() {
  if (currentIndex === -1) {
    // pre-highlight the first task
    currentIndex = 0;
    childDivs = document.getElementById("task-container").children;
    childDivs[currentIndex].classList.add("highlighted");
    return;
  }

  childDivs = document.getElementById("task-container").children;
  childDivs[currentIndex].classList.remove("highlighted");
  currentIndex = (currentIndex + 1) % childDivs.length;
  childDivs[currentIndex].classList.add("highlighted");
  childDivs[currentIndex].scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
    offsetTop: 100,
  });
  childDivs[currentIndex].focus();
  play_sfx(path.join(path_sfx, "bank_se03#7.wav"));
}

function get_status_img() {
  const statusImage = childDivs[currentIndex].querySelector(".status");

  if (statusImage) {
    return statusImage;
  } else {
    console.error("No status image was attached to the task's div?");
  }
}

function assign_task_complete() {
  const statusImage = childDivs[currentIndex].querySelector(".status");

  if (statusImage) {
    write_json({
      field: field_to_load,
      txt: childDivs[currentIndex].textContent,
      task_div: childDivs[currentIndex],
      init: false,
    });
    play_sfx(path.join(path_sfx, "bank_se03#9.wav"));
  }
}

function update_tasks_completed_count() {
  document.getElementById(
    "tasks-completed"
  ).textContent = `Tasks Completed ➔ ${completed_tasks} / ${total_tasks}`;

  if (completed_tasks === total_tasks) {
    console.log("Award");
    play_anim("completed");
  }
}

function play_sfx(filename) {
  sound.play(filename);
}

function play_anim(anim) {
  switch (anim) {
    case "completed":
      const rainbow = document.getElementById("rainbow");
      const diamond = document.getElementById("diamond");

      play_sfx(path.join(path_sfx, "bank_se03#20.wav"));

      rainbow.classList.add("on");
      diamond.classList.add("animate1");

      setTimeout(() => {
        diamond.classList.remove("animate1");
        diamond.classList.add("animate2");

        setTimeout(() => {
          rainbow.classList.remove("on");
          diamond.classList.remove("animate1");
          diamond.classList.remove("animate2");

          setTimeout(() => {
            ipcRenderer.send("quit");
          }, 0.1 * 1000);
        }, 1 * 1000);
      }, 5 * 1000);
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
  read_json(field_to_load);
  setTimeout(() => {
    // play_anim("completed");
  }, 1500);
});

document.addEventListener("keydown", function (event) {
  console.log(event.key);
  switch (event.key) {
    case "ArrowLeft":
      cycle_tasks(-1);
      break;
    case "ArrowRight":
      cycle_tasks(1);
      break;
    case "ArrowUp":
      cycle_tasks(-1);
      break;
    case "ArrowDown":
      cycle_tasks(1);
      break;
    case "Tab":
      cycle_tasks(1);
      break;
    case "Enter":
      assign_task_complete();
      break;
    case "c":
      ipcRenderer.send("dev");
      break;
    case "q":
      ipcRenderer.send("quit");
      break;
    default:
      break;
  }
});
