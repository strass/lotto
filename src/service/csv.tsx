import parse from "csv-parse/lib/sync";
import { map } from "lodash";
import lodashSample from "lodash/sample";
import {
  createContext,
  Dispatch,
  FunctionComponent,
  ReducerAction,
  ReducerState,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import rawCsv from "../data/2020-12-09-test.csv";
import reducer from "../reducer";

export type CsvFields = Record<
  | ""
  | "source"
  | "company"
  | "endDate"
  | "hireDate"
  | "displayName"
  | "updatedDate"
  | "upi"
  | "emailAddress"
  | "title"
  | "managerUpi"
  | "type"
  | "status"
  | "account.domain"
  | "account.username"
  | "account.status"
  | "costcenter.code"
  | "costcenter.name"
  | "firstName.preferred"
  | "firstName.given"
  | "lastName.preferred"
  | "lastName.given"
  | "address.buildingCode"
  | "address.city"
  | "address.state"
  | "address.country.code"
  | "address.country.name"
  | "address.location.code"
  | "address.location.name"
  | "address.postalCode"
  | "function.code"
  | "function.name"
  | "address.streetAddress"
  | "jobCode.code"
  | "jobCode.name"
  | "phoneNumber.main"
  | "middleName.preferred"
  | "middleName.given"
  | "phoneNumber.mobile"
  | "phoneNumber.alt-mobile"
  | "phoneNumber.alt-main"
  | "address.spaceId"
  | "phoneNumber.fax",
  string
>;

const CsvContext = createContext<
  | (ReducerState<typeof reducer> & {
      sample: (num: number) => CsvFields[];
      dispatch: Dispatch<ReducerAction<typeof reducer>>;
    })
  | null
>(null);

export const CsvContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    prizes: [
      { label: "50 x $50" },
      { label: "$100" },
      { label: "$150" },
      { label: "$200" },
      { label: "$250" },
    ],
    all: [],
    data: [],
    chunks: [],
    activeSegments: [],
    activePrize: 0,
    chunkIndex: false,
  });
  useEffect(() => {
    const parsed = parse(rawCsv, {
      columns: true,
      skip_empty_lines: true,
    });
    dispatch({ type: "init", chunkNum: 40, data: parsed });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      sample: (num: number) => {
        if (state.data.length > 0) {
          const sample: CsvFields[] = [];

          // TODO: could be an infinite loop?
          while (sample.length < num) {
            const pick = lodashSample(state.data);
            if (
              !pick ||
              sample.includes(pick) ||
              map(state.prizes, (p) => p.winner)
                .flat()
                .includes(pick)
            ) {
              continue;
            }
            sample.push(pick);
          }

          return sample;
        } else {
          throw new Error("CSV loading or empty");
        }
      },
    }),
    [state]
  );
  console.log(value);
  return (
    <CsvContext.Provider value={value}>
      {value ? children : "loading..."}
    </CsvContext.Provider>
  );
};

const useCsvData = () => {
  const context = useContext(CsvContext);
  if (!context) {
    throw new Error("CsvData Loading");
  }
  return context;
};

export default useCsvData;
