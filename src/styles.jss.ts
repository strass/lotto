import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  "@global": {
    "html, body": { color: "#061D49" },
    button: {
      marginBottom: 8,
    },
  },
  square: {
    background: "white",
    borderRadius: 4,
    width: 100,
    height: 100,
    margin: 12,
    border: "1px solid #061D49",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 3px 6px rgba(68,68,68,0.16), 0 3px 6px rgba(68,68,68,0.23)",
  },
  unstyleList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    flexDirection: "column",
  },
  horizontalList: {
    display: "flex",
    flexDirection: "row",
  },
  header: {
    background: "#071d49",
    textAlign: "center",
    color: "#99b7ff",
    padding: [12, 24],
    fontSize: 25,
    lineHeight: "25px",
    "& > div": {
      justifyContent: "space-between",
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
});

export default useStyles;
