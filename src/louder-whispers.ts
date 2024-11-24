import {
  customPathKey,
  enhanceMessageKey,
  moduleName,
  no,
  notifChoices,
  overrideAudioKey,
  showWhisperNotificationsKey,
  sounds,
  yesPerm,
  yesTemp,
} from "./constants";
import { assertGame } from "./functions";
import { validateCustomPath } from "./validateCustomPath";

Hooks.once("init", function () {
  assertGame(game);
  game.settings.register<
    typeof moduleName,
    typeof showWhisperNotificationsKey,
    number
  >(moduleName, showWhisperNotificationsKey, {
    name: "Show notifications when you get whispers?",
    hint: "If you're not always looking at the chat log, choose one of these options to throw up a notification when you get a whisper.",
    scope: "client",
    config: true,
    choices: [no, yesTemp, yesPerm],
    default: 0,
    type: Number,
  });
  game.settings.register<typeof moduleName, typeof overrideAudioKey, number>(
    moduleName,
    overrideAudioKey,
    {
      name: "Override the audio cue for whispers?",
      hint: "The default sound for an incoming whisper can be a little quiet. Pick one of these to make it more audible.",
      scope: "client",
      config: true,
      choices: Object.keys(sounds),
      default: Object.keys(sounds).indexOf("None"),
      type: Number,
    },
  );
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
});

Hooks.once("ready", () => {
  void validateCustomPath();
});

Hooks.on("closeSettingsConfig", validateCustomPath);

Hooks.on(
  "createChatMessage",
  async (data: any, options: any, userId: string) => {
    assertGame(game);
    const showNotifSetting = game.settings.get(
      moduleName,
      showWhisperNotificationsKey,
    ) as number;
    const customPathSetting = (
      game.settings.get(moduleName, customPathKey) as string
    ).trim();
    if (customPathSetting) {
      const result = await FilePicker.browse("data", customPathSetting);
      console.log(result);
    }
    const showNotif = showNotifSetting !== notifChoices.indexOf(no);
    const overrideIndex = game.settings.get(
      moduleName,
      overrideAudioKey,
    ) as number;
    const overrideKey = Object.keys(sounds)[overrideIndex];
    const override = customPathSetting || sounds[overrideKey];
    const isToMe = (data?.whisper ?? []).includes(game.userId);
    const isFromMe = (data?.author?._id ?? "") === game.userId;
    if (isToMe && !isFromMe) {
      if (override) {
        data.sound = override;
      }
      if (showNotif) {
        ui?.notifications?.info(`Whisper from ${data.author.name}`, {
          permanent: showNotifSetting === notifChoices.indexOf(yesPerm),
        });
      }
    }
  },
);

Hooks.on("renderChatMessage", (data, elements, options) => {
  assertGame(game);
  const enhanceSetting = game.settings.get(moduleName, enhanceMessageKey);
  const isWhisper = (data?.whisper ?? []).length > 0;
  const isToMe = (data?.whisper ?? []).includes(game.userId);
  const isFromMe = (data?.author?._id ?? "") === game.userId;
  if (enhanceSetting && isWhisper) {
    const color = game.users.get(data?.author?._id)?.color;
    if (isFromMe && isToMe) {
      $(elements).addClass("louder-whisper-self");
    } else if (isToMe) {
      if (color) {
        $(elements)
          .css({ "background-color": color })
          .addClass("louder-whisper-to-me");
      }
    } else if (isFromMe) {
      $(elements)
        .css({ "background-color": color })
        .addClass("louder-whisper-from-me");
    }
  }
});
