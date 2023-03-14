console.log('################################################################################')
console.log('        command/config-owner-roles.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const functions = require('../../../../helpers/functions.js');

// Get general information
let guild_id       = context.params.event.guild_id;
let token          = context.params.event.token;
let newOwnerRoleID = context.params.event.data.options[0].value;
let newNumNFTs     = context.params.event.data.options[1].value;

// Set some general information needed
let newOwnerRoleName = await functions.getRoleName(context, newOwnerRoleID);
let newOwnerRoles    = [];

// Set variables up for interaction message
let message_content = "";
let embeds          = [];
let components      = [];
let notPushed       = true;

// SET FAKE DATA TO TEST
//let embeds = [{"type":"rich","title":"15 or more NFTs needed","description":"","color":7909721,"fields":[{"name":"Rolename","value":"budfather15+","inline":true},{"name":"NFTs","value":"15","inline":true},{"name":"RoleID","value":"1075738013734281246","inline":true}],"footer":{"text":"This role is being added or updated."}}];
//let components      = [{"type":1,"components":[{"style":3,"label":"Update","custom_id":"btn_roles_update","disabled":false,"type":2},{"style":4,"label":"Cancel","custom_id":"btn_roles_cancel","disabled":false,"type":2}]}];

// Check if member is an admin
let isAdmin = await functions.isAdmin(context);

if (isAdmin) {
  // IS AN ADMIN
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: token,
    content: "Adding a new owner role..."
  });

  let currentOwnerRoles = await lib.utils.kv['@0.1.16'].get({
    key: "OwnerRoles-" + guild_id,
  });
  
  if (currentOwnerRoles == null) {
    currentOwnerRoles = [];
  };

  if (currentOwnerRoles.length > 0) {
    for (let i = 0; i < currentOwnerRoles.length; i++) {
      if (currentOwnerRoles[i].amount < newNumNFTs) {
        let embed = functions.setOwnerRoleEmbed(newOwnerRoleID, newOwnerRoleName, newNumNFTs, "ADD");
        embeds.push(embed);
        newOwnerRoles.push({
          "id": newOwnerRoleID,
          "amount": newNumNFTs
        });
        notPushed = false;
      }
      let roleID   = currentOwnerRoles[i].id;
      let roleName = await functions.getRoleName(context, roleID);
      let numNFTs  = currentOwnerRoles[i].amount;
      let embed    = functions.setOwnerRoleEmbed(roleID, roleName, numNFTs, "KEEP");
      embeds.push(embed);
      newOwnerRoles.push({
        "id": roleID,
        "amount": numNFTs
      });
    }
  }
  if (notPushed) {
    let embed = functions.setOwnerRoleEmbed(newOwnerRoleID, newOwnerRoleName, newNumNFTs, "ADD");
    newOwnerRoles.push({
      "id": newOwnerRoleID,
      "amount": newNumNFTs
    });
    embeds.push(embed);
  }
  message_content = "The owner roles are as follows: "
  components      = [{"type":1,"components":[{"style":3,"label":"Update","custom_id":"btn_roles_update","disabled":false,"type":2},{"style":4,"label":"Cancel","custom_id":"btn_roles_cancel","disabled":false,"type":2}]}];
} else {
  // NOT AN ADMIN
  message_content = "You do not have permission to run this command. Run the command again after being given the correct role. :-)"
}

// Persist data
await lib.utils.kv['@0.1.16'].set({
  key: "tmp_OwnerRoles-" + guild_id,
  value: newOwnerRoles
})

let messageInner = {
  token: token,
  content: message_content,
  embeds: embeds,
  components: components,
}

await lib.discord.interactions['@1.0.1'].followups.ephemeral.create(messageInner)
