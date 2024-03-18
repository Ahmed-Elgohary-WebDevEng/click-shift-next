import { Setting } from "@/types/global";

export const parseSettings = (settings: Setting[]): Record<string, string> =>
  Object.assign({}, ...settings.map((setting) => ({ [setting.key]: setting.value })));
