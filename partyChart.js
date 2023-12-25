

const url = window.location.href;
const searchParams = new URL(url).searchParams;
const entries = new URLSearchParams(searchParams).entries();
const array = Array.from(entries);
const cityName = array[0][1];
const statsFinnIndex = array[1][1];
const estimation = array[2][1];
console.log(cityName);
console.log(statsFinnIndex);
console.log(estimation);

const returnButton = document.querySelector("#return");

returnButton.addEventListener("click", (event)=>{
    event.preventDefault();
    window.location.href = `./partiesMiddlePage.html?cityName=${cityName}&statsFinnIndex=${statsFinnIndex}`;
})
const display_current = async () =>{
    const retrievedObject = await getData();
    console.log(retrievedObject);
    const values = retrievedObject.value;
    const parties = ["KOK", "PS", "SDP", "KESK", "VIHR", "VAS", "RKP", "KD"];
    parties.forEach((party, index) => {
      let partySupport = []
      for(let i = 0; i < 11; i++) {
          partySupport.push(values[i * 8 + index])
      }
      parties[index] = {
          name: party,
          values: partySupport
      }
  }
)
    console.log(parties);
    const chart = new frappe.Chart("#chart", {
      title: `Voting changes in ${cityName} `,
      data: {
          labels: ["1983", "1987", "1991", "1995", "1999", "2003", "2007", "2011", "2015", "2019", "2023"],
          datasets: parties
      },
      type: "bar",
      height: 450,
      barOptions: {
        stacked: 1
      },
      colors: ['#006288', '#FFDE55', '#F54B4B', '#3AAD2E', '#006845', '#F00A64', '#ffdd93', '#2B67C9']
      });
      const downloadButton = document.querySelector(".download");
      downloadButton.addEventListener("click", (event)=>{
        event.preventDefault();
        chart.export();  
  })
      
}
const display_estimation = async () =>{
    const retrievedObject = await getData();
    console.log(retrievedObject);
    const values = retrievedObject.value;
    const parties = ["KOK", "PS", "SDP", "KESK", "VIHR", "VAS", "RKP", "KD"];
    parties.forEach((party, index) => {
      let partySupport = []
      for(let i = 0; i < 11; i++) {
          partySupport.push(values[i * 8 + index])
      }
      let sum = 0;
      for (let i = 1, n =partySupport.length; i<n; i++){
        sum+= partySupport[i]-partySupport[i-1];
      }
      const estimation = partySupport[partySupport.length-1] + Math.round(sum/10)
      partySupport.push(estimation);
      console.log(estimation);
      parties[index] = {
          name: party,
          values: partySupport
      }
  }
)
    console.log(parties);
    const chart = new frappe.Chart("#chart", {
      title: `Voting changes in ${cityName} `,
      data: {
          labels: ["1983", "1987", "1991", "1995", "1999", "2003", "2007", "2011", "2015", "2019", "2023", "2024 est."],
          datasets: parties
      },
      type: "bar",
      height: 450,
      barOptions: {
        stacked: 1
      },
      colors: ['#006288', '#FFDE55', '#F54B4B', '#3AAD2E', '#006845', '#F00A64', '#ffdd93', '#2B67C9']
      });
      const downloadButton = document.querySelector(".download");
      downloadButton.addEventListener("click", (event)=>{
        event.preventDefault();
        chart.export();  
  })
}

const getData = async ()=> {
    const jsonQuery = {
        "query": [
          {
            "code": "Sukupuoli",
            "selection": {
              "filter": "item",
              "values": [
                "SSS"
              ]
            }
          },
          {
            "code": "Puolue",
            "selection": {
              "filter": "item",
              "values": [
                "03",
                "02",
                "01",
                "04",
                "05",
                "06",
                "07",
                "08"
              ]
            }
          },
          {
            "code": "Vaalipiiri ja kunta vaalivuonna",
            "selection": {
              "filter": "item",
              "values": [
                `${statsFinnIndex}`
              ]
            }
          },
          {
            "code": "Tiedot",
            "selection": {
              "filter": "item",
              "values": [
                "evaa_aanet"
              ]
            }
          }
        ],
        "response": {
          "format": "json-stat2"
        }
      };
      const fetchedData = await fetch("https://statfin.stat.fi:443/PxWeb/api/v1/en/StatFin/evaa/statfin_evaa_pxt_13sw.px", {
        method: "POST",
        headers : {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })
    if (!fetchedData.ok) return;
    const retrievedData = await fetchedData.json();
    return retrievedData
}

if (estimation == "true") {
    display_estimation();
}
else{
    display_current();
    
}
