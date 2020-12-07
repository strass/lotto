import React, { useReducer } from "react";
import { useEffectOnce } from "react-use";
import reducer from "./reducer";
import data from "./service/data";
import Spinner from "./Spinner";
import Squares from "./Squares";

const radius = 500;

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    prizes: [
      { label: "50 x $50" },
      { label: "$100" },
      { label: "$200" },
      { label: "$300" },
      { label: "$400" },
    ],
    data: [],
    chunks: [],
    activeSegments: [],
    activePrize: 0,
    chunkIndex: false,
  });
  useEffectOnce(() => {
    dispatch({ type: "init", data, chunkNum: 40 });
  });

  return (
    <div style={{ display: "flex" }}>
      {state.activePrize === 0 ? (
        <Squares />
      ) : (
        <Spinner
          segments={state.activeSegments}
          radius={radius}
          state={state}
          dispatch={dispatch}
          data={data}
        />
      )}

      <div>
        <h2>Prizes</h2>
        <ul>
          {state.prizes.map((p, idx) => (
            <li key={idx}>
              <button
                style={idx === state.activePrize ? { color: "red" } : undefined}
                onClick={() => {
                  dispatch({ type: "setPrize", prizeIndex: idx });
                }}
              >
                {p.label} {p.winner && `(${p.winner})`}{" "}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
