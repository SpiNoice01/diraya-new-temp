// Script untuk verify bahwa semua dummy data sudah diganti dengan database
const fs = require('fs')
const path = require('path')

const excludeDirs = ['node_modules', '.git', '.next', 'scripts', 'lib/data']
const includeExts = ['.tsx', '.ts', '.js', '.jsx']

function findDummyImports(dir = '.', results = []) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (!excludeDirs.some(excluded => filePath.includes(excluded))) {
        findDummyImports(filePath, results)
      }
    } else if (includeExts.some(ext => file.endsWith(ext))) {
      const content = fs.readFileSync(filePath, 'utf8')
      
      // Check for imports from lib/data
      const dummyImports = []
      const lines = content.split('\n')
      
      lines.forEach((line, index) => {
        if (line.includes('from "@/lib/data/') || line.includes("from '@/lib/data/")) {
          dummyImports.push({
            file: filePath,
            line: index + 1,
            content: line.trim()
          })
        }
      })
      
      if (dummyImports.length > 0) {
        results.push({
          file: filePath,
          imports: dummyImports
        })
      }
    }
  }
  
  return results
}

function main() {
  console.log('🔍 Scanning for dummy data imports...\n')
  
  const dummyImports = findDummyImports()
  
  if (dummyImports.length === 0) {
    console.log('✅ SUCCESS: No dummy data imports found!')
    console.log('🎉 All components are now using database data')
    return
  }
  
  console.log(`❌ FOUND ${dummyImports.length} files still using dummy data:\n`)
  
  dummyImports.forEach((fileInfo, index) => {
    console.log(`${index + 1}. 📄 ${fileInfo.file}`)
    fileInfo.imports.forEach(imp => {
      console.log(`   Line ${imp.line}: ${imp.content}`)
    })
    console.log()
  })
  
  console.log('🔧 Files that need to be updated:')
  dummyImports.forEach(fileInfo => {
    console.log(`   - ${fileInfo.file}`)
  })
  
  console.log('\n💡 Next steps:')
  console.log('1. Update these files to use database services instead')
  console.log('2. Replace dummy imports with appropriate database services')
  console.log('3. Add loading states and error handling')
  console.log('4. Test the updated components')
}

main()
