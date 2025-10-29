# ROADMAP - Migración a Backend

Este documento describe cómo migrar Veedor de una aplicación estática a una aplicación con backend, manteniendo la inversión de dependencias y sin tocar la UI ni los casos de uso.

## 🎯 Objetivos de la Migración

- **Mantener la UI intacta** - No cambiar componentes ni páginas
- **Preservar casos de uso** - Mantener la lógica de aplicación
- **Cambiar solo la infraestructura** - Solo los repositorios y servicios externos
- **Añadir autenticación** - Sistema de usuarios y sesiones
- **Escalabilidad** - Preparar para múltiples usuarios

## 🏗️ Arquitectura Actual vs Futura

### Estado Actual (Estático)
```
UI Layer (React/Vanilla) 
    ↓
Application Layer (Use Cases)
    ↓
Infrastructure Layer (LocalStorage Repos)
    ↓
Browser LocalStorage
```

### Estado Futuro (Con Backend)
```
UI Layer (React/Vanilla) 
    ↓
Application Layer (Use Cases) ← SIN CAMBIOS
    ↓
Infrastructure Layer (REST Repos + Auth)
    ↓
REST API + Database
```

## 📋 Plan de Migración

### Fase 1: Preparación de Infraestructura

#### 1.1 Crear Repositorios REST
Crear nuevas implementaciones de los repositorios que usen REST API:

```typescript
// src/infrastructure/repositories/RestTransactionRepository.ts
export class RestTransactionRepository implements ITransactionRepository {
  constructor(private apiClient: ApiClient) {}
  
  async findAll(): Promise<Transaction[]> {
    const response = await this.apiClient.get('/transactions');
    return response.data;
  }
  
  async add(transaction: CreateTransactionData): Promise<Transaction> {
    const response = await this.apiClient.post('/transactions', transaction);
    return response.data;
  }
  
  // ... resto de métodos
}
```

#### 1.2 Crear Cliente API
```typescript
// src/infrastructure/api/ApiClient.ts
export class ApiClient {
  constructor(private baseURL: string, private authToken?: string) {}
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Implementación HTTP GET
  }
  
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    // Implementación HTTP POST
  }
  
  // ... resto de métodos HTTP
}
```

#### 1.3 Servicio de Autenticación
```typescript
// src/infrastructure/auth/AuthService.ts
export class AuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    // Implementación de login
  }
  
  async register(userData: RegisterData): Promise<AuthResult> {
    // Implementación de registro
  }
  
  async logout(): Promise<void> {
    // Implementación de logout
  }
  
  getCurrentUser(): User | null {
    // Obtener usuario actual
  }
}
```

### Fase 2: Configuración de Inyección de Dependencias

#### 2.1 Factory de Repositorios
```typescript
// src/infrastructure/factories/RepositoryFactory.ts
export class RepositoryFactory {
  static createTransactionRepository(): ITransactionRepository {
    if (import.meta.env.PROD) {
      return new RestTransactionRepository(apiClient);
    } else {
      return new LocalStorageTransactionRepository();
    }
  }
  
  static createBudgetRepository(): IBudgetRepository {
    if (import.meta.env.PROD) {
      return new RestBudgetRepository(apiClient);
    } else {
      return new LocalStorageBudgetRepository();
    }
  }
  
  // ... resto de repositorios
}
```

#### 2.2 Configuración del Store
```typescript
// src/infrastructure/store/index.ts
const transactionRepo = RepositoryFactory.createTransactionRepository();
const budgetRepo = RepositoryFactory.createBudgetRepository();
const categoryRepo = RepositoryFactory.createCategoryRepository();
const settingsRepo = RepositoryFactory.createSettingsRepository();

export const store = createStore({
  transactionRepo,
  budgetRepo,
  categoryRepo,
  settingsRepo
});
```

### Fase 3: Backend API

#### 3.1 Estructura del Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/     # Controladores REST
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a datos
│   ├── middleware/      # Auth, CORS, etc.
│   ├── models/          # Modelos de base de datos
│   └── routes/          # Definición de rutas
├── prisma/             # Schema de base de datos
└── tests/              # Tests del backend
```

#### 3.2 Endpoints API
```typescript
// Rutas principales
GET    /api/transactions     # Listar transacciones
POST   /api/transactions     # Crear transacción
PUT    /api/transactions/:id # Actualizar transacción
DELETE /api/transactions/:id # Eliminar transacción

GET    /api/budgets          # Listar presupuestos
POST   /api/budgets          # Crear presupuesto
PUT    /api/budgets/:id      # Actualizar presupuesto
DELETE /api/budgets/:id      # Eliminar presupuesto

GET    /api/categories       # Listar categorías
POST   /api/categories       # Crear categoría

POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/register    # Registrarse
POST   /api/auth/logout      # Cerrar sesión
GET    /api/auth/me          # Usuario actual
```

#### 3.3 Autenticación JWT
```typescript
// Middleware de autenticación
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

### Fase 4: Base de Datos

#### 4.1 Schema de Base de Datos (PostgreSQL)
```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transacciones
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categories(id),
  fecha TIMESTAMP NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  importe_eur DECIMAL(10,2) NOT NULL,
  merchant VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Presupuestos
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  limite_mensual_eur DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Fase 5: Migración de Datos

#### 5.1 Script de Migración
```typescript
// scripts/migrate-local-to-backend.ts
export async function migrateLocalStorageToBackend() {
  // 1. Obtener datos del LocalStorage
  const localData = getLocalStorageData();
  
  // 2. Autenticar usuario
  const authResult = await authService.login(userEmail, userPassword);
  
  // 3. Migrar categorías
  for (const category of localData.categories) {
    await apiClient.post('/categories', category);
  }
  
  // 4. Migrar transacciones
  for (const transaction of localData.transactions) {
    await apiClient.post('/transactions', transaction);
  }
  
  // 5. Migrar presupuestos
  for (const budget of localData.budgets) {
    await apiClient.post('/budgets', budget);
  }
  
  // 6. Limpiar LocalStorage
  localStorage.clear();
}
```

## 🔧 Configuración de Variables de Entorno

### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.veedor.app
VITE_APP_NAME=Veedor
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/veedor
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://veedor.app
PORT=3001
```

## 🚀 Estrategia de Despliegue

### Opción 1: Monorepo
```
veedor/
├── frontend/          # Aplicación React/Vanilla
├── backend/           # API Node.js
├── shared/            # Tipos compartidos
└── docker-compose.yml # Orquestación
```

### Opción 2: Repositorios Separados
- `veedor-frontend` - Aplicación web
- `veedor-backend` - API REST
- `veedor-shared` - Tipos y utilidades compartidas

## 📊 Monitoreo y Analytics

### Métricas a Implementar
- **Performance**: Tiempo de carga, Core Web Vitals
- **Errores**: Tracking de errores frontend y backend
- **Uso**: Métricas de funcionalidades más usadas
- **Usuarios**: Registros, sesiones, retención

### Herramientas Sugeridas
- **Frontend**: Sentry, Google Analytics
- **Backend**: Winston, Prometheus
- **Base de datos**: PgAdmin, Database monitoring

## 🔒 Seguridad

### Frontend
- Validación de entrada en formularios
- Sanitización de datos
- HTTPS obligatorio
- Content Security Policy

### Backend
- Autenticación JWT con refresh tokens
- Rate limiting por IP y usuario
- Validación y sanitización de datos
- CORS configurado correctamente
- Logs de seguridad

### Base de Datos
- Encriptación de contraseñas (bcrypt)
- Índices para consultas eficientes
- Backups automáticos
- Conexiones seguras (SSL)

## 📈 Escalabilidad Futura

### Horizontal Scaling
- Load balancer para múltiples instancias
- CDN para assets estáticos
- Redis para sesiones y cache
- Microservicios por dominio

### Vertical Scaling
- Optimización de consultas SQL
- Caching inteligente
- Compresión de respuestas
- Lazy loading de datos

## 🧪 Testing Strategy

### Frontend
- Tests unitarios de componentes
- Tests de integración de casos de uso
- Tests E2E con Playwright
- Tests de accesibilidad

### Backend
- Tests unitarios de servicios
- Tests de integración de API
- Tests de carga
- Tests de seguridad

## 📝 Checklist de Migración

### Pre-migración
- [ ] Documentar APIs actuales
- [ ] Crear tests de regresión
- [ ] Preparar scripts de migración
- [ ] Configurar entorno de staging

### Durante la migración
- [ ] Implementar repositorios REST
- [ ] Crear backend API
- [ ] Configurar autenticación
- [ ] Migrar datos existentes
- [ ] Tests de integración

### Post-migración
- [ ] Monitoreo de errores
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Documentación actualizada
- [ ] Rollback plan listo

## 🎯 Beneficios de la Migración

### Para Usuarios
- **Sincronización** entre dispositivos
- **Respaldo automático** de datos
- **Colaboración** (futuro)
- **Notificaciones** push

### Para Desarrolladores
- **Analytics** de uso
- **Updates** automáticos
- **Debugging** mejorado
- **Escalabilidad** horizontal

### Para el Negocio
- **Monetización** (premium features)
- **Insights** de usuarios
- **Compliance** (GDPR, etc.)
- **Integración** con terceros

---

**Nota**: Esta migración está diseñada para ser gradual y no disruptiva. La UI y los casos de uso permanecen intactos, solo cambia la capa de infraestructura.
