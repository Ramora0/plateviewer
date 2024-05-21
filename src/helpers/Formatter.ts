export default class Formatter {
  static formatTime(time: number): string {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    const secondsString = seconds.toString().padStart(2, "0");
    const minutesString = minutes.toString().padStart(2, "0");
    return hours > 0
      ? `${hours}h ${minutesString}:${secondsString}`
      : `${minutesString}:${secondsString}`;
  }
}
