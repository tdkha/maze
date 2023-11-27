import Matrix from "./matrix.mjs";
import Overlay from "./overlay.mjs";

class Node {
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.next = null;
  }

  popFront() {
    if (this.value.length == 0) return null;
    const leftMost = [...this.value][0];
    this.value = this.value.slice(1);
    return leftMost;
  }
}

class Stack {
  constructor(functions) {
    this.functions = Object.assign({}, functions);
    this.top = new Node(1, this.functions["f0"]);
    this.bottom = null;
    this.length = 1;
    this.timeLimit = 6000;
    this.executed = 0;
  }

  peek() {
    return this.top;
  }

  push(value) {
    this.length++;
    const newNode = new Node(this.length, value);
    console.log("Added", newNode);
    if (this.length === 0) {
      this.top = newNode;
      this.bottom = newNode;
    } else {
      const holdingPointer = this.top;
      this.top = newNode;
      this.top.next = holdingPointer;
    }

    return this;
  }

  pop() {
    if (!this.top) {
      return null;
    }

    if (this.top === this.bottom) {
      this.bottom = null;
    }

    const unwantedNode = this.top;
    this.top = this.top.next;
    this.length--;
    console.log("Deleted: ", unwantedNode);
    return this;
  }

  executeMove(move, color) {
    console.log("Move: ", move, " Color: ", color);
    if (!color) {
      if (move.includes("up")) {
        Matrix.move();
      } else if (move.includes("left")) {
        Matrix.rotateLeft();
      } else if (move.includes("right")) {
        Matrix.rotateRight();
      }
    } else {
      if (move.includes("up")) {
        Matrix.move(color);
      } else if (move.includes("left")) {
        Matrix.rotateLeft(color);
      } else if (move.includes("right")) {
        Matrix.rotateRight(color);
      }
    }
  }

  executeFunction(call) {
    if (!call) return;

    if (call.startsWith("f")) {
      const possibleColorFunc = call.split("_")[1] || null;
      if (possibleColorFunc) {
        const ptrParent = document.getElementById("pointer").parentNode;
        const colorValidator = Matrix.validateFuncColor(ptrParent, possibleColorFunc);
        //console.log("Function color:" , possibleColorFunc, " , Color valid: ",colorValidator )
        if (!colorValidator) {
          return;
        }
      }

      const functionPrefixExtract = call.split("_")[0];
      const searchedFunction = this.functions[functionPrefixExtract];
      this.push(searchedFunction);
    } else {
      const possibleColor = call.split("_")[1] || undefined;
      if (possibleColor) {
        const ptrParent = document.getElementById("pointer").parentNode;
        const colorValidator = Matrix.validateFuncColor(ptrParent, possibleColor);
        //console.log("Move color:" , possibleColor, " , Color valid: ",colorValidator )
        if (!colorValidator) {
          return;
        }
        this.executeMove(call, possibleColor);
      } else {
        this.executeMove(call);
      }
    }
    return;
  }

  #execute() {
    const executedValue = this.top.popFront();
    //console.log("EXE:   ", executedValue);
    if (this.top.value.length === 0) {
      this.pop();
    }
    this.executeFunction(executedValue);
    //this.print();
  }

  async start() {
    console.log("----------START---------");
    const startTime = new Date().getTime();

    while (this.top !== null) {
      const reached = document
        .getElementById("pointer")
        .parentNode.classList.contains("goal");
      if (reached) {
        Overlay.winRound();
        return true
      }
      await new Promise((resolve) => setTimeout(resolve, 150)).then(
        this.#execute()
      );
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      this.executed++;

      if (elapsedTime >= this.timeLimit || this.executed >= 100) {
        throw new Error("Too many iterations");
      }
    }
   return false;
  }

  print() {
    console.log("Stack:");
    console.log("-------------------");
    let curNode = this.top;

    while (curNode) {
      const values = curNode.value.join();
      console.log("ID:        ", curNode.id);
      console.log("VALUES:    ", values);
      console.log("-------------------\n");

      if (!curNode.next) {
        break;
      } else {
        curNode = curNode.next;
      }
    }
  }
}

export default Stack;
