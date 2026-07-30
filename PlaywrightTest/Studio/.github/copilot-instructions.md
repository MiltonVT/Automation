# Studio Playwright/TypeScript Coding Instructions

## Principios Fundamentales

### 1. Clean Architecture & POM por Componentes
- **Desacoplamiento:** Mantén la lógica de los tests separada de la implementación de la página.
- **POM Granular:** Divide las páginas en componentes reutilizables (Navbar, Sidebar, LoginForm, etc.) en vez de un único Page Object gigante.
- **Responsabilidad Única:** Los Page Objects solo deben conocer la estructura del DOM; las aserciones deben estar únicamente en los tests.

### 2. Fixtures Personalizados
- **No uses `beforeEach`** para configuración repetitiva. Encapsula el estado (login, datos, navegación) en fixtures personalizados.
- **Lazy Loading:** Las fixtures deben ejecutarse solo cuando el test las solicita explícitamente en sus argumentos.

### 3. Estrategia de Selectores
- **Prioridad Absoluta:** Usa solo selectores basados en `data-testid` (ej: `page.getByTestId('submit-button')`).
- **Prohibido:** No uses selectores frágiles como XPath, selectores de CSS por clases de estilo, o jerarquías profundas.

### 4. Métodos Orientados al Negocio
- Los métodos de los Page Objects deben expresar acciones del dominio, no detalles técnicos.
- **Ejemplo incorrecto:** `await loginPage.fillInputUser('admin')`
- **Ejemplo correcto:** `await loginPage.loginWithUser(CREDENTIALS.ADMIN)`
- Oculta la complejidad técnica dentro de métodos claros y de alto nivel.

### 5. Logging Estructurado
- Cada acción relevante debe dejar un rastro claro en consola/reporte.
- Usa el formato: `[Acción] -> [Entidad] : [Detalle]`.
- **Ejemplo:** `[Login] -> Formulario : Enviando credenciales de administrador.`

### 6. Pausas después de Búsquedas
- Después de realizar cualquier búsqueda (fill en un campo de búsqueda/search box), agrega siempre una pausa mínima de 1 segundo (`await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT)`) para dar tiempo a que los resultados se rendericen antes de continuar.
- Esto aplica a todos los campos de búsqueda: filtros de pantallas, búsqueda de componentes en el editor, búsqueda de plantillas, etc.

---

## Ejemplo de Prompt para el Agente
- "Crea un nuevo componente de formulario siguiendo las instrucciones de Clean Architecture y selectores data-testid."
- "Refactoriza este Page Object para dividirlo en componentes reutilizables."
- "Agrega logging estructurado a los métodos de negocio del LoginFormComponent."

## Siguiente Personalización Sugerida
- Crear una instrucción específica para la gestión de datos de prueba y su integración con fixtures.
- Definir reglas de versionado y documentación para nuevos componentes.
