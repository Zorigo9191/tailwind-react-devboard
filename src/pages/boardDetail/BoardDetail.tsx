import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";
import { ArrowLeft, Check, Pencil, X } from "lucide-react";
import { useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BoardColumn from "./components/BoardColumn";

import { getBoardById } from "@/lib/api";
import { useBoardDetailReducer } from "@/hoohks/BoardDetailReducer";
import { Task } from "@/types/board.type";
import TaskDialog from "./components/TaskDialog";

export default function BoardDetail() {
  const { id } = useParams();
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const boardFromLocalStorage = getBoardById(id ?? "") ?? {
    id: "",
    title: "",
    tasks: [],
  };

  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [board, dispatchBoard] = useReducer(
    useBoardDetailReducer,
    boardFromLocalStorage,
  );

  function handleAddTask(task: Task) {
    dispatchBoard({ type: "ADD_TASK", data: task });
  }

  function handleDeleteTask(task: Task) {
    dispatchBoard({ type: "DELETE_TASK", data: task });
  }

  function handleUpdateTaskStatus(
    id: string,
    newColumn: "ToDo" | "Progress" | "Done",
  ) {
    dispatchBoard({ type: "UPDATE_TASK_STATUS", data: { id, newColumn } });
  }

  function handleEditTask(task: Task) {
    setEditTask(task);
    setIsEditTaskDialogOpen(true);
  }

  function handleUpdateTask(task: Task) {
    dispatchBoard({ type: "UPDATE_TASK", data: task });
  }

  function renderBoardDetailHeader() {
    if (isEditingBoardName) {
      return (
        <>
          <Input
            value={board.title}
            className="w-96"
            onChange={(event) =>
              dispatchBoard({
                type: "UPDATE_BOARD_NAME",
                data: event.target.value,
              })
            }
          />
          <Button
            variant="ghost"
            size="icon-xl"
            onClick={() => setIsEditingBoardName(false)}
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
          <h1 className="font-bold text-2xl">{board.title}</h1>

          <Button
            variant="ghost"
            size="icon-xl"
            onClick={() => setIsEditingBoardName(true)}
          >
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
          editTask ?? { id: "", title: "", description: "", column: "ToDo" }
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
