console.log('################################################################################')
console.log('        command/flex.js STARTING...')
console.log('################################################################################')

const lib       = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const config    = require('../../../../helpers/config.js');
const functions = require('../../../../helpers/functions.js');

let dbCount = await lib.airtable.query['@1.0.0'].count({
    table: `Assets`,
    where: [{}],
    limit: {
      'count': 0,
      'offset': 0
    }
});

let randomID = Math.floor(Math.random()*dbCount.count);

let minID = await lib.airtable.query['@1.0.0'].min({
  table: `Assets`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  },
  field: `id`
});

let getASA = randomID + (minID.min.min - 1);

let flexAsset = await lib.airtable.query['@1.0.0'].select({
  table: `Assets`,
  where: [
    {
      'id__is': `${getASA}`
    }
  ],
  limit: {
    'count': 1,
    'offset': 0
  }
});

await functions.flexAsset(context, flexAsset, "RANDOM");


