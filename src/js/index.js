import Matrix from "./matrix.mjs";
//-------------------------------------------------------
// GLOBAL VERIABLES
//-------------------------------------------------------
var activeBlock = null;
var selectedBlock = null;
//-------------------------------------------------------
// ROUND RESET
//-------------------------------------------------------
const reset = () => {
  const maze = document.getElementById("maze");
  maze.replaceChildren();
  const commandDiv = document.getElementById("command-container");
  commandDiv.replaceChildren();
  const functionDiv = document.getElementById("function-container");
  functionDiv.replaceChildren();
  const msg = document.getElementById("msg");
  msg.classList.remove("err-msg");
  msg.innerHTML = "";
  fetchData();
};
//-------------------------------------------------------
// GAME RESET
//-------------------------------------------------------
const startOver = () => {
  localStorage.setItem("level", 0);
  location.reload();
};

//-------------------------------------------------------
// ROUND LOST
//-------------------------------------------------------
const loseRound = async () => {
  const msg = document.getElementById("msg");
  msg.classList.add("err-msg");
  msg.innerHTML = "Failed to reach the goal. Please try again.";
  setTimeout(() => {
    reset();
  }, 2000);
};
//-------------------------------------------------------
// ROUND WON
//-------------------------------------------------------
const winRound = () => {
  const gameEnd = Matrix.finish();
  const level = parseInt(localStorage.getItem("level"));
  const newLevel = level + 1;
  
  //--------------------------------------------------------
  // DOM element creation
  //--------------------------------------------------------
  const overlayContainer = document.getElementById("overlay");
  const overLayHeader = document.createElement("h2");
  const overlayText = document.createElement("p");
  const btns = document.createElement("div");
  const nextBtn = document.createElement("button");
  //--------------------------------------------------------
  // Class and attributes
  //--------------------------------------------------------
  btns.classList.add("buttons");

  if (gameEnd == true) {
    overlayContainer.classList.add("end-msg");
    overLayHeader.innerText = `The end`;
    overlayText.textContent = `Completed highest level: ${level}`;
    nextBtn.classList.add("end-button");
    nextBtn.innerHTML = "Play again";
  } else {
    overlayContainer.classList.add("success-msg");
    overLayHeader.innerText = `Level ${localStorage.getItem("level")}`;
    overlayText.textContent = "PASSED";

    nextBtn.classList.add("success-button");
    nextBtn.innerHTML = "Next";
  }
  btns.appendChild(nextBtn);
  overlayContainer.appendChild(overLayHeader);
  overlayContainer.appendChild(overlayText);
  overlayContainer.appendChild(btns);

  const nextRound = (e) => {
    e.preventDefault();
    overlayContainer.replaceChildren();
    overlayContainer.classList.remove("success-msg");
    location.reload();
  };

  if (gameEnd == true) {
    nextBtn.addEventListener("click", startOver);
  } else {
    localStorage.setItem("level", newLevel);
    nextBtn.addEventListener("click", nextRound);
  }
};
//-------------------------------------------------------
// CLEAR FUNCTION SLOT
//-------------------------------------------------------
const clearFunctionSlot = () => {
  const functionSlots = document.querySelectorAll(".function-slot");
  functionSlots.forEach((slot) => {
    slot.children.length > 0 && slot.replaceChildren();
  });
};
//-------------------------------------------------------
// Submit
//-------------------------------------------------------
const submit = () => {
  executeFuntions();
};
//-------------------------------------------------------
// DELETE FUNCTION SLOT
//-------------------------------------------------------
const deleteFunctionSlot = () => {
  if (selectedBlock) {
    if (!selectedBlock.classList.contains("function-slot")) {
      selectedBlock.remove();
    }
  }
};

//-------------------------------------------------------
// CREATE MATRIX
//-------------------------------------------------------
const createMatrix = () => {
  const ALLOWED_COLOR = Matrix.getAllowedColors();
  Matrix.create();
  //-------------------------------------------------------
  // DRAG AND DROP FUNCTIONS
  //-------------------------------------------------------
  function dragStart(event) {
    activeBlock = event.target;
  }

  function dragEnd(event) {
    event.preventDefault();
    activeBlock = null;
  }

  async function drop(event) {
    event.preventDefault();
    const slot = event.target;
    const isNotFunctionColor = slot.id.split("-")[0].startsWith("f") && !activeBlock.classList.contains("color-command");

    try {
      if (
        slot.classList.contains("function-slot") ||
        slot.classList.contains("function-slot-value")
      ) {
        if (activeBlock  ) {
          const clonedElement = activeBlock.cloneNode(true);
          if (slot.classList.contains("color-command")) {
            //---------------------------------------
            // BOTH ARE COLOR
            //---------------------------------------
            if (clonedElement.classList.contains("color-command")) {
              // change color
              slot.replaceWith(clonedElement);
            } else {
              //---------------------------------------
              // FIRST: COLOR
              // SECOND: STH ELSE
              //---------------------------------------
              const clonedElementPrefix = clonedElement.id.split("-")[0]; //directional
              slot.id = clonedElementPrefix + "-" + slot.id;
              slot.innerHTML = clonedElement.innerHTML;
            }
          } else {
            if (slot.classList.contains("function-slot-value")) {
              //---------------------------------------
              // FIRST: STH ELSE
              // SECOND: COLOR
              //---------------------------------------
              if (clonedElement.classList.contains("color-command")) {
                const clonedElementPrefix = clonedElement.id.split("-")[0]; //color
                if (!ALLOWED_COLOR.includes(clonedElementPrefix))
                  throw new Error("Invalid color");
                const curID = slot.id.split("-");
                const newID = [
                  ...curID.slice(0, 1),
                  clonedElementPrefix,
                  ...curID.slice(1),
                ];
                slot.id = newID.join("-");
                slot.classList.add(clonedElementPrefix);
              } else {
                //---------------------------------------
                // FIRST: STH ELSE
                // SECOND: STH ELSE
                //---------------------------------------
                slot.replaceWith(clonedElement);
              }
              //---------------------------------------
              // EMPTY
              //---------------------------------------
            } else {
              slot.appendChild(clonedElement);
            }
          }
          //clonedElement.classList = clonedElement.classList.value.replace(/\b\w*-?command\w*\b/g, '');
          clonedElement.classList.add("function-slot-value");
          clonedElement.id += "-function";
        }
      }
      activeBlock = null;
    } catch (err) {
      if (err.msg == "Invalid color") {
        setTimeout(() => {
          const msg = document.getElementById("msg");
          msg.classList.add("err-msg");
          msg.innerText = err.msg;
        }, 2000);
        location.reload();
      }
    }
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function functionSlotSelected(event) {
    event.preventDefault();
    if (selectedBlock) {
      selectedBlock.classList.remove("selected");
    }
    selectedBlock = event.target;
    selectedBlock.classList.add("selected");
    console.log(selectedBlock);
  }
  //-------------------------------------------------------
  // EVENT LISTENERS
  //-------------------------------------------------------
  const commandBlocks = document.querySelectorAll(".command");
  commandBlocks.forEach((command) => {
    command.addEventListener("dragstart", dragStart);
    command.addEventListener("dragend", dragEnd);
  });

  const functionSlots = document.querySelectorAll(".function-slot");
  functionSlots.forEach((slot) => {
    slot.addEventListener("dragover", allowDrop);
    slot.addEventListener("drop", drop);
    slot.addEventListener("click", functionSlotSelected);
  });
  const functionSlotValue = document.querySelectorAll(".function-slot-value");
  functionSlotValue.forEach((slot) => {
    slot.addEventListener("click", functionSlotSelected);
  });
};
//-------------------------------------------------------
// INITIAL DATA FETCH
//-------------------------------------------------------
const fetchData = () => {
  const level = localStorage.getItem("level") || null;
  if (!level){
    localStorage.setItem("level", 0);
  }else{
    document.getElementById("level").innerText = `Level ${localStorage.getItem(
      "level"
    )}`;
  }

  createMatrix();

  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", reset);
  const startOverBtn = document.getElementById("start-over-btn");
  startOverBtn.addEventListener("click", startOver);
  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", deleteFunctionSlot);
  const clearBtn = document.getElementById("clear-btn");
  clearBtn.addEventListener("click", clearFunctionSlot);
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", submit);
};

fetchData(); // first fetch
//-------------------------------------------------------
// GLOBAL VERIABLES
//-------------------------------------------------------
const ALLOWED_COLOR = Matrix.getAllowedColors();

//-------------------------------------------------------
// GET ALL SELECTIONS
//-------------------------------------------------------
const getSelection = () => {
  const result = [];
  const selection = document.querySelectorAll(".functions");
  selection.forEach((element) => {
    const children = element.childNodes;

    const firstWords = Array.from(children).map((child) => {
      const valueBlock = child.childNodes[0];

      if (valueBlock != undefined) {
        const possibleColorPrefix = valueBlock.id.split("-")[1];
        const subResult =
          ALLOWED_COLOR.indexOf(possibleColorPrefix) == -1
            ? valueBlock.id.split("-")[0]
            : valueBlock.id.split("-")[0] + "_" + possibleColorPrefix;
        return subResult;
      }
    });
    result.push(firstWords);
  });
  return result;
};



//-------------------------------------------------------
// EXECUTE
//-------------------------------------------------------

const executeFuntions = async () => {
  try {
    const selection = getSelection();
    // EXECUTION
    const functions = {};
    selection.forEach((f) => {
      const newFunc = f.slice(1);
      const funcName = f[0];
      functions[funcName] = newFunc;
    });

    console.log(functions);

    const executeMove = async (move) => {
      if (move.includes("up")) {
        Matrix.move();
      } else if (move.includes("left")) {
        Matrix.rotateLeft();
      } else if (move.includes("right")) {
        Matrix.rotateRight();
      }
    };
    const executeMoveWithColor = async (move, color) => {
      if (move.includes("up")) {
        Matrix.move(color);
      } else if (move.includes("left")) {
        Matrix.rotateLeft(color);
      } else if (move.includes("right")) {
        Matrix.rotateRight(color);
      }
    };
    const executeFunction = async (funcName , color = null) => {
      if (funcName in functions) {
        const calls = functions[funcName];
        for (let i = 0; i < calls.length; i++) {
          const call = calls[i];

          if (!call) continue; // skip undefined
          if (call.startsWith("f")) {
            const possibleColorFunc = call.split("_")[1] || null;
            if (possibleColorFunc) {
                const ptrParent = document.getElementById("pointer").parentNode;
                const colorValidator = Matrix.validateFuncColor(ptrParent,color)
                if(!colorValidator) throw new Error("Invalid move (Color)");
                const functionPrefixExtract = call.split("_")[0];
                await executeFunction(functionPrefixExtract, possibleColorFunc);
              } else {
                await executeFunction(call);
              }
            
          } else {
            //--------------------------------------------------
            // Color and non-color parameterized call
            //--------------------------------------------------
            const possibleColor = call.split("_")[1] || undefined;
            if (possibleColor) {
              await executeMoveWithColor(call, possibleColor);
            } else {
              await executeMove(call);
            }

            const reached = document
              .getElementById("pointer")
              .parentNode.classList.contains("goal");
            if (reached) {
              winRound();
              break;
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    };
    await executeFunction("f0"); // run the main function
    loseRound();
  } catch (err) {
    console.log(err);
    if (
      err.message == "Error occured" ||
      err.message == "Invalid move" ||
      err.message == "Invalid move (Color)"
    ) {
      const msg = document.getElementById("msg");
      msg.classList.add("err-msg");
      msg.innerHTML = err.message;
      setTimeout(() => {
        reset();
      }, 2000);
    }
  }
};