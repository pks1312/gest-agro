# Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar tu aplicación GEST AGRO en Vercel.

## 📋 Requisitos Previos

1. **Cuenta en GitHub/GitLab/Bitbucket** (recomendado) o puedes subir directamente
2. **Cuenta en Vercel** (gratuita): https://vercel.com
3. **API Key de OpenAI** configurada

## 🚀 Pasos para Desplegar

### Paso 1: Preparar el Proyecto

1. **Asegúrate de que todo esté funcionando localmente:**
   ```bash
   npm run build
   ```
   Si hay errores, corrígelos antes de continuar.

2. **Verifica que el archivo `.env` NO esté en el repositorio:**
   - El archivo `.env` ya está en `.gitignore`, así que está bien.

### Paso 2: Subir a Git (Recomendado)

1. **Inicializa Git si no lo has hecho:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - GEST AGRO"
   ```

2. **Crea un repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un nuevo repositorio (público o privado)
   - NO inicialices con README, .gitignore o licencia

3. **Conecta tu repositorio local:**
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

### Paso 3: Desplegar en Vercel

#### Opción A: Desde GitHub (Recomendado)

1. **Inicia sesión en Vercel:**
   - Ve a https://vercel.com
   - Inicia sesión con tu cuenta de GitHub

2. **Importa tu proyecto:**
   - Haz clic en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite/React

3. **Configura el proyecto:**
   - **Framework Preset:** Vite (debería detectarse automáticamente)
   - **Root Directory:** `./` (dejar por defecto)
   - **Build Command:** `npm run build` (debería estar por defecto)
   - **Output Directory:** `dist` (debería estar por defecto)
   - **Install Command:** `npm install` (debería estar por defecto)

4. **Configura Variables de Entorno:**
   - En la sección "Environment Variables", agrega:
     - **Name:** `VITE_OPENAI_API_KEY`
     - **Value:** Tu API key de OpenAI (la que tienes en tu `.env` local)
   - Haz clic en "Add"
   - **IMPORTANTE:** Selecciona los ambientes (Production, Preview, Development)

5. **Haz clic en "Deploy"**

#### Opción B: Desde Vercel CLI (Alternativa)

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión:**
   ```bash
   vercel login
   ```

3. **Despliega:**
   ```bash
   vercel
   ```
   - Sigue las instrucciones en la terminal
   - Cuando pregunte por variables de entorno, agrega `VITE_OPENAI_API_KEY`

4. **Para producción:**
   ```bash
   vercel --prod
   ```

### Paso 4: Verificar el Despliegue

1. **Espera a que termine el build** (2-5 minutos)
2. **Vercel te dará una URL** como: `https://tu-proyecto.vercel.app`
3. **Verifica que todo funcione:**
   - Abre la URL
   - Prueba el chatbot (debe funcionar con IA)
   - Verifica que los logos se vean correctamente
   - Prueba la navegación

## 🔧 Configuración Adicional

### Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

### Variables de Entorno en Vercel

Para agregar o modificar variables de entorno después del despliegue:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega o modifica las variables
4. Haz un nuevo deploy para aplicar los cambios

### Actualizaciones Futuras

Cada vez que hagas `git push` a tu repositorio:
- Vercel detectará los cambios automáticamente
- Creará un nuevo deploy
- Te notificará cuando esté listo

## 🐛 Solución de Problemas

### El build falla
- Revisa los logs en Vercel
- Asegúrate de que `npm run build` funcione localmente
- Verifica que no haya errores de TypeScript

### El chatbot no funciona
- Verifica que `VITE_OPENAI_API_KEY` esté configurada en Vercel
- Asegúrate de que la variable esté en el ambiente correcto (Production)
- Revisa la consola del navegador para errores

### Los logos no se ven
- Verifica que los archivos estén en `public/` o `src/assets/`
- Asegúrate de que las rutas sean correctas
- Revisa que los archivos no sean demasiado grandes

### Error 404 en rutas
- Verifica que tengas `react-router-dom` configurado correctamente
- Vercel debería manejar esto automáticamente con Vite

## 📝 Checklist Pre-Deploy

- [ ] `npm run build` funciona sin errores
- [ ] Todas las imágenes están en las carpetas correctas
- [ ] El archivo `.env` NO está en el repositorio
- [ ] Las variables de entorno están listas para agregar en Vercel
- [ ] El proyecto está en Git (recomendado)
- [ ] Has probado la aplicación localmente

## 🔐 Seguridad

- **NUNCA** subas tu `.env` al repositorio
- **NUNCA** compartas tu API key públicamente
- Usa variables de entorno en Vercel para datos sensibles
- El archivo `.env` ya está en `.gitignore` ✅

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite en Vercel](https://vercel.com/guides/deploying-vite-with-vercel)
- [Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎉 ¡Listo!

Una vez desplegado, tu aplicación estará disponible en una URL de Vercel y podrás compartirla con tus clientes.

