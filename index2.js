// dictionary of magical strings
const HTML_ELEMENTS = {
  containers: {
    actionGroups: "#action-groups .btn-group-vertical",
    actionLists: "#option-list .btn-group-vertical",
    actions: "#action-group-container",
    actionForms: "#action-group-container .opt"
  },
  buttons: {
    addgroup: "#action-groups #add-name",
    all: ".btn",
    groups: ".btn-default",
    currentGroup: ".btn-primary",
    deleteGroups: ".btn-danger",
    addAction: ".btn-success",
    actions: ".btn-default",
    deleteAction: "#option-list .btn-group-vertical .btn-danger",
    saveAction: "#action-group-container .opt .btn-success"
  },
  staticInputs: {
    name: "#action-groups #name",
    select: "#action-list",
  },
  generated: {
    actionChoice: `<select name="action-list" id="action-list" value="sound" class="form-control">
        <option value="sound">Sound</option>
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="relay">Relay</option>
        <option value="economy">Economy</option>
        <option value="wiper">Wiper</option>
        <option value="log">Log</option>
        <option value="lamps">Lamps</option>
      </select>`
  },
  formTypes: {
    sound: "sound",
    text: "text",
    email: "email",
    relay: "relay",
    economy: "economy",
    lamps: "lamps",
    wiper: "wiper",
    log: "log"
  }
}

// Class to create a completely new Action Group
// to be stored in the list of Action Names
// to be used as references by sharing the same name
class ActionListName {
  constructor(name) {
    this.name = name;
    this.container = HTML_ELEMENTS.containers.actionGroups;
  }
  get actionListCodeName() {
    return this.name;
  }
  get actionListCommonName() {
    return decodeURI(this.name);
  }
  appendButtons() {
    $(this.container).append(`<div class="btn-group" role="group"><button type="button" data-id="${this.actionListCodeName}" class="btn btn-default loads">${this.actionListCommonName}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
  }
}

// Class to create an Action List that corresponds
// with an Action Group via the name
class ActionList {
  constructor(name) {
    this.name = encodeURI(name);
    this.actionList = [];
  }
  addNewAction(action) {
    this.actionList.push(action);
  }
  get actions() {
    return this.actionList;
  }
  get actionListCodeName() {
    return this.name
  }
  get actionListCommonName() {
    return decodeURI(this.name);
  }
  get actionListLength() {
    return this.actionList.length;
  }
}

// class to create an action to be stored in the
// action list array
// class Action {
//   constructor(dataType, data) {
//     this.dataType = dataType;
//     this.data = data;
//   }
//   getAction() {
//     return this.data;
//   }
//   getDataType() {
//     return this.dataType;
//   } 
// }

class economy {
  constructor(setting, display, dataType) {
    this.dataType = dataType;
    this.setting = setting;
    this.display = display;
  }
  get commonName() {
    return this.display;
  }
}

class email {
  constructor(address, display, dataType) {
    this.dataType = dataType;
    this.address = address;
    this.display = display;
  }
}

class lamps {
  constructor(setting, display, dataType) {
    this.dataType = dataType;
    this.setting = setting;
    this.display = display;
  }
}

class log {
  constructor(message, display, dataType) {
    this.dataType = dataType;
    this.setting = setting;
    this.display = display;
  }
}

class relay {
  constructor(setting, display, dataType) {
    this.dataType = dataType;
    this.setting = setting;
    this.display = display;
  }
}

class sound {
  constructor(file, setting, display, dataType) {
    this.dataType = dataType;
    this.file = file;
    this.setting = setting;
    this.display = display;
  }
}

class text {
  constructor(number, message, display, dataType) {
    this.dataType = dataType;
    this.number = number;
    this.message = message;
    this.display = display;
  }
}

class wiper {
  constructor(count, display, dataType) {
    this.dataType = dataType;
    this.count = count;
    this.display = display;
  }
}

const EventHandlers = {
  // add name
  addName: function() {
    let name = encodeURI($(HTML_ELEMENTS.staticInputs.name).val());
    if (name === "" || name === null) {
      $(HTML_ELEMENTS.staticInputs.name).css("background-color", "rgb(210, 170, 170)");
    } else {
      let index = getIndex(name);
      if ($(HTML_ELEMENTS.containers.actionGroups).html().includes("No Action Lists Found")) {
        $(HTML_ELEMENTS.containers.actionGroups).html("");
      }
      if (index > -1) {
        removeGroup(name);
      }
      createGroup(name);
      debugger;
      ACTION_LIST_NAME[getIndex(name)].appendButtons();
    }
  },
  addSelect: function() {
    if ($(HTML_ELEMENTS.containers.actionLists).html().includes("</select>")) {
    } else {
      if ($(HTML_ELEMENTS.containers.actionLists).html().includes("No Action Lists Found")) {
        $(HTML_ELEMENTS.containers.actionLists).html("");
      }
      $(HTML_ELEMENTS.containers.actionLists).append(HTML_ELEMENTS.generated.actionChoice);
    }
  },
  removeGroupButton: function() {
    let name = $(this).prev().attr("data-id");
    $(this).parent().slideUp();
    removeGroup(name);
    if (ACTION_LIST_NAME.length === 0) {
      $(HTML_ELEMENTS.containers.actionGroups).html("No Action Groups Made");
    }
  },
  populateGroups: function() {
    if (ACTION_LIST_NAME.length > 0) {
      $(HTML_ELEMENTS.containers.actionGroups).html("");
    }
    ACTION_LIST_NAME.forEach(obj => {
      obj.appendButtons();
    });
  },
  displayForm: function() {
    $(".opt").hide();
    let dataType = $(this).val();
    $(`${HTML_ELEMENTS.containers.actions} #${dataType}`).slideDown();
  },
  populateLists: function() {
    let name = $(this).attr("data-id");
    let index = getIndex(name);
    $(`${HTML_ELEMENTS.containers.actionGroups} ${HTML_ELEMENTS.buttons.all}`).removeClass("btn-primary").addClass("btn-default");
    $(this).removeClass("btn-default").addClass("btn-primary");
    $(HTML_ELEMENTS.containers.actionLists).html("");
    ACTION_LIST[index].actionList.forEach(obj => {
      let dataType = obj.dataType;
      let commonName = obj.display;
      // let commonName = obj.getActionLis();
      $(HTML_ELEMENTS.containers.actionLists).append(`<div class="btn-group" role="group"><button type="button" data-id="${dataType}" class="btn btn-default loads">${commonName}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
    });
  },
  submitAction: function() {
    let dataType = $(this).parent().attr("id");
    let inputArray = $(`#${dataType} input, #${dataType} select, #${dataType} textarea`).toArray();
    let selectedGroup = $(`${HTML_ELEMENTS.containers.actionGroups} ${HTML_ELEMENTS.buttons.currentGroup}`);
    let groupIndex = getIndex(selectedGroup.attr("data-id"));
    const data = [];
    let display;
    let setting;
    let message;
    let file;
    let number;
    switch (dataType) {
      case HTML_ELEMENTS.formTypes.economy:
        display = `${dataType.slice(0,1) + dataType.slice(1,dataType.length)} - ${inputArray[0].value.slice(0, 1).toUpperCase() + inputArray[0].slice(1, inputArray[0].length)}`;
        inputArray[0].value === "on" ? setting = true : setting = false;
        ACTION_LIST[groupIndex].actionList.push(new economy(setting, display, dataType));
        break;
    
      case HTML_ELEMENTS.formTypes.email:
        debugger;
        let address = inputArray[0].value;
        let emailCheck = /^[_\w\-]+(\.[_\w\-]+)*@[\w\-]+(\.[\w\-]+)*(\.[\D]{2,6})$/;
        if (!emailCheck.test(address)) {
          $('#email-input').css({ 'background-color': 'rgb(250, 210, 210)' });
          break;
        } else {
          $("#email-input").css({ 'background-color': ''});
        }
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${address}`;
        ACTION_LIST[groupIndex].actionList.push(new email(address, display, dataType));
        break;

      case HTML_ELEMENTS.formTypes.lamps:
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${inputArray[0].value.slice(0, 1).toUpperCase() + inputArray[0].slice(1, inputArray[0].length)}`;
        let temp;
        inputArray[0].value === "on" ? temp = true : temp = false;
        ACTION_LIST[groupIndex].actionList.push(new lamps(setting, display, dataType));
        break;

      case HTML_ELEMENTS.formTypes.log:
        let message = encodeURI(inputArray[1].value);
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${decodeURI(inputArray[0]).slice(0, 10)}`;
        let shortMessage = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${message.slice(0,10)}...`;
        ACTION_LIST[groupIndex].actionList.push(new log(message, display, dataType));
        break;

      case HTML_ELEMENTS.formTypes.relay:
        inputArray[0].value === "on" ? setting = true : setting = false;
        debugger;
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${inputArray[0].value.slice(0, 1).toUpperCase() + inputArray[0].value.slice(1, inputArray[0].value.length)}`;
        debugger;
        ACTION_LIST[groupIndex].actionList.push(new relay(setting, display, dataType));
        break;

      case HTML_ELEMENTS.formTypes.sound:
        file = inputArray[0].value;
        setting = inputArray[1].checked;
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${inputArray[0].value.slice(0, 1).toUpperCase() + inputArray[0].slice(1, inputArray[0].length)}`;
        ACTION_LIST[groupIndex].actionList.push(new sound(file, setting, display, dataType));
        break;

      case HTML_ELEMENTS.formTypes.text:
        number = formatPhone(inputArray[0].value);
        message = encodeURI(inputArray[1].value);
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${number}`;
        ACTION_LIST[groupIndex].actionList.push(new text(number, message, display, dataType));
        break;

      case HTML_ELEMENTS.formTypes.wiper:
        let count = inputArray[0].value;
        display = `${dataType.slice(0, 1) + dataType.slice(1, dataType.length)} - ${count} strokes`;
        break;

      default:
        break;
    }
    // let newAction = new Action(dataType, data);
    // let selectedGroup = $(`${HTML_ELEMENTS.containers.actionGroups} ${HTML_ELEMENTS.buttons.currentGroup}`);
    // let groupIndex = getIndex(selectedGroup.attr("data-id"));
    // ACTION_LIST[groupIndex].actionList.push(newAction);
    EventHandlers.populateLists.call($(`${HTML_ELEMENTS.containers.actionGroups} ${HTML_ELEMENTS.buttons.currentGroup}`));
  }
}
  //add new action

  // save action

  // delete list item

  // populate list

function createGroup (name) {
  const group = new ActionListName(name);
  const list = new ActionList(name);
  ACTION_LIST_NAME.push(group);
  ACTION_LIST.push(list);
}

function getIndex (name) {
  return ACTION_LIST_NAME.findIndex(obj => obj.name === name);
}

function removeGroup (name) {
  let index = getIndex(name);
  ACTION_LIST_NAME.splice(index, 1);
  ACTION_LIST.splice(index, 1);
}

function saveGroups () {
  localStorage.setItem("actionLists", JSON.stringify(ACTION_LIST));
  localStorage.setItem("actionGroups", JSON.stringify(ACTION_LIST_NAME));
}

function formatPhone(number) {
  let startNumber = number;
  //validate number
  if (!/^1?[\-\. ]?\(?(\d{3})\)?[\-\. ]?\d{3}[\-\. ]?\d{4}$/.test(startNumber)) return false;
  //remove 1 if it's there to remove complication
  if (startNumber[0] == 1) startNumber = startNumber.slice(1);
  //remove any characters except for the digits
  let strippedNumber = startNumber.replace(/\D/g, '');
  //currently returns format: 8885550000
  strippedNumber = "+1" + strippedNumber;
  // adds +1 to the beginning as per e164
  return strippedNumber;
};

const ACTION_LIST_NAME = [];
const ACTION_LIST = [];

// -----testing purposes-----
createGroup("Tyler");
let action = new sound("buzzer", "continuous", "Buzzer - Continuous", "sound");
ACTION_LIST[getIndex("Tyler")].addNewAction(action);
debugger;
  // --------------------------

$(".opt").hide();
EventHandlers.populateGroups();

$(document).ready(() => {
  // event listener for add name button
  $(HTML_ELEMENTS.buttons.addgroup).click(EventHandlers.addName);
  // event listener to get select box
  $(HTML_ELEMENTS.buttons.addAction).click(EventHandlers.addSelect);
  // event listener for group delete buttons
  $(HTML_ELEMENTS.containers.actionGroups).on('click', HTML_ELEMENTS.buttons.deleteGroups, EventHandlers.removeGroupButton);
  //event listener for select to display a form
  $(HTML_ELEMENTS.containers.actionLists).on('change', HTML_ELEMENTS.staticInputs.select, EventHandlers.displayForm);
  // event listener to populate Lists from a group
  $(HTML_ELEMENTS.containers.actionGroups).on('click', HTML_ELEMENTS.buttons.groups, EventHandlers.populateLists);
  // event listener for each add button in forms
  $(HTML_ELEMENTS.containers.actions).on('click', HTML_ELEMENTS.buttons.addAction, EventHandlers.submitAction);
});