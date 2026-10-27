import type {
  Board,
  CreateTask,
  Task,
  UpdateBoard,
  UpdateTask,
} from "@/types/board.type";
import { supabase } from "./supabase";

const LOCAL_STORAGE_BOARDS_KEY = "boards";
const API_URL = import.meta.env.VITE_API_URL;

/////// fetch mit Token ///////
async function authFetch(path: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-type", "application/json");
  }

  if (session) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  return fetch(`${API_URL}${path}`, { ...options, headers });
}

/////// Alle Boards laden ///////
export async function getBoards(): Promise<Board[]> {
  const res = await authFetch("/boards");
  if (!res.ok) {
    throw new Error(`Failed to fetch boards: ${res.status}`);
  }
  return (await res.json()) as Board[];
}

export function getBoardsFromLocalStorage(): Board[] {
  const boardsStringified =
    localStorage.getItem(LOCAL_STORAGE_BOARDS_KEY) ?? "";
  if (boardsStringified) {
    const boards: Board[] = JSON.parse(boardsStringified) ?? [];
    return boards;
  }
  return [];
}

///////Board durch id finden //////
export async function getBoardById(id: string): Promise<Board | undefined> {
  const res = await authFetch(`/boards/${id}`);

  if (res.status === 404) {
    return undefined;
  }

  if (!res.ok) {
    throw new Error(`Error fetching board by id: ${res.status}`);
  }
  return (await res.json()) as Board;
}

export function saveBoards(boards: Board[]): void {
  localStorage.setItem(LOCAL_STORAGE_BOARDS_KEY, JSON.stringify(boards));
}

export async function saveBoard(board: Board): Promise<void> {
  const boards = await getBoards();

  const updatedBoards = boards.map((b) => {
    if (b.id === board.id) {
      return board;
    } else {
      return b;
    }
  });
  saveBoards(updatedBoards);
}

////// Board löschen /////////
export async function deleteBoard(id: string): Promise<void> {
  const res = await authFetch(`/boards/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error(`Error deleting board: ${res.status}`);
  }
}

////////neues Board erzeugen///////////
export async function insertBoard(board: Board): Promise<Board> {
  const res = await authFetch(`/boards`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ title: board.title }),
  });

  if (!res.ok) {
    throw new Error(`Error creating board : ${res.status}`);
  }
  return (await res.json()) as Board;
}

////// Board update //////////
export async function updateBoard(
  id: string,
  board: UpdateBoard,
): Promise<Board | null> {
  const res = await fetch(`${API_URL}/boards/${id}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ title: board.title }),
  });
  if (!res.ok) {
    throw new Error(`Error updating board : ${res.status}`);
  }
  return (await res.json()) as Board;
}

///// Task neu erzeugen//////
export async function insertTask(task: CreateTask): Promise<Task> {
  const res = await authFetch(`/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error(`Error creating task : ${res.status}`);
  }
  return (await res.json()) as Task;
}

///// Task updaten /////
export async function updateTask(id: string, task: UpdateTask): Promise<Task> {
  const res = await authFetch(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error(`Error updating task : ${res.status}`);
  }
  return (await res.json()) as Task;
}

///// Remove task /////
export async function deleteTask(id: string): Promise<void> {
  const res = await authFetch(`/tasks/${id} `, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Error deleting task: ${res.status}`);
  }
}
