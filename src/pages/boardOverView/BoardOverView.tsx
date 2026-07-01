import { useEffect, useReducer, useState } from "react";
import { Button } from "../../components/ui/Button";
import BoardCard from "./components/BoardCard";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { deleteBoard, getBoards, insertBoard } from "@/lib/api";
import { Board } from "@/types/board.type";
import { useBoardOverviewReducer } from "@/hoohks/BoardsOverviewReducer";

export default function BoardOverView() {
  const [boards, boardsDispatch] = useReducer(useBoardOverviewReducer, []);

  const [boardNameInput, setBoardnameInput] = useState("Neues Board");

  async function fetchBoards() {
    const boards = await getBoards();
    boardsDispatch({ type: "SET", data: boards });
    console.log(boards);
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  async function handleAddNewBoard() {
    const newBoard: Board = {
      id: "",
      title: boardNameInput,
      created_at: new Date().toISOString(),
      tasks: [],
    };

    const insertedBoard = await insertBoard(newBoard);
    if (insertedBoard) {
      boardsDispatch({ type: "ADD", data: insertedBoard });
      setBoardnameInput("");
    }
  }

  function handleDeleteBoard(id: string) {
    try {
      deleteBoard(id);
      boardsDispatch({
        type: "DELETE",
        data: { id: id, title: "", tasks: [], created_at: "" },
      });
    } catch (error) {
      console.error("Error deleting boards:", error);
    }
  }

  return (
    <>
      <div className="flex flex-row place-content-between ">
        <h1 className="text-xl font-bold">Meine Boards</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center p-2.5">
              <Plus className="size-5" />
              Neues Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Board erstellen</DialogTitle>
              <DialogDescription>Gib dem Board einen Namen</DialogDescription>
            </DialogHeader>
            <Input
              onChange={(e) => setBoardnameInput(e.target.value)}
              id="name-1"
              name="name"
              defaultValue="Neues Board"
              value={boardNameInput}
            />
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Abbrechen</Button>
              </DialogClose>
              <DialogClose>
                <Button onClick={handleAddNewBoard}>Speichern</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-4 py-5">
        {boards.map((board) => {
          return (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={handleDeleteBoard}
            />
          );
        })}
      </div>
    </>
  );
}
