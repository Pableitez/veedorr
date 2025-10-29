export function createCookiesPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'legal-page';
  container.style.cssText = `
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  `;

  container.innerHTML = `
    <div class="legal-header">
      <h1>Política de Cookies</h1>
      <p class="last-updated">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>

    <div class="legal-content">
      <section>
        <h2>1. ¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio web recuerde información sobre tu visita.</p>
      </section>

      <section>
        <h2>2. Uso de cookies en Veedor</h2>
        <p>Veedor utiliza un enfoque minimalista respecto a las cookies:</p>
        
        <h3>Cookies técnicas (necesarias):</h3>
        <ul>
          <li><strong>Almacenamiento local:</strong> Utilizamos LocalStorage del navegador para guardar tus datos financieros</li>
          <li><strong>Preferencias:</strong> Guardamos tu tema preferido (claro/oscuro) y configuración de idioma</li>
        </ul>

        <h3>Cookies que NO utilizamos:</h3>
        <ul>
          <li>Cookies de seguimiento o análisis</li>
          <li>Cookies de publicidad</li>
          <li>Cookies de redes sociales</li>
          <li>Cookies de terceros</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del almacenamiento local</h2>
        <p>El almacenamiento local se utiliza exclusivamente para:</p>
        <ul>
          <li>Guardar tus transacciones financieras de forma segura</li>
          <li>Almacenar tus categorías personalizadas</li>
          <li>Recordar tus presupuestos mensuales</li>
          <li>Mantener tus preferencias de visualización</li>
        </ul>
      </section>

      <section>
        <h2>4. Control de datos</h2>
        <p>Tienes control total sobre tus datos:</p>
        <ul>
          <li><strong>Exportar:</strong> Puedes exportar todos tus datos en formato CSV o JSON</li>
          <li><strong>Eliminar:</strong> Puedes borrar datos individuales o todos los datos</li>
          <li><strong>Modificar:</strong> Puedes editar cualquier información almacenada</li>
        </ul>
      </section>

      <section>
        <h2>5. Cómo gestionar el almacenamiento local</h2>
        <p>Para gestionar los datos almacenados localmente:</p>
        
        <h3>En Chrome/Edge:</h3>
        <ol>
          <li>Presiona F12 para abrir las herramientas de desarrollador</li>
          <li>Ve a la pestaña "Application" o "Aplicación"</li>
          <li>En el panel izquierdo, expande "Local Storage"</li>
          <li>Selecciona tu dominio y elimina las entradas que desees</li>
        </ol>

        <h3>En Firefox:</h3>
        <ol>
          <li>Presiona F12 para abrir las herramientas de desarrollador</li>
          <li>Ve a la pestaña "Storage" o "Almacenamiento"</li>
          <li>Expande "Local Storage" en el panel izquierdo</li>
          <li>Selecciona tu dominio y elimina las entradas que desees</li>
        </ol>
      </section>

      <section>
        <h2>6. Seguridad</h2>
        <p>Los datos se almacenan únicamente en tu dispositivo y no se transmiten a servidores externos. Para mayor seguridad:</p>
        <ul>
          <li>Mantén tu navegador actualizado</li>
          <li>No compartas tu dispositivo con terceros</li>
          <li>Realiza copias de seguridad periódicas</li>
        </ul>
      </section>

      <section>
        <h2>7. Cambios en esta política</h2>
        <p>Nos reservamos el derecho de actualizar esta política de cookies. Te notificaremos de cualquier cambio significativo actualizando la fecha de "última actualización" en esta página.</p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos a través de los canales disponibles en la aplicación.</p>
      </section>
    </div>
  `;

  // Estilos (reutilizamos los mismos que en las otras páginas legales)
  const style = document.createElement('style');
  style.textContent = `
    .legal-page {
      color: var(--color-text-primary);
    }

    .legal-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-border);
    }

    .legal-header h1 {
      color: var(--color-text-primary);
      margin-bottom: 0.5rem;
    }

    .last-updated {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    .legal-content section {
      margin-bottom: 2.5rem;
    }

    .legal-content h2 {
      color: var(--color-text-primary);
      margin-bottom: 1rem;
      font-size: var(--font-size-xl);
    }

    .legal-content h3 {
      color: var(--color-text-primary);
      margin: 1.5rem 0 0.75rem 0;
      font-size: var(--font-size-lg);
    }

    .legal-content p {
      margin-bottom: 1rem;
      color: var(--color-text-secondary);
    }

    .legal-content ul, .legal-content ol {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .legal-content li {
      margin-bottom: 0.5rem;
      color: var(--color-text-secondary);
    }

    .legal-content strong {
      color: var(--color-text-primary);
    }

    @media (max-width: 768px) {
      .legal-page {
        padding: 1rem;
      }
      
      .legal-header {
        margin-bottom: 2rem;
      }
      
      .legal-content section {
        margin-bottom: 2rem;
      }
    }
  `;
  container.appendChild(style);

  return container;
}
