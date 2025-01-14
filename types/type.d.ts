import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface TaskInfo {
  date: string;
  time: string;
  budget: number;
  rooms: string[];
  photos: string[];
  needsBedding: boolean;
  location: string;
  status: string;
}

declare interface Task {
  id: string;
  date: string;
  time: string;
  budget: number;
  location: string;
  rooms: string[];
  status: "pending" | "accepted" | "completed";
  photos: string[];
  needsBedding: boolean;
}
