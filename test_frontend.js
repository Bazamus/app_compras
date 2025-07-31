const https = require('https');

console.log('🔍 VERIFICANDO FRONTEND - VERSIÓN 2.1');
console.log('=======================================\n');

// Función para hacer peticiones HTTPS
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testFrontend() {
  try {
    console.log('1️⃣ Verificando variables de entorno del backend...');
    const envCheck = await makeRequest('https://appcompras.netlify.app/.netlify/functions/index/env-check');
    console.log(`   ✅ Status: ${envCheck.statusCode}`);
    console.log(`   📄 Respuesta: ${envCheck.data}`);
    
    console.log('\n2️⃣ Verificando endpoint de debug...');
    const debug = await makeRequest('https://appcompras.netlify.app/.netlify/functions/index/debug');
    console.log(`   ✅ Status: ${debug.statusCode}`);
    console.log(`   📄 Respuesta: ${debug.data.substring(0, 200)}...`);
    
    console.log('\n3️⃣ Verificando página principal...');
    const mainPage = await makeRequest('https://appcompras.netlify.app/');
    console.log(`   ✅ Status: ${mainPage.statusCode}`);
    console.log(`   📄 Tamaño HTML: ${mainPage.data.length} caracteres`);
    
    // Buscar indicadores de la versión en el HTML
    const hasVersion21 = mainPage.data.includes('VERSIÓN 2.1');
    const hasDebugLog = mainPage.data.includes('APP CARGADA');
    console.log(`   🔍 Contiene VERSIÓN 2.1: ${hasVersion21 ? '✅' : '❌'}`);
    console.log(`   🔍 Contiene debug logs: ${hasDebugLog ? '✅' : '❌'}`);
    
    console.log('\n4️⃣ Verificando archivo de prueba...');
    const testFile = await makeRequest('https://appcompras.netlify.app/test-deploy.txt');
    console.log(`   ✅ Status: ${testFile.statusCode}`);
    console.log(`   📄 Contenido: ${testFile.data.substring(0, 100)}...`);
    
    console.log('\n🎯 DIAGNÓSTICO:');
    console.log('================');
    
    if (hasVersion21 && hasDebugLog) {
      console.log('✅ Frontend actualizado correctamente');
      console.log('✅ Código de debug presente');
      console.log('❓ Problema: Variables de entorno o comunicación API');
    } else {
      console.log('❌ Frontend NO actualizado');
      console.log('❌ Código de debug ausente');
      console.log('🔧 Solución: Forzar rebuild o verificar cache');
    }
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Abrir https://appcompras.netlify.app en navegador');
    console.log('2. Abrir DevTools (F12)');
    console.log('3. Ir a la pestaña Console');
    console.log('4. Verificar si aparecen los logs de debug');
    console.log('5. Verificar si aparece el alert de debug');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
  }
}

testFrontend(); 