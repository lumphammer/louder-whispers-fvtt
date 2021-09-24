
const moduleName = "louder-whispers";
const no = "No";
const yesTemp = "Yes (temporary)";
const yesPerm = "Yes (permanent until dismissed)";
const showWhisperNotificationsKey = "showWhisperNotifications" ;
const overrideAudioKey = "overrideAudioKey";
const enhanceMessageKey = "enhanceMessage";
const customPathKey = "customPath"
const notifChoices = [no, yesTemp, yesPerm];

const sounds = {
  "None": null,
  "Airhorn": `modules/${moduleName}/audio/Air Horn-SoundBible.com-964603082.mp3`,
  "Bike horn": `modules/${moduleName}/audio/Bike Horn-SoundBible.com-602544869.mp3`,
  "Electronic chime": `modules/${moduleName}/audio/Store_Door_Chime-Mike_Koenig-570742973.mp3`,
}

let customPath = null;

Hooks.once("init", async function () {
  game.settings.register(moduleName, showWhisperNotificationsKey, {
    name: "Show notifications when you get whispers?",
    hint: "If you're not always looking at the chat log, choose one of these options to throw up a notification when you get a whisper.",
    scope: "client",
    config: true,
    choices: [no, yesTemp, yesPerm],
    default: 0,
    type: Number,
  });
  game.settings.register(moduleName, overrideAudioKey, {
    name: "Override the audio cue for whispers?",
    hint: "The default sound for an incoming whisper can be a little quiet. Pick one of these to make it more audible.",
    scope: "client",
    config: true,
    choices: Object.keys(sounds),
    default: Object.keys(sounds).indexOf("None"),
    type: Number,
  });
  game.settings.register(moduleName, enhanceMessageKey, {
    name: "Make whisper messages more vibrant?",
    hint: "If ticked, whisper messages will stand out more and be coloured to match the sender.",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(moduleName, customPathKey, {
    name: "Custom audio path",
    hint: "If present, use this file (inside your Data folder) instead of the built-in sounds.",
    scope: "client",
    config: true,
    default: "",
    type: String,
  });
  customPath = game.settings.get(moduleName, customPathKey).trim();
});

Hooks.once("ready", () => {
  validateCustomPath();
});

async function validateCustomPath () {
  const customPathSetting = game.settings.get(moduleName, customPathKey).trim();
  const errorMessage = `[Louder Whispers] Custom audio file ${customPathSetting} not found (should be relative to your Data folder.)`;
  if (customPathSetting) {
    try {
      let result = await FilePicker.browse("data", customPathSetting);
      if (result.files.length >= 1) {
        if (customPath !== customPathSetting) {
          customPath = customPathSetting;
          ui.notifications.info(`[Louder Whispers] Custom audio file set to ${customPath}`);
        }
      } else {
        throw new Error(errorMessage)
      }
    } catch (e) {
      customPath = null;
      ui.notifications.error(errorMessage);
    }
  }
}

Hooks.on("closeSettingsConfig", validateCustomPath);


Hooks.on("createChatMessage", async (data, options, userId) => {
  const showNotifSetting = game.settings.get(moduleName, showWhisperNotificationsKey);
  const customPathSetting = game.settings.get(moduleName, customPathKey).trim();
  if (customPathSetting) {
    let result = await FilePicker.browse("data", customPathSetting);
    console.log(result);
  }
  const showNotif = showNotifSetting !== notifChoices.indexOf(no)
  const overrideIndex = game.settings.get(moduleName, overrideAudioKey);
  const overrideKey = Object.keys(sounds)[overrideIndex];
  const override = customPathSetting || sounds[overrideKey];
  const isToMe = (data?.data?.whisper ?? []).includes(game.userId);
  const isFromMe = (data?.data?.user ?? "") === game.userId;
  if (isToMe && !isFromMe) {
    if (override) {
      data.data.sound = override;
    }
    if (showNotif) {
      ui.notifications.info(
        `Whisper from ${data.user.data.name}`,
        { permanent: showNotif === notifChoices.indexOf(yesPerm)},
      );
    }
  }
});

Hooks.on("renderChatMessage", async (data, elements, options) => {
  const enhance = game.settings.get(moduleName, enhanceMessageKey);
  const isWhisper  = (data?.data?.whisper ?? []).length > 0;
  if (!(enhance && isWhisper)) {
    return;
  }
  const color = game.users.get(data?.data?.user)?.data?.color;
  if (color) {
    $(elements).css({"background-color": color}).addClass("louder-whisper");
  }
});

