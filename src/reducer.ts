import { ComponentProps, Reducer } from "react";
import type Spinner from "./Spinner";
import type data from "./service/data";
import { chunk, first, last } from "lodash";

export interface LottoState {
  prizes: Array<{ label: string; winner?: string }>;
  data: typeof data;
  chunks: typeof data[];
  activeSegments: ComponentProps<typeof Spinner>["segments"];
  activePrize: number;
}

type Action = Record<string, unknown> & { type: string } & (
    | { type: "init"; data: LottoState["data"]; chunkNum: number }
    | { type: "advance"; chunkIndex: number }
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
      };
    default:
      return state;
  }
};

export default reducer;
