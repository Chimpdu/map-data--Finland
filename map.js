
let parties2023;
let employment2021;
const initMap = async (geoJsonData) => {
   
    
    let map = L.map('map', {minZoom:-3});
    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);
    let google = L.tileLayer("https://{s}.google.com/vt/lyrs=s@221097413,traffic&x={x}&y={y}&z={z}", {
        attribution: "© Google map",
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);
    let geoJson1 = L.geoJSON(geoJsonData, {
        weight:2,
        onEachFeature: getFeature1,
        style: getStyle1
    })
    .addTo(map);
    let geoJson2 = L.geoJSON(geoJsonData, {
        weight:2,
        onEachFeature: getFeature2,
        style: getStyle2
          
    })
    .addTo(map);
    let baseMaps = {
        "OpenStreetMap": osm,
        "Google map": google
    }
    let overLayMaps = {
        "parties": geoJson1,
        "student employment": geoJson2 
    }
    let layerControl = L.control.layers(baseMaps, overLayMaps).addTo(map);

   map.fitBounds(geoJson1.getBounds());
   map.fitBounds(geoJson2.getBounds());
}
const fetchData = async () => {
    let geoJsonUrl = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    let fetchedGeoJsonData = await fetch(geoJsonUrl);
    let geoJsonData = await fetchedGeoJsonData.json();
    /* await getPartiesData(); */
    await getPartiesData2023();
    await getEmploymentData2021();
    console.log(employment2021); 
    initMap(geoJsonData);
}

const getPartiesData2023 = async () => {
    const  fetchedPartiesJsonQuery = await fetch("./parties2023.json");
    const partiesJsonQuery = await fetchedPartiesJsonQuery.json();
    const url = "https://statfin.stat.fi:443/PxWeb/api/v1/en/StatFin/evaa/statfin_evaa_pxt_13sw.px";
    
    const fetchedPartiesData = await fetch(url, {
        method: "POST",
        headers : {"content-type": "application/json"},
        body: JSON.stringify(partiesJsonQuery)
    })
    if (!fetchedPartiesData.ok) return;
    parties2023 = await fetchedPartiesData.json();
  
}
const getEmploymentData2021 = async() => {
    const fetchedEmploymentJsonQuery = await fetch("./studentEmployment2021.json");
    const employmentJsonQuery = await fetchedEmploymentJsonQuery.json();
    const url = "https://statfin.stat.fi:443/PxWeb/api/v1/en/StatFin/tyokay/statfin_tyokay_pxt_13g3.px";

    const fetchedEmploymentData = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(employmentJsonQuery)
    })
    if (!fetchedEmploymentData.ok) return;
    employment2021 = await fetchedEmploymentData.json();
}
const getFeature1= async (feature, layer) =>{
    if (!feature.properties.name) return
    layer.bindTooltip(feature.properties.name);
    const cityCode = "KU"+feature.properties.kunta;
    const statsFinnCityCode = getstatsFinnCityCode(cityCode);
    
    const valueIndex = parties2023.dimension['Vaalipiiri ja kunta vaalivuonna'].category.index[statsFinnCityCode];
    const parties2023PerCity = [];
    const allValues = parties2023.value;
 
    let i = 0;
    allValues.forEach((element, index) => {
        
        if (index == valueIndex + i*473) {
            parties2023PerCity.push(element);
            i++;
        }
    })
    let topPartyValue = Math.max(...parties2023PerCity);
    let topPartyIndex; 
    parties2023PerCity.forEach((element, index)=> {
        if (element==topPartyValue) {
            topPartyIndex = index;
        }
    })
    const party = ["KOK", 'PS', "SDP", "KESK", "VIHR", "VAS", "RKP", "KD"];
    const partyLogo = ["./img/National_Coalition_Party_logo.svg", 
                        "./img/Perussuomalaiset_Logo.svg", 
                        "./img/Sozialdemokratische_Partei_Finnlands_Logo.svg",
                        "./img/Keskusta.svg",
                        "./img/Vihreät.svg",
                        "./img/Vasemmistoliitto_Logo_2018.svg",
                        "./img/Ruotsalainen_kansanpuolue_Teillogo.svg",
                        "./img/Christian_Democrats_(Finland)_logo_2022.svg"
                    ]; 
    
    let topParty = party[topPartyIndex];
    let topPartyLogo = partyLogo[topPartyIndex];
    if (topPartyValue == 0) {
        topParty = "--";
        topPartyLogo =""
    }
   /*  console.log(feature.properties.name);
    console.log(topParty); */

    layer.bindPopup(
        `<p><strong>${feature.properties.name}</strong></p>
         <ul>
            <li>Leading party: ${topParty} (2023)</li>
            <li>Votes for leading party: ${topPartyValue} <img src=${topPartyLogo} alt=${topParty} style="width: 35px"></img></li>
            <p><button id = "to-party-chart" style="font-size: 1.2rem; padding:0.5rem; border-radius:12px; box-shadow: 2px 2px #558ABB; cursor:pointer">See on chart</button></p> 
        </ul>`
    )
    layer.on('popupopen', () => {
        const navigationButton = document.querySelector("#to-party-chart");
        navigationButton.addEventListener("click", (event) => {
            event.preventDefault();
            let obj = {
                'cityName':feature.properties.name,
                'statsFinnCityCode':statsFinnCityCode
            };
            const searchParams = new URLSearchParams(obj);
            const queryString = searchParams.toString();
            window.location.href = "./partiesMiddlePage.html?"+queryString;
            
        });
    });
}
const getStyle1 =  (feature) => {
    const cityCode = "KU"+feature.properties.kunta;
    const statsFinnCityCode = getstatsFinnCityCode(cityCode);
    
    const valueIndex = parties2023.dimension['Vaalipiiri ja kunta vaalivuonna'].category.index[statsFinnCityCode];
    const parties2023PerCity = [];
    const allValues = parties2023.value;

    let i = 0;
    allValues.forEach((element, index) => {
        
        if (index == valueIndex + i*473) {
            parties2023PerCity.push(element);
            i++;
        }
    })
    let topPartyValue = Math.max(...parties2023PerCity);
    let topPartyIndex; 
    parties2023PerCity.forEach((element, index)=> {
        if (element==topPartyValue) {
            topPartyIndex = index;
        }
    })
    if (topPartyIndex == 0) {
        return {color: "#006288", fillOpacity: 0.5};
    }
    else if (topPartyIndex == 1) {
        return {color: "#FFDE55", fillOpacity: 0.5}
    }
    else if (topPartyIndex == 2) {
        return {color: "#F54B4B", fillOpacity: 0.5}
    }
    else if (topPartyIndex == 3) {
        return {color: "#3AAD2E", fillOpacity: 0.5}
    }
    else if (topPartyIndex == 4) {
        return {color: "#006845", fillOpacity: 0.5}
    }
    else if (topPartyIndex == 5) {
        return {color: "#F00A64", fillOpacity: 0.5}
    }
    else if (topPartyIndex == 6) {
        return {color: "#ffdd93", fillOpacity: 0.5}
    }
    else if (topPartyIndex == 7) {
        return {color: "#2B67C9", fillOpacity: 0.5}
    }
    else {
        return {color: "grey", fillOpacity: 0.5};
    }
    
    
}
    
    
    
   
  

const getFeature2= (feature, layer) =>{
    if (!feature.properties.name) return
    layer.bindTooltip(feature.properties.name);
    const cityName = feature.properties.name;
    const cityCode = "KU"+feature.properties.kunta;
    const indexObject = employment2021.dimension.Alue.category.index;
    const index = indexObject[cityCode];
    const allValues = employment2021.value
    let totalStudentEmploymentNum;
    let totalStudentEmploymentPer;
    if (index == 0) {
        totalStudentEmploymentNum = allValues[0];
        totalStudentEmploymentPer = allValues[1];
    } else {
        totalStudentEmploymentNum = allValues[2*index];
        totalStudentEmploymentPer = allValues[2*index + 1];
    }
    
    
    layer.bindPopup(
        `   
            <p>Student employment situation in ${cityName}:</p>
            <ul>
                <p><li>Total employment number: ${totalStudentEmploymentNum} (2021)</li></p>
                <p><li>Employment percentage: ${totalStudentEmploymentPer}% (2021)</li></p>
                <p><button id="to-employ-chart" style="font-size: 1.2rem; padding:0.5rem; border-radius:12px; box-shadow: 2px 2px #558ABB; cursor:pointer">See on chart</button></p>
            </ul>
        `
    )

    layer.on('popupopen', () => {
        const navigationButton = document.querySelector("#to-employ-chart");
        navigationButton.addEventListener("click", (event) => {
            event.preventDefault();
            let obj = {
                'cityName':feature.properties.name,
                'cityCode': cityCode
            };
            const searchParams = new URLSearchParams(obj);
            const queryString = searchParams.toString();
            window.location.href = "./employMiddlePage.html?"+queryString;
            
        });
    });
} 
/* Dont add async here or color would nit display */
const getStyle2 = (feature)=> {
    if (!feature.properties.name) return
    const cityCode = "KU"+feature.properties.kunta;
    const indexObject = employment2021.dimension.Alue.category.index;
    const index = indexObject[cityCode];
    const allValues = employment2021.value
    let totalStudentEmploymentPer;
    if (index == 0) {
        totalStudentEmploymentPer = allValues[1];
    } else {
        totalStudentEmploymentPer = allValues[2*index + 1];
    }
    const hue = Math.round(120 * (totalStudentEmploymentPer - 39.5) / (80.6-39.5)); /* formula: normalize and convert */
    return {color: `hsl(${hue}, 75%, 50%)`}
}
const getstatsFinnCityCode = (cityCode) => {
    let correspondingCode;
    const labels = parties2023.dimension["Vaalipiiri ja kunta vaalivuonna"].category.label;
    const StatFinnCityCodeList = Object.keys(labels);
    
    StatFinnCityCodeList.forEach(element => {
        if (labels[element].substring(0,5) == cityCode) correspondingCode=element; 
    });
    return correspondingCode
}
fetchData()

