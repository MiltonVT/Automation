#!/usr/bin/env node

/**
 * Run Playwright tests with organized report directories
 * Usage: node scripts/runTestWithReports.js <test-file> <test-name> [playwright-args]
 * Example: node scripts/runTestWithReports.js studio publish --headed
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getReportPath, ensureReportsArchiveDir } = require('./generateReportName');

/**
 * Rename screenshots to include the test name
 * Converts "test-finished-1.png" to "test-name-1.png"
 */
function renameScreenshots(testResultsDir, testName) {
  try {
    // Sanitize test name for file naming
    const sanitizedName = testName
      .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special characters with -
      .toLowerCase()
      .replace(/--+/g, '-') // Replace multiple dashes with single dash
      .slice(0, 50); // Limit length
    
    // Find and rename screenshot files
    const files = fs.readdirSync(testResultsDir);
    let screenshotCount = 0;
    
    files.forEach(file => {
      if (file.startsWith('test-finished-') && file.endsWith('.png')) {
        const oldPath = path.join(testResultsDir, file);
        const num = screenshotCount + 1;
        const newFileName = `${sanitizedName}-${num}.png`;
        const newPath = path.join(testResultsDir, newFileName);
        
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`  ✏️  Renamed: ${file} → ${newFileName}`);
          screenshotCount++;
        } catch (err) {
          console.log(`  ⚠️  Could not rename ${file}: ${err.message}`);
        }
      }
    });
    
    if (screenshotCount > 0) {
      console.log(`✅ ${screenshotCount} screenshot(s) renamed with test name`);
    }
  } catch (err) {
    console.log(`⚠️  Error renaming screenshots: ${err.message}`);
  }
}

function runTest(testFile, testName, additionalArgs = []) {
  // Ensure reports archive directory exists
  ensureReportsArchiveDir();
  
  // Get unique report path
  const reportPath = getReportPath(testName);
  const htmlReportDir = path.join(reportPath, 'html-report');
  const defaultReportDir = 'html-report';
  
  // Create directories if they don't exist
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  console.log(`📁 Report directory: ${reportPath}`);
  console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);
  console.log(`🧪 Test: ${testName || 'all tests'}`);
  console.log(`📄 File: ${testFile}`);
  console.log('---\n');
  
  // Build playwright command
  const testSpec = testFile.includes('.spec.ts') 
    ? `src/tests/${testFile}.spec.ts`
    : `src/tests/${testFile}.spec.ts`;
  
  const args = [
    'playwright',
    'test',
    testSpec,
  ];
  
  // Add grep if test name is provided
  if (testName && testName !== 'all') {
    args.push('--grep');
    // Remove surrounding quotes if present
    const cleanTestName = testName.replace(/^['"]|['"]$/g, '');
    args.push(cleanTestName);
  }
  
  // Add any additional arguments
  args.push(...additionalArgs);
  
  // Build command with proper quoting for arguments with spaces
  let displayCommand = 'npx playwright test ' + testSpec;
  if (testName && testName !== 'all') {
    const cleanTestName = testName.replace(/^['"]|['"]$/g, '');
    displayCommand += ` --grep "${cleanTestName}"`;
  }
  if (additionalArgs.length > 0) {
    displayCommand += ' ' + additionalArgs.join(' ');
  }
  
  console.log(`🚀 Running: ${displayCommand}\n`);
  
  try {
    // Set environment variable for the report output folder
    const env = process.env;
    env.PLAYWRIGHT_HTML_REPORT_DIR = htmlReportDir;
    
    // Execute playwright test directly with environment variable
    console.log(`📌 Setting PLAYWRIGHT_HTML_REPORT_DIR: ${htmlReportDir}`);
    execSync(displayCommand, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: env
    });
    
    // Move test-results directory to archive location
    const defaultTestResultsDir = path.join(__dirname, '..', 'test-results');
    const testResultsArchiveDir = path.join(reportPath, 'test-results');
    
    if (fs.existsSync(defaultTestResultsDir)) {
      if (!fs.existsSync(testResultsArchiveDir)) {
        fs.mkdirSync(testResultsArchiveDir, { recursive: true });
      }
      
      console.log(`\n📋 Moving test results (screenshots, traces, etc)...`);
      
      // Copy all files from test-results to archive
      const copyFiles = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          
          if (fs.lstatSync(srcPath).isDirectory()) {
            copyFiles(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        });
      };
      
      try {
        copyFiles(defaultTestResultsDir, testResultsArchiveDir);
        console.log(`✅ Test results copied`);
        
        // Rename screenshots with test names
        renameScreenshots(testResultsArchiveDir, testName);
      } catch (copyErr) {
        console.log(`⚠️  Could not copy test results: ${copyErr.message}`);
      }
    }
    
    console.log(`\n✅ Tests completed successfully!`);
    console.log(`📁 Results saved in: ${reportPath}`);
    console.log(`📊 View report: ${path.join(htmlReportDir, 'index.html')}`);
    console.log(`📸 Screenshots at: ${testResultsArchiveDir}`);
    process.exit(0);
  } catch (err) {
    console.log(`\n❌ Tests failed or ended with error`);
    console.log(`Error details: ${err.message}`);    
    console.log(`📁 Results saved in: ${reportPath}`);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const testFile = args[0] || 'studio';
const testName = args[1] || 'Login';
const additionalArgs = args.slice(2);

// Run the test
runTest(testFile, testName, additionalArgs);
