export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const decimalTime = hours + minutes / 60;
  return Math.round(decimalTime * 100) / 100; // Rounds to two decimal places
}
