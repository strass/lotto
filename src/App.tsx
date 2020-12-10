import { isArray } from "lodash";
import React, { Fragment } from "react";
import useCsvData from "./service/csv";
import Spinner from "./Spinner";
import Squares from "./Squares";
import useStyles from "./styles.jss";
import logo from "./AbbVieLogo_Corporate.png";

const App = () => {
  const styles = useStyles();
  const { dispatch, ...state } = useCsvData();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <header className={styles.header}>
        <div className={styles.row}>
          <img
            src={logo}
            alt="AbbVie"
            style={{ filter: "grayscale(1) invert(1)" }}
          />
          <div>2020 ABC + CRC Raffle</div>
        </div>
      </header>
      <div style={{ display: "flex" }}>
        <div style={{ flexBasis: "67%" }}>
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
        <div
          style={{ flexBasis: "33%", display: "flex", flexDirection: "column" }}
        >
          <h2>Prizes</h2>
          <ul className={`${styles.horizontalList} ${styles.unstyleList}`}>
            {state.prizes.map((p, idx) => (
              <li key={idx} style={{ marginRight: 12 }}>
                <button
                  className={`btn btn-${
                    idx !== state.activePrize ? "outline-" : ""
                  }${p.winner ? "success" : "primary"}`}
                  onClick={() => {
                    if (idx !== 0) {
                      dispatch({ type: "reset", chunkNum: 40 });
                    }
                    dispatch({ type: "setPrize", prizeIndex: idx });
                  }}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          <h2>Winners</h2>
          <ul>
            {state.prizes.map((p, idx) => (
              <li key={idx} style={{ marginBottom: 24 }}>
                {p.label}:{" "}
                {p.winner && isArray(p.winner) ? (
                  <Fragment>
                    <br />
                    <div style={{ columns: 3 }}>
                      {p.winner
                        .sort((a, b) => {
                          if (a.displayName < b.displayName) {
                            return -1;
                          }
                          if (a.displayName > b.displayName) {
                            return 1;
                          }
                          return 0;
                        })
                        .map((w) => w.displayName)
                        .map((n) => (
                          <div key={n}>{n}</div>
                        ))}
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>{p.winner?.displayName}</Fragment>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
