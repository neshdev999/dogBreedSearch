async function generateBreedsArray(responseJson){
  var outputArray = [];  
  for (let element in responseJson["message"]) {  
      outputArray.push({  
          id: element,  
          name: responseJson["message"][element]  
      });  
  }  
  return outputArray;
}