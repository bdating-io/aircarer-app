import TaskAcceptedList from "@/components/TaskAcceptedList";
import TaskInfoCard from "@/components/TaskInfoCard";
import React, { useState } from "react";
import { View } from "react-native";
import { Task } from "@/types/type";

export default function taskAccept() {
  const tasks: Task[] = [
    {
      id: "1",
      date: "2024-03-20",
      time: "14:00-16:00",
      budget: 150,
      location: "123 Main St, City",
      rooms: ["Bedroom", "Kitchen"],
      status: "pending",
      photos: ["../../assets/images/task1.png"],
      needsBedding: true,
    },
    {
      id: "2",
      date: "2024-03-21",
      time: "10:00-12:00",
      budget: 120,
      location: "456 Park Ave, City",
      rooms: ["Living Room", "Bathroom"],
      status: "pending",
      photos: ["../../assets/images/task1.png"],
      needsBedding: false,
    },
  ];
  const [task, setTask] = useState(tasks[0]);
  return (
    <View>
      {tasks !== null ? (
        <TaskAcceptedList tasks={tasks} />
      ) : (
        <TaskInfoCard task={task} />
      )}
    </View>
  );
}
