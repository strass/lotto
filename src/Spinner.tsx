import React, { Fragment, FunctionComponent, useMemo } from "react";

const Spinner: FunctionComponent<{ segments: string[]; radius: number }> = ({
  segments,
  radius: r,
}) => {
  const cx = r;
  const cy = r;
  const arcs = useMemo(() => {
    const slices = segments.length;
    return segments.map((segmentTitle, idx) => {
      const fromAngle = (idx * 360) / slices;
      const toAngle = ((idx + 1) * 360) / slices;
      const fromCoordX = cx + r * Math.cos((fromAngle * Math.PI) / 180);
      const fromCoordY = cy + r * Math.sin((fromAngle * Math.PI) / 180);
      const toCoordX = cx + r * Math.cos((toAngle * Math.PI) / 180);
      const toCoordY = cy + r * Math.sin((toAngle * Math.PI) / 180);
      const d = `M${cx},${cy} L${fromCoordX},${fromCoordY} A${r},${r} 0 0,1 ${toCoordX},${toCoordY}z`;
      return (
        <path
          d={d}
          stroke="black"
          strokeWidth="1px"
          fill="white"
          key={idx}
          style={{ zIndex: 1 }}
        />
      );
    });
  }, [segments]);
  return (
    <Fragment>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="black"
        fill="white"
        style={{ zIndex: 0 }}
      />
      {arcs}
    </Fragment>
  );
};

export default Spinner;
