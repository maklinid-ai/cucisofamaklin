const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const fromStatic = path.join(cwd, '.next', 'static')
const fromPublic = path.join(cwd, 'public')
const toStandalone = path.join(cwd, '.next', 'standalone')
const toStandaloneStatic = path.join(toStandalone, '.next', 'static')
const toStandalonePublic = path.join(toStandalone, 'public')

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory does not exist: ${src}`)
  }

  fs.mkdirSync(dest, { recursive: true })

  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name)
    const destPath = path.join(dest, name)
    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

try {
  copyDir(fromStatic, toStandaloneStatic)
  copyDir(fromPublic, toStandalonePublic)
  console.log('Static and public files copied successfully.')
} catch (error) {
  console.error(error)
  process.exit(1)
}
