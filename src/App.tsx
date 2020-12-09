import { isArray } from "lodash";
import React from "react";
import useCsvData from "./service/csv";
import Spinner from "./Spinner";
import Squares from "./Squares";

const App = () => {
  const { dispatch, ...state } = useCsvData();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexBasis: "min-width" }}>
        {state.activePrize === 0 ? (
          <Squares dispatch={dispatch} />
        ) : (
          <Spinner
            segments={state.activeSegments}
            state={state}
            dispatch={dispatch}
          />
        )}
      </div>

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
                {p.label}{" "}
                {p.winner &&
                  `(${
                    isArray(p.winner)
                      ? p.winner.map((w) => w.displayName).join(", ")
                      : p.winner.displayName
                  })`}{" "}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
