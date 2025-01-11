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
}

declare interface Task {
  task_id: number;
  task_name: string;
  task_description: string;
  task_status: string;
}
