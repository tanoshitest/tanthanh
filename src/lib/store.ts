import { create } from "zustand";
import type { Role } from "./types";

interface AuthState {
  role: Role | null;
  userName: string;
  userId: string;
  selectedChildId: string;
  setRole: (role: Role) => void;
  logout: () => void;
  setSelectedChildId: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userName: "",
  userId: "",
  selectedChildId: "hs-001",
  setRole: (role) => {
    const names: Record<Role, { name: string; id: string }> = {
      admin: { name: "Nguyễn Văn Admin", id: "admin-001" },
      teacher: { name: "Trần Thị Mai", id: "gv-001" },
      parent: { name: "Nguyễn Thị Lan", id: "ph-001" },
    };
    set({ role, userName: names[role].name, userId: names[role].id });
  },
  logout: () => set({ role: null, userName: "", userId: "" }),
  setSelectedChildId: (id) => set({ selectedChildId: id }),
}));
