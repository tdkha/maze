import storage from "./storage.mjs";

const Matrix = {
    moveUp: (curPos, matrix) => {
      console.log("move up");
    },
    moveDown: (curPos, matrix) => {
      console.log("move down");
    },
    moveLeft: (curPos, matrix) => {
      console.log("move left");
    },
    moveRight: (curPos, matrix) => {
      console.log("move right");
    },
    rotateLeft: (curPos, matrix) => {
      console.log("rotate left");
    },
    rotateRight: (curPos, matrix) => {
      console.log("rotate right");
    },
    create: (id) => {
      const options = document.getElementById("options");
      console.log(storage[0])
    },
  };
export default Matrix;
  