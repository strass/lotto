import { isArray } from "lodash";
import React from "react";
import useCsvData from "./service/csv";
import Spinner from "./Spinner";
import Squares from "./Squares";
import useStyles from "./styles.jss";

const App = () => {
  const styles = useStyles();
  const { dispatch, ...state } = useCsvData();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 className={styles.logo}>BTS 2020 Raffle</h1>
      <div style={{ display: "flex" }}>
        <div style={{ flexBasis: "50%" }}>
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
        <div style={{ flexBasis: "25%" }}>
          <h2>Prizes</h2>
          <ul className={styles.unstyleList}>
            {state.prizes.map((p, idx) => (
              <li key={idx}>
                <button
                  className={`btn btn-${
                    idx !== state.activePrize ? "outline-" : ""
                  }${p.winner ? "success" : "primary"}`}
                  onClick={() => {
                    dispatch({ type: "setPrize", prizeIndex: idx });
                  }}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flexBasis: "25%" }}>
          <h2>Winners</h2>
          <ul>
            {state.prizes.map((p, idx) => (
              <li key={idx}>
                {p.label}:{" "}
                {p.winner &&
                  `(${
                    isArray(p.winner)
                      ? p.winner.map((w) => w.displayName).join(", ")
                      : p.winner.displayName
                  })`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
