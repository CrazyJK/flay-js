import getColors from 'get-image-colors';

export default async function getColorList(filepath) {
  const colors = await getColors(filepath);
  return colors.map((color) => color.hex());
}
