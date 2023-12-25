

const url = window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).entries();
const array = Array.from(entries);
const cityName = array[0][1];
const cityCode = array[1][1];
const data = array[2][1];


const returnButton = document.querySelector("#return");

returnButton.addEventListener("click", (event)=>{
    event.preventDefault();
    window.location.href = `./employMiddlePage.html?cityName=${cityName}&cityCode=${cityCode}`;
})
const displayLevel = async () =>{
    const retrievedObject = await getLevelData();
    console.log(retrievedObject);
    const values = retrievedObject.value;
    const label = Object.values(retrievedObject.dimension.Koulutusaste.category.label);
    console.log(label);
    console.log(values);
    let valueSet1 = [];
    let valueSet2 = [];
    for (let i = 0; i < 14; i++){
      valueSet1.push(values[0+(i*2)])
    }
    for (let i = 0; i < 14; i++){
      valueSet2.push(values[1+(i*2)])
    }
    

    const chart = new frappe.Chart("#chart-1", {
      title: `Comparison between education type and student employment in ${cityName} in 2021`,
      data: {
          labels: label,
          datasets: [
              {
                  name: "Employed students",
                  values: valueSet1,
                  
              }
            ]
      },
      type: "bar",
      height: 450,
    });
    const chartPercentage = new frappe.Chart("#chart-2", {
      title: `Percentage of student employment in ${cityName} in 2021`,
      data: {
          labels: label,
          datasets: [
             
              {
                name: "Employed Students ratio (%)",
                values: valueSet2,
              }
            ]
      },
      type: "line",
      height: 400,
    }); 
    const downloadButton = document.querySelector(".download");
    downloadButton.addEventListener("click", ()=>{
      chart.export();  
      chartPercentage.export();
})
}
const displayType = async () =>{
    const retrievedObject = await getTypeData();
    console.log(retrievedObject);
    const values = retrievedObject.value;
    const chart = new frappe.Chart("#chart-1", {
        title: `Comparison between education type and student employment in ${cityName} in 2021`,
        data: {
            labels: ["Education not leading to a degree or degree completed abroad", "Education leading to a degree", "Total"],
            datasets: [
                {
                    name: "Students number",
                    values: [values[6], values[3], values[0]],
                    
                  },
                {
                    name: "Employed students",
                    values: [values[7], values[4], values[1]],
                  }
              ]
        },
        type: "bar",
        height: 450,
      });

      const chartPercentage = new frappe.Chart("#chart-2", {
        title: `Percentage of student employment in ${cityName} in 2021`,
        data: {
            labels: ["Education not leading to a degree", "Education leading to a degree", "Total"],
            datasets: [
               
                {
                  name: "Employed Students ratio (%)",
                  values: [values[8], values[5], values[2]],
                }
              ]
        },
        type: "line",
        height: 400,
      });
      const downloadButton = document.querySelector(".download");
      downloadButton.addEventListener("click", ()=>{
        chart.export();  
        chartPercentage.export();
  })
}

const getTypeData = async ()=> {
    const jsonQuery = {
        "query": [
          {
            "code": "Koulutuksen tyyppi",
            "selection": {
              "filter": "item",
              "values": [
                "SSS",
                "1",
                "2"
              ]
            }
          },
          {
            "code": "Alue",
            "selection": {
              "filter": "item",
              "values": [
                `${cityCode}`
              ]
            }
          },
          {
            "code": "Vuosi",
            "selection": {
              "filter": "item",
              "values": [
                "2021"
              ]
            }
          }
        ],
        "response": {
          "format": "json-stat2"
        }
      };
      const fetchedData = await fetch("https://statfin.stat.fi:443/PxWeb/api/v1/en/StatFin/tyokay/statfin_tyokay_pxt_13g3.px", {
        method: "POST",
        headers : {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })
    if (!fetchedData.ok) return;
    const retrievedData = await fetchedData.json();
    return retrievedData
}

const getLevelData = async ()=> {
    const jsonQuery = {
      "query": [
        {
          "code": "Koulutusaste",
          "selection": {
            "filter": "item",
            "values": [
              /* "SSS", */
              "21",
              "22",
              "31",
              "32",
              "33",
              "41",
              "62",
              "63",
              "71",
              "72",
              "73",
              "81",
              "82",
              "X"
            ]
          }
        },
        {
          "code": "Alue",
          "selection": {
            "filter": "item",
            "values": [
              `${cityCode}`
            ]
          }
        },
        {
          "code": "Vuosi",
          "selection": {
            "filter": "item",
            "values": [
              "2021"
            ]
          }
        },
        {
          "code": "Tiedot",
          "selection": {
            "filter": "item",
            "values": [
              "tyos",
              "tyos_pros"
            ]
          }
        }
      ],
      "response": {
        "format": "json-stat2"
      }
    };
      const fetchedData = await fetch("https://statfin.stat.fi:443/PxWeb/api/v1/en/StatFin/tyokay/statfin_tyokay_pxt_13g3.px", {
        method: "POST",
        headers : {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })
    if (!fetchedData.ok) return;
    const retrievedData = await fetchedData.json();
    return retrievedData
}

if (data == "level") {
    displayLevel();
}
else{
    displayType();
    
}

