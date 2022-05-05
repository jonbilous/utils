import { Dimensions } from "./types";

export default ({ width, height }: Dimensions) => {
  if (width > height) {
    return "horizontal";
  }

  if (height > width) {
    return "vertical";
  }

  return "square";
};
