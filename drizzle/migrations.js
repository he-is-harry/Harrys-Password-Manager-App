import journal from './meta/_journal.json';
import m0000 from './0000_create_passwords.sql';
import m0001 from './0001_create_logins.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001
    }
  }
  