import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";
import { ArrowLeft, Check, Pencil, X } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BoardColumn from "./components/BoardColumn";

import {
  deleteTask,
  getBoardById,
  insertTask,
  updateBoard,
  updateTask,
} from "@/lib/api";
import { useBoardDetailReducer } from "@/hoohks/BoardDetailReducer";
import { CreateTask, Task, UpdateTask } from "@/types/board.type";
import TaskDialog from "./components/TaskDialog";

export default function BoardDetail() {
  const { id } = useParams();
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [boardName, setBoardname] = useState("");
  const [board, dispatchBoard] = useReducer(useBoardDetailReducer, undefined);

  async function fetchBoard() {
    const board = await getBoardById(id ?? "");
    dispatchBoard({ type: "SET_BOARD", data: board });
  }

  useEffect(() => {
    fetchBoard();
  }, []);

  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  if (!board) {
    return <div>Loading...</div>;
  }

  async function handleAddTask(task: CreateTask) {
    try {
      const insertedTask = await insertTask({
        ...task,
        boardId: board?.id ?? "",
      });
      if (insertedTask) {
        dispatchBoard({ type: "ADD_TASK", data: insertedTask });
      }
    } catch (error: unknown) {
      console.error("Error adding task:", error);
    }
  }

  async function handleDeleteTask(task: Task) {
    try {
      await deleteTask(task.id);
      dispatchBoard({ type: "DELETE_TASK", data: task });
    } catch (error: unknown) {
      console.error("Error deleting task:", error);
    }
  }

  async function handleUpdateTaskStatus(
    id: string,
    newColumn: "ToDo" | "Progress" | "Done",
  ) {
    try {
      await updateTask(id, { column: newColumn });
      dispatchBoard({ type: "UPDATE_TASK_STATUS", data: { id, newColumn } });
    } catch (error: unknown) {
      console.error("Error updating task status:", error);
    }
  }

  function handleEditTask(task: Task) {
    setEditTask(task);
    setIsEditTaskDialogOpen(true);
  }

  async function handleUpdateTask(task: UpdateTask) {
    try {
      const updatedTask = await updateTask(editTask?.id ?? "", task);
      if (updatedTask) {
        dispatchBoard({ type: "UPDATE_TASK", data: updatedTask });
      }
    } catch (error: unknown) {
      console.error("Error updating task:", error);
    }
  }

  function handleEditBoardTitle() {
    setIsEditingBoardName(true);
    setBoardname(board?.title ?? "");
  }

  async function handleSubmitEditBoardTitle() {
    if (!board) return;

    const updatedBoard = await updateBoard(board.id, { title: boardName });

    if (updatedBoard) {
      dispatchBoard({ type: "UPDATE_BOARD_NAME", data: boardName });
      setIsEditingBoardName(false);
    }
  }

  function renderBoardDetailHeader() {
    if (isEditingBoardName) {
      return (
        <>
          <Input
            value={boardName}
            className="w-96"
            onChange={(event) => setBoardname(event.target.value)}
          />
          <Button
            variant="ghost"
            size="icon-xl"
            onClick={handleSubmitEditBoardTitle}
          >
            <Check className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xl"
            onClick={() => setIsEditingBoardName(false)}
          >
            <X className="size-5" />
          </Button>
        </>
      );
    } else {
      return (
        <>
          <h1 className="font-bold text-2xl">{board?.title ?? "Board"}</h1>

          <Button variant="ghost" size="icon-xl" onClick={handleEditBoardTitle}>
            <Pencil className="size-4" />
          </Button>
        </>
      );
    }
  }

  return (
    <div className="container">
      <div className="flex flex-row items-center gap-2">
        <Link to={"/boards"}>
          <Button variant="ghost" size="icon-xl">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        {renderBoardDetailHeader()}
      </div>

      <TaskDialog
        key={editTask?.id ?? "empty-0"}
        open={isEditTaskDialogOpen}
        handleOpenChange={setIsEditTaskDialogOpen}
        onSubmitUpdate={handleUpdateTask}
        title="Task bearbeiten"
        description="bearbeite die ausgewählte Aufgabe"
        task={
          editTask ?? {
            id: "",
            title: "",
            description: "",
            column: "ToDo",
            assignedTo: null,
            deadline: null,
            boardId: board.id ?? "",
            created_at: Date.now().toString(),
          }
        }
      />

      <div className="mt-8 grid grid-cols-3 gap-4">
        <BoardColumn
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          title="ToDo"
          tasks={board.tasks.filter((task) => task.column === "ToDo")}
          handleEditTask={handleEditTask}
        />
        <BoardColumn
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          title="Progress"
          tasks={board.tasks.filter((task) => task.column === "Progress")}
          handleEditTask={handleEditTask}
        />
        <BoardColumn
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          title="Done"
          tasks={board.tasks.filter((task) => task.column === "Done")}
          handleEditTask={handleEditTask}
        />
      </div>
    </div>
  );
}
