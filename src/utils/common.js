//时间戳转为yyyy-MM-dd HH:mm:ss形式
export function timestampToDate(timestamp) {
  if (timestamp) {
    var date = new Date(parseInt(timestamp) + 8 * 3600 * 1000);
    return date
      .toJSON()
      .substr(0, 19)
      .replace("T", " ");
  }
}

//yyyy-MM-dd HH:mm:ss转为时间戳
export function dateToTimestamp(date) {
  var timestamp = new Date(date).getTime();
  return timestamp;
}
