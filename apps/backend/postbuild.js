import fs from 'fs';

// Create a proxy/entrypoint at dist/index.js pointing to dist/src/index.js
fs.writeFileSync('dist/index.js', 'import "./src/index.js";\n');
console.log('Successfully created dist/index.js proxy.');
