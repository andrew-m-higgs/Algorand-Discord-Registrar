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
      case "VIEW":
        colour = config.randomColour();
        emoji  = ":heavy_equals_sign:";
        footer = "";
        break;
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
      "title"      : `${numNFTs} or more NFTs needed`,
      "description": "",
      "color"      : colour,     
      "fields": [
        {
          "name": `Rolename`,
          "value": `${roleName}`,
          "inline": true
        },
        {
          "name": `NFTs`,
          "value": `${numNFTs}`,
          "inline": true
        },
        {
          "name": `RoleID`,
          "value": `${roleID}`,
          "inline": true
        }
      ],
      "footer": {
        "text": `${footer}`
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

  // Flex the given asset to the current channel
  flexAsset: async (context, flexAsset, flexType) => {

    //const followupID = context.params.event.message.id;
    const channelID  = context.params.event.channel_id;
    const token      = context.params.event.token;
    const memberID   = context.params.event.member.user.id;
    const guild_id   = context.params.event.guild_id;

    let assetName = flexAsset.rows[0].fields.name;
    let assetIPFS = flexAsset.rows[0].fields.ipfs;
    let assetID   = flexAsset.rows[0].fields.asset_id;
    let assetQty  = flexAsset.rows[0].fields.qty;
    let colour    = 0xFF9900;

    let collectionName = await lib.utils.kv.get({
      key: "CollectionName: " + guild_id,
    });
    
    switch(flexType) {
      case "RANDOM": 
        message_content = `<@!${memberID}> who flexed a **random** NFT from ` + collectionName + "!";
        colour = config.red();
        break;
      case "OWN":
        message_content = `<@!${memberID}> who flexed **their** favourite NFT from ` + collectionName + "!";
        colour = config.green();
        break;
    }

    let fileExt = "";
    let fileResponse = await lib.http.request['@1.1.6']({
      method: 'GET',
      url: `https://ipfs.io/ipfs/${assetIPFS}`,
    });

    let fileData = fileResponse.body;
    switch(fileResponse.headers['content-type']) {
      case "image/jpeg":
        fileExt = ".jpg";
        break;
      case "image/gif":
        fileExt = ".gif";
        break;
      case "image/png":
        fileExt = ".png";
        break;
      case "video/webm":
        fileExt = ".webm";
        break;
      default:
        console.log("Error in header switch: " + fileResponse.headers['content-type']);
    };

    await lib.discord.channels['@0.2.0'].messages.create({
      "channel_id": `${channelID}`,
      "tts": false,
      "content": "Flexing NFT",
      "file": fileData,
      "filename": fileResponse.headers.etag.split('"')[1] + fileExt,
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 5,
              "label": `NFT Explorer `,
              "url": `https://www.nftexplorer.app/asset/${assetID}`,
              "disabled": false,
              "type": 2
            },
            {
              "style": 5,
              "label": `Rand Gallery`,
              "url": `https://www.randgallery.com/algo-collection/?address=${assetID}`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ],
      "embeds": [
        {
          "type": "rich",
          "title": `**${assetName}**`,
          "description": `This asset has a quantity of ${assetQty}`,
          "color": 0x0a0a0a
        },{
          "type": "rich",
          "title": "**Courtesy of:**",
          "description": message_content,
          "color": colour,
        }
      ]
    });      
  },
}
