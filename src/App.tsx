import { max, toNumber } from "lodash";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSpring } from "react-spring";
import { useBoolean, useEffectOnce } from "react-use";
import reducer from "./reducer";
import data from "./service/data";
import Spinner from "./Spinner";

const map = function (
  value: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  if (value === 0) {
    return out_min;
  }
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const radius = 500;

const App = () => {
  const [spinning, setSpinActive] = useBoolean(false);
  const [state, dispatch] = useReducer(reducer, {
    prizes: [
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
  const [power, setPower] = useState(0);
  const [rotation, setRotation] = useState(0);
  const acc = useRef(0);
  const selectedChunk = useRef(0);
  const [spinAnimation, setSpinAnimation] = useSpring(() => ({
    transform: "rotate(0deg)",
    immediate: false,
    onFrame({ transform }: { transform: string }) {
      setRotation(toNumber(transform.slice(7, -4)));
      acc.current = acc.current > 0.5 ? acc.current - 0.5 : 0;
    },
  }));

  useEffect(() => {
    const config = { mass: 50, tension: 200, friction: 200, precision: 0.001 };
    setSpinAnimation({
      from: { transform: `rotate(${map(acc.current, 0, 100, 0, 1700)}deg)` },
      transform: `rotate(${map(acc.current + power, 0, 100, 0, 1700)}deg)`,
      onStart: () => {
        acc.current = max([acc.current + power, 2]) ?? 2;
        setSpinActive(true);
      },
      onRest: () => {
        acc.current = 0;
        setSpinActive(false);
      },
      immediate: false,
      config,
    });
  }, [power, setSpinAnimation, setSpinActive]);

  const resetAnimation = () =>
    setSpinAnimation({ transform: "rotate(0deg)", immediate: true });

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>Wheel</h1>
        <button
          onClick={() => {
            setPower((p) => p + 2);
          }}
        >
          spin
        </button>
        {state.chunkIndex === false ? (
          <button
            disabled={spinning}
            onClick={() => {
              let chunkIndex =
                (selectedChunk.current -
                  // TODO: #1 figure out why this is 18 when chunknum is 40 and # datapoints is 1000
                  18) %
                state.activeSegments.length;
              if (chunkIndex < 0) {
                chunkIndex = state.activeSegments.length - Math.abs(chunkIndex);
              }
              // console.log(selectedChunk.current, chunkIndex);
              dispatch({
                type: "advance",
                chunkIndex,
              });
              resetAnimation();
            }}
          >
            advance
          </button>
        ) : (
          <button
            disabled={spinning}
            onClick={() => {
              let nameIndex =
                (selectedChunk.current -
                  // TODO: figure out why this is 29 for chunk size of 40
                  29) %
                state.activeSegments.length;
              if (nameIndex < 0) {
                nameIndex = state.activeSegments.length - Math.abs(nameIndex);
              }
              // console.log(selectedChunk.current, nameIndex);
              dispatch({
                type: "winner",
                nameIndex,
              });
              // resetAnimation();
            }}
          >
            select winner
          </button>
        )}
        <button
          onClick={() => {
            dispatch({
              type: "init",
              chunkNum: 40,
              // TODO: #2 Do we need to remove winners?
              data,
            });
            resetAnimation();
          }}
        >
          reset
        </button>
        <Spinner
          segments={state.activeSegments}
          radius={radius}
          spinAnimation={spinAnimation}
          rotation={rotation}
          setSelectedChunk={(index) => (selectedChunk.current = index)}
        />
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
