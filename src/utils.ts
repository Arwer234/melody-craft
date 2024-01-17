function hexToRgba(hex: string, alpha?: number) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (result) {
      result = result.map(m => m + m) as RegExpExecArray;
    }
  }

  if (alpha !== undefined) {
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16,
        )}, ${alpha})`
      : null;
  }

  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : null;
}

export { hexToRgba };
