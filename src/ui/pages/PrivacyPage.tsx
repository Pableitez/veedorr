export function createPrivacyPage(): HTMLElement {
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
      <h1>Política de Privacidad</h1>
      <p class="last-updated">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>

    <div class="legal-content">
      <section>
        <h2>1. Información que recopilamos</h2>
        <p>Veedor es una aplicación de finanzas personales que funciona completamente en tu navegador. No recopilamos ni enviamos información personal a nuestros servidores.</p>
        
        <h3>Datos almacenados localmente:</h3>
        <ul>
          <li>Transacciones financieras que introduces</li>
          <li>Categorías de gastos personalizadas</li>
          <li>Presupuestos mensuales</li>
          <li>Preferencias de la aplicación (tema, idioma)</li>
        </ul>
      </section>

      <section>
        <h2>2. Cómo utilizamos tu información</h2>
        <p>Toda la información se procesa y almacena únicamente en tu dispositivo mediante el almacenamiento local del navegador (LocalStorage). No compartimos, vendemos ni transmitimos tus datos a terceros.</p>
      </section>

      <section>
        <h2>3. Seguridad de los datos</h2>
        <p>Los datos se almacenan de forma segura en tu navegador. Para mayor seguridad, recomendamos:</p>
        <ul>
          <li>Mantener tu navegador actualizado</li>
          <li>No compartir tu dispositivo con terceros</li>
          <li>Realizar copias de seguridad periódicas de tus datos</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies y tecnologías similares</h2>
        <p>Veedor utiliza únicamente el almacenamiento local del navegador para funcionar. No utilizamos cookies de seguimiento ni tecnologías de análisis de terceros.</p>
      </section>

      <section>
        <h2>5. Tus derechos</h2>
        <p>Como todos los datos se almacenan localmente, tienes control total sobre ellos:</p>
        <ul>
          <li>Puedes exportar tus datos en cualquier momento</li>
          <li>Puedes eliminar todos los datos borrando el almacenamiento local</li>
          <li>Puedes modificar o eliminar transacciones individuales</li>
        </ul>
      </section>

      <section>
        <h2>6. Cambios en esta política</h2>
        <p>Nos reservamos el derecho de actualizar esta política de privacidad. Te notificaremos de cualquier cambio significativo actualizando la fecha de "última actualización" en esta página.</p>
      </section>

      <section>
        <h2>7. Contacto</h2>
        <p>Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de los canales disponibles en la aplicación.</p>
      </section>
    </div>
  `;

  // Estilos
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

    .legal-content ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .legal-content li {
      margin-bottom: 0.5rem;
      color: var(--color-text-secondary);
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
