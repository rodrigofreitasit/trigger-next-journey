import React from 'react';

export const Step2Summary = ({ selectedJourneyName }) => {
  return (
    <div className="slds-p-horizontal_medium">
      
      {/* Resumo da Escolha */}
      <div className="slds-box slds-theme_shade slds-m-bottom_medium">
        <h3 className="slds-text-heading_small slds-m-bottom_x-small">Resumo da Configuração</h3>
        <p>
          Próxima Jornada Selecionada: <br />
          <strong>{selectedJourneyName || 'Nenhuma selecionada'}</strong>
        </p>
      </div>

      {/* Disclaimer / Aviso Importante */}
      <div className="slds-scoped-notification slds-media slds-media_center slds-theme_info" role="status">
        <div className="slds-media__figure">
          <span className="slds-icon_container slds-icon-utility-info" title="information">
            <svg className="slds-icon slds-icon_small slds-icon-text-default" aria-hidden="true">
              <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
            </svg>
            <span className="slds-assistive-text">informação</span>
          </span>
        </div>
        <div className="slds-media__body">
          <p>
            <strong>Atenção ao Comportamento:</strong>
            <br />
            Ao passar por esta atividade, o cliente será inserido na jornada <strong>{selectedJourneyName}</strong> imediatamente.
            <br />
            <br />
            Caso existam etapas adicionais <em>nesta</em> jornada atual após este passo, o cliente <strong>continuará passando por elas normalmente</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};