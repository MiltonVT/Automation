# PlaywrightTest

Este proyecto utiliza Playwright para la automatización de pruebas end-to-end en aplicaciones web. A continuación, se describe la estructura del proyecto, el propósito de cada archivo/carpeta y el funcionamiento general de la arquitectura.

## Estructura del Proyecto

```
Studio/
├── package.json                # Dependencias y scripts del proyecto
├── playwright.config.ts        # Configuración global de Playwright
├── playwright-report/          # Reportes generados por Playwright
│   └── index.html              # Reporte HTML de las ejecuciones
├── src/
│   ├── fixtures/
│   │   └── testFixture.ts      # Fixtures personalizados para los tests
│   ├── pages/
│   │   ├── BasePage.ts         # Clase base para páginas (Page Object Model)
│   │   ├── LoginPage.ts        # Page Object para la página de login
│   │   ├── SettingsPage.ts     # Page Object para la página de configuración
│   │   └── StudioPage.ts       # Page Object para la página principal del Studio
│   ├── tests/
│   │   ├── settings.spec.ts    # Pruebas automatizadas para la configuración
│   │   └── studio.spec.ts      # Pruebas automatizadas para el Studio
│   └── utils/
│       └── constants.ts        # Constantes reutilizables en los tests
├── test-results/               # Resultados de las ejecuciones de pruebas
└── tests/
    └── example.spec.ts         # Ejemplo de prueba Playwright
```

## Descripción de Archivos y Carpetas

- **package.json**: Define las dependencias, scripts y metadatos del proyecto.
- **playwright.config.ts**: Archivo de configuración principal de Playwright (timeout, browsers, reporter, etc).
- **playwright-report/**: Carpeta donde Playwright genera los reportes visuales tras ejecutar las pruebas.
- **src/**: Contiene el código fuente de los tests y utilidades.
  - **fixtures/**: Fixtures personalizados para inicializar datos, usuarios, o estados antes de los tests.
  - **pages/**: Implementación del patrón Page Object Model. Cada archivo representa una página o sección de la aplicación, encapsulando selectores y métodos de interacción.
  - **tests/**: Archivos de pruebas automatizadas, organizados por funcionalidad o módulo.
  - **utils/**: Utilidades y constantes reutilizables en los tests.
- **test-results/**: Resultados crudos de las ejecuciones de pruebas (logs, capturas, etc).
- **tests/**: Ejemplos o pruebas adicionales.

## Funcionamiento de la Arquitectura

El proyecto sigue el patrón **Page Object Model (POM)**, que facilita el mantenimiento y escalabilidad de las pruebas:

1. **Page Objects**: Cada página relevante de la aplicación tiene su propia clase en `src/pages/`, donde se definen los selectores y métodos para interactuar con la UI.
2. **Fixtures**: En `src/fixtures/` se definen datos o configuraciones que se comparten entre tests, permitiendo inicializar el entorno de pruebas de forma flexible.
3. **Tests**: Los archivos en `src/tests/` importan los Page Objects y Fixtures para escribir pruebas legibles y reutilizables.
4. **Utilidades**: Constantes y funciones auxiliares en `src/utils/` ayudan a evitar duplicidad de código.
5. **Ejecución y Reportes**: Al ejecutar los tests (por ejemplo, con `npx playwright test`), los resultados se almacenan en `test-results/` y los reportes visuales en `playwright-report/`.

## Ejecución de Pruebas

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Ejecuta las pruebas:
   ```bash
   npx playwright test
   ```
3. Visualiza el reporte:
   ```bash
   npx playwright show-report
   ```

## Notas
- Modifica `playwright.config.ts` para ajustar la configuración según tus necesidades.
- Agrega nuevos Page Objects en `src/pages/` para cubrir más funcionalidades.
- Usa fixtures para compartir lógica o datos entre tests.

---

**Autor:** Equipo de Automatización
