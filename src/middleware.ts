import { defineMiddleware } from "astro:middleware";

// Idiomas que soporta la aplicación
const supportedLocales = ['en', 'es'];

export const onRequest = defineMiddleware((context, next) => {
  // Extraer la información de la URL actual
  const url = new URL(context.request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const { pathname } = url

  // 1. Filtrar assets y archivos estáticos
  // Ignoramos si la ruta contiene un punto (ej. .png, .css) o si empieza por /_astro
  if (pathname.includes('/_image')) {
    return next();
  }
  
  // El primer segmento indica el idioma (ej. /es/ o /en/)
  const currentLocale = pathSegments[0];

  // Si la ruta actual no comienza con un idioma soportado
  if (!supportedLocales.includes(currentLocale)) {
    // Detectar el idioma preferido del navegador mediante las cabeceras
    const acceptLanguageHeader = context.request.headers.get('accept-language');
    let preferredLocale = acceptLanguageHeader?.split(',')[0].split('-')[0] || 'en';
    
    // Si el idioma del navegador no está en nuestra lista, usamos inglés por defecto
    if (!supportedLocales.includes(preferredLocale)) {
      preferredLocale = 'en';
    }

    // Construir la nueva ruta manteniendo el path y los parámetros de búsqueda (?...)
    // Usamos una ruta relativa para asegurar la compatibilidad en producción
    const destination = `/${preferredLocale}${url.pathname}${url.search}`;

    // Redirigir al usuario a la versión localizada de la página
    return context.redirect(destination, 302);
  }

  // Si la URL ya es correcta, continuar con la carga normal de la página
  return next();
});