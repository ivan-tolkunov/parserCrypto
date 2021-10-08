import fs from 'fs';

let fileContent = fs.readFileSync("json.txt", "utf8");
const stringArray = fileContent.split("|");
let writeableStream = fs.createWriteStream("finalString.txt");
let jsonArray = [];
let attributeArray = [];
let chanceArray = [];
let finalArray = [];

for(let element of stringArray) {
    jsonArray.push(JSON.parse(element));
}

for(let attribute of jsonArray) {
    attributeArray.push(attribute.attributes[0].value);
    if(attribute.attributes[1] === undefined) {
        attributeArray.push(false);
    } else{
        attributeArray.push(true);
    }
}

var result = {};
attributeArray.forEach(function(i){
    result[i] = result[i] + 1 || 1;
});

for (let key in result) {
    const chance = {
        trait_type: key,
        chance: result[key] / jsonArray.length
    };
    chanceArray.push(chance);
}

for (let el of jsonArray) {
    let finalChance = 1;
    for(let traitT of el.attributes) {
        finalChance *= findChance(traitT.value);
    }
    const img = {
        name: el.name,
        chance: finalChance
    };
   finalArray.push(img);
}

function findChance(traitType) {
    for (let uniqueAttribute of chanceArray) {
        if(uniqueAttribute.trait_type === traitType.toString()) return uniqueAttribute.chance;
    }
}

for(let el of finalArray)
    writeableStream.write(JSON.stringify(el) + " ");

//if u need JSON
// JSON.parse(JSON.stringify(finalArray))
