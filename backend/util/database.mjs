import chalk from 'chalk';
// import { format } from "sql-formatter";
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: 'dltmdgns',
// });

// module.exports = pool.promise();

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('node-complete', 'root', 'dltmdgns', {
  dialect: 'mysql',
  host: 'localhost',
  logging: (msg) => {
    // 改行を入れる。
    const formattedMsg = msg.replace(/\n/g, '\n\t');
    console.log(chalk.blueBright(formattedMsg));
    // console.log(format(msg, { language: "mysql" }));
  },
});

export default sequelize;
