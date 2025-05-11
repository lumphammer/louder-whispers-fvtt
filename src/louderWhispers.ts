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

let customPath = "";

Hooks.once("init", function () {
  assertGame(game);
});

Hooks.once("init", function () {
  assertGame(game);
  game.settings.register(moduleName, showWhisperNotificationsKey, {
    name: "Show notifications when you get whispers?",
    hint: "If you're not always looking at the chat log, choose one of these options to throw up a notification when you get a whisper.",
    scope: "client",
    config: true,
    // @ts-expect-error this actually works
    choices: [no, yesTemp, yesPerm],
    default: 0,
    type: Number,
  });
  game.settings.register(moduleName, overrideAudioKey, {
    name: "Override audio for whispers?",
    hint: "The default sound for an incoming whisper can be a little quiet. Pick one of these to make it more audible.",
    scope: "client",
    config: true,
    // @ts-expect-error this actually works
    choices: Object.keys(sounds),
    default: Object.keys(sounds).indexOf("None"),
    type: Number,
  });
  game.settings.register(moduleName, enhanceMessageKey, {
    name: "Make whisper messages stand out in the chat log?",
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
  void validateCustomPath(customPath);
});

Hooks.on("closeSettingsConfig", () => validateCustomPath(customPath));

Hooks.on(
  "createChatMessageHTML",
  (data: ChatMessage, options: any, userId: string) => {
    assertGame(game);
    const showNotifSetting = game.settings.get(
      moduleName,
      showWhisperNotificationsKey,
    );
    const customPathSetting = game.settings
      .get(moduleName, customPathKey)
      .trim();
    const showNotif = showNotifSetting !== notifChoices.indexOf(no);
    const overrideIndex = game.settings.get(moduleName, overrideAudioKey);
    const overrideKey = Object.keys(sounds)[overrideIndex];
    const override = customPathSetting || sounds[overrideKey];
    const isToMe = (data?.whisper ?? []).includes(game.userId ?? "");
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

Hooks.on(
  "renderChatMessage",
  (data: ChatMessage, elements: JQuery, options: any) => {
    assertGame(game);
    const enhanceSetting = game.settings.get(moduleName, enhanceMessageKey);
    const isWhisper = (data?.whisper ?? []).length > 0;
    const isToMe = (data?.whisper ?? []).includes(game.userId ?? "");
    const isFromMe = (data?.author?._id ?? "") === game.userId;
    if (enhanceSetting && isWhisper) {
      const color = game.users?.get(data?.author?._id ?? "")?.color;
      if (isFromMe && isToMe) {
        $(elements).addClass("louder-whisper-self");
      } else if (isToMe) {
        $(elements)
          .css("background-color", color?.toString() ?? "inherit")
          .addClass("louder-whisper-to-me");
      } else if (isFromMe) {
        $(elements)
          .css("background-color", color?.toString() ?? "inherit")
          .addClass("louder-whisper-from-me");
      }
    }
  },
);
