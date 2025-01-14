import React, { createContext, useState, useContext } from "react";
import { LinenBag, LinenContextType } from "@/types/linen";
import { Alert } from "react-native";

const LinenContext = createContext<LinenContextType | undefined>(undefined);

export const LinenProvider = ({ children }: { children: React.ReactNode }) => {
  const [linenBags, setLinenBags] = useState<LinenBag[]>([
    {
      id: "1",
      location: "Storage Room A",
      timestamp: "2024-03-20 14:30",
      roomNumber: "301",
      status: "pending",
    },
  ]);

  const updateBagStatus = (bagId: string, newStatus: LinenBag["status"]) => {
    setLinenBags((prev) =>
      prev.map((bag) => {
        if (bag.id === bagId) {
          const updates: Partial<LinenBag> = { status: newStatus };
          if (newStatus === "collected") {
            updates.collectedAt = new Date().toISOString();
          }
          return { ...bag, ...updates };
        }
        return bag;
      })
    );
    Alert.alert("Success", `Linen bag status updated to ${newStatus}`);
  };

  const addNewBag = (bag: Omit<LinenBag, "id">) => {
    const newBag: LinenBag = {
      ...bag,
      id: Date.now().toString(),
    };
    setLinenBags((prev) => [...prev, newBag]);
  };

  return (
    <LinenContext.Provider value={{ linenBags, updateBagStatus, addNewBag }}>
      {children}
    </LinenContext.Provider>
  );
};

export const useLinenContext = () => {
  const context = useContext(LinenContext);
  if (context === undefined) {
    throw new Error("useLinenContext must be used within a LinenProvider");
  }
  return context;
}; 