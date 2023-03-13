console.log('################################################################################')
console.log('        message/button/btn_roles_cancel.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const functions = require('../../../../../helpers/functions.js');

let guild_id        = context.params.event.guild_id;
let isAdmin         = await functions.isAdmin(context);
let message_content = "Something went wrong. If this problem persists contact your administrator.";
let embeds          = [];

if (isAdmin) {
  let ownerRoles = await lib.utils.kv['@0.1.16'].get({
    key: "OwnerRoles-" + guild_id,
  });

  for (let i = 0; i < ownerRoles.length; i++) {
    let roleName = await functions.getRoleName(context, ownerRoles[i].id);
    let roleID   = ownerRoles[i].id;
    let numNFTs  = ownerRoles[i].amount;

    let embed    = await functions.setOwnerRoleEmbed(roleID, roleName, numNFTs, "VIEW");
    embeds.push(embed);
  }
  message_content = "Owner roles have been left unchanged."
}

let message = await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${context.params.event.token}`,
    content: message_content,
    embeds: embeds,
})
