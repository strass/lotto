import { isArray } from "lodash";
import { Fragment, FunctionComponent } from "react";
import { LottoState } from "./reducer";
import useStyles from "./styles.jss";

const Winners: FunctionComponent<{
  prizes: LottoState["prizes"];
  toggleViewWinners: () => void;
}> = ({ prizes, toggleViewWinners }) => {
  const styles = useStyles();
  return (
    <div>
      <h2 onClick={() => toggleViewWinners()}>Winners</h2>
      <ul className={styles.unstyleList}>
        {prizes.map((p, idx) => (
          <li key={idx} style={{ marginBottom: 24 }}>
            {p.label}:{" "}
            {p.winner && isArray(p.winner) ? (
              <Fragment>
                <br />
                <div style={{ columns: 3 }}>
                  {p.winner
                    .sort((a, b) => {
                      if (a.displayName < b.displayName) {
                        return -1;
                      }
                      if (a.displayName > b.displayName) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((w) => w.displayName)
                    .map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                </div>
              </Fragment>
            ) : (
              <Fragment>{p.winner?.displayName}</Fragment>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Winners;
