import Matrix from "./matrix.mjs";
const Overlay = {
  //-------------------------------------------------------
  // INITIAL INSTRUCTION
  //-------------------------------------------------------
  instruction : ()=>{

  },
  //-------------------------------------------------------
  // ROUND WON
  //-------------------------------------------------------
  winRound : () => {
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
  
      nextBtn.id = "next-button";
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

      const startOver = () => {
        localStorage.setItem("level", 0);
        location.reload();
      };
      
      nextBtn.addEventListener("click", startOver);
    } else {
      localStorage.setItem("level", newLevel);
      nextBtn.addEventListener("click", nextRound);
    }
  },
 
}

export default Overlay;