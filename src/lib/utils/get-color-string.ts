const tagColors = [
  "#5cdbd3",
  "orange",
  "lime",
  "#ff7875",
  "geekblue",
  "gold",
  "success",
  "#52c41a",
  "cyan",
  "#fa541c",
  "#ffc53d",
  "#40a9ff",
  "#108ee9",
  "purple",
  "#73d13d",
  "#87d068",
  "#2db7f5",
  "processing",
  "#faad14",
  "#13c2c2",
  "magenta",
  "blue",
  "warning",
  "default",
  "#ff85c0",
  "#b37feb",
  "#1890ff",
  "volcano",
  "green",
  "red",
  "error",
  "#f50",
  "#597ef7",
  "#eb2f96",
  "#722ed1",
];

export function getColorFromString(
  input: string | null | undefined,
  colors?: string[],
): string {
  const s = input ?? "";
  let hash = 111;

  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  const index = Math.abs(hash) % (colors?.length || tagColors.length);
  return colors?.[index] || tagColors[index];
}
