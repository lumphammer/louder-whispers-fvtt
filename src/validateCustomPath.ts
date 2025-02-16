import { customPathKey, moduleName } from "./constants";
import { assertGame } from "./functions";

export async function validateCustomPath(customPath: string) {
  assertGame(game);

  const customPathSetting = game.settings.get(moduleName, customPathKey).trim();
  const errorMessage = `[Louder Whispers] Custom audio file ${customPathSetting} not found (should be relative to your Data folder.)`;
  if (customPathSetting) {
    try {
      const result = await FilePicker.browse("data", customPathSetting);
      if (result.files.length >= 1) {
        if (customPath !== customPathSetting) {
          customPath = customPathSetting;
          ui?.notifications?.info(
            `[Louder Whispers] Custom audio file set to ${customPath}`,
          );
        }
      } else {
        throw new Error(errorMessage);
      }
    } catch {
      ui?.notifications?.error(errorMessage);
    }
  }
}
