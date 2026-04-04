const { execSync } = require('child_process');

try {
  const result = execSync('dfx ping', { encoding: 'utf-8' });
  const pingData = JSON.parse(result);
  
  console.log('dfx is running. Details:');
  console.log(`IC API Version: ${pingData.ic_api_version}`);
  console.log(`Implementation Version: ${pingData.impl_version}`);
  console.log(`Replica Health Status: ${pingData.replica_health_status}`);
  console.log(`Certified Height: ${pingData.certified_height}`);
} catch (error) {
  console.log('dfx is not running. Starting dfx...');
  execSync('dfx +0.24.3 start --clean --background', { stdio: 'inherit' });
}