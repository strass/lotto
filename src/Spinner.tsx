import React, { ComponentProps, FunctionComponent, useMemo } from "react";
import { animated, useSpring } from "react-spring";

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
  const fromAngle = _fromAngle + 90;
  const toAngle = _toAngle + 90;
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
}> = ({ r, fromAngle: _fromAngle, toAngle: _toAngle, label, idx }) => {
  const fromAngle = _fromAngle + 90;
  const toAngle = _toAngle + 90;
  return (
    <text
      y={r}
      x={r / 4}
      style={{
        transform: `rotate(${(fromAngle + toAngle) / 2 - 12}deg)`,
        transformOrigin: "center",
      }}
    >
      {label} ({idx})
    </text>
  );
};

const Spinner: FunctionComponent<{
  segments: string[];
  radius: number;
  spinAnimation: ReturnType<typeof useSpring>[0];
  rotation: number;
  setSelectedChunk: ComponentProps<typeof Segment>["setSelectedChunk"];
}> = ({ segments, radius: r, spinAnimation, rotation, setSelectedChunk }) => {
  const cx = r;
  const cy = r;
  const { arcs, text } = useMemo<Record<"arcs" | "text", JSX.Element[]>>(() => {
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
  }, [segments, cx, cy, r, rotation, setSelectedChunk]);
  return (
    <svg width={r * 2} height={r * 2}>
      <animated.g style={{ transformOrigin: "center", ...spinAnimation }}>
        <circle cx={cx} cy={cy} r={r} stroke="black" fill="white" />
        {arcs}
        {text}
      </animated.g>
      <polygon
        points="-20,0 20,0 0,40"
        style={{ transform: "translateX(50%)" }}
      />
    </svg>
  );
};

export default Spinner;
