// IMPORTING
import {
    init,
    PinboardEmbed,
    SearchEmbed,
    Action,
    RuntimeFilterOp,
    EmbedEvent,
    AuthType
} from 'https://cdn.jsdelivr.net/npm/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {getSearchData} from "./rest-api.js";

// INITIALIZE
init({
    thoughtSpotHost: tsHost,
    authType: AuthType.None,
        // authType: AuthType.SSO,
    customCssUrl: "cdn.jsdelivr.net/gh/luca-borletti/Gallus-Insights-Web-Tool/css/custom.css",
    // username: "Luca",
    // authEndpoint: "https://authenticator-server:gallus/endpoint",
    // getAuthToken: () => Promise.resolve(token),
    // autoLogin: true,

    // authType: AuthType.Basic,
    // username: "Luca",
    // password: "Gallus2022#"
});

// authStatus = init(embedConfig); authStatus.on(AuthStatus.FAILURE, (reason) => {
//     console.log('Authentication failed');
// });

const embedDiv = '#embed';

// MAKE A LIVEBOARD
function makeLiveboard(guid){
    let embed = new PinboardEmbed(embedDiv, {
        frameParams: {},
        /*param-start-modifyActions*/
        fullHeight: false,
        /*param-end-liveboardFullHeight*/
        /*param-start-modifyActions*/
        disabledActions: [],
        disabledActionReason: "Reason for disabling",
        // visibleActions: [Action.Explore, Action.DownloadAsPdf, Action.ShowUnderlyingData, Action.DrillInclude, Action.DrillDown, Action.DrillExclude], /* Removes all actions if empty array */
        hiddenActions: [],
        pinboardId: guid,
    });

    //hideNoDataImage(); 

    embed
        // LISTENERS
        // .on(EmbedEvent.Init, showLoader)
        // .on(EmbedEvent.Load, hideLoader)
        .on(EmbedEvent.Error, () => {
            //showNoDataImage();
            // hideLoader();
        })
        .render();
    }

// MAKE A VISUALIZATION
function makeVisualization(guid, vizGuid){
    let embed = new PinboardEmbed(embedDiv, {
        frameParams: {},
        /*param-start-modifyActions*/
        disabledActions: [],
        disabledActionReason: "Reason for disabling",
        hiddenActions: [],
        /*param-end-modifyActions*/
        pinboardId: guid,
        vizId: vizGuid
    });

    //hideNoDataImage(); 

    embed
        // LISTENERS
        // .on(EmbedEvent.Init, showLoader)
        // .on(EmbedEvent.Load, hideLoader)
        .on(EmbedEvent.Error, () => {
            //showNoDataImage();
            // hideLoader();
        })
        .render();
    }

// MAKE A SEARCH
function makeSearch(datasourceGuid){
    let embed = new SearchEmbed(embedDiv, {
        frameParams: {},
        /*param-start-modifyActions*/
        // hideDataSources: true,
        disabledActions: [],
        disabledActionReason: "Reason for disabling",
        // visibleActions: [Action.ShowUnderlyingData, Action.Download, Action.DrillInclude, Action.DrillDown, Action.DrillExclude], /* Removes all actions if empty array */
        hiddenActions: [],
        /* Use either visibleActions or hiddenActions */
        searchOptions: {
            searchTokenString: '[Company][Loan amount] top 10 2021', //write a TML query
            //[commit date][revenue]
            // executeSearch: true,
        },
        /*param-end-modifyActions*/
        dataSources: [datasourceGuid],
    });

    //hideNoDataImage(); 

    embed
        // LISTENERS
        // .on(EmbedEvent.Init, showLoader)
        // .on(EmbedEvent.Load, hideLoader)
        .on(EmbedEvent.Error, () => {
            //showNoDataImage();
            // hideLoader();
        })
        .render();
    }

// MAKE AN ANSWER
function makeAnswer(answerGuid){
    let embed = new SearchEmbed(embedDiv, {
        frameParams: {},
        /*param-start-modifyActions*/
        disabledActions: [],
        disabledActionReason: "Reason for disabling",
        hiddenActions: [],
        /*param-end-modifyActions*/
        answerId: answerGuid
        /*param-start-runtimeFilters*//*param-end-runtimeFilters*/
    });

    //hideNoDataImage(); 

    embed
        // LISTENERS
        // .on(EmbedEvent.Init, showLoader)
        // .on(EmbedEvent.Load, hideLoader)
        .on(EmbedEvent.Error, () => {
            //showNoDataImage();
            // hideLoader();
        })
        .render();
    }

// HIGHCHARTS CURRENCY ORDERS OF MAGNITUDE SYMBOLS
Highcharts.setOptions({
    lang: {
        numericSymbols: ["K", "M", "B", "T", "Q", "L"]
    }
})

// MAKE A TOP 15 BUBBLE CHART
function top15Bubble(worksheetID, search) {
    getSearchData(tsHost, worksheetID, search).then(data => {
        // console.log(data);
        const loanIdx = data.columnNames.findIndex(v => v == 'Total Loan amount');
        const companyIdx = data.columnNames.findIndex(v => v == 'Company');

        const series = {}
        for (const r of data.data) {
            const companyName = r[companyIdx];
            if (!Object.keys(series).includes(companyName)) {
                series[companyName] = [];
            }
            series[companyName].push({ name: r[companyIdx], value: r[loanIdx]});
        }

        const chartSeries = [];

        for (const companyName of Object.keys(series)) {
            chartSeries.push({name: companyName, data: series[companyName]})
        }

        // console.log(chartSeries);

        Highcharts.chart('embed', {
            chart: {
                height: '45%',
                type: 'packedbubble',
                backgroundColor: "#eef1f4",
            },
            legend: { 
                // enabled:false 
                align: 'left',
                verticalAlign: 'bottom',
                layout: 'vertical',
                    },
            title: {
                // text: 'Top 5 Lenders by Volume'
                text: null
                    },
            series: chartSeries
        });
    });
}

// MAKE AN ADJUSTED NET INCOME WATERFALL CHART
function adjustedNetWaterfall(worksheetID, search) {
    getSearchData(tsHost, worksheetID, search).then(data => {
        // console.log(data);

        let chartSeries = [];

        // console.log(data.columnNames);
        // console.log((data.data)[0]);

        for (let r = 0; r < data.columnNames.length; r++) {
            chartSeries.push({name: data.columnNames[r].substring(6), y: (data.data)[0][r]});
        }
        
        chartSeries[3].isIntermediateSum = true;
        // chartSeries[3].color = Highcharts.getOptions().colors[1];
        chartSeries[3].color = '#767E8B';
        chartSeries[11].isSum = true;
        // chartSeries[8].isSum = true;
        // chartSeries[11].color = Highcharts.getOptions().colors[1];
        chartSeries[11].color = '#767E8B';
        // chartSeries[8].color = '#767E8B';


        Highcharts.chart('embed', {
            chart: {
                backgroundColor: "#eef1f4",
                type: 'waterfall'
            },

            title: {
                text: null
            },

            xAxis: {
                type: 'category'
            },

            yAxis: {
                title: {
                    text: 'USD'
                }
            },

            legend: {
                enabled: false
            },

            series: [{
                // upColor: Highcharts.getOptions().colors[2],
                upColor: "#4273E8",
                // color: Highcharts.getOptions().colors[3],
                color: "#DC5057",
                data: chartSeries,
                dataLabels: {
        enabled: true,
        formatter: function () {
            return Highcharts.numberFormat(this.y / 1000000, 0, ',') + 'M';
        },
        style: {
            fontWeight: 'bold'
        }
    },
            }]
        });
    });
}

// MAKE AN INCOME STATEMENT WATERFALL CHART
function incomeStatementWaterfall(worksheetID, search) {
    getSearchData(tsHost, worksheetID, search).then(data => {
        // console.log(data);

        let chartSeries = [];

        // console.log(data.columnNames);
        // console.log((data.data)[0]);

        for (let r = 0; r < data.columnNames.length; r++) {
            chartSeries.push({name: data.columnNames[r].substring(6), y: (data.data)[0][r]});
        }
        
        chartSeries[8].isIntermediateSum = true;
        // chartSeries[3].color = Highcharts.getOptions().colors[1];
        chartSeries[8].color = '#767E8B';
        chartSeries[16].isSum = true;
        // chartSeries[11].color = Highcharts.getOptions().colors[1];
        chartSeries[16].color = '#767E8B';


        Highcharts.chart('embed', {
            chart: {
                height: '40%',
                backgroundColor: "#eef1f4",
                type: 'waterfall'
            },

            title: {
                text: null
            },

            xAxis: {
                type: 'category'
            },

            yAxis: {
                title: {
                    text: 'USD'
                }
            },

            legend: {
                enabled: false
            },

            series: [{
                // upColor: Highcharts.getOptions().colors[2],
                upColor: "#4273E8",
                // color: Highcharts.getOptions().colors[3],
                color: "#DC5057",
                data: chartSeries,
                dataLabels: {
        enabled: true,
        formatter: function () {
            return Highcharts.numberFormat(this.y / 1000000, 0, ',') + 'M';
        },
        style: {
            // fontWeight: 'bold'
        }
    },
            }]
        });
    });
}


// LOADER FUNCTIONS (optional)
function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// NO DATA IMAGE FUNCTIONS (optional)
function showNoDataImage() {
    document.getElementById("no-data").style.display = "block";
}
function hideNoDataImage() {
    document.getElementById("no-data").style.display = "none";
}

// CLEAR EMBED FUNCTION (important)
const clearEmbed = () => {
    const div = document.getElementById("embed");
    div.innerHTML = "";
}

// WRITE DESCRIPTION FUNCTION
function writeDescription(description) {
    let descDiv = document.getElementById("description");
    descDiv.style.display = "block";
    descDiv.style.fontSize = '18pt';
    descDiv.style.color = "var(--title-color)";
    descDiv.innerHTML = '';
    descDiv.innerText = description;

}

// CALL "MAKE A _____" FUNCTIONS DEPENDING ON MENU ITEM
function loadContent(contentObj){
    console.log('Running load content');
    console.log(contentObj);
    clearEmbed();
    if(contentObj.description !== null){
        writeDescription(contentObj.description);
    }
    else {
        document.getElementById("description").style.display = "none";
    }
    if(contentObj.type == 'liveboard'){
        makeLiveboard(contentObj.guid);
    }
    if(contentObj.type == 'visualization'){
        makeVisualization(contentObj.guid, contentObj.vizGuid);
    }
    if(contentObj.type == 'search'){
        makeSearch(contentObj.guid);
    }
    if(contentObj.type == 'answer'){
        makeAnswer(contentObj.guid);
    }
    if(contentObj.type == 'chart'){
        if (contentObj.name == 'Top 15 Lenders'){
            top15Bubble(contentObj.guid, contentObj.chartTML);
        }
        if (contentObj.name == 'Adjusted Net Income'){
            adjustedNetWaterfall(contentObj.guid, contentObj.chartTML);
        }
        if (contentObj.name == 'Income Statement'){
            incomeStatementWaterfall(contentObj.guid, contentObj.chartTML);
        }
    }
    if(contentObj.name == 'Sign up'){
        
    }
    if(contentObj.name == 'Login'){

    }
    if(contentObj.name == 'Logout'){

    }
}


// BASIC ICON MAPPING
var imageMap = {
    'liveboard' : 'bar_chart',
    'answer': 'search',
    'search': 'search',
    'visualization': 'bar_chart',
    'chart': 'multiline_chart'
}

// WRITE SIDE MENU
function writeMenu(itemArray, menu){
   console.log("writing menu");
    // check if menu-1 or menu-2
    let menuUl = document.getElementById(menu);
    for(let i = 0, len = itemArray.length; i<len; i++){
        let li = document.createElement('li');
        let iconStr;
        let item = itemArray[i];
        if (null != item.overridingImage) {
            iconStr = item.overridingImage;
        }
        else {
            iconStr = imageMap[item.type];
        }
        li.innerHTML = "<span class='wrapper'><span class='material-icons'>" + iconStr + "</span><p>&nbsp&nbsp;" + item['name'] + "</p></span>";
        menuUl.append(li);
        if (item.type == "dropdown") {
            let ul = document.createElement('ul');
            let ulId = "submenu-" + i;
            ul.setAttribute('id', ulId);
            ul.setAttribute('class', 'submenu-hidden');
            menuUl.append(ul);
            writeMenu(item.contents, ulId);
            li.onclick = function () {
                ul.classList.toggle('submenu-visible');
            };
        }
        else {
            li.onclick = function () {
                loadContent(itemArray[i]);
            }; 
        }
        // check if menu-1 or menu-2
            // create new function that basically changes some divs to include
                // descriptive stuff
            // also modify load content to include a clearHome tab
    }
}
//    writeMenu(homeItems, 'menu-1');
writeMenu(menuItems, 'menu-2');
makeLiveboard(defaultLiveboardId);
writeDescription(defaultLiveboardDescription);