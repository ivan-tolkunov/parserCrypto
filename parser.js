import fs from 'fs';

let fileContent = fs.readFileSync(process.argv[2] + ".txt", "utf8");
let writeableStream = fs.createWriteStream(process.argv[2] + " final.txt");

let simpleArray = fileContent.split("|").splice(-1,1);
let deleteLastElement = simpleArray.pop();
let jsonArray = JSON.parse(JSON.stringify(simpleArray));
let attributeArray = [];
let chanceArray = [];
let finalArray = [];

for(let attribute of jsonArray) {
    for(let a of JSON.parse(attribute).attributes) {
        attributeArray.push(a.trait_type + ": " + a.value);
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
    for(let traitT of JSON.parse(el).attributes) {
        finalChance *= findChance(traitT.trait_type + ": " + traitT.value);
    }
    const img = {
        name: JSON.parse(el).name,
        chance: finalChance
    };
   finalArray.push(img);
}

function findChance(traitType) {
    for (let uniqueAttribute of chanceArray) {
        if(uniqueAttribute.trait_type === traitType.toString()) return uniqueAttribute.chance;
    }
}

function myCompare(a, b) {
    return a.chance - b.chance;
  }

for(let el of finalArray.sort(myCompare))
    writeableStream.write(JSON.stringify(el) + " ");
    
writeableStream.end("");
