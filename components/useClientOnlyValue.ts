import { Platform } from "react-native";

export function useClientOnlyValue<T>(web: T, native: T): T {
  return Platform.OS === "web" ? web : native;
}
