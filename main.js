const calc = document.body.querySelector('.calc');
const metalType = calc.querySelector('.header__type');

const dn = calc.querySelector('.header__dn');
const du = calc.querySelector('.header__du');
const thickness = calc.querySelector('.header__thickness');
const len = calc.querySelector('.header__len');

const itemsTable = document.querySelector('.itemsTable__table');
const addBtn = document.querySelector('.header__add');

const amountGlueTotals = calc.querySelector('.amountGlue .calcResults__value');
const amountCleanerTotals = calc.querySelector('.amountCleaner .calcResults__value');
const amountTapeLongitudinalTotals = calc.querySelector('.amountTapeLongitudinal .calcResults__value');
const amountTapeCrossTotals = calc.querySelector('.amountTapeCross .calcResults__value');
const amountSelfAdhesiveTotals = calc.querySelector('.amountSelfAdhesive .calcResults__value');


let tableId = 0;
let itemsPosition = [];

addBtn.addEventListener('click',()=>{
    tableId++;
    let dnv = Number(dn.value);
    let tv = Number(thickness.value);
    let lnv = Number(len.value);
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
    row.insertCell().innerHTML = `<a class="itemsTable__removeRow" href="javascript:void(0);">×</a>`;

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


function generateItems(itemObj){
    let html = '';
    for(let [index, item] of itemObj.entries()) {
        html += `<option value="${item}">${item}</option>`
    }
    return html;
}


const dnTable = { steel: [10.2,12,13.5,15,17.2,20,21.3,25,26.8,30,33.5,38,42.3,48,54,57,60.3,63.5,70,76,80,88.9,101.3,108,114,125,133,139,159,170],
                  plastic: [10,12,16,20,25,32,40,50,63,75,90,110,125,140,160]
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
        '1/4"': [6,9,13],
        '3/8"': [6,9,13,19],
        '1/2"': [6,9,13,19],
        '5/8"': [6,9,13,19],
        '3/4"': [6,9],
        '7/8"': [6,9,13,19,25,32,40,50],
        '1"': [6,9,13,19,25],
        '1 1/8"': [6,9,13,19,25,32,40,50],
        '1 1/4': [6,9,13,19,25,32,40,50],
        '1 3/8"': [6,9,13,19,25,32,40,50],
        '1 5/8"': [6,9,13,19,25,32,40,50],
        '1 7/8': [9,13,19,25,32,40,50],
        '2 1/8"': [9,13,19,25,32],
        '2 1/4': [9,13,19,25,32,40,50],
        '2 3/8': [9,13,19,25,32,40,50],
        '2 1/2': [9,13,19,25,32],
        '2 3/4': [9,13,19,25,32,40,50],
        '3': [9,13,19,25,32,40,50],    
        '3 1/8"': [9,13,19,25,32,40,50],
        '3 1/2': [9,13,19,25,32,40,50],
        '4 1/4': [9,13,19,25,32,40,50],
        '4 1/2': [9,13,19,25,32,40,50],

    },
}

function calcAreaGluedSurface (dn, thickness, len) {
    return Number((((dn/1000+thickness*2/1000)*(dn/1000+thickness*2/1000))*3.1415926-(dn/1000*dn/1000)*3.1415926)*(len/2-1)+thickness/1000*len);
}

function calcAmountGlue (dn, thickness, len) {
    return calcAreaGluedSurface(dn, thickness, len)*0.3;
}

function calcAmountCleaner (dn, thickness, len) {
    return 0;
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
    thickness.innerHTML = generateItems(thicknessTable[metalType.value][dn.value]);
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
    console.log(dnTable[metalType.value]);
    dn.innerHTML = generateItems(dnTable[metalType.value]);
}
dn.addEventListener('change', ()=>{
    changeThickness();
})
metalType.addEventListener('change', ()=>{
    changeType();
    changeThickness();
})
document.addEventListener("DOMContentLoaded",()=>{
    changeType();
    changeThickness();
});