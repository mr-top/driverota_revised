import { TZDate } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";

import { Temporal } from "@js-temporal/polyfill";

function getTimeSlots() {
  const present = new Date();

  console.log(present);

  const newPresent = TZDate.tz('Asia/Tokyo');

  console.log(newPresent.toString());

  console.log(Intl.supportedValuesOf('timeZone'))
}

getTimeSlots();
export default getTimeSlots;