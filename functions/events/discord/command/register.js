console.log('################################################################################')
console.log('        command/register.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('../../../../helpers/config.js');
const functions = require('../../../../helpers/functions.js');

// Get info from environment
const token         = context.params.event.token;
let wallet_string   = context.params.event.data.options[0].value;
let member_id       = context.params.event.member.user.id;
let guild_id        = context.params.event.guild_id;
let message_content = "Something did not go according to plan. Please try again later.";
let logChannel      = await lib.utils.kv.get({
  key: "logChannel: " + guild_id,
})
  
await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  "token": token,
  "content": 'We are attempting to register your **wallet: ' + wallet_string + '**!',
  "response_type": 'CHANNEL_MESSAGE_WITH_SOURCE'
});
 
let message = await lib.discord.channels['@0.3.4'].messages.create({
  "channel_id": logChannel,
  "content": `<@!${member_id}> is attempting to register this **wallet: ${wallet_string}**!`,
});  

let selectMember = await lib.airtable.query['@1.0.0'].select({
  table: `Members`,
  where: [{ 'member_id__is': `${member_id}` }],
  limit: {
    'count': 0,
    'offset': 0
  }
});

if (selectMember.rows.length < 1) {
  // Do insert of new member
  let insertMember = await lib.airtable.query['@1.0.0'].insert({
    table: `Members`,
    fieldsets: [
      {
        'member_id': `${member_id}`,
        'wallet_string': `${wallet_string}`
      }
    ],
    typecast: false
  });

  if (insertMember.rows.length < 1) {
    message_content = "Something went wrong with the registeration. Please try again later.";
  } else {
    message_content = "You have been registered. Please run **/update-roles** to get your owner roles."
  }
} else {
  // Do update of current member
  let updateMember = await lib.airtable.query['@1.0.0'].update({
    table: `Members`,
    where: [{ 'member_id__is': `${member_id}` }],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'wallet_string': `${wallet_string}`,
      'asset_ids': ``,
      'name_list': ``
    },
    typecast: false
  });

  if (updateMember.rows.length < 1) {
    message_content = "Something went wrong with the re-registeration. Please try again later.";
  } else {
    message_content = "You have been re-registered. Please run **/update-roles** to fix your owner roles."
  }
}

await lib.discord.interactions['@1.0.1'].responses.update({
    "token": token,
    "content": message_content,
})