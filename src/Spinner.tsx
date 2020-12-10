import { max, toNumber } from "lodash";
import React, {
  Dispatch,
  Fragment,
  FunctionComponent,
  ReducerAction,
  ReducerState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animated, useSpring } from "react-spring";
import { useBoolean } from "react-use";
import reducer from "./reducer";

const mapRotation = function (
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

const Segment: FunctionComponent<{
  r: number;
  fromAngle: number;
  toAngle: number;
  label: string;
  path: string;
  currentRotation: number;
  setSelectedChunk: (index: number) => void;
  index: number;
}> = ({
  r,
  fromAngle: _fromAngle,
  toAngle: _toAngle,
  label,
  path,
  currentRotation,
  setSelectedChunk,
  index,
}) => {
  const fromAngle = _fromAngle;
  const toAngle = _toAngle;
  const correctedFromAngle = (fromAngle + currentRotation) % 360;
  const correctedToAngle = (toAngle + currentRotation) % 360;
  const selected =
    correctedFromAngle === 0 ||
    (correctedFromAngle > correctedToAngle && correctedToAngle !== 0);

  if (selected) {
    setSelectedChunk(index);
  }
  return (
    <animated.path
      d={path}
      stroke="black"
      strokeWidth="1px"
      style={{
        transition: "fill 0.2s",
        fill: selected ? "gold" : "palegoldenrod",
      }}
    />
  );
};
const Text: FunctionComponent<{
  r: number;
  fromAngle: number;
  toAngle: number;
  label: string;
  idx: number;
  totalSegments: number;
}> = ({ r, fromAngle, toAngle, label, idx, totalSegments }) => {
  return (
    <text
      y={r}
      x={r / 4}
      style={{
        transform: `rotate(${
          fromAngle - 180 + 360 / totalSegments / 2 - 1
        }deg)`,
        transformOrigin: "center",
      }}
    >
      {label}
    </text>
  );
};

const r = 500;
const cx = r;
const cy = r;

const Spinner: FunctionComponent<{
  segments: string[];
  state: ReducerState<typeof reducer>;
  dispatch: Dispatch<ReducerAction<typeof reducer>>;
}> = ({ segments, state, dispatch }) => {
  const [spinning, setSpinActive] = useBoolean(false);
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
      from: {
        transform: `rotate(${mapRotation(acc.current, 0, 100, 0, 1700)}deg)`,
      },
      transform: `rotate(${mapRotation(
        acc.current + power,
        0,
        100,
        0,
        1700
      )}deg)`,
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

  const resetAnimation = useCallback(
    () => setSpinAnimation({ transform: "rotate(0deg)", immediate: true }),
    [setSpinAnimation]
  );

  useEffect(() => {
    if (state.activePrize) {
      resetAnimation();
    }
  }, [state.activePrize, resetAnimation]);

  const { arcs, text } = useMemo<Record<"arcs" | "text", JSX.Element[]>>(() => {
    const setSelectedChunk = (newValue: number) =>
      (selectedChunk.current = newValue);
    const slices = segments.length;
    const test = segments.map((segmentTitle, idx) => {
      const fromAngle = (idx * 360) / slices;
      const toAngle = ((idx + 1) * 360) / slices;
      const fromCoordX = cx + r * Math.cos((fromAngle * Math.PI) / 180);
      const fromCoordY = cy + r * Math.sin((fromAngle * Math.PI) / 180);
      const toCoordX = cx + r * Math.cos((toAngle * Math.PI) / 180);
      const toCoordY = cy + r * Math.sin((toAngle * Math.PI) / 180);
      const d = `M${cx},${cy} L${fromCoordX},${fromCoordY} A${r},${r} 0 0,1 ${toCoordX},${toCoordY}z`;
      return {
        arcs: (
          <Segment
            key={idx}
            currentRotation={rotation % 360}
            r={r}
            fromAngle={fromAngle}
            toAngle={toAngle}
            path={d}
            label={segmentTitle}
            index={idx}
            setSelectedChunk={setSelectedChunk}
          />
        ),
        text: (
          <Text
            key={idx}
            idx={idx}
            r={r}
            fromAngle={fromAngle}
            toAngle={toAngle}
            label={segmentTitle}
            totalSegments={state.activeSegments.length}
          />
        ),
      };
    });
    return {
      arcs: test.map(({ arcs }) => {
        return arcs;
      }),
      text: test.map(({ text }) => {
        return text;
      }),
    };
  }, [segments, rotation, state.activeSegments.length]);
  return (
    <Fragment>
      <svg
        width={r * 2}
        height={r * 2}
        style={{ marginTop: 12 }}
        className="mx-auto"
      >
        <g style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}>
          <animated.g style={{ transformOrigin: "center", ...spinAnimation }}>
            <circle cx={cx} cy={cy} r={r} stroke="black" fill="white" />
            {arcs}
            {text}
          </animated.g>
        </g>
        <polygon
          points="-20,0 20,0 0,40"
          style={{ transform: "translateX(50%)" }}
        />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 12,
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            setPower((p) => p + 2);
          }}
        >
          spin
        </button>
        {state.chunkIndex === false ? (
          <button
            className="btn btn-primary"
            disabled={spinning}
            onClick={() => {
              const chunkIndex = selectedChunk.current;
              console.log(selectedChunk.current, chunkIndex);
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
            className="btn btn-primary"
            disabled={spinning}
            onClick={() => {
              const nameIndex = selectedChunk.current;
              console.log(selectedChunk.current, nameIndex);
              if (!state.chunkIndex && state.chunkIndex !== 0) {
                throw new Error("No chunk index found");
              }
              console.log(state.chunks[state.chunkIndex][nameIndex]);
              dispatch({
                type: "winner",
                winner: state.chunks[state.chunkIndex][nameIndex],
              });
              // resetAnimation();
            }}
          >
            Select winner!
          </button>
        )}
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            dispatch({
              type: "reset",
              chunkNum: 40,
            });
            resetAnimation();
          }}
        >
          reset
        </button>
      </div>
    </Fragment>
  );
};

export default Spinner;
