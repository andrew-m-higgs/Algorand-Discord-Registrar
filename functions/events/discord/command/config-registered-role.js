console.log('################################################################################')
console.log('        command/config-registered-role.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('../../../../helpers/config.js');
const functions = require('../../../../helpers/functions.js');

let regRole         = context.params.event.data.options[0].value;
let guild_id        = context.params.event.guild_id;
let isAdmin         = await functions.isAdmin(context);
let message_content = "";

if (isAdmin) {
  // IS AN ADMIN
  await lib.utils.kv['@0.1.16'].set({
    key: "RegisteredRole-" + guild_id,
    value: regRole
  }).catch(console.error(e));

  message_content = config.successMark() + " The registered role was set to **" + regRole + "**. Re-run the command to change it."
} else {
  // NOT AN ADMIN
  message_content = config.failMark() + " You do not have permission to run this command. Run the command again after being given the correct role. :-)"
}

let message = await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: context.params.event.token,
    content: message_content
})

