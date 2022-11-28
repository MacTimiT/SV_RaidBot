const durations = [
    {name: "10 seconds", value: 10 * 1000} 
]

const run = async (client, interaction) => {
    let member = interaction.options.getMember("user")
    let duration = interaction.options.getNumber("duration")
    let reason = interaction.options.getString("reason") || "No reason given"

    if(!member) return interaction.reply("Invalid member")

    try{
        await member.timeout(duration, reason)
        return interaction.reply(`${member.user.tag} has been timed out for ${durations.find(d=> duration === d.value)?.name} with a reason of ${reason}`)
    }
    catch(err){
        if (err){
            console.error(err)
            return interaction.reply(`Failed to timeout ${member.user.tag}`)
        }
    }
}

module.exports = {
    name: "timeout",
    description: "Timeout a member",
    perm: "MODERATE_MEMBERS",
    options: [
        {
            name: "user", description: "The user to timeout",
            type: "USER", required: true,
        },
        {
            name: "duration", description: "The duration of the timout",
            type: "NUMBER", choices: durations, required: true
        },
        {
            name: "reason", description: "Reason for punishment",
            type: "STRING", required: false
        }
    ], run
}