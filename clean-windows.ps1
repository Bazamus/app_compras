# Script de limpieza para Windows PowerShell
# Uso: .\clean-windows.ps1

Write-Host "Limpiando node_modules y carpetas de build..." -ForegroundColor Green

# Función para eliminar carpetas de forma segura
function Remove-SafeDirectory {
    param([string]$Path)
    
    if (Test-Path $Path) {
        Write-Host "Eliminando: $Path" -ForegroundColor Yellow
        Remove-Item $Path -Recurse -Force -ErrorAction SilentlyContinue
        
        if (Test-Path $Path) {
            Write-Host "Advertencia: No se pudo eliminar completamente $Path" -ForegroundColor Red
        } else {
            Write-Host "Eliminado: $Path" -ForegroundColor Green
        }
    } else {
        Write-Host "No existe: $Path" -ForegroundColor Gray
    }
}

# Limpiar node_modules
Remove-SafeDirectory "node_modules"
Remove-SafeDirectory "backend\node_modules"
Remove-SafeDirectory "smartshop-frontend\node_modules"

# Limpiar carpetas de build
Remove-SafeDirectory "backend\dist"
Remove-SafeDirectory "smartshop-frontend\dist"

Write-Host "Limpieza completada!" -ForegroundColor Green
Write-Host "Ejecuta 'npm run install:all' para reinstalar las dependencias." -ForegroundColor Cyan 