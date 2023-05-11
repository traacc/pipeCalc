const calc = document.body.querySelector('.calc');
const metalType = calc.querySelector('.calcHeader__type');

const dn = calc.querySelector('.calcHeader__dn');
const du = calc.querySelector('.calcHeader__du');
const thickness = calc.querySelector('.calcHeader__thickness');
const len = calc.querySelector('.calcHeader__len');
const outInch = calc.querySelector('.calcHeader__outInch');

const itemsTable = document.querySelector('.itemsTable__table');
const addBtn = document.querySelector('.calcHeader__add');

const amountGlueTotals = calc.querySelector('.amountGlue .calcResults__value');
const amountCleanerTotals = calc.querySelector('.amountCleaner .calcResults__value');
const amountTapeLongitudinalTotals = calc.querySelector('.amountTapeLongitudinal .calcResults__value');
const amountTapeCrossTotals = calc.querySelector('.amountTapeCross .calcResults__value');
const amountSelfAdhesiveTotals = calc.querySelector('.amountSelfAdhesive .calcResults__value');


let tableId = 0;
let itemsPosition = [];

const { jsPDF } = window.jspdf;

addBtn.addEventListener('click',()=>{
    tableId++;
    
    let dnv = Number(dn.value);
    let tv = Number(thickness.value);
    let lnv = Number(len.value);

    
    
   
    len.reportValidity();
    thickness.reportValidity();
    dn.reportValidity();
    metalType.reportValidity();

    if(!dnv||!tv||!lnv)
        return;
    itemsPosition.push({
        id: tableId,
        metalType: metalType.value,
        dn: dn.value,
        thickness: thickness.value,
        len: len.value,
        amountGlue: calcAmountGlue(dnv, tv, lnv),
        amountCleaner: calcAmountCleaner(dnv, tv, lnv),
        amountTapeLongitudinal: calcAmountTapeLongitudinal(dnv, tv, lnv),
        amountTapeCross: calcAmountTapeCross(dnv, tv, lnv),
        amountSelfAdhesive: calcAmountSelfAdhesive(dnv, tv, lnv)
    });
    
    let row = itemsTable.insertRow();
    row.insertCell().innerHTML = metalType.options[metalType.selectedIndex].text;
    row.insertCell().innerHTML = dn.options[dn.selectedIndex].text;
    row.insertCell().innerHTML = thickness.options[thickness.selectedIndex].text;
    row.insertCell().innerHTML = len.value;
    row.insertCell().innerHTML = calcAmountGlue(dnv, tv, lnv).toFixed(2);
    row.insertCell().innerHTML = calcAmountCleaner(dnv, tv, lnv).toFixed(2);
    row.insertCell().innerHTML = calcAmountTapeLongitudinal(dnv, tv, lnv).toFixed(2);
    row.insertCell().innerHTML = calcAmountTapeCross(dnv, tv, lnv).toFixed(2);
    row.insertCell().innerHTML = calcAmountSelfAdhesive(dnv, tv, lnv).toFixed(2);
    row.insertCell().innerHTML = `<a class="itemsTable__removeRow" href="javascript:void(0);"></a>`;

    //console.log(row);
    let tId = tableId;
    console.log(itemsPosition);
    row.querySelector('.itemsTable__removeRow').addEventListener('click',()=>{
        itemsTable.deleteRow(row.rowIndex);
        console.log(itemsPosition);
        itemsPosition = itemsPosition.filter(obj => obj.id !== tId);
        updateResults();
    });
    updateResults();
});


function generateItems(itemObj, placeholder){
    let html = `<option value="" disabled selected>${placeholder}</option>`;
    for(let [index, item] of itemObj.entries()) {
        html += `<option value="${item}">${item}</option>`
    }
    return html;
}


const dnTable = { steel: [10.2,12,13.5,15,17.2,20,21.3,25,26.8,30,33.5,38,42.3,48,54,57,60.3,63.5,70,76,80,88.9,101.3,108,114,125,133,139,159,170],
                  plastic: [10,12,16,20,25,32,40,50,63,75,90,110,125,140,160],
                  cu: [6.4,9.5,12.7,15.9,19.1,22.3,25.4,28.6,30,34.9,41.3,47.6,54,57.2,60.3,63.5,70,76.2,80,88.9,108.8,114.3,]
}
const duTable = {
    steel: {
        10.2:6,
        12: 6,
        13.5: 8,
        15: 11,
        17.2:10,
        20: 15,
        21.3: 15,
        25:18,
        26.8:20,
        30:25,
        33.5:25,
        38:30,
        42.3:32,
        48:40,
        54:50,
        57:50,
        60.3:50,
        63.5:50,
        70:65,
        76:65,
        80:65,
        88.9:80,
        101.3:90,
        108:100,
        114:100,
        125:100,
        133:125,
        139:125,
        159:150,
        170:163
        },
    plastic: {
        10: "",
        12: "",
        16: "", 
        20: "",
        25: "",
        32: "",
        40: "",
        50: "",
        63: "",
        75: "",
        90: "",
        110: "",
        125: "",
        140: "",
        160: "",
    },
    cu: {
        6.4: 4,
        9.5: 8,
        12.7: 10,
        15.9: 13,
        19.1: 15,
        22.3: 20,
        25.4: 23,
        28.6: 25,
        30: 28,
        34.9: 32,
        41.3: 40,
        47.6: 40,
        54: 50,
        57.2: 50,
        60.3: '',
        63.5: 60,
        70: 62.4,
        76.2: 65,    
        80: 74.3,
        88.9: 80,
        108.8: 100,
        114.3: 100,

    }
}
const thicknessTable = {
    steel : {
        10.2: [6,9,13,19],
        12:   [6,9,13,19],
        13.5: [6,9,13,19],
        15:   [6,9,13,19,32],
        17.2: [6,9,13,19,25,32,40,50],
        20:   [6,9],
        21.3: [6,9,13,19,25,32,40,50],
        25:   [6,9,13,19,25],
        26.8: [6,9,13,19,25,32,40,50],
        30:   [9,13,19],
        33.5: [6,9,13,19,25,32,40,50],
        38:   [9],
        42.3: [6,9,13,19,25,32,40,50],
        48:   [9,13,19,25,32,40,50],
        54:   [9,13,19,25,32],
        57:   [9,13,19,25,32,40,50],
        60.3: [9,13,19,25,32,40,50],
        63.5: [9,13,19,25,32],
        70:   [9,13,19,25,32,40,50],
        76:   [9,13,19,25,32,40,50],
        80:   [9,13,19,25,32,40,50],
        88.9: [9,13,19,25,32,40,50],
        101.3:[9,13,19,25,32,40,50],
        108:  [9,13,19,25,32,40,50],
        114:  [9,13,19,25,32,40,50],
        125:  [9,13,19,25,32,40,50],
        133:  [9,13,19,25,32,40,50],
        139:  [9,13,19,25,32,40,50],
        159:  [9,13,19,25,32,40,50],
        170:  [40, 50],
    },
    plastic: {
        10: [6,9,13,19],
        12: [6,9,13,19],
        16: [6,9,13,19], 
        20: [6,9,13,19,25,32,40,50],
        25: [6,9,13,19,25,40],
        32: [6,9,13,19,25,32,40,50],
        40: [6,9,13,19,25,32,40,50],
        50: [9,13,19,25,32,40,50],
        63: [9,13,19,25,32],
        75: [9,13,19,25,32,40,50],
        90: [9,13,19,25,32,40,50],
        110: [9,13,19,25,32,40,50],
        125: [9,13,19,25,32,40,50],
        140: [9,13,19,25,32,40,50],
        160: [9,13,19,25,32,40,50],
    },
    cu: {
        6.4: [6,9,13],
        9.5: [6,9,13,19],
        12.7: [6,9,13,19],
        15.9: [6,9,13,19],
        19.1: [6,9],
        22.3: [6,9,13,19,25,32,40,50],
        25.4: [6,9,13,19,25],
        28.6: [6,9,13,19,25,32,40,50],
        30: [6,9,13,19,25,32,40,50],
        34.9: [6,9,13,19,25,32,40,50],
        41.3: [6,9,13,19,25,32,40,50],
        47.6: [9,13,19,25,32,40,50],
        54: [9,13,19,25,32],
        57.2: [9,13,19,25,32,40,50],
        60.3: [9,13,19,25,32,40,50],
        63.5: [9,13,19,25,32],
        70: [9,13,19,25,32,40,50],
        76.2: [9,13,19,25,32,40,50],    
        80: [9,13,19,25,32,40,50],
        88.9: [9,13,19,25,32,40,50],
        108.8: [9,13,19,25,32,40,50],
        114.3: [9,13,19,25,32,40,50],

    },
}

const outInchTable = {
    6.4: '1/4\"',
    9.5: '3/8\"',
    12.7: '1/2\"',
    15.9: '5/8\"',
    19.1: '3/4\"',
    22.3: '7/8\"',
    25.4: '1\"',
    28.6: '1 1/8\"',
    30: '1 1/4\"',
    34.9: '1 3/8\"',
    41.3: '1 5/8\"',
    47.6: '1 7/8\"',
    54: '2 1/8\"',
    57.2: '2 1/4\"',
    60.3: '2 3/8\"',
    63.5: '2 1/2\"',
    70: '2 3/4\"',
    76.2: '3\"',    
    80: '3 1/8\"',
    88.9: '3 1/2\"',
    108.8: '4 1/4\"',
    114.3: '4 1/2\"',

}

function calcAreaGluedSurface (dn, thickness, len) {
    return Number((((dn/1000+thickness*2/1000)*(dn/1000+thickness*2/1000))*3.1415926-(dn/1000*dn/1000)*3.1415926)*(len/2-1)+thickness/1000*len);
}

function calcAmountGlue (dn, thickness, len) {
    return calcAreaGluedSurface(dn, thickness, len)*0.3;
}

function calcAmountCleaner (dn, thickness, len) {
    return calcAmountGlue(dn, thickness, len)*0.3;
}

function calcCirLen (dn, thickness) {
    return Number(3.1415926*(dn+thickness*2)/1000);
}

function calcAmountTapeLongitudinal (dn, thickness, len) {
    return Number(calcCirLen(dn, thickness)*(len/2-1));
}

function calcAmountTapeCross (dn, thickness, len) {
    return Number(len);
}

function calcAmountSelfAdhesive (dn, thickness, len) {
    return calcCirLen(dn, thickness, len)*len*1.15;
}

function changeThickness() {
    if(!metalType.value||!dn.value)
        return;
    thickness.innerHTML = generateItems(thicknessTable[metalType.value][dn.value], "Толщина изоляции в мм");

}

function getColumnSum(column) {
    return itemsPosition.reduce((acc, cur) => acc + cur[column], 0);
}

function updateResults() {
    amountGlueTotals.textContent = getColumnSum("amountGlue").toFixed(2);
    amountCleanerTotals.textContent = getColumnSum("amountCleaner").toFixed(2);
    amountTapeLongitudinalTotals.textContent = getColumnSum("amountTapeLongitudinal").toFixed(2);
    amountTapeCrossTotals.textContent = getColumnSum("amountTapeCross").toFixed(2);
    amountSelfAdhesiveTotals.textContent = getColumnSum("amountSelfAdhesive").toFixed(2);
}
function changeType() {
    //console.log(dnTable[metalType.value]);
    dn.innerHTML = generateItems(dnTable[metalType.value], "DN трубы");
    if(metalType.value=='cu') {
        outInch.classList.remove('hide');
    } else {
        outInch.classList.add('hide');
    }

    if(metalType.value=='plastic') {
        du.classList.add('hide');
    } else {
        du.classList.remove('hide');
    }

    dn.value="";
    du.value="";
    outInch.value="";
    len.value="";
}
function updateDu() {
    if(!metalType.value||!dn.value)
        return;
    du.value = duTable[metalType.value][dn.value];
}
function updateOutInch() {
    if(!metalType.value||!dn.value)
        return;
    if(metalType.value=='cu') {
        outInch.value = outInchTable[dn.value];
    }
}
dn.addEventListener('change', ()=>{
    changeThickness();
    updateDu();
    updateOutInch();
})
metalType.addEventListener('change', ()=>{
    changeType();
    changeThickness();
    updateDu();
    updateOutInch();
})

let pdfDoc = new jsPDF();

function headerPdf(title) {
    pdfDoc.addImage(document.querySelector('.pdfLogo'), 'PNG', 0, 5, 200, 20);
    pdfDoc.setFontSize(14);
    pdfDoc.text(5, 30, title);
}

function headerTable(h) {
    h+=8;
    pdfDoc.setFont("FuturaPT-Medium");
    pdfDoc.text(5, h, "Тип трубы");

    pdfDoc.text(25, h, "DN трубы (мм)", {maxWidth:'12'});
    pdfDoc.text(45, h, "Толщина изоляции (мм)", {maxWidth:'20'});
    pdfDoc.text(70, h, "Длинна трубы (м)", {maxWidth:'15'});
    pdfDoc.text(90, h, "Кол-во клея (л)", {maxWidth:'13'});
    pdfDoc.text(110, h, "Кол-во очистителя (л)", {maxWidth:'20'});
    pdfDoc.text(135, h, "Лента продольная (м)", {maxWidth:'20'});
    pdfDoc.text(160, h, "Лента поперечная (м)", {maxWidth:'20'});
    pdfDoc.text(185, h, "Кол-во покрытия (м²)", {maxWidth:'17'});
    pdfDoc.setFont("FuturaPT-Book");
}

function rowPdf(el,h) {

    const metalStrings = {'steel': 'Сталь', 'plastic':'Пластик', 'cu':'Медь'}

    h+=8;
    pdfDoc.setFont("FuturaPT-Medium");
    pdfDoc.text(5, h, metalStrings[el.metalType]);
    pdfDoc.setFont("FuturaPT-Book");
    pdfDoc.text(25, h, String(el.dn));
    pdfDoc.text(45, h, el.thickness);
    pdfDoc.text(70, h, el.len);
    pdfDoc.text(90, h, el.amountGlue.toFixed(2));
    pdfDoc.text(110, h, el.amountCleaner.toFixed(2));
    pdfDoc.text(135, h, el.amountTapeLongitudinal.toFixed(2));
    pdfDoc.text(160, h, el.amountTapeCross.toFixed(2));
    pdfDoc.text(185, h, el.amountSelfAdhesive.toFixed(2));
    
    
}

function totalPdf(caption, value, unit, x, y) {
    pdfDoc.text(x, y, String(caption), {maxWidth:'27'});
    pdfDoc.setFont("FuturaPT-Medium");
    pdfDoc.text(x, y+10, value + " " + unit);
    pdfDoc.setFont("FuturaPT-Book");
}

function generatePdf() {
    
    pdfDoc.addFileToVFS('FuturaPT-Book-normal.ttf', font);
    pdfDoc.addFont('FuturaPT-Book-normal.ttf', 'FuturaPT-Book', 'normal');

    pdfDoc.addFileToVFS('FuturaPT-Medium-normal.ttf', fontMed);
    pdfDoc.addFont('FuturaPT-Medium-normal.ttf', 'FuturaPT-Medium', 'normal');
    pdfDoc.setFont("FuturaPT-Book");

    pdfDoc.setFontSize(14);

    headerPdf("Расчет аксессуаров для трубок K-FLEX");

    pdfDoc.setFontSize(8);

    let i = 0;

    headerTable(33);
    for(i=0; i<itemsPosition.length; i++){
        rowPdf(itemsPosition[i],47+i*12);
    }
    pdfDoc.setFontSize(14);
    pdfDoc.text(5, 50 + itemsPosition.length*17, "Итого вам понадобиться:");
    pdfDoc.setFontSize(8);
    totalPdf("Количество клея", getColumnSum("amountGlue").toFixed(2), " литров", 5, 60 + itemsPosition.length*17);
    totalPdf("Количество очистителя", getColumnSum("amountCleaner").toFixed(2), " литров", 35, 60 + itemsPosition.length*17);
    totalPdf("Количество ленты для продольных швов", getColumnSum("amountTapeLongitudinal").toFixed(2), " метров", 65, 60 + itemsPosition.length*17);
    totalPdf("Количество ленты для поперечных швов", getColumnSum("amountTapeCross").toFixed(2),  " метров", 95, 60 + itemsPosition.length*17);
    totalPdf("Количество покрытия самоклеющегося", getColumnSum("amountSelfAdhesive").toFixed(2), " м²", 125, 60 + itemsPosition.length*17);
    //pdfDoc.text(160, 100+i*17, "Итого: " + document.querySelector('.products__total .num').textContent + "руб.") ;


    pdfDoc.save('output.pdf');
}

/* END PDF Generator */
document.querySelector('.calcGeneratePdf').addEventListener('click',()=>{
    generatePdf();
});

document.addEventListener("DOMContentLoaded",()=>{
    if(metalType.value) 
        changeType();
    changeThickness();
    updateOutInch();
});