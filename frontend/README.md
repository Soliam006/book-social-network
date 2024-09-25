# Frontend
Para ejecutar un proyecto de **Next.js**, debes seguir una serie de pasos para configurar el entorno de desarrollo y arrancar el servidor local. Aquí te dejo los pasos completos:

## Pasos para ejecutar un proyecto de Next.js

### 1. **Instalar Node.js**
Primero, asegúrate de tener **Node.js** instalado en tu máquina. Puedes descargarlo desde [nodejs.org](https://nodejs.org/). Es recomendable tener al menos la versión **16.x** o superior para trabajar con Next.js.

- Para comprobar si Node.js está instalado y su versión, ejecuta en la terminal:

```bash
node -v
```

- Asegúrate de tener también **npm** (que viene con Node.js) o **yarn** instalado:

```bash
npm -v
```

### 2. **Instalar las dependencias**
Dentro de la carpeta del proyecto Next.js, necesitas instalar todas las dependencias. Esto lo puedes hacer usando **npm** o **yarn**, según lo que esté configurado en el proyecto.

- Si usas **npm**:

```bash
npm install  ------
```

- O si usas **yarn** (si el proyecto usa yarn como gestor de paquetes):

```bash
yarn install  -----
```

Este comando leerá el archivo `package.json` y descargará todas las dependencias que necesita el proyecto, creando la carpeta `node_modules`.

**No se pueden instalar paquetes sin antes haberlo hablado con el equipo**. Todos necesitamos seguir al menos, la versión más actualizada del Proyecto.

Luego, edita el archivo `.env.local` con tus propios valores (por ejemplo, URL del backend, claves de API, etc.).

### 4. **Ejecutar el servidor de desarrollo**
Una vez que las dependencias están instaladas y las variables de entorno configuradas, puedes ejecutar el servidor de desarrollo de **Next.js**.

- Con **npm**:

```bash
npm run dev
```

- O con **yarn**:

```bash
yarn dev
```

Esto iniciará un servidor de desarrollo en modo local. Si todo está correctamente configurado, podrás acceder a la aplicación en tu navegador en la siguiente dirección:

```
http://localhost:3000
```

### 5. **Navegar por el proyecto**
Una vez que el servidor de desarrollo esté corriendo, puedes abrir tu navegador y ver la aplicación en `http://localhost:3000`. Cualquier cambio que realices en los archivos de la aplicación debería reflejarse en tiempo real sin tener que reiniciar el servidor (gracias al hot-reloading de Next.js).

### 6. **Solución de problemas comunes**
- **Error de puerto ocupado**: Si el puerto `3000` ya está en uso, puedes ejecutar el servidor en un puerto diferente:

```bash
npm run dev -- -p 3001
```

- **Dependencias faltantes**: Si ves errores relacionados con módulos faltantes, asegúrate de haber corrido `npm install` o `yarn install` antes de iniciar el servidor.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) 