import React from "react";
import useCsvData from "./service/csv";
import Spinner from "./Spinner";
import Squares from "./Squares";
import useStyles from "./styles.jss";
import Winners from "./Winners";
import Wrapper from "./Wrapper";

const App = () => {
  const styles = useStyles();
  const { dispatch, ...state } = useCsvData();

  if (state.activePrize === state.prizes.length) {
    return (
      <Wrapper>
        <div style={{ width: 1024, fontSize: "160%" }} className="mx-auto">
          <Winners
            prizes={state.prizes}
            toggleViewWinners={() =>
              dispatch({
                type: "setPrize",
                prizeIndex: state.prizes.length - 1,
              })
            }
          />
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div style={{ display: "flex" }}>
        <div
          style={{
            flexBasis: "67%",
            display: "flex",
            flexDirection: "column",
          }}
          className="mx-auto"
        >
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
          style={{
            flexBasis: "33%",
            display: "flex",
            flexDirection: "column",
          }}
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
          <Winners
            prizes={state.prizes}
            toggleViewWinners={() =>
              dispatch({ type: "setPrize", prizeIndex: state.prizes.length })
            }
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default App;
