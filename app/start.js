const { exec } = require('child_process');
const process = exec('npm run dev', { cwd: __dirname });
process.stdout.on('data', (data) => console.log(data));
process.stderr.on('data', (data) => console.error(data));