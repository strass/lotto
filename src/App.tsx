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
    prizes: [],
    data: [],
    chunks: [],
    activeSegments: [],
    activePrize: 0,
  });
  useEffectOnce(() => {
    dispatch({ type: "init", data, chunkNum: 50 });
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
        <button
          disabled={spinning}
          onClick={() => {
            console.log(selectedChunk.current);
            dispatch({ type: "advance", chunkIndex: selectedChunk.current });
          }}
        >
          advance
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
          <li>$100</li>
          <li>$200</li>
          <li>$300</li>
          <li>$400</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
