import TaskAcceptedList from "@/components/TaskAcceptedList";
import TaskInfoCard from "@/components/TaskInfoCard";
import { TaskInfo } from "@/types/type";
import React, { useState } from "react";
import { View, Text } from "react-native";

export default function taskAccept() {
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  return <View>{false ? <TaskInfoCard /> : <TaskAcceptedList />}</View>;
}
