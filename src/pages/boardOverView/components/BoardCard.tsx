import { Button } from "@/components/ui/Button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Board } from "@/types/board.type";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function BoardCard({
  board,
  onDelete,
}: {
  board: Board;
  onDelete: (id: string) => void;
}) {
  return (
    <Link to={`/boards/${board.id}`}>
      <Card className=" transition-shadow hover:shadow-md rounded-b-sm border-2">
        <CardHeader>
          <CardTitle>{board.title}</CardTitle>
          <CardDescription>
            3 Spalten - {board.tasks.length} Tasks
          </CardDescription>
          <CardAction>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onDelete(board.id);
              }}
              className="hover:text-destructive text-muted-foreground"
              size={"icon"}
              variant={"ghost"}
            >
              <Trash2 />
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
