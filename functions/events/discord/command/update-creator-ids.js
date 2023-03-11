console.log('################################################################################')
console.log('        command/update-creator-ids.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('../../../../helpers/config.js');
const functions = require('../../../../helpers/functions.js');

let guild_id        = context.params.event.guild_id;
let isAdmin         = await functions.isAdmin(context);
let message_content = "";
let numASA          = 0;
let embeds          = [];

if (isAdmin) {
  // IS AN ADMIN

  // Get wallet Strings
  let walletArray = await functions.getCreatorWallets(context);

  // Get Creator assets for wallet addresses
  let creatorAssets = [];
  for (let i = 0; i < walletArray.length; i++) {
    console.log(walletArray[i]);
    let assetResult = await lib.http.request['@1.1.6'].get({
      url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + walletArray[i] + '/created-assets?limit=1000'// required
    })

    for (let j = 0; j < assetResult.data.assets.length; j++){
      creatorAssets.push(assetResult.data.assets[j].index)
    }

    let embed = {
      "type": "rich",
      "title": walletArray[i],
      "description": "This wallet has **" + assetResult.data.assets.length + "** assets in it.",
      "color": config.green(),
    };
    embeds.push(embed);

    numASA += assetResult.data.assets.length;
  }
  
  
  await lib.utils.kv['@0.1.16'].set({
    key: "CreatorIDs-" + guild_id,
    value: creatorAssets
  });

  message_content = config.successMark() + " The creator ASA IDs have been updated. A total of **" + numASA + "** were added. Re-run the command to change it."
} else {
    // NOT AN ADMIN
    message_content = config.failMark() + " You do not have permission to run this command. Run the command again after being given the correct role. :-)"
}


console.log(embeds);

let message = await lib.discord.interactions['@1.0.1'].followups.ephemeral.create({
    token: context.params.event.token,
    content: message_content,
    "embeds": embeds,
})
