import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  "@global": {
    "html, body": { background: "skyblue", color: "#061D49" },
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
  logo: {
    textAlign: "center",
  },
});

export default useStyles;
