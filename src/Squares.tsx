import { sample, times } from "lodash";
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
import { useBoolean } from "react-use";
import data from "./service/data";

const ROWS = 2;
const COLUMNS = 5;

const unstyleList = {
  display: "flex",
  listStyle: "none",
};

const Square: FunctionComponent<{
  running: boolean;
  idx: number;
}> = ({ running, idx }) => {
  const [label, setLabel] = useState<ReactText>(`${idx}`);
  useEffect(() => {
    if (running) {
      setLabel(sample(data) ?? "ERROR");
    }
  }, [running, idx, setLabel]);
  const transitionRef = useRef<ReactSpringHook>(null);
  const transitions = useTransition([label], null, {
    ref: transitionRef,
    from: { transform: "translate3d(0,-40px,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: () => {
      console.log("leave");
      if (running) {
        requestAnimationFrame(() => {
          console.log("RAF");
          setTimeout(() => {
            setLabel(sample(data) ?? "ERROR");
          }, 500);
        });
      }
      return { transform: "translate3d(0,40px,0)", opacity: 0 };
    },
    trail: 0,
  });

  useChain([transitionRef]);

  return (
    <Fragment>
      {transitions.map(
        ({ item, props, key, state }) =>
          (item || item === 0) && (
            <animated.div
              key={`${label}-${key}-${state}`}
              style={{ ...props, position: "absolute" }}
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

  // Build a transition and catch its ref
  //   const transitionRef = useRef<ReactSpringHook>(null);

  // First run the spring, when it concludes run the transition
  //   useChain([springRef, transitionRef]);

  // Use the animated props like always
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
            <ul>
              {times(COLUMNS, (cId) => {
                const idx = rId * COLUMNS + cId;
                // const label = idx + 1;
                return (
                  <li
                    key={`${rId}-${cId}`}
                    style={{
                      width: 50,
                      height: 50,
                      outline: "1px solid black",
                      position: "relative",
                    }}
                  >
                    {/* <span>{label}</span> */}
                    <Square running={running} idx={idx} />
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
