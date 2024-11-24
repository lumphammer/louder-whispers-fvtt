export const moduleName = "louder-whispers";
export const no = "No";
export const yesTemp = "Yes (temporary)";
export const yesPerm = "Yes (permanent until dismissed)";
export const showWhisperNotificationsKey = "showWhisperNotifications";
export const overrideAudioKey = "overrideAudioKey";
export const enhanceMessageKey = "enhanceMessage";
export const customPathKey = "customPath";
export const notifChoices = [no, yesTemp, yesPerm];

export const sounds: Record<string, string | null> = {
  None: null,
  Airhorn: `modules/${moduleName}/audio/Air Horn-SoundBible.com-964603082.mp3`,
  "Bike horn": `modules/${moduleName}/audio/Bike Horn-SoundBible.com-602544869.mp3`,
  "Electronic chime": `modules/${moduleName}/audio/Store_Door_Chime-Mike_Koenig-570742973.mp3`,
};
