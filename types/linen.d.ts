export interface LinenBag {
  id: string;
  location: string;
  timestamp: string;
  roomNumber?: string;
  status: "pending" | "collected" | "cleaning" | "sorted" | "returned";
  collectedAt?: string;
  notes?: string;
}

export interface LinenContextType {
  linenBags: LinenBag[];
  updateBagStatus: (bagId: string, newStatus: LinenBag["status"]) => void;
  addNewBag: (bag: Omit<LinenBag, "id">) => void;
} 