import * as c from "./constants";

const qualifiedCustomPathKey = `${c.moduleName}.${c.customPathKey}`;
const qualifiedShowWhisperNotificationsKey = `${c.moduleName}.${c.showWhisperNotificationsKey}`;
const qualifiedOverrideAudioKey = `${c.moduleName}.${c.overrideAudioKey}`;
const qualifiedEnhanceMessageKey = `${c.moduleName}.${c.enhanceMessageKey}`;

declare global {
  interface SettingConfig {
    [qualifiedCustomPathKey]: string;
    [qualifiedShowWhisperNotificationsKey]: number;
    [qualifiedOverrideAudioKey]: number;
    [qualifiedEnhanceMessageKey]: boolean;
  }
}
export {};
