let arr = JSON.parse(localStorage.getItem("actionGroups")) || [];

// arr.forEach((obj, index, arr) => {
//   $("#action-groups .btn-group-vertical").append(`<div class="btn-group" role="group"><button type="button" id=${name} class="btn btn-default">${name}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
// });

class OptionGroup {
  constructor (name, soundName, soundRepeat, phoneNumber, textMessage, emails, relay, economy, lamps, wiperCount, wiper, log) {
    this.name = name;
    this.soundName = soundName;
    this.soundRepeat = soundRepeat;
    this.phoneNumber = phoneNumber;
    this.textMessage = textMessage;
    this.emails = emails;
    this.relay = relay;
    this.economy = economy;
    this.wiper = wiper;
    this.wiperCount = wiperCount;
    this.log = log;
    this.lamps = lamps;
  }
}

// let newObj = {
//   name: undefined,
//   soundName: undefined,
//   soundRepeat: undefined,
//   phoneNumber: [],
//   textMessage: undefined,
//   emails: [],
//   relay: undefined,
//   economy: undefined,
//   wiper: undefined,
//   wiperCount: undefined,
//   log: undefined,
//   lamps: undefined
// };

let newObj = [{ name: "" }, { actionList: [] }];

$("document").ready(function() {
  arr.forEach(arr => {
    $("#action-groups .btn-group-vertical").append(`<div class="btn-group" role="group"><button type="button" id=${arr[0].name} class="btn btn-default">${arr[0].name}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
  });
  $(".opt").hide();
  $("#sound").show();
  $(".list").hide();
  // $("#name").val(defaultParams.name);
  // $("#text-message").val(defaultParams.textMessage);
  // $("#sound-options").val(defaultParams.soundName);
  // $("#repeat").prop("checked", defaultParams.soundRepeat);
  // $("#relay-options").val("on");
  // $("#power").val("on");
  // $("#lamps-power").val("on");
  // $("#wiper-power").prop("checked", defaultParams.wiper);
  // $("#wiper-repeat").val(defaultParams.wiperCount);
  // $("#log-check").prop("checked", "true");
  // $("#message").val(defaultParams.log);
  // populateOnLoad();

  $("#group-name").slideDown(300);

  $("#action-list").change((event) => {
    let actionValue = $("#action-list").val();
    $(`.opt`).slideUp(300);
    $(`#${actionValue}`).slideDown(300);
    event.stopPropagation();
  });

  populatefields();

  $("#name-list").on('click', 'button', () => {
    $("#group-name").slideDown(300).val($("#name-list li span").text());
  });

  $("#save").click(saveButton);

  $(".btn-group-vertical").on("click", ".btn-group .btn-danger", (e) => {
    let siblingName = e.currentTarget.previousSibling.id;
    let index = arr.findIndex(arr => arr[0].name === siblingName);
    $(`.btn-group #${siblingName}`).parent().slideUp();
    arr.splice(index, 1);
  });

  $(".btn-group-vertical").on('click', '.btn-default, .btn-primary', (e) => {
    let name = (e.currentTarget.id) || this.id;
    let index = arr.findIndex(arr => arr[0].name === name);
    let Params = arr[index][1].actionList;
    newObj = [{ name: "" }, { actionList: [] }];
    $(".list").hide();
    $("email-list").html("<p>Email Addresses</p>");
    $("phone-list").html("<p>Phone Numbers</p>");
    $("phone-message").html("<p>Text Message</p>");
    $("wiper-list").html("<p>Wipers</p>");
    $("relay-list").html("<p>Relay</p>");
    $("power-list").html("<p>Economy Mode</p>");
    $("lamps-list").html("<p>Lamp</p>");
    $("log-list").html("<p>Log Message</p>");
    emptyFields();
    $(".opt").hide();
    $("#sound").show();
    $("#name").val(name);
    populateName();

    // const populateOnLoad = () => {
    //   populateEconomy();
    //   populatePhoneOnLoad();
    //   populateLamps();
    //   populateLog();
    //   populateEmailOnLoad();

    //   populatePhone();
    //   populateRelay();
    //   populateSound();
    //   populateWipers();
    // }

    if (Params.findIndex(obj => obj.phone) > -1) {
      let index = Params.findIndex(obj => obj.phone);
      $("#text-message").val(Params[index].phone.message);
      populatePhoneOnLoad();
    }
    if (Params.findIndex(obj => obj.sound) > -1) {
      let index = Params.findIndex(obj => obj.sound);
      let soundName = Params[index].sound.src.slice(0, -4);
      $("#sound-options").val(soundName);
      $("#repeat").prop("checked", Params[index].sound.loop);
      populateSound();
    }
    if (Params.findIndex(obj => obj.relay) > -1) {
      let index = Params.findIndex(obj => obj.relay);
      let truthy;
      if (Params[index].relay.value) {
        truthy = "on";
      } else {
        truthy = "off";
      }
      $("#relay-options").val(truthy);
      populateRelay();
    }
    if (Params.findIndex(obj => obj.economy) > -1) {
      let index = Params.findIndex(obj => obj.economy);
      let truthy;
      if (Params[index].economy.value) {
        truthy = "on";
      } else {
        truthy = "off";
      }
      $("#power").val(truthy);
      populateEconomy();
    }
    if (Params.findIndex(obj => obj.wiper) > -1) {
      let index = Params.findIndex(obj => obj.wiper);
      $("#wiper-power").prop("checked", Params[index].wiper.value);
      $("#wiper-repeat").val(Params[index].wiper.wiperCount);
      populateWipers();
    }
    if (Params.findIndex(obj => obj.lamps) > -1) {
      let index = Params.findIndex(obj => obj.lamps);
      let truthy;
      if (Params[index].lamps.value) {
        truthy = "on";
      } else {
        truthy = "off";
      }
      $("#lamps-power").val(truthy);
      populateLamps();
    }
    if (Params.findIndex(obj => obj.log) > -1) {
      let index = Params.findIndex(obj => obj.log);
      $("#log-check").prop("checked", Params[index].log.value);
      $("#message").val(Params[index].log.message);
      populateLog();
    }
    // populateOnLoad();
    $(".btn-group-vertical button").removeClass("btn-primary").addClass("btn-default");
    $(`#${name}`).removeClass("btn-default").addClass("btn-primary");
  });

  $("#option-list").on("click", ".btn-xs", (e) => {
    e.currentTarget.parentNode.remove();
  });

  $("#wiper-repeat-input .glyphicon-minus").click(() => {
    let curValue = $("#wiper-repeat").val();
      if (curValue > 1) {
        curValue--;
        $("#wiper-repeat").val(curValue);
      }
  });

  $("#wiper-repeat-input .glyphicon-plus").click(() => {
    let curValue = $("#wiper-repeat").val();
    if (curValue < 10) {
      curValue++;
      $("#wiper-repeat").val(curValue);
    }
  });
});



const populateOnLoad = () => {
  populateEconomy();
  populatePhoneOnLoad();
  populateLamps();
  populateLog();
  populateEmailOnLoad();
  
  populatePhone();
  populateRelay();
  populateSound();
  populateWipers();
}

const populatefields = () => {
  $("#add-email").click(populateEmail);

  $("#add-phone").click(populatePhone);

  $("#add-sound").click(populateSound);

  $("#add-relay").click(populateRelay);

  $("#add-economy").click(populateEconomy);

  $("#add-lamp").click(populateLamps);

  $("#add-wiper").click(populateWipers);

  $("#add-log").click(populateLog);

  $("#add-name").click(populateName);
}

const populateEmailOnLoad = () => {
  let name = $("#name").val();
  let index = arr.findIndex(arr => arr[0].name === name);
  let Params = arr[index][1].actionList;
  let emailIndex = Params.findIndex(obj => obj.email);
  if (Params[emailIndex].email.addresses.length > 0) {
    $("#email-list").html(`<p>Email Addresses</p>`);
    Params[emailIndex].email.addresses.forEach((email) => {
      $("#email-list").slideDown(300).append(`<li><button class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>${email}</li>`);
    });
  }
}

const populatePhoneOnLoad = () => {
  let name = $("#name").val();
  let index = arr.findIndex(arr => arr[0].name === name);
  let Params = arr[index][1].actionList;
  let phoneIndex = Params.findIndex(obj => obj.phone);
  if (Params[phoneIndex].phone.phoneNumber.length > 0) {
    $("#phone-list").html(`<p>Phone Numbers</p>`);
    Params[phoneIndex].phone.phoneNumber.forEach((phone) => {
      $("#phone-list").slideDown(300).append(`<li><button class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>${phone}</li>`);
    });
  }
}

const populateNameOnLoad = () => {
  let name = $("#name").val();
  $("#name-list").slideDown(300).html(`<p>Name</p> <li><span>${name}</span></li>`);
}

const populateEmail = () => {
  let email = $("#email-input").val();
  let emailCheck = /^[_\w\-]+(\.[_\w\-]+)*@[\w\-]+(\.[\w\-]+)*(\.[\D]{2,6})$/;
  if (!($("#email-list").html().includes(email))) {
    if (emailCheck.test(email) === false) {
      $('#email-input').css({ 'background-color': 'rgb(250, 210, 210)' });
    } else {
      $("#email-input").css({ 'background-color': ''});
      $("#email-list").slideDown(300).append(`<li><button class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>${email}</li>`);
      if (newObj[1].actionList.findIndex(obj => obj.email) < 0 ) {
        newObj[1].actionList.push({
          email: {
           addresses: []
          }
        });
        let index = newObj[1].actionList.findIndex(obj => obj.email);
        newObj[1].actionList[index].email.addresses.push(email);
      } else {
        let index = newObj[1].actionList.findIndex(obj => obj.email);
        newObj[1].actionList[index].email.addresses.push(email);
      }
      $("#email-input").val("")
    }
  } else {
    $('#email-input').css({ 'background-color': 'rgb(250, 210, 210)' });
  }
}

const populatePhone = () => {
  let phone = $("#text-number").val();
  let message = $("#text-message").val();
  let phoneCheck = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!($("#phone-list").html().includes(phone))) {
    if (phoneCheck.test(phone) === false) {
      $('#text-number').css({ 'background-color': 'rgb(250, 210, 210)' });
    } else {
      $('#text-number').css({ 'background-color': '' });
      $("#phone-list").slideDown(300).append(`<li><button class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>${phone}</li>`);
      if (newObj[1].actionList.findIndex((obj) => obj.phone) < 0) {
        newObj[1].actionList.push({
          phone: {
            phoneNumber: [],
            message: "default",
          }
        });
        let index = newObj[1].actionList.findIndex((obj) => obj.phone);
        newObj[1].actionList[index].phone.phoneNumber.push(phone);
      } else {
        let index = newObj.findIndex((obj) => obj.phone);
        newObj[1].actionList[index].phone.phoneNumber.push(phone);
      }
      $("#text-number").val("")
    }
  } else {
    $('#text-number').css({ 'background-color': 'rgb(250, 210, 210)' });
  }
  if (message.length !== 0) {
    $("#phone-message").slideDown(300).html(`<p>Text Message</p><li>${message}</li>`);
    let index = newObj[1].actionList.findIndex((obj) => obj.phone);
    if (index > -1) {
      newObj[1].actionList[index].phone.message = message;
    } else {

    }
    $("#text-message").val("")
  }
}

const populateSound = () => {
  let sound = $("#sound-options").val();
  let soundRepeat = $("#repeat").prop("checked");
  $("#sound-list").slideDown(300).html(`<p>Sounds</p><li>${sound} - ${soundRepeat}</li>`);
  if (newObj[1].actionList.findIndex(obj => obj.audio) < 0) {
    newObj[1].actionList.push({
        audio: {
          src: `${sound}.wav`,
          loop: soundRepeat
        }
      }
    );
  } else {
    let index = newObj[1].actionList.findIndex(obj => obj.audio);
    newObj[1].actionList[index].audio.src = `${sound}.wave`;
    newObj[1].actionList[index].audio.loop = soundRepeat;
  }
}

const populateRelay = () => {
  let relay = $("#relay-options").val();
  $("#relay-list").slideDown(300).html(`<p>Relay</p><li>${relay}</li>`);
  if (newObj[1].actionList.findIndex(obj => obj.relay) < 0) {
    newObj[1].actionList.push({
      relay: {
        value: (() => {
          if (relay === "on") {
            return "true";
          } else {
            return "false";
          }
        })()
      }
    });
  } else {
    let index = newObj[1].actionList.findIndex(obj => obj.relay);
    newObj[1].actionList[index].relay.value = (() => {
      if (relay === "on") {
        return "true";
      } else {
        return "false";
      }
    })();
  }
}

const populateEconomy = () => {
  let power = $("#power").val();
  $("#power-list").slideDown(300).html(`<p>Economy Mode</p><li>${power}</li>`);
  if (newObj[1].actionList.findIndex(obj => obj.economy) < 0) {
    newObj[1].actionList.push({
      economy: {
        value: (() => {
          if (power === "on") {
            return "true";
          } else {
            return "false";
          }
        })()
      }
    });
  } else {
    let index = newObj[1].actionList.findIndex(obj => obj.economy);
    newObj[1].actionList[index].economy.value = (() => {
      if (power === "on") {
        return "true";
      } else {
        return "false";
      }
    })();
  }
}

const populateLamps = () => {
  let lamp = $("#lamps-power").val();
  $("#lamps-list").slideDown(300).html(`<p>Lamp</p><li>${lamp}</li>`);
  if (newObj[1].actionList.findIndex(obj => obj.lamps) < 0 ) {
    newObj[1].actionList.push({
      lamps: {
        value: (() => {
          if (lamp === "on") {
            return "true";
          } else {
            return "false";
          }
        })()
      }
    });
  } else {
    let index = newObj[1].actionList.findIndex(obj => obj.lamps);
    newObj[1].actionList[index].lamps.value = (() => {
      if (lamp === "on") {
        return "true";
      } else {
        return "false";
      }
    })();
  }
}

const emptyFields = () => {
  $("#name").val("");
  $("#text-message").val("");
  $("#sound-options").val("buzzer");
  $("#repeat").prop("checked", "true");
  $("#relay-options").val("on");
  $("#power").val("on");
  $("#lamps-power").val("on");
  $("#wiper-power").prop("checked", "true");
  $("#wiper-repeat").val("1");
  $("#log-check").prop("checked", "true");
  $("#message").val("");
}

const populateWipers = () => {
  let wiperCheck = $("#wiper-power").prop("checked");
  let wiperCount = $("#wiper-repeat").val();
  if (wiperCheck) {
    $("#wiper-list").slideDown(300).html(`<p>Wipers</p><li>${wiperCheck} - ${wiperCount}</li>`);
    if (newObj[1].actionList.findIndex(obj => obj.wiper) < 0 ) {
      newObj[1].actionList.push({
        wiper: {
          value: wiperCheck,
          wiperCount: wiperCount
        }
      });
    } else {
      let index = newObj.findIndex(obj => obj.wiper);
      newObj[1].actionList[index].wiper.value = wiperCheck;
      newObj[1].actionList[index].wiper.wiperCount = wiperCount;
    }
  }
}

const populateLog = () => {
  let logCheck = $("#log-check").prop("checked");
  let message = $("#message").val();
  if (logCheck) {
    $("#log-list").slideDown(300).html(`<p>Log Message</p><li>${message}</li>`);
    if (newObj[1].actionList.findIndex(obj => obj.log) < 0 ) {
      newObj[1].actionList.push({
        log: {
          value: logCheck,
          message: message
        }
      });
    } else {
      let index = newObj.findIndex(obj => obj.log);
      newObj[1].actionList[index].log.value = logCheck;
      newObj[1].actionList[index].log.message = message;
    }
  }
  $("#message").val("");
}

const populateName = () => {
  let name = $("#name").val();
  name = name.replace(/\s+/g, '-');
  $("#name-list").slideDown(300).html(`<p>Name</p><li><span>${name}</span></li>`);
  newObj[0].name = name;
}

const saveButton = () => {
  arr.push(newObj);
  $("#action-groups .btn-group-vertical").append(`<div class="btn-group" role="group"><button type="button" id=${newObj[0].name} class="btn btn-default">${newObj[0].name}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
  newObj = [{ name: "" }, { actionList: [] }];
  $(".list").hide();
  $("email-list").html("<p>Email Addresses</p>");
  $("phone-list").html("<p>Phone Numbers</p>");
  $("phone-message").html("<p>Text Message</p>");
  $("wiper-list").html("<p>Wipers</p>");
  $("relay-list").html("<p>Relay</p>");
  $("power-list").html("<p>Economy Mode</p>");
  $("lamps-list").html("<p>Lamp</p>");
  $("log-list").html("<p>Log Message</p>");
  emptyFields();
  $(".opt").hide();
  $("#sound").show();
  localStorage.removeItem("actionGroups")
  localStorage.setItem("actionGroups", JSON.stringify(arr));
}