/**
 * 获取日期（YYYY-MM-DD HH:mm:ss）
 * @param date 日期时间戳
 */
export function getDate(time: number) {
  const date = new Date(time);
  // 年
  const year = date.getFullYear();
  // 月
  let month: number | string = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : `${month}`;
  // 日
  let day: number | string = date.getDate();
  day = day < 10 ? `0${day}` : `${day}`;
  // 小时
  let hour: number | string = date.getHours();
  hour = hour < 10 ? `0${hour}` : `${hour}`;
  // 分钟
  let minute: number | string = date.getMinutes();
  minute = minute < 10 ? `0${minute}` : `${minute}`;
  // 秒
  let second: number | string = date.getSeconds();
  second = second ? `0${second}` : `${second}`;
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}