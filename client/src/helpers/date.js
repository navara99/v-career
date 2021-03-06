import moment from "moment-timezone";

export const formatDate = (timestamp) => {
  const date = new Date(timestamp).toDateString();
  const formatedDate = date.slice(0, -5);
  const year = date.slice(-5);
  return formatedDate + ", " + year;
};

export const formatStartEndTime = (start, end) => {
  const timezone = moment.tz.guess();
  const startTime = moment.tz(start, timezone).format("hh:mm a");
  const endTime = moment.tz(end, timezone).format("hh:mm a");
  const timezoneStr = moment.tz(start, timezone).format("ha z").slice(-4);

  return startTime + " - " + endTime + timezoneStr;
};

export const combineDateTimes = (date, startTime, endTime) => {
  const UTCDate = new Date(date).toUTCString().split(" ").slice(0, 4).join(" ");
  const UTCStart = new Date(startTime)
    .toUTCString()
    .split(" ")
    .slice(4)
    .join(" ");
  const UTCEnd = new Date(endTime).toUTCString().split(" ").slice(4).join(" ");

  return [`${UTCDate} ${UTCStart}`, `${UTCDate} ${UTCEnd}`];
};
