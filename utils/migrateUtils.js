const fs = require('fs');
const shell = require('shelljs');

function getVersion(currentFileName) {
  let version = 1;
  shell.ls(`./migrations`).forEach((item, index) => {
    if (item === currentFileName) {
      version = index + 1;
    }
  });
  return version;
}

async function migrate(currentFileName, queryInterface) {
  const migrationResourceDir = './migrations/resources/v';
  const version = getVersion(currentFileName.split('/')[currentFileName.split('/').length - 1]);
  const directories = shell.ls(`${migrationResourceDir}${version}`);
  for (let index = 0; index < directories.length; index++) {
    const fileName = directories[index];
    console.log('migrating: ', fileName);
    await queryInterface.sequelize
      .query(fs.readFileSync(`${migrationResourceDir}${version}/${fileName}`, 'utf-8'))
      .catch((e) => {
        console.log(e);
        const error = e.original.sqlMessage;
        if (error.startsWith('Table') && error.endsWith('already exists')) {
          // If the database is already built add this migration to sequelizeMeta table.
          return;
        }
        throw e;
      });
  }
}

module.exports = {
  migrate,
  getVersion
};
