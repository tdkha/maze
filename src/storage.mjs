const storage = [
    {
      "id": "1",
      "commands":{
        colors : ["yellow" , "pink" , "green"],
        functionNumber : ["f0"],
        directions : ["left","up","right"]
      },
      "functions": [2],
      "start_direction": "right",
      "matrix_size": [1,7],
      "matrix": [
        [ "start_green" , "yellow" , "pink" , "green", "yellow", "pink", "end_green"]
      ]
    },
    {
      "id": "2",
      "commands":{
        colors : ["blue"],
        functionNumber : ["f0"],
        directions : ["left","up","right"]
      },
      "functions": [5],
      "start_direction": "right",
      "matrix_size": [5,6],
      "matrix": [
        [ "empty" , "empty" , "empty" , "empty" , "blue" ,"end_blue" ],
        [ "empty" , "empty" , "empty" , "blue" , "blue" ,"empty" ],
        [ "empty" , "empty" , "blue" , "blue" , "empty" , "empty" ],
        [ "empty" , "blue" , "blue" , "empty" , "empty" , "empty" ],
        [ "start_blue" , "blue" ,  "empty" , "empty" , "empty" , "empty"]
      ]
    },
     {
      "id": "3",
      "commands":{
        colors : ["green" , "pink" , "blue"],
        functionNumber : ["f0","f1"],
        directions : ["left","up","right"]
      },
      "functions": [3,3],
      "start_direction": "left",
      "matrix_size": [5,6],
      "matrix": [
        [ "end_pink" , "empty" , "empty" , "empty" , "empty" , "empty" , "empty" , "empty", "empty", "empty", "empty"],
        [ "blue" , "pink" ,  "pink" , "pink" , "blue" , "blue"  , "blue" , "blue", "blue", "blue", "start_blue"]
      ]
    }
    
  ]
  export default storage;