console.log('################################################################################')
console.log('        message/selectmenu/dropdown_flex.js STARTING...')
console.log('################################################################################')

const lib        = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config     = require('../../../../../helpers/config.js');
const functions  = require('../../../../../helpers/functions.js');
const token      = context.params.event.token;
const followupID = context.params.event.message.id;
const getASA     = context.params.event.data.values[0];

await lib.discord.interactions['@1.0.0'].responses.update({
  token: token,
  message_id: followupID, //paste followup messageID
  content: 'Flexing your choice!',
});
  
let flexAsset = await lib.airtable.query['@1.0.0'].select({
  table: `Assets`,
  where: [
    {
      'asset_id__is': `${getASA}`
    }
  ],
  limit: {
    'count': 1,
    'offset': 0
  }
});
  
await functions.flexAsset(context, flexAsset, "OWN");
  
  