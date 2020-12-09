import { range, sample, times } from "lodash";
import {
  Fragment,
  FunctionComponent,
  ReactText,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  animated,
  ReactSpringHook,
  useChain,
  useSpring,
  useTransition,
} from "react-spring";
import { useBoolean, useList } from "react-use";
import data from "./service/data";

const ROWS = 5;
const COLUMNS = 10;

const unstyleList = {
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const Square: FunctionComponent<{
  running: boolean;
  idx: number;
  label: string;
}> = ({ running, idx, label }) => {
  //   useEffect(() => {
  //     if (running) {
  //       console.log("kickstart");
  //       setLabel(sample(data) ?? "ERROR");
  //     }
  //   }, [running]);
  const transitionRef = useRef<ReactSpringHook>(null);
  const transitions = useTransition([label], null, {
    ref: transitionRef,
    from: { transform: "translate3d(0,-40px,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: { transform: "translate3d(0,40px,0)", opacity: 0 },
    trail: 0,
    unique: true,
    immediate: true,
  });

  useChain([transitionRef]);

  return (
    <Fragment>
      {transitions.map(
        ({ item, props, key, state }) =>
          item && (
            <animated.div
              key={key}
              style={{
                ...props,
                position: "absolute",
                transition: "all cubic-bezier(.07,.78,.88,.24) 250ms",
                willChange: "transform, opacity",
              }}
            >
              {item}
            </animated.div>
          )
      )}
    </Fragment>
  );
};

const Squares: FunctionComponent = () => {
  const [running, setRunning] = useBoolean(false);
  // Build a spring and catch its ref
  const springRef = useRef<ReactSpringHook>(null);
  const props = useSpring({
    ref: springRef,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [labels, { set }] = useList(range(50).map(String));

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        set(times(50, () => sample(data) ?? "err"));
      }, 500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, set]);

  return (
    <Fragment>
      {running ? (
        <button onClick={() => setRunning(false)}>stop</button>
      ) : (
        <button onClick={() => setRunning(true)}>start</button>
      )}
      <ul style={{ ...unstyleList, flexDirection: "column", ...props }}>
        {times(ROWS, (rId) => (
          <li>
            <ul style={{ ...unstyleList, flexDirection: "row" }}>
              {times(COLUMNS, (cId) => {
                const idx = rId * COLUMNS + cId;
                return (
                  <li
                    key={`${rId}-${cId}`}
                    style={{
                      width: 60,
                      height: 60,
                      outline: "1px solid black",
                      position: "relative",
                      margin: 12,
                    }}
                  >
                    <Square running={running} idx={idx} label={labels[idx]} />
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default Squares;
