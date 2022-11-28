const { MessageEmbed } = require("discord.js")
const { capitalizeFirstLetter } = require("../util/functions.js")
const { readPokemon, readDefenseEffect } = require("../util/jsonreader.js")

const starlevels = [
    {name: "1 star", value: 1},
    {name: "2 star", value: 2},
    {name: "3 star", value: 3},
    {name: "4 star", value: 4},
    {name: "5 star", value: 5},
    {name: "6 star", value: 6},
    {name: "7 star", value: 7},
]

const types = [
    {name: "Normal", value: "normal"},
    {name: "Fighting", value: "fighting"},
    {name: "Flying", value: "flying"},
    {name: "Poison", value: "poison"},
    {name: "Ground", value: "ground"},
    {name: "Rock", value: "rock"},
    {name: "Bug", value: "bug"},
    {name: "Ghost", value: "ghost"},
    {name: "Steel", value: "steel"},
    {name: "Fire", value: "fire"},
    {name: "Water", value: "water"},
    {name: "Grass", value: "grass"},
    {name: "Electric", value: "electric"},
    {name: "Psychic", value: "psychic"},
    {name: "Ice", value: "ice"},
    {name: "Dragon", value: "dragon"},
    {name: "Dark", value: "dark"},
    {name: "Fairy", value: "fairy"},

]



const run = async (client, interaction) => {
    let stars = interaction.options.getNumber("stars")
    let code = interaction.options.getString("code")
    let teraType = interaction.options.getString("teratype")
    let species = interaction.options.getString("species") || "No species given"

    let pokemon = readPokemon('./SVpokemon.json')
    let defenseEff = readDefenseEffect('./defenseEffectiveness.json')

    const newEmbed = new MessageEmbed()
    .setColor("#fafafa")
    .setTitle(`${interaction.user.tag} has created a new raid: ${code.toUpperCase()}`)
    .setDescription(`A new ${starlevels.find(s=> stars === s.value)?.name} raid has started with Code: ${code.toUpperCase()}`)
    .addFields(
        {name: "Tera Type", value: `${types.find(t=> teraType === t.value)?.name}`}
    )

    let weakTo = "None "
    for (var key in defenseEff[teraType]){
        if(defenseEff[teraType][key] === 2)
        {
            if(weakTo === "None ")
                weakTo = ""

            weakTo += `${capitalizeFirstLetter(key)}/`
        }
    }
    weakTo = weakTo.slice(0, -1)

    newEmbed.addFields(
        {name: "Weaknesses", value: weakTo}
    )

    if(interaction.options.getString("species") != null)
    {
        species = capitalizeFirstLetter(species)
        newEmbed.addFields(
            {name: "Species", value: `${species}`}
        )
        if(pokemon.hasOwnProperty(species))
        {
            let ogTyping = capitalizeFirstLetter(pokemon[species].type1)

            if(pokemon[species].hasOwnProperty("type2"))
                ogTyping += `/${capitalizeFirstLetter(pokemon[species].type2)}`

            newEmbed.addFields(
                {name: "Original Typing", value: ogTyping}
            )
            newEmbed.setImage(`https://serebii.net/${pokemon[species].img}`)
        }
    }



    interaction.reply({content: "Raid created", ephemeral: true})

    interaction.channel.send({embeds: [newEmbed]})
    .then(msg => {
        setTimeout(() => msg.delete(), 180000)
      })

    return interaction.channel.threads.create({
        name: `${interaction.user.tag}'s raid: ${code.toUpperCase()} thread`,
        autoArchiveDuration: 60,
	    reason: 'New raid was made',
    }).then(thrd => {
        setTimeout(() => thrd.delete(), 360000)
    });
}

module.exports = {
    name: "startraid",
    description: "Starts a raid",
    options: [
        {
            name: "stars", description: "Star levels of the raid",
            type: "NUMBER", choices: starlevels, required: true
        },
        {
            name: "code", description: "Link code of the raid",
            type: "STRING", required: true,
            min_length: 6, max_length: 6
        },
        {
            name: "teratype", description: "Tera type of the raid pokemon",
            type: "STRING", required: true, choices: types,
        },
        {
            name: "species", description: "Pokemon species in the raid",
            type: "STRING", required: false,
        },
    ], run
}