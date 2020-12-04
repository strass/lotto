import { ComponentProps, Reducer } from "react";
import type Spinner from "./Spinner";
import type data from "./service/data";
import { chunk, first, last, set } from "lodash";

export interface LottoState {
  prizes: Array<{ label: string; winner?: string }>;
  data: typeof data;
  chunks: typeof data[];
  activeSegments: ComponentProps<typeof Spinner>["segments"];
  activePrize: number;
  chunkIndex: false | number;
}

type Action = { type: string } & (
  | { type: "init"; data: LottoState["data"]; chunkNum: number }
  | { type: "advance"; chunkIndex: number }
  | { type: "winner"; nameIndex: number }
  | { type: "setPrize"; prizeIndex: number }
);

const reducer: Reducer<LottoState, Action> = (state, action) => {
  switch (action.type) {
    case "init":
      const chunks = chunk(action.data, action.chunkNum);
      return {
        ...state,
        data: action.data,
        chunks,
        activeSegments: chunks.map((names) => `${first(names)}-${last(names)}`),
        activePrize: 0,
        chunkIndex: false,
      };
    case "advance":
      return {
        ...state,
        activeSegments: state.chunks[action.chunkIndex],
        chunkIndex: action.chunkIndex,
      };
    case "winner":
      return {
        ...state,
        prizes: set(state.prizes, `[${state.activePrize}]`, {
          ...state.prizes[state.activePrize],
          winner: state.chunks[state.chunkIndex as number][action.nameIndex],
        }),
      };
    case "setPrize":
      return {
        ...state,
        activePrize: action.prizeIndex,
      };
    default:
      return state;
  }
};

export default reducer;
