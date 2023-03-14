console.log('################################################################################')
console.log('        command/clear-owner-roles.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const functions = require('../../../../helpers/functions.js');

// Get general information
let guild_id       = context.params.event.guild_id;
let token          = context.params.event.token;

let isAdmin         = await functions.isAdmin(context);
let embeds          = [];
let message_content = "";
let components      = [];

if (isAdmin) {
  // IS AN ADMIN
  let ownerRoles = await lib.utils.kv['@0.1.16'].get({
    key: "OwnerRoles-" + guild_id,
  });

  if (ownerRoles == null) {
    ownerRoles = [];
  };

  for (let i =0; i < ownerRoles.length; i++) {
    let roleID   = ownerRoles[i].id;
    let roleName = await functions.getRoleName(context, roleID);
    let numNFTs  = ownerRoles[i].amount;
    let embed = functions.setOwnerRoleEmbed(roleID, roleName, numNFTs, "VIEW");
    embeds.push(embed);
  }
  message_content = "The owner roles are as follows: "
  components      = [{"type":1,"components":[{"style":3,"label":"Clear","custom_id":"btn_roles_clear","disabled":false,"type":2},{"style":4,"label":"Cancel","custom_id":"btn_roles_cancel","disabled":false,"type":2}]}];
} else {
  // NOT AN ADMIN
  message_content = "You do not have permission to run this command. Run the command again after being given the correct role. :-)";
}


let messageInner = {
  token: token,
  content: message_content,
  embeds: embeds,
  components: components,
}
  
await lib.discord.interactions['@1.0.1'].followups.ephemeral.create(messageInner)
  