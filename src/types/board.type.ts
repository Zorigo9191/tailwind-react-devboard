import { Database } from "./supabase";

/* =========================
   TASK
========================= */

export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export type CreateTask = Database["public"]["Tables"]["tasks"]["Insert"];

export type UpdateTask = Database["public"]["Tables"]["tasks"]["Update"];

/* =========================
   BOARD
========================= */

export type Board = Database["public"]["Tables"]["boards"]["Row"] & {
  tasks: Task[];
};

export type UpdateBoard = Database["public"]["Tables"]["boards"]["Update"];

/* =========================
   LOCAL STORAGE
========================= */

export interface BoardLocalStorage {
  id: string;
  title: string;
  tasks: Task[];
}
