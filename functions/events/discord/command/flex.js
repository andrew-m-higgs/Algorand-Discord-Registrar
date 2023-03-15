console.log('################################################################################')
console.log('        command/flex.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('../../../../helpers/config.js');
const functions = require('../../../../helpers/functions.js');
const token     = context.params.event.token;
const guild_id  = context.params.event.guild_id;

let member_id       = context.params.event.member.user.id;
let message_content = "";
let options         = [];
let collectionName  = await lib.utils.kv.get({
  key: 'CollectionName: ' + guild_id,
});
  
let editFollowup = await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  token: token,
  content: `A select menu will appear soon! Make a choice then to flex your favourite NFT from **${collectionName}**.`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
});  

let member_details = await lib.airtable.query['@1.0.0'].select({
  table: `Members`, // required
  where: [{ member_id__is: member_id }],
  limit: {
    count: 1,
    offset: 0,
  },
});

if (member_details.rows.length > 0) {
  let wallet_string = member_details.rows[0].fields.wallet_string;
  let asset_ids     = member_details.rows[0].fields.asset_ids.split(",");
  let name_list     = member_details.rows[0].fields.name_list.split(",");

  if (asset_ids.length == 0) {
    message_content = "No **" + collectionName + "** assets found in **" + wallet_string + "**. Perhaps you still need to run /update-roles."
  } else {
    for (let i = 0; i < asset_ids.length; i++) {
      options.push({
        label:name_list[i],
        value: asset_ids[i],
        default: false,
      })
    }
    
    console.log("HERE: " + JSON.stringify(options));

    await lib.discord.interactions['@1.0.1'].responses.update({
      token: token,
      content: "Which **" + collectionName + "** would you like to flex from **" + wallet_string + "**?",
      tts: false,
      components: [{
        type: 1,
        components: [{
          custom_id: `dropdown_flex`,
          placholder: "Please select...",
          options: options,
          type: 3,
        }]
      }]
    })
  }
} else {
  message_content = "No don't seem to be registered. Have you run the /register command yet?";
}
  
if (message_content != "") {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: token,
    content: message_content,
  })
}
