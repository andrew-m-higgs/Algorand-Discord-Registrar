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

  // Some emojis to use
  successMark: () => {
    return ":heavy_check_mark:"
  },    
  failMark: () => {
    return ":heavy_multiplication_x:"
  },    
};
