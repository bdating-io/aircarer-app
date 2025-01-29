export interface ProfileData {
  firstName: string;
  lastName: string;
  abn: string;
  role: "Laundry Partner" | "Supervisor" | "Cleaner" | "House Owner";
  backgroundCheck: string;
}
