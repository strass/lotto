import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  "@global": {
    html: { background: "skyblue", color: "#444" },
  },
  square: {
    background: "white",
    borderRadius: 4,
    width: 100,
    height: 100,
    margin: 12,
    border: "1px solid #444",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 3px 6px rgba(68,68,68,0.16), 0 3px 6px rgba(68,68,68,0.23)",
  },
});

export default useStyles;
