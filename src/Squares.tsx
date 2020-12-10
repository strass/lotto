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
  config,
} from "react-spring";
import { useBoolean, useList } from "react-use";
import reducer from "./reducer";
import useCsvData, { CsvFields } from "./service/csv";
import useStyles from "./styles.jss";

const ROWS = 5;
const COLUMNS = 10;

const Square: FunctionComponent<{
  label: string;
}> = ({ label }) => {
  const transitionRef = useRef<ReactSpringHook>(null);
  const transitions = useTransition(label, null, {
    ref: transitionRef,
    from: { transform: "translateY(-40px)", opacity: 0.01 },
    enter: { transform: "translateY(0px)", opacity: 1 },
    leave: { transform: "translateY(40px)", opacity: 0 },
    trail: 25,
    unique: true,
    immediate: false,
    config: { ...config.stiff, precision: 0.1 },
  });

  useChain([transitionRef]);

  return (
    <Fragment>
      {transitions.map(({ item, props, key, state }) =>
        item && !!Number(props.opacity?.getValue()) ? (
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
        ) : null
      )}
    </Fragment>
  );
};

const Squares: FunctionComponent<{
  dispatch: Dispatch<ReducerAction<typeof reducer>>;
}> = ({ dispatch }) => {
  const styles = useStyles();
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
      <ul
        className={`mx-auto ${styles.unstyleList}`}
        style={{ flexDirection: "column", width: "fit-content", ...props }}
      >
        {times(ROWS, (rId) => (
          <li>
            <ul className={styles.unstyleList} style={{ flexDirection: "row" }}>
              {times(COLUMNS, (cId) => {
                const idx = rId * COLUMNS + cId;
                return (
                  <li className={styles.square} key={`${rId}-${cId}`}>
                    <Square
                      label={labels?.[idx]?.["account.username"] ?? "?"}
                    />
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
      <div className="d-grid gap-2 col-6 mx-auto">
        {running ? (
          <button
            className="btn btn-primary btn-large"
            onClick={() => {
              setRunning(false);
              dispatch({ type: "winner", winner: labels });
            }}
          >
            Select winners!
          </button>
        ) : (
          <button
            className="btn btn-primary btn-large"
            onClick={() => setRunning(true)}
          >
            Start
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default Squares;
