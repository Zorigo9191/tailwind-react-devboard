import { Board } from "@/types/board.type";
type BoardsOverviewState = Board[];

type BoardsOverviewAction =
  | {
      type: "ADD" | "DELETE";
      data: Board;
    }
  | { type: "SET"; data: Board[] };

export function useBoardOverviewReducer(
  prevState: BoardsOverviewState,
  action: BoardsOverviewAction,
) {
  let newState = prevState;

  switch (action.type) {
    case "ADD": {
      newState = [...prevState, action.data];

      break;
    }

    case "DELETE": {
      newState = prevState.filter((board) => board.id !== action.data.id);

      break;
    }

    case "SET": {
      newState = action.data;
      break;
    }
    default:
      break;
  }

  return newState;
}
