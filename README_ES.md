# Guía de Contribución a la Documentación de RustFS

¡Bienvenido a la comunidad RustFS! Realmente apreciamos tu interés en contribuir a nuestra documentación. Tu contribución, ya sea corrigiendo un error tipográfico o traduciendo una guía completa, es importante para nosotros. Esta guía tiene como objetivo proporcionarte instrucciones claras para ayudarte a participar sin problemas en la construcción conjunta de la documentación de RustFS.

<p align="center">
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README.md">English</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">简体中文</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_JA.md">日本語</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_DA.md">Deutsch</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_FR.md">Français</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_TR.md">Türkçe</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_KO.md">한국어</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_PT.md">Português</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_RU.md">Русский</a> |
  Español
</p>

------

### Tabla de Contenidos

1. [¿Qué es RustFS?](#1-qué-es-rustfs)
2. [Nuestra Misión: Datos Accesibles y Seguros para Todos](#2-nuestra-misión-datos-accesibles-y-seguros-para-todos)
3. [Tu Viaje de Contribución](#3-tu-viaje-de-contribución)
   - [Comenzando: Tu Primera Contribución](#31-comenzando-tu-primera-contribución)
   - [Traducir la Documentación: Agregar un Nuevo Idioma](#32-traducir-la-documentación-agregar-un-nuevo-idioma)
4. [El Flujo de Trabajo Técnico](#4-el-flujo-de-trabajo-técnico)
   - [Prerrequisitos](#41-prerrequisitos)
   - [Configuración de Desarrollo Local](#42-configuración-de-desarrollo-local)
   - [Directrices de Pull Request (PR) y Commits](#43-directrices-de-pull-request-pr-y-commits)
   - [Verificaciones Automatizadas y Despliegue](#44-verificaciones-automatizadas-y-despliegue)
5. [Comunidad y Licenciamiento](#5-comunidad-y-licenciamiento)
   - [Agradecimientos](#51-agradecimientos)
   - [Licencia de Contenido](#52-licencia-de-contenido)

### 1. ¿Qué es RustFS?

RustFS es una solución de almacenamiento de objetos distribuida, simple y de alto rendimiento. Es 100% compatible con S3 y se publica bajo la licencia Apache 2.0, lo que la convierte en un software de código abierto amigable para uso comercial.

Escrito completamente en Rust—el lenguaje de programación moderno conocido por su seguridad de memoria y rendimiento excepcional¹—RustFS es desarrollado por una comunidad global de ingenieros talentosos. Está diseñado para ser una alternativa de código abierto poderosa y confiable, y puede servir como reemplazo directo para productos como MinIO.²

### 2. Nuestra Misión: Datos Accesibles y Seguros para Todos

Creemos que el almacenamiento de datos debe ser asequible, confiable y seguro para todos, en todas partes.

La documentación de alta calidad y multilingüe es central para esta misión. No es solo un complemento; es clave para reducir la barrera de entrada para usuarios y desarrolladores de todo el mundo. Cuando traduces una guía o corriges un error, estás ayudando directamente a personas de diferentes comunidades lingüísticas a construir más fácilmente infraestructuras de datos robustas y rentables. Tus contribuciones empoderan a una audiencia global, mejorando colectivamente la seguridad y soberanía de los datos. Este enfoque comunitario para compartir conocimiento maximiza el valor del proyecto y nos ayuda a realizar verdaderamente nuestra visión.⁴

### 3. Tu Viaje de Contribución

Hemos diseñado diferentes caminos para varios tipos de contribuidores. Ya sea que quieras corregir rápidamente un pequeño problema o traducir sistemáticamente toda la documentación, encontrarás la guía adecuada aquí.

#### 3.1 Comenzando: Tu Primera Contribución

La forma más fácil de comenzar es haciendo pequeñas ediciones directamente a través de la interfaz web de GitHub. Este método no requiere configuración de desarrollo local y es perfecto para cambios menores.⁶

Las contribuciones simples que puedes hacer incluyen:

- Corregir errores tipográficos o gramaticales.
- Corregir enlaces rotos.
- Aclarar oraciones o párrafos confusos.
- Reportar un problema para algo que no sabes cómo arreglar.

**El Proceso de Pull Request de "5 Minutos":**

1. Navega a la página que quieres editar en el sitio de documentación `https://docs.rustfs.com/`.
2. Desplázate hacia abajo y haz clic en el enlace "Edit this page on GitHub".
3. Esto te llevará al archivo fuente Markdown correspondiente en GitHub. Haz clic en el ícono del lápiz (✏️) en la esquina superior derecha para entrar al modo de edición.
4. Haz tus cambios en el editor de texto.
5. Cuando termines, desplázate hacia abajo. En la sección "Propose changes", escribe un mensaje de commit conciso, por ejemplo, "Fix typo in installation guide."
6. Haz clic en el botón "Propose changes". GitHub te guiará entonces a través del proceso de crear un pull request.

Este proceso sirve como una excelente "rampa de entrada para contribuidores", permitiéndote familiarizarte con nuestro flujo de trabajo sin ninguna configuración compleja. Una contribución ligera exitosa es a menudo el primer paso hacia un compromiso más profundo.⁵

#### 3.2 Traducir la Documentación: Agregar un Nuevo Idioma

Esta es el área central donde más necesitamos la ayuda de la comunidad. Por favor, sigue estos pasos para agregar o mejorar traducciones.

**Paso 1: Coordinación a través de GitHub Issues**

Para evitar trabajo duplicado y asegurar colaboración, por favor visita nuestra **[página de GitHub Issues](https://github.com/rustfs/rustfs/issues)** antes de comenzar a traducir.

- **Agregar un Nuevo Idioma**: Verifica si alguien más ya está trabajando en el idioma que quieres traducir. Si no, por favor crea un nuevo issue con el título `[i18n] Add <Language> (<lang-code>) Translation`, por ejemplo, `[i18n] Add German (de) Translation`. Esto nos ayuda a rastrear el progreso y asignar propiedad.⁷
- **Mejorar una Traducción Existente**: Si quieres mejorar una traducción existente, encuentra el issue relevante o crea uno nuevo detallando las mejoras que planeas hacer.

**Paso 2: Entender la Estructura de Directorios**

Nuestro sitio de documentación está construido con VitePress, que usa una estructura de directorios basada en archivos para manejar múltiples idiomas.⁹ Todos los archivos fuente están ubicados en el directorio `docs/`.

```
docs/
├── en/                  # Inglés (o como directorio raíz)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # Japonés
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # Archivo de configuración de VitePress
```

**Paso 3: Agregar un Nuevo Paquete de Idioma**

1. **Fork y clona** el repositorio a tu máquina local, luego crea una nueva rama.

2. En el directorio `docs/`, crea una nueva carpeta usando el **código de idioma ISO 639-1** correspondiente para tu idioma objetivo. Por favor, consulta la tabla de códigos de idioma a continuación.

3. Copia **todo el contenido** de `docs/en/` (o los archivos fuente en inglés en la raíz) a tu nueva carpeta de idioma. Esto te proporciona una estructura de archivos completa para traducir.

4. Abre el archivo `docs/.vitepress/config.ts` y agrega una nueva entrada para tu idioma en el objeto `locales`.

   Por ejemplo, para agregar alemán (`de`):

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'

   export default defineConfig({
     //... otras configuraciones
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // Agrega la nueva configuración de locale aquí
       de: {
         label: 'Deutsch', // Texto en el menú desplegable de idiomas
         lang: 'de',       // Atributo lang de HTML
         link: '/de/',     // Enlace de redirección
         // Puedes sobrescribir configuraciones de tema para esta locale,
         // por ejemplo, para textos de navbar y sidebar.
         themeConfig: {
           nav: [
             { text: 'Anleitung', link: '/de/guide/getting-started' }
           ],
           sidebar: {
             '/de/guide/':
               }
             ]
           }
         }
       }
     }
   })
   ```

   Para ayudarte a configurar esto correctamente, la siguiente tabla explica el propósito de cada propiedad en el objeto `locales`.⁹

| Propiedad     | Tipo     | Requerido | Descripción                                                  |
| ------------- | -------- | --------- | ------------------------------------------------------------ |
| `label`       | `string` | Sí        | El texto que aparece en el menú desplegable de selección de idioma en la barra de navegación. |
| `lang`        | `string` | No        | El atributo `lang` para la etiqueta `<html>`. Usa el nombre del directorio si no se especifica. |
| `link`        | `string` | No        | El enlace al que el usuario es redirigido al seleccionar este idioma. Por defecto, la ruta raíz de la locale (por ejemplo, `/ja/`). |
| `title`       | `string` | No        | Sobrescribe el título principal del sitio para esta locale específica. |
| `description` | `string` | No        | Sobrescribe la descripción principal del sitio para esta locale específica. |
| `themeConfig` | `object` | No        | Configuración de tema específica para la locale. Se usa para traducir enlaces de navbar, texto de sidebar, etc. |

```
Esta tabla está diseñada para eliminar la ambigüedad en la configuración, asegurando que los contribuidores puedan hacerlo correctamente la primera vez y reduciendo la necesidad de revisiones de ida y vuelta.
```

**Paso 4: Traducir el Contenido**

- En tu nuevo directorio de idioma, abre los archivos Markdown uno por uno y traduce el contenido de texto.
- **Importante**: Por favor **no** traduzcas lo siguiente:
  - Claves en el frontmatter (por ejemplo, `title:`, `layout:`).
  - Cualquier código dentro de bloques de código.
  - Enlaces URL.
  - Etiquetas HTML.
- Solo traduce el texto legible por humanos.

**Paso 5: Enviar tu Pull Request**

Una vez que hayas terminado de traducir, por favor sigue las [Directrices de Pull Request (PR) y Commits](#43-directrices-de-pull-request-pr-y-commits) para enviar tu contribución, y asegúrate de vincularla al issue que creaste en el Paso 1.

**Referencia de Códigos de Idioma**

Para garantizar consistencia, por favor usa los códigos ISO 639-1 estándar de la tabla a continuación.¹³

| Idioma              | Código ISO 639-1  |
| ------------------- | ----------------- |
| Chino (Simplificado) | `zh` o `zh-CN`    |
| Inglés              | `en`              |
| Japonés             | `ja`              |
| Alemán              | `de`              |
| Francés             | `fr`              |
| Español             | `es`              |
| Coreano             | `ko`              |
| Portugués           | `pt`              |
| Ruso                | `ru`              |
| Turco               | `tr`              |

### 4. El Flujo de Trabajo Técnico

Para desarrolladores que deseen hacer contribuciones más sustanciales localmente (como agregar un nuevo paquete de idioma o hacer cambios extensos), por favor sigue este flujo de trabajo técnico.

#### 4.1 Prerrequisitos

Antes de comenzar, por favor asegúrate de tener el siguiente software instalado en tu sistema:

- **Node.js**: Versión `18.x` o superior.¹⁴ Puedes descargarlo desde el [sitio web oficial de Node.js](https://nodejs.org/).

- **Gestor de Paquetes**: Recomendamos usar `pnpm` para eficiencia. Puedes instalarlo globalmente con `npm install -g pnpm`. Alternativamente, puedes usar `npm` o `yarn`.¹⁵

- **Git**: Un sistema de control de versiones. Puedes descargarlo desde el [sitio web oficial de Git](https://git-scm.com/).

#### 4.2 Configuración de Desarrollo Local

Sigue esta secuencia de comandos para ejecutar el servidor de desarrollo de documentación localmente:

1. Fork y Clonar el Repositorio

   Primero, fork este repositorio en GitHub. Luego, clona tu fork a tu máquina local.

   Bash

   ```
   # Reemplaza <YOUR_USERNAME> con tu nombre de usuario de GitHub
   git clone https://github.com/<YOUR_USERNAME>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. Instalar Dependencias

   Usa pnpm para instalar todas las dependencias requeridas del proyecto.

   Bash

   ```
   pnpm install
   ```

3. Ejecutar el Servidor de Desarrollo

   Este comando iniciará un servidor de desarrollo local con recarga en caliente habilitada.

   Bash

   ```
   pnpm docs:dev
   ```

4. Acceder al Sitio

   Después de la ejecución exitosa, deberías ver una salida en tu terminal similar a VitePress dev server running at: <http://localhost:5173/>. Abre esta URL en tu navegador para ver el sitio de documentación. Cualquier cambio que hagas a los archivos Markdown se reflejará instantáneamente en el navegador.¹⁵

#### 4.3 Directrices de Pull Request (PR) y Commits

Seguimos un flujo de trabajo estandarizado para asegurar la calidad del código y un historial de proyecto limpio.

- **Estrategia de Ramas**

  - Siempre crea una nueva rama para tu trabajo. No hagas commit directamente a la rama `main`.
  - Usa un nombre de rama descriptivo, como `feat/add-german-translation` o `fix/correct-s3-api-typo`.¹⁷

- Convención de Mensajes de Commit

  Adherimos a la especificación Conventional Commits. Esto nos ayuda a automatizar changelogs y hace el historial de commits más fácil de entender.

  - **Formato**: `<type>(<scope>): <subject>`

  - **Ejemplos**:

    - `feat(i18n): add initial french translation`

    - `fix(guide): correct typo in getting-started.md`

    - docs(contributing): update local development setup

      Este enfoque estructurado es una mejor práctica en muchos proyectos de código abierto maduros.⁸

- **Enviar un Pull Request**

  1. Empuja tu rama a tu fork: `git push -u origin your-branch-name`.
  2. En GitHub, abre un pull request desde tu fork hacia la rama `main` del repositorio `rustfs/docs.rustfs.com`.
  3. **Vincular el Issue**: En la descripción del PR, usa palabras clave como `Closes #123` o `Fixes #123` para vincular el issue que creaste anteriormente. Esto cerrará automáticamente el issue cuando el PR sea fusionado, un paso clave en la automatización de nuestro flujo de trabajo.⁷
  4. **Escribir una Descripción Clara**: Explica claramente **qué** cambiaste y **por qué**. Si tus cambios son visuales, por favor incluye capturas de pantalla antes y después.⁵

- **El Proceso de Revisión**

  - Una vez que envíes un PR, un mantenedor del proyecto lo revisará.
  - Podemos solicitar cambios. ¡Por favor no te desanimes! Esto es una parte normal del desarrollo de código abierto colaborativo dirigido a mejorar la calidad de las contribuciones.
  - Una vez que tu PR sea aprobado y todas las verificaciones automatizadas hayan pasado, un mantenedor lo fusionará.

#### 4.4 Verificaciones Automatizadas y Despliegue

Para asegurar la calidad y estabilidad de nuestra documentación, tenemos un pipeline CI/CD (Integración Continua/Despliegue Continuo) completamente automatizado.

- **Verificaciones Automatizadas**: Cuando envíes un pull request, GitHub Actions ejecutará automáticamente una serie de verificaciones. Estas verificaciones verifican que el sitio de documentación se construya exitosamente y que el formato del código sea correcto (linting).¹⁹
- **Despliegue Automatizado**: Una vez que tu PR sea fusionado en la rama `main`, GitHub Actions se disparará nuevamente, construyendo automáticamente la última versión del sitio y desplegándola a `https://docs.rustfs.com`.

Al hacer este proceso transparente, apuntamos a construir la confianza de los contribuidores en nuestro flujo de trabajo. No necesitas preocuparte por los detalles del despliegue; una fusión exitosa significa un despliegue exitoso. Esto te da una vista clara de todo el ciclo de vida de tu contribución, desde el envío hasta la publicación.¹⁹

### 5. Comunidad y Licenciamiento

#### 5.1 Agradecimientos

La documentación de RustFS es construida por la comunidad, para la comunidad. Estamos increíblemente agradecidos con todos los que contribuyen su tiempo y experiencia.

Cada contribución, sin importar cuán pequeña, es altamente valorada. Para reconocer todas las contribuciones de manera justa y transparente, usamos las herramientas integradas de GitHub.

Puedes ver una lista de todos nuestros increíbles contribuidores en el **[gráfico de contribuidores](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)**. Este enfoque automatizado y escalable asegura que cada contribución sea reconocida y siempre esté actualizada.²²

#### 5.2 Licencia de Contenido

Toda la documentación en este proyecto está licenciada bajo la **Licencia Internacional Creative Commons Attribution 4.0**.²³

Al contribuir al proyecto de documentación de RustFS, aceptas que tus contribuciones serán publicadas bajo esta licencia.

Bajo esta licencia, eres libre de:

- **Compartir** — copiar y redistribuir el material en cualquier medio o formato.
- **Adaptar** — remezclar, transformar y construir sobre el material para cualquier propósito, incluso comercialmente.

Debes seguir estos términos:

- **Atribución** — Debes dar **crédito apropiado**, proporcionar un enlace a la licencia, y **indicar si se hicieron cambios**. Puedes hacerlo de cualquier manera razonable, pero no de ninguna manera que sugiera que el licenciante te respalda a ti o a tu uso.²³
