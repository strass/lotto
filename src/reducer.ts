import { ComponentProps, Reducer } from "react";
import type Spinner from "./Spinner";
import { first, isArray, last, set, without } from "lodash";
import type { CsvFields } from "./service/csv";

export interface LottoState {
  all: CsvFields[];
  prizes: Array<{ label: string; winner?: CsvFields | CsvFields[] | null }>;
  data: CsvFields[];
  chunks: CsvFields[][];
  activeSegments: ComponentProps<typeof Spinner>["segments"];
  activePrize: number;
  chunkIndex: false | number;
}

type Action = { type: string } & (
  | { type: "init"; data: LottoState["data"]; chunkNum: number }
  | { type: "reset"; chunkNum: number }
  | { type: "advance"; chunkIndex: number }
  | { type: "winner"; winner: CsvFields | CsvFields[] }
  | { type: "setPrize"; prizeIndex: number }
);

function distribute<T>(input: T[], k: number) {
  const subs = Array(k)
    .fill(undefined)
    .map(() => []) as T[][];
  for (let i = 0; i < input.length; i++) {
    subs[i % k].push(input[i]);
  }
  return subs;
}

const reducer: Reducer<LottoState, Action> = (state, action) => {
  switch (action.type) {
    case "init": {
      const chunks = distribute(action.data, action.chunkNum);
      return {
        ...state,
        data: action.data,
        all: action.data,
        chunks,
        activeSegments: chunks.map(
          (names) =>
            `${first(names)?.["account.username"]}-${
              last(names)?.["account.username"]
            }`
        ),
        chunkIndex: false,
      };
    }
    case "reset": {
      const chunks = distribute(state.data, action.chunkNum);
      return {
        ...state,
        activeSegments: chunks.map(
          (names) =>
            `${first(names)?.["account.username"]}-${
              last(names)?.["account.username"]
            }`
        ),
        chunks,
        chunkIndex: false,
      };
    }
    case "advance":
      return {
        ...state,
        activeSegments: state.chunks[action.chunkIndex].map(
          (n) => n["displayName"]
        ),
        chunkIndex: action.chunkIndex,
      };
    case "winner":
      return {
        ...state,
        data: without(
          state.data,
          ...(isArray(action.winner) ? action.winner : [action.winner])
        ),
        prizes: set(state.prizes, `[${state.activePrize}]`, {
          ...state.prizes[state.activePrize],
          winner: action.winner,
        }),
      };
    case "setPrize":
      return {
        ...state,
        activePrize: action.prizeIndex,
      };
  }
};

export default reducer;
