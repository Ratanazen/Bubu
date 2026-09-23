const fs = require('fs');
let code = fs.readFileSync('apps/control-center/src/components/Sidebar.tsx', 'utf8');
code = code.replace("import {\n  Download, PetIcon } from './Icons';", "import { PetIcon } from './Icons';");
fs.writeFileSync('apps/control-center/src/components/Sidebar.tsx', code);
