import { Dimensions } from "./types";

export default (file: File) => {
  return new Promise<Dimensions>((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const { width, height } = img;
        resolve({ width, height });
        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.src = objectUrl;
  });
};
