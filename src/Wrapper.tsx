import { FunctionComponent } from "react";
import useStyles from "./styles.jss";
import logo from "./AbbVieLogo_Corporate.png";

const Wrapper: FunctionComponent = ({ children }) => {
  const styles = useStyles();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <header className={styles.header}>
        <div className={styles.row}>
          <img
            src={logo}
            alt="AbbVie"
            style={{ filter: "grayscale(1) invert(1)" }}
          />
          <div>2020 ABC + CRC Raffle</div>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Wrapper;
