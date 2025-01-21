import fs from "fs";
import fs_extra from "fs-extra";
const { removeSync, ensureDirSync } = fs_extra;
import { join } from "path";
import tar from "tar";

const isBuilding = Boolean(process.env.NATIVEPHP_BUILDING);
const pythonBinaryPath = process.env.NATIVEPHP_PYTHON_BINARY_PATH;
const pythonVersion = process.env.NATIVEPHP_PYTHON_BINARY_VERSION;

// Differentiates for Serving and Building
const isArm64 = isBuilding ? process.argv.includes('--arm64') : process.arch.includes('arm64');
const isWindows = isBuilding ?  process.argv.includes('--win') : process.platform.includes('win32');
const isLinux = isBuilding ?  process.argv.includes('--linux') : process.platform.includes('linux');
const isDarwin = isBuilding ?  process.argv.includes('--mac') : process.platform.includes('darwin');

// Initialize platform object
const platform = {
    os: false,
    arch: false,
    pythonBinary: 'python',
};

if (isWindows) {
    platform.os = 'win';
    platform.pythonBinary += '.exe';
    platform.arch = 'x64';
}

if (isLinux) {
    platform.os = 'linux';
    platform.arch = 'x64';
}

if (isDarwin) {
    platform.os = 'mac';
    platform.arch = 'x86';
}

if (isArm64) {
    platform.arch = 'arm64';
}

// Override architecture if building with specific args
if (isBuilding) {
    platform.arch = process.argv.includes('--x64') ? 'x64' : platform.arch;
    platform.arch = process.argv.includes('--x86') ? 'x86' : platform.arch;
    platform.arch = process.argv.includes('--arm64') ? 'arm64' : platform.arch;
}

const pythonVersionZip = 'python-' + pythonVersion + '.tar';
const binarySrcDir = join(pythonBinaryPath, platform.os, platform.arch, pythonVersionZip);
const binaryDestDir = join(import.meta.dirname, 'resources/python');

console.log('Python Source: ', binarySrcDir);
console.log('Python Binary Filename: ', platform.pythonBinary);
console.log('Python version: ' + pythonVersion);

console.log("Unzipping Python binary from " + 
    binarySrcDir + 
    " to " + 
    binaryDestDir);
removeSync(binaryDestDir);
ensureDirSync(binaryDestDir);

// Use tar to extract the .tar.gz file
tar.x({
    file: binarySrcDir,
    cwd: binaryDestDir,
    sync: true,
    strip: 1
});

console.log("Copied Python binary to ", binaryDestDir);

const binPath = join(import.meta.dirname, 'resources/python/bin');
console.log("Bin Path: ", binPath);

// Add execute permissions
fs.chmod(binPath, 0o755, (err) => {
    if (err) {
        console.log(`Error setting permissions: ${err}`);
    } else {
        console.log("Set execute permissions on ", binPath);
    }
});