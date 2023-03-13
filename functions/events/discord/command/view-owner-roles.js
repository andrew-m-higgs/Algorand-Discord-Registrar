console.log('################################################################################')
console.log('        command/view-owner-roles.js STARTING...')
console.log('################################################################################')

const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const functions = require('../../../../helpers/functions.js');

let token           = context.params.event.token;
let guild_id        = context.params.event.guild_id;
let embedSections   = [];
let message_content = "These are the roles given to our collectors:"

let ownerRoles = await lib.utils.kv['@0.1.16'].get({
    key: "OwnerRoles-" + guild_id,
});

for (let i = 0; i < ownerRoles.length; i++) {
  let roleName = await functions.getRoleName(context, ownerRoles[i].id);
  let roleID   = ownerRoles[i].id;
  let numNFTs  = ownerRoles[i].amount;

  let embed    = functions.setOwnerRoleEmbed(roleID, roleName, numNFTs, "VIEW");
  embedSections.push(embed);
}

let messageInner = {
  token: token,
  content: message_content,
  embeds: embedSections,
}

await lib.discord.interactions['@1.0.1'].responses.ephemeral.create(messageInner)
