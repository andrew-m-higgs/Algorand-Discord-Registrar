const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('./config.js');

async function addRole(roleID, user_id, guild_id) {
  console.log('(functions.js) )Adding role (' + roleID + ')... ');
  await lib.discord.guilds['@0.2.4'].members.roles.update({
    role_id: roleID,
    user_id: user_id,
    guild_id: guild_id,
  }).catch(function () {
    console.log("Promise Rejected: while adding a role. (File: functions.js).");
  });
}

async function delRole(roleID, user_id, guild_id) {
  console.log('(functions.js) Removing role (' + roleID + ')...');
  await lib.discord.guilds['@0.2.4'].members.roles.destroy({
    role_id: roleID,
    user_id: user_id,
    guild_id: guild_id,
  }).catch(function () {
    console.log("Promise Rejected: while deleting a role. (File: functions.js).");
  });
}
  

module.exports = {
  // PROCEDURES

  //////////////////////////////////////////////////////////
  // changeRoles() - add new role and make sure all others 
  //                 are removed
  changeRoles: async (givenRole, removeRoles, user_id, guild_id) => {
    
    // Add new role
    //console.log("Adding role :", givenRole);
    addRole(givenRole, user_id, guild_id);

    //Remove others if there
    for (let i = 0; i < removeRoles.length; i++){
      //console.log("Removing role :", removeRoles[i]); 
      delRole(removeRoles[i], user_id, guild_id);
    }
  },

  //////////////////////////////////////////////////////////
  // isAdmin() - Check if a member is an admin
  isAdmin: async (context) => {
    let guild_id      = context.params.event.guild_id;
    let member_id     = context.params.event.member.user.id;
    let member_roles  = context.params.event.member.roles;
    let adminRoleId   = 0;
    let adminRoleName = config.adminRoleName();
    let server_roles  = await lib.discord.guilds['@0.2.4'].roles.list({
      guild_id: guild_id,
    });

    // get admin role id
    for (let i = 0; i < server_roles.length; i++) {
      if (server_roles[i].name == adminRoleName) {
        adminRoleId = server_roles[i].id
      }
    }

    // check if member has admin role
    if (member_roles.includes(adminRoleId)) {
      console.log("Member (" + member_id + ") is an admin.")
      return true;
    }
    
    console.log("Member (" + member_id + ") is not an admin.");
    return false;
  },

  //////////////////////////////////////////////////////////
  // setOwnerRoleEmbed() - returns an embed object
  setOwnerRoleEmbed: (roleID, roleName, numNFTs, embedType) => {
    let colour = "";
    let emoji  = "";
    let footer = "";

    switch(embedType) {
      case "KEEP":
        colour = config.orange();
        emoji  = ":heavy_equals_sign:";
        footer = "This role exists and will not be changed.";
        break;
      case "DELETE":
        colour = config.red();
        emoji  = ":heavy_minus_sign:";
        footer = "This role either no longer exists or is being updated.";
        break;
      case "ADD":
        colour = config.green();
        emoji  = ":heavy_plus_sign:";
        footer = "This role is being added or updated.";
        break;
    }

    let embed = {
      "type"       : "rich",
      "title"      : numNFTs + ` or more NFTs needed`,
      "description": "",
      "color"      : colour,     
      "fields": [
        {
          "name": `Rolename`,
          "value": roleName,
          "inline": true
        },
        {
          "name": `NFTs`,
          "value": numNFTs,
          "inline": true
        },
        {
          "name": `RoleID`,
          "value": roleID,
          "inline": true
        }
      ],
      "footer": {
        "text": `This role exists and will not be changed.`
      }
    }

    return embed;
  },

  //////////////////////////////////////////////////////////
  // getCreatorWallets() - return an array of Creator 
  //                       Wallets stored in key value pair
  getCreatorWallets: async (context) => {
    let guild_id      = context.params.event.guild_id;

    let walletStrings = await lib.utils.kv['@0.1.16'].get({
      key: "CreatorWallets-" + guild_id
    });

    return walletStrings.split(",");    
  },

  //////////////////////////////////////////////////////////
  // getRoleName() - return a role name based on a role id 
  getRoleName: async (context, roleId) => {
    let guild_id = context.params.event.guild_id;
    let server_roles  = await lib.discord.guilds['@0.2.4'].roles.list({
      guild_id: guild_id,
    });

    for (let i = 0; i < server_roles.length; i++) {
      if (roleId == server_roles[i].id) {
        return server_roles[i].name;
      }
    }
    return "THIS ROLE ID DOES NOT EXIST";
  },

}

