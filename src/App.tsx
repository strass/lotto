import { sample } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import data from "./service/data";
import Spinner from "./Spinner";
import { useSpring, animated } from "react-spring";

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
  const [list, { push }] = useList<string>(data);
  const [power, setPower] = useState(0);
  const acc = useRef(0);
  const [props, set] = useSpring(() => ({
    transform: "rotate(0deg)",
    immediate: false,
  }));

  useEffect(() => {
    const config = { mass: 50, tension: 200, friction: 200, precision: 0.001 };
    set({
      from: { transform: `rotate(${map(acc.current, 0, 100, 0, 1700)}deg)` },
      transform: `rotate(${map(acc.current + power, 0, 100, 0, 1700)}deg)`,
      immediate: false,
      config,
    });
    acc.current = acc.current + power;
  }, [power, set]);

  return (
    <div>
      <button
        onClick={() => {
          setPower((p) => p + 2);
        }}
      >
        spin
      </button>
      <animated.svg
        style={{ transformOrigin: "center", ...props }}
        width={radius * 2}
        height={radius * 2}
      >
        <Spinner segments={list} radius={radius} />
      </animated.svg>
    </div>
  );
};

export default App;
