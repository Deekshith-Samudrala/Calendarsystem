try{
    require("mongoose").connect("mongodb://0.0.0.0:27017/p2etaskdatabase");
}
catch(error){
    console.log("error db",error); 
}