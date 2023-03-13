module.exports = {
  tableName: () => {
    // Table name from Airtable setup
    return 'TableName';
  },
  adminRoleName: () => {
    // The admin role name used on your server for this bot    
    return 'Creator';
  },

  // Some colours to use
  green: () => {
    return 0x78B159;
  },
  orange: () => {
    return 0xFF9900;
  },
  red: () => {
    return 0xDD2E44;
  },
  blue: () => {
    return 0x19AFE4;
  },
  randomColour: () => {
    //fully random
    //return Math.floor(Math.random()*16777215);
    
    //psuedo random
    let colours = [
      0x27A8DB,
      0x990B1D,
      0xE7D538,
      0x3FCB7B,
      0xDA543C,
      0xEC9DBF,
      0xBD0036,
      0x24205C,
      0xD77E03,
      0x037900,
    ];
    return colours[Math.floor(Math.random()*colours.length)];
  },

  // Some emojis to use
  successMark: () => {
    return ":heavy_check_mark:"
  },    
  failMark: () => {
    return ":heavy_multiplication_x:"
  },    
};
