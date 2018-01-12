const defaults = {
  name: "",
  soundName: "buzzer",
  soundRepeat: "true",
  phoneNumber: [],
  textMessage: "System Supplied Message",
  emails: [],
  relay: "true",
  economy: "false",
  wiper: "true",
  wiperCount: 1,
  log: "System Supplied Message",
  lamps: "false"
};

let defaultParams = JSON.parse(localStorage.getItem("newDefaults")) || defaults;

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

$("document").ready(function() {
  $(".opt").hide();
  $("#sound").show();
  $("#name").val(defaultParams.name);
  $("#text-message").val(defaultParams.textMessage);
  $("#sound-options").val(defaultParams.soundName);
  $("#repeat").prop("checked", defaultParams.soundRepeat);
  $("#relay-options").val("on");
  $("#power").val("on");
  $("#lamps-power").val("on");
  $("#wiper-power").prop("checked", defaultParams.wiper);
  $("#wiper-repeat").val(defaultParams.wiperCount);
  $("#log-check").prop("checked", "true");
  $("#message").val(defaultParams.log);

  if (defaultParams.emails) {
    defaultParams.emails.forEach((email) => {
      $("#email-list").slideDown(300).append(`<li> ${email}</li>`);
    });
    defaultParams.phoneNumber.forEach((phone) => {
      $("#phone-list").slideDown(300).append(`<li> ${phone}</li>`);
    });
  }

  populateEconomy();
  // populateEmail();
  populateLamps();
  populateLog();
  populateNameOnLoad();
  populatePhone();
  populateRelay();
  populateSound();
  populateWipers();

  $("#group-name").slideDown(300);

  $("#action-list").change((event) => {
    let actionValue = $("#action-list").val();
    $(`.opt`).slideUp(300);
    $(`#${actionValue}`).slideDown(300);
    event.stopPropagation();
  });

  $("#add-email").click(populateEmail);

  $("#add-phone").click(populatePhone);

  $("#add-sound").click(populateSound);

  $("#add-relay").click(populateRelay);

  $("#add-economy").click(populateEconomy);

  $("#add-lamp").click(populateLamps);

  $("#add-wiper").click(populateWipers);

  $("#add-log").click(populateLog);

  $("#add-name").click(populateName);

  $("#name-list").on('click', 'button', () => {
    $("#group-name").slideDown(300).val($("#name-list li span").text());
  })

});

const populateNameOnLoad = () => {
  let name = $("#name").val();
  $("#name-list").html(`<p>Name</p> <li><span>${name}</span> <button id="edit-name-btn" class="btn btn-warning btn-xs"><i id ="edit-name" class="glyphicon glyphicon-italic"></i></button></li>`);
}

const populateEmail = () => {
  let email = $("#email-input").val();
  if (!($("#email-list").html().includes(email))) {
    $("#email-list").slideDown(300).append(`<li> ${email}</li>`);
  }
}

const populatePhone = () => {
  let phone = $("#text-number").val();
  let message = $("#text-message").val();
  if (!($("#phone-list").html().includes(phone))) {
    $("#phone-list").slideDown(300).append(`<li> ${phone}</li>`);
  }
  $("#phone-message").html(`<p>Text Message</p><li>${message}</li>`)
}

const populateSound = () => {
  let sound = $("#sound-options").val();
  let soundRepeat = $("#repeat").prop("checked");
  $("#sound-list").html(`<p>Sounds</p><li>${sound} - ${soundRepeat}</li>`)
}

const populateRelay = () => {
  let relay = $("#relay-options").val();
  $("#relay-list").html(`<p>Relay</p><li>${relay}</li>`);
}

const populateEconomy = () => {
  let power = $("#power").val();
  $("#power-list").html(`<p>Economy Mode</p><li>${power}</li>`);
}

const populateLamps = () => {
  let lamp = $("#lamps-power").val();
  $("#lamps-list").html(`<p>Lamp</p><li>${lamp}</li>`);
}

const populateWipers = () => {
  let wiperCheck = $("#wiper-power").prop("checked");
  let wiperCount = $("#wiper-repeat").val();
  if (wiperCheck) {
    $("#wiper-list").slideDown(300).html(`<p>Wipers</p><li>${wiperCheck} - ${wiperCount}</li>`);
  }
}

const populateLog = () => {
  let logCheck = $("#log-check").prop("checked");
  let message = $("#message").val();
  if (logCheck) {
    $("#log-list").html(`<p>Log Message</p><li>${message}</li>`);
  }
}

const populateName = () => {
  let name = $("#name").val();
  $("#group-name").slideUp(300);
  $("#name-list").html(`<p>Name</p> <li><span>${name}</span> <button id="edit-name-btn" class="btn btn-warning btn-xs"><i id ="edit-name" class="glyphicon glyphicon-italic"></i></button></li>`);
}

$("#save").click(function () {
  let name = $("#name").val();
  let soundName = $("#sound-list li").html().split(" - ")[0];
  let soundRepeat = $("#sound-list li").html().split(" - ")[1];
  let phoneNumber = $("#phone-list li").text().split(" ").filter((elem) => elem.length >= 10);
  let textMessage = $("#phone-message li").html();
  let emails = $("#email-list li").text().split(" ").filter((elem) => elem.length >= 4);
  let relay = (() => {
    if ($("#relay-list li").html() === "on") {
        return "true";
    } else {
      return "false";
    }
  })();
  let economy = (() => {
    if ($("#power-list li").html() === "on") {
      return "true";
    } else {
      return "false";
    }
  })();
  let lamps = (() => {
    if ($("#lamps-list li").html() === "on") {
      return "true";
    } else {
      return "false";
    }
  })();
  let wiper = $("#wiper-list li").html().split(" - ")[0];
  let wiperCount = $("#wiper-list li").html().split(" - ")[1];
  let log = $("#log-list li").html();
  arr[name] = new OptionGroup(name, soundName, soundRepeat, phoneNumber, textMessage, emails, relay, economy, lamps, wiperCount, wiper, log);
  localStorage.setItem("newDefaults", JSON.stringify(arr[name]));
  console.log(JSON.stringify(arr[name]));
});

let arr = [];

