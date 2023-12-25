const returnButton = document.querySelector(".go-back");
returnButton.addEventListener("click", (event)=>{
    event.preventDefault();
    window.location.href = "./index.html";
})

const url = window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).entries();
const array = Array.from(entries);
const cityName = array[0][1];
const statsFinnIndex = array[1][1];
console.log(cityName);
console.log(statsFinnIndex);

const displayCurrentButton = document.querySelector("#present-data");
const addEstimation = document.querySelector("#estimate-data");
displayCurrentButton.addEventListener("click",  (event)=>{
    event.preventDefault();
    let obj = {
      'cityName':cityName,
      'statsFinnCityCode':statsFinnIndex,
      'estimation': false
  };
  const searchParams = new URLSearchParams(obj);
  const queryString = searchParams.toString();
  window.location.href = "./partyChart.html?"+queryString;
    
})
addEstimation.addEventListener("click", (event)=>{
  event.preventDefault();
  let obj = {
    'cityName':cityName,
    'statsFinnCityCode':statsFinnIndex,
    'estimation': true
};
const searchParams = new URLSearchParams(obj);
const queryString = searchParams.toString();
window.location.href = "./partyChart.html?"+queryString;
  
})




    