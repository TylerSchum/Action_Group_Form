// JSON call to fill in previously made action-lists
let arr = JSON.parse(localStorage.getItem("actionGroups")) || [];

// initial creation of the object model
let newObj = [{ name: "" }, { actionList: [] }];
// function begins after dom load
$("document").ready(function() {
  // fills the left column with buttons for each previously made list
  $(".btn-group-vertical").html("");
  arr.forEach(arr => {
    // creation of buttons
    $("#action-groups .btn-group-vertical").append(`<div class="btn-group" role="group"><button type="button" data-id="${arr[0].name.codeName}" class="btn btn-default loads">${decodeURI(arr[0].name.codeName)}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
  });
  if (arr.length < 1) {
    $(".btn-group-vertical").html("No Action Lists Found");
  }
  // hide all fieldsets
  $(".opt").hide();
  // show sound fieldset
  $("#sound").slideDown(300);
  // hide all divs to display inputted info
  $(".list").hide();

  // add event listener to change which fieldset is displayed based on the select element
  $("#action-list").change((event) => {
    let actionValue = $("#action-list").val();
    $(`.opt`).slideUp(300);
    $(`#${actionValue}`).slideDown(300);
    event.stopPropagation();
  });

  // adds event listeners to each plus button in each fieldset
  populatefields();

  // add event listener to save button
  $("#save").click(saveButton);

  // add event listeners to each trash can button in the left side column list
  // this will remove the list from the column and from the overall array
  $(".btn-group-vertical").on("click", ".btn-group .btn-danger", (e) => {
    let siblingName = e.currentTarget.previousSibling.dataset.id;
    let parentStatus = e.currentTarget.parentElement.parentNode.children.length;
    let index = arr.findIndex(arr => arr[0].name.codeName === siblingName);
    $(this).parent().slideUp();
    arr.splice(index, 1);
    // fills the left column with buttons for each previously made list
    $(".btn-group-vertical").html("");
    arr.forEach(arr => {
      // creation of buttons
      $("#action-groups .btn-group-vertical").append(`<div class="btn-group" role="group"><button type="button" data-id="${arr[0].name.codeName}" class="btn btn-default loads">${decodeURI(arr[0].name.codeName)}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
    });
    // hide all fieldsets
    $(".opt").hide();
    // show sound fieldset
    $("#sound").show();
    // hide all divs to display inputted info
    $(".list").hide();
    if ( arr.length < 1 ) {
      $(".btn-group-vertical").html("No Action Lists Found");
    }
    // remove master array from local storage
    localStorage.removeItem("actionGroups");
    // add in new master array with new list
    localStorage.setItem("actionGroups", JSON.stringify(arr));
  });

  // event listener for the clear fields button
  // resets the current obj being made, all form values, and the display
  $("#defaults").click(() => {
    newObj = [{ name: "" }, { actionList: [] }];
    $(".list").slideUp(300);
    $("#email-list").html("<p>Email Addresses</p>");
    $("#phone-list").html("<p>Phone Numbers</p>");
    $("#phone-message").html("<p>Text Message</p>");
    $("#wiper-list").html("<p>Wipers</p>");
    $("#relay-list").html("<p>Relay</p>");
    $("#power-list").html("<p>Economy Mode</p>");
    $("#lamps-list").html("<p>Lamp</p>");
    $("#log-list").html("<p>Log Message</p>");
    emptyFields();
    $(".opt").hide();
    $("#sound").show();
    $("#action-list").val("sound");
    $(".btn-group-vertical button").removeClass("btn-primary").addClass("btn-default");
    $(`#defaults`).removeClass("btn-default").addClass("btn-primary");
    populatefields();
  });

  // add event listeners to each button that represents a list
  // This will reset the current array, the form, and display
  // then check for each piece of data
  // then places that value into the form
  // then fills the array and display
  // then iterates through the phone and email data to fill there
  $(".btn-group-vertical").on('click', '.loads', (e) => {
    let name = (e.currentTarget.dataset.id) || this.dataset.id;
    let index = arr.findIndex(arr => arr[0].name.codeName === name);
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
    $("#name").val(decodeURI(name));
    populateName();
    if (Params.findIndex(obj => obj.phone) > -1) {
      let index = Params.findIndex(obj => obj.phone);
      $("#text-message").val(Params[index].phone.message);
      populatePhoneOnLoad();
    }
    if (Params.findIndex(obj => obj.email) > -1) {
      populateEmailOnLoad();
    }
    if (Params.findIndex(obj => obj.audio) > -1) {
      let index = Params.findIndex(obj => obj.audio);
      let soundName = Params[index].audio.src.slice(0, -4);
      $("#sound-options").val(soundName);
      $("#repeat").prop("checked", Params[index].audio.loop);
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
    $(".btn-group-vertical button").removeClass("btn-primary").addClass("btn-default");
    $(`button[data-id="${name}"]`).removeClass("btn-default").addClass("btn-primary");
    populatefields();
  });

  // event listeners for phone list to remove phone numbers
  $("#phone-list").on("click", ".btn-xs", (e) => {
    let val = e.currentTarget.parentElement.textContent;
    let phoneIndex = newObj[1].actionList.findIndex(obj => obj.phone);
    let removalIndex = newObj[1].actionList[phoneIndex].phone.phoneNumber.findIndex(obj => obj.number === val);
    newObj[1].actionList[phoneIndex].phone.phoneNumber.splice(removalIndex, 1);
    e.currentTarget.parentNode.remove();
    if (newObj[1].actionList[phoneIndex].phone.phoneNumber.length < 1) {
      newObj[1].actionList.splice(phoneIndex, 1);
      $("#phone-list").slideUp(300);
    }
  });

  // event listeners for email list to remove addresses
  $("#email-list").on("click", ".btn-xs", (e) => {
    let val = e.currentTarget.parentElement.textContent;
    let emailIndex = newObj[1].actionList.findIndex(obj => obj.email);
    let removalIndex = newObj[1].actionList[emailIndex].email.addresses.indexOf(val);
    newObj[1].actionList[emailIndex].email.addresses.splice(removalIndex, 1);
    e.currentTarget.parentNode.remove();
    if (newObj[1].actionList[emailIndex].email.addresses.length < 1) {
      newObj[1].actionList.splice(emailIndex, 1);
      $("#email-list").slideUp(300);
    }
  });

  // event listener for the minus button on the wiper number input
  $("#wiper-repeat-input .glyphicon-minus").click(() => {
    let curValue = $("#wiper-repeat").val();
      if (curValue > 1) {
        curValue--;
        $("#wiper-repeat").val(curValue);
      }
  });

  // event listener for the add button on the wiper number input
  $("#wiper-repeat-input .glyphicon-plus").click(() => {
    let curValue = $("#wiper-repeat").val();
    if (curValue < 10) {
      curValue++;
      $("#wiper-repeat").val(curValue);
    }
  });
});

// function for all add button event listeners
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

// function populates email addresses from previously made lists
const populateEmailOnLoad = () => {
  let name = $("#name").val();
  let index = arr.findIndex(arr => decodeURI(arr[0].name.codeName) === name);
  let Params = arr[index][1].actionList;
  let emailIndex = Params.findIndex(obj => obj.email);
  if (Params[emailIndex].email.addresses.length > 0) {
    newObj[1].actionList.push({
      email: {
        addresses: []
      }
    });
    $("#email-list").html(`<p>Email Addresses</p>`);
    let newObjPhoneIndex = newObj[1].actionList.findIndex(obj => obj.email)
    Params[emailIndex].email.addresses.forEach((email) => {
      $("#email-list").slideDown(300).append(`<li><button class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>${email}</li>`);
      newObj[1].actionList[newObjPhoneIndex].email.addresses.push(email);
    });
  }
}

// function populates phone numbers from previously made lists
const populatePhoneOnLoad = () => {
  let name = $("#name").val();
  let index = arr.findIndex(arr => decodeURI(arr[0].name.codeName) === name);
  let Params = arr[index][1].actionList;
  let phoneIndex = Params.findIndex(obj => obj.phone);
  if (Params[phoneIndex].phone.phoneNumber.length > 0) {
    newObj[1].actionList.push({
      phone: {
        phoneNumber: [],
        message: ""
      }
    });
    $("#phone-list").html(`<p>Phone Numbers</p>`);
    let newObjPhoneIndex = newObj[1].actionList.findIndex(obj => obj.phone)
    Params[phoneIndex].phone.phoneNumber.forEach((phone) => {
      $("#phone-list").slideDown(300).append(`<li><button class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button>${phone.number}</li>`);
      newObj[1].actionList[newObjPhoneIndex].phone.phoneNumber.push({
        number: phone
      });
    });
  }
}

// function to add email address on add click
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

// function to add phone numbers and text message on add click
const populatePhone = () => {
  let phone = $("#text-number").val();
  let message = encodeURI($("#text-message").val());
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
            message: "default"
          }
        });
        let index = newObj[1].actionList.findIndex((obj) => obj.phone);
        newObj[1].actionList[index].phone.phoneNumber.push({
          number: phone
        });
      } else {
        let index = newObj[1].actionList.findIndex((obj) => obj.phone);
        newObj[1].actionList[index].phone.phoneNumber.push({
          number: phone
        });
      }
      $("#text-number").val("")
    }
  } else {
    $('#text-number').css({ 'background-color': 'rgb(250, 210, 210)' });
  }
  if (message.length !== 0) {
    $("#phone-message").slideDown(300).html(`<p>Text Message</p><li>${decodeURI(message)}</li>`);
    let index = newObj[1].actionList.findIndex((obj) => obj.phone);
    if (index > -1) {
      newObj[1].actionList[index].phone.message = message;
    } else {

    }
    $("#text-message").val("")
  }
}

// function to add sound and repeat check on add click
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

// function to populate relay choices on add click
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

// function to populate Economy choice on add click
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

// function to populate lamp choices on add click
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

// function to empty out fields in the form
const emptyFields = () => {
  $("#name").val("");
  $("#text-message").val("");
  $("#sound-options").val("buzzer");
  $("#repeat").prop("checked", false);
  $("#relay-options").val("on");
  $("#power").val("on");
  $("#lamps-power").val("on");
  $("#wiper-power").prop("checked", true);
  $("#wiper-repeat").val("1");
  $("#log-check").prop("checked", true);
  $("#message").val("");
}

// function to populate wipers choice and count on add click
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

// function to populate log check and message
const populateLog = () => {
  let logCheck = $("#log-check").prop("checked");
  let message = encodeURI($("#message").val());
  if (logCheck) {
    $("#log-list").slideDown(300).html(`<p>Log Message</p><li>${decodeURI(message)}</li>`);
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

// function to populate name field
const populateName = () => {
  let name = $("#name").val();
    if (name === "" || name === "undefined") {
      $('#name').css({ 'background-color': 'rgb(250, 210, 210)' });
    } else {
      codeName = encodeURI(name);
      $('#name').css({ 'background-color': ''});
      $("#name-list").slideDown(300).html(`<p>Name</p><li><span>${name}</span></li>`);
      newObj[0].name = {
        commonName: name,
        codeName: codeName
      };
    }
}

// event listener for save button
const saveButton = () => {
  if (newObj[0].name === "" | newObj[0].name === "undefined") {
  } else {
    if ($(".btn-group-vertical").html() === "No Action Lists Found") {
      $(".btn-group-vertical").html("");
    }
    // find list name
    let ObjName = newObj[0].name.codeName;
    // check for the name in the list of previously made action groups
    if (arr.findIndex(arr => arr[0].name.codeName === ObjName) > -1) {
      // grab index of name matched array
      let arrIndex = arr.findIndex(arr => arr[0].name.codeName === ObjName);
      // remove the index of the previous array
      arr.splice(arrIndex, 1);
      // add in new array
      arr.push(newObj);
    } else {
      // add in new array
      arr.push(newObj);
      // create new button for the newly made list
      $("#action-groups .btn-group-vertical").append(`<div class="btn-group" role="group"><button type="button" data-id="${newObj[0].name.codeName}" class="btn btn-default loads">${decodeURI(newObj[0].name.codeName)}</button><button class="btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button></div>`);
    }
    // clear out our creation array for new use
    newObj = [{ name: {} }, { actionList: [] }];
    // hide all display info
    $(".list").hide();
    // remove display info
    $("#email-list").html("<p>Email Addresses</p>");
    $("#phone-list").html("<p>Phone Numbers</p>");
    $("#phone-message").html("<p>Text Message</p>");
    $("#wiper-list").html("<p>Wipers</p>");
    $("#relay-list").html("<p>Relay</p>");
    $("#power-list").html("<p>Economy Mode</p>");
    $("#lamps-list").html("<p>Lamp</p>");
    $("#log-list").html("<p>Log Message</p>");
    nameIndex = 0;
    addressIndex = 0;
    // remove values from form
    emptyFields();
    // hide all formfields
    $(".opt").hide();
    // display sound formfield
    $("#sound").show();
    // remove master array from local storage
    localStorage.removeItem("actionGroups");
    // add in new master array with new list
    localStorage.setItem("actionGroups", JSON.stringify(arr));
  }
}