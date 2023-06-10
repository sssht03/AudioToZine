export function splitString(input: string, splitNum: number): string[] {
  const words = input.split(' ');

  const partitionSize = Math.ceil(words.length / splitNum);
  const result: string[] = [];

  let startIndex = 0;
  let endIndex = partitionSize;

  for (let i = 0; i < splitNum; i++) {
    if (endIndex > words.length) endIndex = words.length;
    const partition = words.slice(startIndex, endIndex).join(' ');
    result.push(partition);
    startIndex = endIndex;
    endIndex += partitionSize;
  }

  return result;
}