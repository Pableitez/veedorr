# Veedor — Control sencillo de tus finanzas

Aplicación web gratuita de finanzas personales para España. Controla gastos, crea presupuestos y visualiza tu economía con total privacidad. Sin registro, datos privados.

## 🚀 Características

- **💰 Gestión completa** de transacciones, presupuestos y categorías
- **📊 Dashboard visual** con gráficos y KPIs financieros
- **📁 Importación/Exportación** CSV y JSON para respaldos
- **🌙 UX dark-first** con tema claro/oscuro automático
- **♿ Accesibilidad WCAG AA** con navegación por teclado
- **📱 Responsive** optimizado para móvil y escritorio
- **🔒 Privacidad total** - datos solo en tu navegador
- **🇪🇸 Formato español** fechas (dd/mm/yyyy) e importes (EUR)

## 🛠️ Stack Tecnológico

- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **Vitest** - Testing framework
- **ESLint + Prettier** - Linting y formateo
- **Vanilla JS** - Sin frameworks, máximo rendimiento

## 📁 Estructura del Proyecto

```
src/
├── domain/           # Entidades y lógica de negocio
│   ├── entities/
│   ├── repositories/
│   └── services/
├── application/      # Casos de uso y servicios
│   ├── use-cases/
│   └── services/
├── infrastructure/   # Adaptadores externos
│   ├── repositories/
│   ├── storage/
│   └── routing/
├── ui/              # Componentes y páginas
│   ├── components/
│   ├── pages/
│   └── layouts/
└── shared/          # Utilidades compartidas
    ├── utils/
    ├── types/
    └── constants/
```

## 🚀 Cómo Arrancar

### Prerrequisitos

- Node.js 18+ 
- npm, yarn o pnpm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/veedor.git
   cd veedor
   ```

2. **Instalar dependencias**
   ```bash
   # Con npm
   npm install
   
   # Con pnpm (recomendado)
   pnpm install
   
   # Con yarn
   yarn install
   ```

3. **Arrancar en modo desarrollo**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

4. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:3000`
   - O navega manualmente a la URL mostrada en la terminal

### Despliegue en Producción

#### GitHub Pages (Automático)
1. Haz fork del repositorio
2. Ve a Settings → Pages
3. Selecciona "GitHub Actions" como fuente
4. Los cambios en `main` se desplegarán automáticamente

#### Despliegue Manual
```bash
# Construir para producción
npm run build
# o
pnpm build

# Previsualizar build local
npm run preview
# o
pnpm preview
```

#### Otros Proveedores
- **Vercel**: `vercel --prod`
- **Netlify**: Arrastra la carpeta `dist/`
- **Firebase**: `firebase deploy`

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Arrancar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción

# Testing
npm run test         # Ejecutar tests
npm run test:ui      # Ejecutar tests con UI

# Linting y Formateo
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint
npm run format       # Formatear código con Prettier
npm run type-check   # Verificar tipos de TypeScript
```

## 🏗️ Arquitectura

### Domain Layer
- **Entidades**: `Transaction`, `Budget`, `Settings`
- **Repositorios**: Interfaces abstractas (`ITransactionRepository`, `IBudgetRepository`)
- **Servicios**: Lógica de negocio pura

### Application Layer
- **Use Cases**: Casos de uso específicos
- **Servicios**: Servicios de aplicación

### Infrastructure Layer
- **Repositorios**: Implementaciones concretas (LocalStorage)
- **Store**: Sistema de estado con publisher/subscriber
- **Routing**: Router por hash con interfaz abstracta

### UI Layer
- **Componentes**: Componentes reutilizables
- **Páginas**: Páginas de la aplicación
- **Layouts**: Layouts principales

## 🔧 Configuración

### TypeScript
- Configuración estricta en `tsconfig.json`
- Path mapping configurado para imports limpios
- Tipos compartidos en `src/shared/types`

### ESLint + Prettier
- Configuración en `.eslintrc.cjs` y `.prettierrc`
- Reglas estrictas para TypeScript
- Formateo automático

### Vite
- Configuración en `vite.config.ts`
- Dev server en puerto 3000
- Build optimizado para producción

## 📁 Estructura CSV

### Formato de Importación
```csv
fecha;descripcion;categoria;importe
15/01/2024;Compra en supermercado;Comida;-45,50
16/01/2024;Sueldo;Ingresos;2500,00
17/01/2024;Alquiler;Vivienda;-800,00
```

**Campos requeridos:**
- `fecha`: Formato dd/mm/yyyy (ej: 15/01/2024)
- `descripcion`: Descripción de la transacción
- `categoria`: Nombre de la categoría (opcional)
- `importe`: Importe con coma decimal (ej: -45,50, 2500,00)

**Formato de importe:**
- Usar coma (,) como separador decimal
- Usar punto (.) como separador de miles (opcional)
- Negativo para gastos, positivo para ingresos
- Ejemplos: `-45,50`, `2500,00`, `1.234,56`

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + N` | Nueva transacción |
| `Ctrl + I` | Importar CSV |
| `Ctrl + E` | Exportar datos |
| `Ctrl + T` | Cambiar tema |
| `Esc` | Cerrar modal |
| `Enter` | Confirmar formulario |

## 🔄 Cómo Resetear LocalStorage

### Opción 1: Desde la aplicación
1. Ve a Configuración (próximamente)
2. Busca "Resetear datos"
3. Confirma la acción

### Opción 2: Desde el navegador
1. **Chrome/Edge**: F12 → Application → Local Storage → `localhost:3000` → Clear All
2. **Firefox**: F12 → Storage → Local Storage → `localhost:3000` → Delete All
3. **Safari**: Cmd+Option+I → Storage → Local Storage → Clear All

### Opción 3: Código JavaScript
```javascript
// En la consola del navegador
localStorage.clear();
location.reload();
```

## 📱 Módulos Funcionales

### ✅ MVP0 - Base y Estructura
- [x] Configuración inicial del proyecto
- [x] Arquitectura de carpetas
- [x] Sistema de routing por hash
- [x] Store simple con publisher/subscriber
- [x] Configuración de herramientas

### ✅ MVP1 - Dominio y Tipado
- [x] Entidades del dominio (Transaction, Budget, Category, Settings)
- [x] Value Objects (MoneyEUR, EsDate, Id)
- [x] Interfaces de repositorio
- [x] Tests unitarios completos

### ✅ MVP2 - Infraestructura
- [x] Repositorios LocalStorage
- [x] Parser CSV para formato español
- [x] Datos de ejemplo (seeds)
- [x] Tests de infraestructura

### ✅ MVP3 - Store y Estado
- [x] Sistema de eventos y slices
- [x] Selectores puros para cálculos
- [x] Integración con repositorios
- [x] Tests de selectores

### ✅ MVP4 - UI y Componentes
- [x] Kit de componentes atómicos
- [x] Sistema de theming dark/light
- [x] Sidebar responsive
- [x] Página playground para testing

### ✅ MVP5 - Vistas Funcionales
- [x] Dashboard con KPIs y gráficos
- [x] Gestión completa de transacciones
- [x] Sistema de presupuestos
- [x] Validación española de formularios

### ✅ MVP6 - Importación/Exportación
- [x] Importador CSV con vista previa
- [x] Exportación CSV y JSON
- [x] Manejo de duplicados y errores
- [x] Tests de importación

### ✅ MVP7 - SEO y Producción
- [x] Páginas legales (privacidad, términos, cookies)
- [x] Meta tags SEO optimizados
- [x] Manifest PWA
- [x] Robots.txt y sitemap

## 🌍 Internacionalización

- **Idioma**: Español (es-ES)
- **Moneda**: Euro (EUR)
- **Formato de fecha**: dd/mm/yyyy
- **Formato de importe**: 1.234,56 €

## ♿ Accesibilidad

- Cumple estándares WCAG AA
- Navegación por teclado
- Contraste adecuado
- Etiquetas semánticas

## 🚀 Escalabilidad Futura

- **Backend**: Interfaz de repositorio lista para migración a REST API
- **Router**: Interfaz abstracta para cambiar a router real
- **Store**: Arquitectura preparada para Redux/Zustand si es necesario
- **Testing**: Vitest configurado para tests unitarios e integración

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.
