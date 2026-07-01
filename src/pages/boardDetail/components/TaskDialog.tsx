import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { CreateTask, Task } from "@/types/board.type";
import { useContext, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { UserNameContext } from "@/context/UserNameContext";

export default function TaskDialog({
  open,
  handleOpenChange,
  onSubmitUpdate,
  title,
  description,
  task,
}: {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  onSubmitUpdate: (task: CreateTask) => void;
  title: string;
  description: string;
  task: Task;
}) {
  const context = useContext(UserNameContext);
  const [taskTitel, setTaskTitel] = useState<string>(task.title);
  const [taskDescription, setTaskDescription] = useState<string>(
    task.description ?? "",
  );
  const [selectedPerson, setSelectedPerson] = useState<string>(
    task.assignedTo ?? " ",
  );
  const [date, setDate] = useState<Date | undefined>(
    task.deadline ? new Date(task.deadline) : undefined,
  );

  function handleSubmitUpdate() {
    const updatedTask: CreateTask = {
      title: taskTitel,
      description: taskDescription,
      deadline: date?.toISOString() ?? null,
      assignedTo: selectedPerson === " " ? null : selectedPerson,
      column: task.column,
      boardId: task.boardId ?? "",
    };

    onSubmitUpdate(updatedTask);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          <span> Titel</span>
          <Input
            value={taskTitel}
            onChange={(e) => setTaskTitel(e.target.value)}
          />
        </div>
        <div>
          <span> Beschreibung</span>
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
        <div>
          <span>Zugewiesen an</span>
          <Select value={selectedPerson} onValueChange={setSelectedPerson}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value=" ">Keine Zuweisung</SelectItem>
                <SelectItem
                  value={
                    context?.userName === ""
                      ? "undefined"
                      : (context?.userName ?? "undefined")
                  }
                >
                  {context?.userName ?? "undefined"}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <span>Deadline</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                {date ? format(date, "dd.MM.yyyy") : <span>Pick a date</span>}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                required
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Abrrechen</Button>
          </DialogClose>
          {taskTitel === "" ? (
            <Button disabled>Speichern</Button>
          ) : (
            <DialogClose>
              <Button onClick={handleSubmitUpdate}>Speichern</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
