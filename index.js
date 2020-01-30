let mainObj = {
    apple: 25,
    banana: 36,
    apricot: 44,
    milk: 55,
    any: 99
}

let translatedObj = {
    apple: "խնձոր",
    banana: "բանան",
    apricot: "ծիրան",
    milk: "կաթ",
    any: "any"
}



const colors = ["red", "green", "yellow", "black", "aqua"]



const createChart = (main, translated, needId) => {
    let keysArr = [];
    let valueArr = [];
    let virtualProcentForTrueHidden={}

    for (let [key, val] of Object.entries(main)) {
        valueArr.push(val)
    }

    for (let [key, val] of Object.entries(translated)) {
        keysArr.push(val)
    }

    let valueProcent = [];
    let sum = 0

    valueArr.forEach(el => {
        sum += el
    })
    valueArr.forEach(el => {
        valueProcent.push(Math.round(el / sum * 100))
    })

    const dataLengthColors = []



    for (let i = 0; i < valueProcent.length; i++) {
        dataLengthColors.push(colors[i])

    }
    let forChangingData = [...valueProcent];


    var canvas = document.getElementById(needId);
    var ctx = canvas.getContext('2d');

    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.defaultFontSize = 16;
    var theHelp = Chart.helpers;

    var data = {
        labels: keysArr,
        datasets: [{
            fill: true,
            backgroundColor: dataLengthColors,
            data: valueProcent,
            borderWidth: [2, 2]
        }]
    };

    const options = {
        tooltips: {
            bodyFontSize: 30,
            backgroundColor: "#6F6B6A",
            position: "average",
            footerFontSize: 10,
            bodyFontColor: "#0C0B0A",
            displayColors: false
        },
        title: {
            display: true,
            position: 'top'
        },
        rotation: -0.7 * Math.PI,
        legend: {
            display: true,
            position: 'right',
            boxWidth: 20,

            onClick: function (e, legendItem) {
                const index = legendItem.index;
                const ci = this.chart;
                const meta = ci.getDatasetMeta(0).data[index];
                meta.hidden = !meta.hidden

                if (legendItem.hidden === false) {
                   
                    let hiddenObj = {}
                    for (let i = 0; i < 5; i++) {
                        hiddenObj[i] = ci.data.datasets["0"]._meta["0"].data[i].hidden
                    }
                    let newDataForIndexes = []
                    let newDataForIndexesTrueHidden = []
                    for (let [key, val] of Object.entries(hiddenObj)) {
                        if (val === false) {
                            newDataForIndexes.push(key)
                        } else if (val === true) {
                            newDataForIndexesTrueHidden.push(key)
                        }
                    }
                    let dataWithFalseHidden = [];
                    let arrForIndexesTrueHidden = []

                    newDataForIndexes.forEach(el => {
                        dataWithFalseHidden.push(ci.data.datasets["0"].data[el])
                    })

                    newDataForIndexesTrueHidden.forEach(el=>{
                        arrForIndexesTrueHidden.push(ci.data.datasets["0"].data[el])
                    })

                    let sum = 0
                    let beginSum = 0;
                    newDataForIndexes.forEach(el=>{
                        beginSum += forChangingData[el]
                        
                    })

                    dataWithFalseHidden.forEach(el => {
                        sum += el
                    })

                    newVirtualProcentForTrueHidden = {}

                    arrForIndexesTrueHidden.map((el,i)=>{
                        newVirtualProcentForTrueHidden[i]=Math.round((forChangingData[i] / (beginSum+forChangingData[i])) * 100)
                       
                    })

                    for(let [key,val] of Object.entries(newVirtualProcentForTrueHidden)){
                        ci.data.datasets["0"].data[key] = val
                    }

                    newProcentData = {}
                    dataWithFalseHidden.map((el, i) => {
                        newProcentData[newDataForIndexes[i]] = Math.round((el / sum) * 100);
                    })

                    for (let [key, val] of Object.entries(newProcentData)) {

                        ci.data.datasets["0"].data[key] = val

                    }
                 
                }
                else if (legendItem.hidden === true) {
                    console.log(legendItem)
                    let hiddenObj = {}
                    for (let i = 0; i < 5; i++) {
                        hiddenObj[i] = ci.data.datasets["0"]._meta["0"].data[i].hidden
                    }
                    let newDataForIndexes = []
                    for (let [key, val] of Object.entries(hiddenObj)) {
                        if (val === false) {
                            newDataForIndexes.push(key)
                        }
                    }
                    let dataWithFalseHidden = []


                    newDataForIndexes.forEach(el => {
                        dataWithFalseHidden.push(ci.data.datasets["0"].data[el])
                    })
                    let sum = 0
                    dataWithFalseHidden.forEach(el => {
                        sum += el
                    })
                    newProcentData = {}
                    dataWithFalseHidden.map((el, i) => {
                        newProcentData[newDataForIndexes[i]] = Math.round((el / (sum - Number(legendItem.text.split(" ")[0]))) * (100 - Number(legendItem.text.split(" ")[0])));
                       
                    })

                    for (let [key, val] of Object.entries(newProcentData)) {
                        console.log(typeof index)
                        console.log(typeof key)
                        if (key != index) {
                            ci.data.datasets["0"].data[key] = val
                        } else {
                        }
                    }
                }
                ci.update();

            },



            labels: {
                generateLabels: function (chart) {
                    const data = chart.data;

                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function (label, i) {


                            const meta = chart.getDatasetMeta(0);
                            const ds = data.datasets[0];
                            const arc = meta.data[i];


                            const custom = arc && arc.custom || {};
                            const getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
                            const arcOpts = chart.options.elements.arc;
                            const fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                            const stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                            const bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                            return {
                                text: ds.data[i] + " % " + label,
                                fillStyle: fill,
                                strokeStyle: stroke,
                                lineWidth: bw,
                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                index: i
                            };
                        });

                    }
                    return [];
                }
            }
        }
    };


    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });


   
}

createChart(mainObj, translatedObj, "pieChart")

