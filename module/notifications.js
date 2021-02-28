
const moduleName = "better-indents";
const no = "No";
const yesTemp = "Yes (temporary)";
const yesPerm = "Yes (permanent until dismissed)";
const showWhisperNotificationsKey = "showWhisperNotifications" ;
const overrideAudioKey = "overrideAudioKey";
const enhanceMessageKey  ="enhanceMessage";
const notifChoices = [no, yesTemp, yesPerm];

const sounds = {
  "None": null,
  "Airhorn": "modules/better-indents/audio/Air Horn-SoundBible.com-964603082.mp3",
  "Bike horn": "modules/better-indents/audio/Bike Horn-SoundBible.com-602544869.mp3",
  "Electronic chime": "modules/better-indents/audio/Store_Door_Chime-Mike_Koenig-570742973.mp3",
}

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
});


Hooks.on("createChatMessage", async (data, options, userId) => {
  const showNotif = game.settings.get(moduleName, showWhisperNotificationsKey);
  const overrideIndex = game.settings.get(moduleName, overrideAudioKey);
  const overrideKey = Object.keys(sounds)[overrideIndex];
  const override = sounds[overrideKey];
  const isToMe = (data?.data?.whisper ?? []).includes(game.userId);
  if (override && isToMe) {
    data.data.sound = override;
  }
  if (showNotif !== notifChoices.indexOf(no) && isToMe) {
    ui.notifications.info(
      `Whisper from ${data.user.data.name}`,
      { permanent: showNotif === notifChoices.indexOf(yesPerm)},
    );
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

CONFIG.debug.hooks = true;
