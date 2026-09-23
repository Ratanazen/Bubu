import * as fs from 'fs';
import * as path from 'path';

export interface ProjectInfo {
    name: string;
    path: string;
    type: 'C' | 'C++' | 'Python' | 'Node.js' | 'Rust' | 'Go' | 'Java' | 'Unknown';
    buildSystem?: string;
}

export class ProjectScanner {
    public scanDirectory(dir: string): ProjectInfo {
        const info: ProjectInfo = {
            name: path.basename(dir),
            path: dir,
            type: 'Unknown'
        };

        try {
            const files = fs.readdirSync(dir);
            
            if (files.includes('package.json')) {
                info.type = 'Node.js';
                info.buildSystem = 'npm';
            } else if (files.includes('Cargo.toml')) {
                info.type = 'Rust';
                info.buildSystem = 'cargo';
            } else if (files.includes('CMakeLists.txt')) {
                info.type = files.includes('main.cpp') || files.includes('main.cc') ? 'C++' : 'C';
                info.buildSystem = 'cmake';
            } else if (files.includes('Makefile')) {
                info.type = 'C';
                info.buildSystem = 'make';
            } else if (files.includes('pyproject.toml') || files.includes('requirements.txt')) {
                info.type = 'Python';
                info.buildSystem = 'pip';
            } else if (files.includes('pom.xml')) {
                info.type = 'Java';
                info.buildSystem = 'maven';
            } else if (files.includes('go.mod')) {
                info.type = 'Go';
                info.buildSystem = 'go';
            }
        } catch (e) {
            console.error('Failed to scan directory', e);
        }

        return info;
    }
}
