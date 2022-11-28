const fs = require("fs")

const readPokemon = (path) => {
        let rawdata = fs.readFileSync(path)
        let pokemon = JSON.parse(rawdata)
        return pokemon
}

const readDefenseEffect = (path) => {
    let rawdata = fs.readFileSync(path)
    let defenseEff = JSON.parse(rawdata)
    return defenseEff
}

module.exports = {
    readPokemon,
    readDefenseEffect
}