# Medición de formularios — Steid Hub

Contenedor existente: `GTM-KGVBFL2M`. Este cambio prepara los eventos en `dataLayer`; **no modifica ni publica la configuración remota de GTM o GA4**.

| Evento `dataLayer` | Cuándo ocurre | Uso recomendado en GA4 |
|---|---|---|
| `lead_form_open` | Se abre el flotante o el formulario completo entra en pantalla | Visitas al formulario |
| `lead_form_start` | La persona empieza a rellenar un campo | Inicio del formulario |
| `lead_form_submit` | La persona envía campos válidos; el servidor aún puede rechazarlos | Formularios completados/intentos válidos |
| `generate_lead` | `/api/leads` confirma que guardó la solicitud | Evento clave: lead guardado |
| `whatsapp_click` | Después de guardar el flotante, justo antes de abrir WhatsApp | Salida hacia WhatsApp; **no** confirma que se haya enviado un mensaje |

Parámetros compartidos: `form_id=steidhub_lead`, `page_path`, `form_type` (`floating` o `embedded`) y `cta_source`. La apertura incluye `cta_label`; la salida incluye `contact_method=WhatsApp`. Ningún evento contiene nombre, apellido, correo, teléfono ni texto libre del proyecto.

En GTM, crear un activador **Evento personalizado** por cada nombre anterior y una etiqueta de **Evento de GA4** correspondiente, asociada a la etiqueta de Google existente. Pasar solo los parámetros permitidos. No habilitar a la vez una segunda etiqueta automática con el mismo `generate_lead`, para evitar duplicados. Marcar `generate_lead` como evento clave en GA4; considerar `whatsapp_click` como microconversión separada. Probar escritorio y móvil con GTM Preview y GA4 DebugView antes de publicar el contenedor.

En páginas con `#contactForm`, los botones de contacto, incluidos los accesos propios de WhatsApp, llevan al formulario existente; no se abre el flotante. En páginas sin ese formulario se abre el flotante. Este pide nombre, apellido, email, teléfono opcional y dos autorizaciones, incluida la aceptación de las condiciones de tratamiento de datos enlazadas a la política de privacidad. Envía los datos al mismo `/api/leads` que el formulario completo: concatena nombre y apellido en la columna existente `nombre` y usa las mismas claves de Cloudflare, sin migración de la tabla. Solo redirige automáticamente a WhatsApp tras una respuesta exitosa. Si falla el guardado, conserva los datos, muestra un error y ofrece un enlace explícito para ir a WhatsApp sin guardar; ese camino registra `whatsapp_click` con `lead_saved=false`, pero no `generate_lead`. Los enlaces para compartir artículos por WhatsApp quedan fuera de este flujo.
