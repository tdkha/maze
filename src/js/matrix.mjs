import storage from "./storage.mjs";

const Matrix = {
  getMatrixSize: (level) => {
    if (!level) throw new Error("No level found");
    const matrix_size = storage[level].matrix_size;
    return matrix_size;
  },
  getPointerPosition: (pointer) => {
    if (!pointer) throw new Error("No pointer");
    const parent = pointer.parentNode;
    const row = parseInt(parent.dataset.row);
    const col = parseInt(parent.dataset.col);
    return [row, col];
  },
  isCellEmpty: (row, col) => {
    const level = localStorage.getItem("level");
    const matrix = storage[level].matrix; // Assuming your matrix is stored in storage[0].matrix

    if (matrix[0].constructor === Array) {
      // Two-dimensional matrix
      const matrixRow = matrix.length;
      const matrixCol = matrix[0].length;

      if (row < 0 || row >= matrixRow || col < 0 || col >= matrixCol) {
        return false; // Cell is considered non-empty if it's out of bounds
      }
      const cellValue = matrix[row][col];
      return cellValue === "empty";
    } else {
      // One-dimensional matrix
      const matrixCol = matrix.length;
      const index = row * matrixCol + col;
      const cellValue = matrix[index];
      return cellValue === "empty";
    }
  },
  getFuncCellColor: (cell) => {
    const allowedColor = Matrix.getAllowedColors();
    let nextColor = "none";
    let updateNextColor = false; // flag
    cell.classList.forEach((className) => {
      if (allowedColor.indexOf(className) != -1 && updateNextColor == false) {
        nextColor = className;
        updateNextColor = true;
      }
    });
    return nextColor;
  },
  validateFuncColor: (parentDOM, color = null) => {
    let curColor = color ? color : "none";
    if (curColor == "none") {
      return true;
    } else {
      // NEXT
      let nextColor = Matrix.getFuncCellColor(parentDOM);
      // COMPARE
      const allowed = curColor == nextColor ? true : false;
      return allowed;
    }
  },
  move: (color = null) => {
    try {
      console.log("move forward");
      const level = localStorage.getItem("level");
      // POINTER
      const pointer = document.getElementById("pointer");
      const newPointer = pointer; //copy
      const classNames = pointer.className.split(" ");
      // DIRECTION
      const allowedDirection = ["up", "down", "left", "right"];
      const ptrDirection = classNames.filter((className) =>
        className.includes("direction-")
      )[0];
      const direction = ptrDirection.split("-")[1];
      if (!ptrDirection || allowedDirection.indexOf(direction) == -1)
        throw new Error("We ran into an error.");
      // MATRIX POSITION
      const ptrPos = Matrix.getPointerPosition(pointer);
      // MATRIX SIZE
      const matrixSize = Matrix.getMatrixSize(level);
      if (!matrixSize || !pointer || !ptrDirection || !ptrPos)
        throw new Error("Error occured");
      // NEXT MOVES
      let nextMovePositionX;
      let nextMovePositionY;
      let canMove = false;

      const matrixRow = matrixSize[0]; // Number of rows in a matrix
      const matrixCol = matrixSize[1]; // Number of columns in a matrix

      switch (direction) {
        case "up":
          nextMovePositionX = ptrPos[0] - 1;
          nextMovePositionY = ptrPos[1];
          canMove =
            nextMovePositionX < 0 || nextMovePositionX > matrixRow - 1
              ? false
              : true;
          break;
        case "down":
          nextMovePositionX = ptrPos[0] + 1;
          nextMovePositionY = ptrPos[1];
          canMove =
            nextMovePositionX < 0 || nextMovePositionX > matrixRow - 1
              ? false
              : true;
          break;
        case "left":
          nextMovePositionX = ptrPos[0];
          nextMovePositionY = ptrPos[1] - 1;
          canMove = nextMovePositionY < 0 ? false : true;
          break;
        case "right":
          nextMovePositionX = ptrPos[0];
          nextMovePositionY = ptrPos[1] + 1;
          canMove = nextMovePositionY > matrixCol - 1 ? false : true;
          break;
      }
      canMove = Matrix.isCellEmpty(nextMovePositionX, nextMovePositionY)
        ? false
        : true;
      if (!canMove) throw new Error("Invalid move");
      // POINTER PARENT
      const parent = pointer.parentNode;
      const newParent = document.getElementById(
        `cell-${nextMovePositionX}-${nextMovePositionY}`
      );
      // CHECKING FOR NEXT MOVE COLOR
      const colorAllowed = Matrix.validateFuncColor(parent, color);
      if (!colorAllowed) throw new Error("Invalid move (Color)");
      parent.replaceChildren(); // remove pointer
      newParent.appendChild(newPointer);
    } catch (err) {
      throw new Error("Invalid move");
    }
  },
  rotateLeft: (color = null) => {
    console.log("rotate left");
    const pointer = document.getElementById("pointer");
    const parent = pointer.parentNode;
    const classNames = pointer.className.split(" ");
    // COLOR
    const colorAllowed = Matrix.validateFuncColor(parent, color);
    if (!colorAllowed) throw new Error("Invalid move (Color)");
    // DIRECTION
    const directionClass = classNames.find((className) =>
      className.includes("direction-")
    );
    if (directionClass) {
      let newDirection;
      switch (directionClass) {
        case "direction-up":
          newDirection = "direction-left";
          break;
        case "direction-left":
          newDirection = "direction-down";
          break;
        case "direction-down":
          newDirection = "direction-right";
          break;
        case "direction-right":
          newDirection = "direction-up";
          break;
        default:
          console.error("Invalid direction class.");
          break;
      }
      pointer.classList.remove(directionClass);
      pointer.classList.add(newDirection);
      console.log(`Rotated from ${directionClass} to ${newDirection}`);
    }

    // ROTATION
    const rotationString = pointer.style.transform;
    const degreeRegex = /rotate\((\d+)deg\)/;
    const match = rotationString.match(degreeRegex);
    if (match && match[1]) {
      const degreeValue = parseInt(match[1], 10);
      let newDegreeValue = degreeValue - 90;
      if (newDegreeValue < 0) {
        newDegreeValue = 270;
      }
      pointer.style.transform = `rotate(${newDegreeValue}deg)`;
      pointer.style.mozTransform = `rotate(${newDegreeValue}deg)`;
    }
  },
  rotateRight: (color = null) => {
    console.log("rotate right");
    const pointer = document.getElementById("pointer");
    const parent = pointer.parentNode;
    const classNames = pointer.className.split(" ");
    // COLOR
    const colorAllowed = Matrix.validateFuncColor(parent, color);
    if (!colorAllowed) throw new Error("Invalid move (Color)");
    // DIRECTION
    const directionClass = classNames.find((className) =>
      className.includes("direction-")
    );
    if (directionClass) {
      let newDirection;
      switch (directionClass) {
        case "direction-up":
          newDirection = "direction-right";
          break;
        case "direction-right":
          newDirection = "direction-down";
          break;
        case "direction-down":
          newDirection = "direction-left";
          break;
        case "direction-left":
          newDirection = "direction-up";
          break;
        default:
          console.error("Invalid direction class.");
          break;
      }
      pointer.classList.remove(directionClass);
      pointer.classList.add(newDirection);
      console.log(`Rotated from ${directionClass} to ${newDirection}`);
    }

    // ROTATION
    const rotationString = pointer.style.transform;
    const degreeRegex = /rotate\((\d+)deg\)/;
    const match = rotationString.match(degreeRegex);

    if (match && match[1]) {
      const degreeValue = parseInt(match[1], 10);
      let newDegreeValue = degreeValue + 90;
      if (newDegreeValue == 360) {
        newDegreeValue = 0;
      }
      pointer.style.transform = `rotate(${newDegreeValue}deg)`;
      pointer.style.mozTransform = `rotate(${newDegreeValue}deg)`;
    }
  },
  create: () => {
    try {
      const mazeContainer = document.getElementById("maze");
      const level = localStorage.getItem("level");
      //-------------------------
      // QUERY MATRIX
      //-------------------------
      const { matrix, commands, functions, start_direction } = storage[level];
      //-------------------------
      // DOM ELEMENTS
      //-------------------------
      const pointer = document.createElement("div");
      pointer.id = "pointer";

      matrix.forEach((row, rowIndex) => {
        const rowElement = document.createElement("div");
        rowElement.classList.add("mazeRow");

        row.forEach((cell, colIndex) => {
          const cellElement = document.createElement("div");
          cellElement.id = `cell-${rowIndex}-${colIndex}`;
          cellElement.classList.add("mazeCell");
          cellElement.classList.add(cell); // Add class based on cell type
          if (
            cell.split("_").includes("start") ||
            cell.split("_").includes("end")
          ) {
            cellElement.classList.add(cell.split("_")[1]); // Add color class name
          }
          cellElement.dataset.row = rowIndex; // Add data attributes for row and column
          cellElement.dataset.col = colIndex;

          //------------------------------------
          // RENDER POINTER
          //------------------------------------
          if (cell.split("_")[0] == "start") {
            const direction = start_direction;
            switch (direction) {
              case "up":
                pointer.classList.add("direction-up");
                break;
              case "down":
                pointer.classList.add("direction-down");
                pointer.style.transform = `rotate(${180}deg)`;
                break;
              case "left":
                pointer.classList.add("direction-left");
                pointer.style.transform = `rotate(${270}deg)`;
                break;
              case "right":
                pointer.classList.add("direction-right");
                pointer.style.transform = `rotate(${90}deg)`;
                break;
            }
            cellElement.appendChild(pointer);
          }
          //------------------------------------
          // RENDER GOAL
          //------------------------------------
          if (cell.split("_")[0] == "end") {
            cellElement.classList.add("goal");
          }
          //------------------------------------
          // ADD ALL CELL TO A ROW
          //------------------------------------
          rowElement.appendChild(cellElement);
        });
        //------------------------------------
        // ADD ALL ROW TO A MATRIX
        //------------------------------------
        mazeContainer.appendChild(rowElement);
      });
      //------------------------------------
      // RENDER COMMAND CONTAINER
      //------------------------------------
      const commandDiv = document.getElementById("command-container");
      const h2Command = document.createElement("h2");
      h2Command.textContent = "Commands";
      commandDiv.appendChild(h2Command);
      for (let section in commands) {
        const tempDiv = document.createElement("div");
        tempDiv.id = `${section}-container`;
        tempDiv.classList.add("commands");
        const sectionContainer = commands[section];
        if (!sectionContainer.length) continue;

        if (section == "colors") {
          sectionContainer.forEach((text) => {
            const element = document.createElement("div");
            element.draggable = true;
            element.id = `${text}-command`;
            element.classList.add("command");
            element.classList.add("color-command");
            element.classList.add(text);
            tempDiv.appendChild(element);
          });
          commandDiv.appendChild(tempDiv);
        } else {
          sectionContainer.forEach((text) => {
            const element = document.createElement("div");
            element.draggable = true;
            element.innerHTML = text;
            if (text == "left") {
              element.innerHTML = "↶";
            }
            if (text == "right") {
              element.innerHTML = "↷";
            }
            if (text == "up") {
              element.innerHTML = "↑";
            }

            element.id = `${text}-command`;
            element.classList.add("command");
            tempDiv.appendChild(element);
          });
          commandDiv.appendChild(tempDiv);
        }
      }
      //------------------------------------
      // RENDER FUNCTION CONTAINER
      //------------------------------------
      const functionDiv = document.getElementById("function-container");
      let count = 0;
      const h2Function = document.createElement("h2");
      h2Function.textContent = "Functions";
      functionDiv.appendChild(h2Function);
      for (let slots of functions) {
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("functions");
        tempDiv.id = `function-slot-${count}`;
        for (let i = 0; i <= slots; i++) {
          const element = document.createElement("div");
          element.id = `function-slot-${count}-${i}`;
          if (i == 0) {
            const subElement = document.createElement("div");
            subElement.classList.add("disabled-function-slot");
            subElement.id = "f" + count + "-command-function";
            subElement.innerHTML = "f" + count;
            subElement.disabled = true;
            element.appendChild(subElement);
            count++;
          } else {
            element.classList.add("function-slot");
          }
          tempDiv.appendChild(element);
        }
        functionDiv.appendChild(tempDiv);
      }
    } catch (err) {
      console.log(err);
    }
  },
  getAllowedColors: () => {
    const level = localStorage.getItem("level");
    return storage[level].commands.colors;
  },
  finish : () => {
    const maxLevel = storage.length - 1 ;
    const curLevel = parseInt(localStorage.getItem("level"));
    const finished = curLevel > maxLevel ? true : false;

    console.log("Game end:",finished)
    if(!finished) return true;
    return false;
  }
};
export default Matrix;
