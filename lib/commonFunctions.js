import { Timestamp } from "firebase/firestore";
import moment from "moment";
import momentTz from "moment-timezone";

export const formatUnderScoreString = (string) => {
  if (!string) return null;

  return string?.split("_")?.join(" ");
};

export const convertTimeStamp = (time) => {
  if (!time?._seconds) {
    return null;
  }

  let dt = new Date(time._seconds * 1000);

  return moment(dt).format("DD-MM-YYYY hh:mm A");
};

export const convertToTimeStamp = (date) => {
  const temp = new Timestamp(date?._seconds, date?._nanoseconds).toDate();
  return momentTz(temp).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A");
};
