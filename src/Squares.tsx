import { times } from "lodash";
import {
  Dispatch,
  Fragment,
  FunctionComponent,
  ReducerAction,
  useEffect,
  useRef,
} from "react";
import {
  animated,
  ReactSpringHook,
  useChain,
  useSpring,
  useTransition,
} from "react-spring";
import { useBoolean, useList } from "react-use";
import reducer from "./reducer";
import useCsvData, { CsvFields } from "./service/csv";

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
    trail: 25,
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
                transition: "all cubic-bezier(.07,.78,.88,.24) 250ms",
                willChange: "transform, opacity",
                position: "absolute",
              }}
            >
              {item}
            </animated.div>
          )
      )}
    </Fragment>
  );
};

const Squares: FunctionComponent<{
  dispatch: Dispatch<ReducerAction<typeof reducer>>;
}> = ({ dispatch }) => {
  const dataSource = useCsvData();
  const [running, setRunning] = useBoolean(false);
  // Build a spring and catch its ref
  const springRef = useRef<ReactSpringHook>(null);
  const props = useSpring({
    ref: springRef,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [labels, { set }] = useList<CsvFields>();

  useEffect(() => {
    if (running) {
      console.log("starting");
      intervalRef.current = setInterval(() => {
        set(dataSource.sample(COLUMNS * ROWS));
      }, 750);
    }
    return () => {
      console.log("clearing");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, set, dataSource]);

  return (
    <Fragment>
      {running ? (
        <button
          onClick={() => {
            setRunning(false);
            dispatch({ type: "winner", winner: labels });
          }}
        >
          select winners
        </button>
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
                      width: 100,
                      height: 100,
                      outline: "1px solid black",
                      position: "relative",
                      margin: 12,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Square
                      running={running}
                      idx={idx}
                      label={labels?.[idx]?.["account.username"]}
                    />
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
