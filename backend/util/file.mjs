import { unlink } from "node:fs";

export const deleteFile = (filePath) => {
  unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
