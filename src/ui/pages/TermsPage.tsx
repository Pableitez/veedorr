export function createTermsPage(): HTMLElement {
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
      <h1>Términos de Uso</h1>
      <p class="last-updated">Última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>

    <div class="legal-content">
      <section>
        <h2>1. Aceptación de los términos</h2>
        <p>Al utilizar Veedor, aceptas estos términos de uso. Si no estás de acuerdo con alguno de estos términos, no debes usar la aplicación.</p>
      </section>

      <section>
        <h2>2. Descripción del servicio</h2>
        <p>Veedor es una aplicación web gratuita de gestión de finanzas personales que te permite:</p>
        <ul>
          <li>Registrar y categorizar tus transacciones financieras</li>
          <li>Crear y gestionar presupuestos mensuales</li>
          <li>Visualizar resúmenes financieros y estadísticas</li>
          <li>Importar y exportar datos en formato CSV</li>
        </ul>
      </section>

      <section>
        <h2>3. Uso responsable</h2>
        <p>Te comprometes a utilizar Veedor de manera responsable y legal:</p>
        <ul>
          <li>No utilizar la aplicación para actividades ilegales</li>
          <li>Proporcionar información precisa y actualizada</li>
          <li>Mantener la confidencialidad de tus datos de acceso</li>
          <li>No intentar acceder a datos de otros usuarios</li>
        </ul>
      </section>

      <section>
        <h2>4. Limitaciones de responsabilidad</h2>
        <p>Veedor se proporciona "tal como está" sin garantías de ningún tipo. No nos hacemos responsables de:</p>
        <ul>
          <li>Pérdida de datos debido a problemas técnicos</li>
          <li>Decisiones financieras basadas en la información de la aplicación</li>
          <li>Interrupciones del servicio</li>
          <li>Daños derivados del uso de la aplicación</li>
        </ul>
      </section>

      <section>
        <h2>5. Propiedad intelectual</h2>
        <p>Veedor y todos sus contenidos son propiedad de sus desarrolladores. Los usuarios conservan todos los derechos sobre sus propios datos financieros.</p>
      </section>

      <section>
        <h2>6. Modificaciones del servicio</h2>
        <p>Nos reservamos el derecho de modificar, suspender o discontinuar Veedor en cualquier momento sin previo aviso.</p>
      </section>

      <section>
        <h2>7. Terminación</h2>
        <p>Puedes dejar de usar Veedor en cualquier momento. La terminación no afecta tus datos, que permanecen almacenados localmente en tu navegador.</p>
      </section>

      <section>
        <h2>8. Ley aplicable</h2>
        <p>Estos términos se rigen por las leyes de España. Cualquier disputa será resuelta en los tribunales competentes de España.</p>
      </section>

      <section>
        <h2>9. Contacto</h2>
        <p>Para cualquier consulta sobre estos términos, puedes contactarnos a través de los canales disponibles en la aplicación.</p>
      </section>
    </div>
  `;

  // Estilos (reutilizamos los mismos que en PrivacyPage)
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
