import times from "lodash/times";
import faker from "faker";

const fakeData = (num: number = 20) => {
  return times(num, () => faker.name.findName());
};

export default fakeData(1000);
