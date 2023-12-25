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
const cityCode = array[1][1];


const displayType = document.querySelector("#type-data");
const displayLevel = document.querySelector("#level-data");
displayType.addEventListener("click",  (event)=>{
    event.preventDefault();
    let obj = {
      'cityName':cityName,
      'cityCode':cityCode,
      'data': 'type'
  };
  const searchParams = new URLSearchParams(obj);
  const queryString = searchParams.toString();
  window.location.href = "./employChart.html?"+queryString;
    
})
displayLevel.addEventListener("click", (event)=>{
  event.preventDefault();
  let obj = {
    'cityName':cityName,
    'cityCode':cityCode,
    'data': 'level'
};
const searchParams = new URLSearchParams(obj);
const queryString = searchParams.toString();
window.location.href = "./employChart.html?"+queryString;
  
})