console.log('################################################################################')
console.log('        command/update-creator-ids.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('../../../../helpers/config.js');
const functions = require('../../../../helpers/functions.js');

let guild_id        = context.params.event.guild_id;
let token           = context.params.event.token;
let isAdmin         = await functions.isAdmin(context);
let message_content = "";
let numASA          = 0;
let embeds          = [];

if (isAdmin) {
  // IS AN ADMIN
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: token,
    content: "Checking for existing ASA IDs in Airtable DB..."
  });

let dbCount = await lib.airtable.query['@1.0.0'].count({
    table: `Assets`,
    where:[{}],
    limit: {
      'count':0,
      'offset':0
    }
  })

  if (dbCount.count > 0) {
    await lib.discord.interactions['@1.0.1'].responses.update({
      token: token,
      content: "Clearing all ASA IDs from Airtable DB...**you will need to run /update-creator-ids again** in a minute or two."
    });
  
    // Delete the ASA IDs from Airtable
    await lib.airtable.query['@1.0.0'].delete({
      table: `Assets`,
      where: [{}],
      limit: {
        'count': 0,
        'offset': 0
      }
    });  
  }

  await lib.discord.interactions['@1.0.1'].responses.update({
    token: token,
    content: "Getting list of ASA IDs from creator wallets..."
  });

  // Get wallet Strings
  let walletArray = await functions.getCreatorWallets(context);

  // Get Creator assets for wallet addresses
  let creatorAssets = [];
  let fieldsets     = [];
  for (let i = 0; i < walletArray.length; i++) {
    console.log(walletArray[i]);
    let walletASANum = 0;
    let assetResult = await lib.http.request['@1.1.6'].get({
      url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + walletArray[i] + '/created-assets?limit=1000' // required
    })

    for (let j = 0; j < assetResult.data.assets.length; j++){
      if (!assetResult.data.assets[j].deleted) {
        walletASANum++;
        creatorAssets.push(assetResult.data.assets[j].index)
        let ipfs = assetResult.data.assets[j].params.url.split('/').pop().split('#').shift();
        fieldsets.push({
          'asset_id': assetResult.data.assets[j].index,
          'name': `${assetResult.data.assets[j].params.name}`,
          'ipfs': `${ipfs}`,
          'qty': assetResult.data.assets[j].params.total  
        })
      }
    }

    let embed = {
      "type": "rich",
      "title": walletArray[i],
      "description": "This wallet has **" + walletASANum + "** assets in it.",
      "color": config.green(),
    };
    embeds.push(embed);

    numASA += walletASANum;
  }
  
  
  await lib.utils.kv['@0.1.16'].set({
    key: "CreatorIDs-" + guild_id,
    value: creatorAssets
  });

  await lib.discord.interactions['@1.0.1'].responses.update({
    token: token,
    content: "Writing all ASA IDs to Airtable DB..."
  });

 // Add the new ASA IDs to Airtable
  let result = await lib.airtable.query['@1.0.0'].insert({
    table: `Assets`,
    fieldsets: fieldsets,
    typecast: false
  });

  message_content = "The creator ASA IDs have been updated. A total of **" + numASA + "** were added. Re-run the command to change it."
} else {
    // NOT AN ADMIN
    message_content = "You do not have permission to run this command. Run the command again after being given the correct role. :-)"
}


console.log(embeds);

let message = await lib.discord.interactions['@1.0.1'].responses.update({
    token: token,
    content: message_content,
    "embeds": embeds,
})
