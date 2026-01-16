import React, { useEffect, useState } from 'react';
import { usePostmonger } from './hooks/usePostmonger';
import { JourneySelector } from './components/JourneySelector'; // Seu componente anterior
import { Step2Summary } from './components/Step2Summary'; // O novo componente

function App() {
  const { connection, payload, updateActivity } = usePostmonger();
  
  // Controle de Estado da Aplicação
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    targetJourneyId: '',
    targetJourneyName: ''
  });

  // Inicializa dados se for edição
  useEffect(() => {
    if (payload?.arguments?.execute?.inArguments?.length > 0) {
      const args = payload.arguments.execute.inArguments;
      // Procura nos argumentos salvos
      const savedId = args.find(arg => arg.targetJourneyId)?.targetJourneyId;
      const savedName = args.find(arg => arg.targetJourneyName)?.targetJourneyName;
      
      if (savedId) {
        setConfig({ targetJourneyId: savedId, targetJourneyName: savedName });
      }
    }
  }, [payload]);

  // Lógica dos Botões do Journey Builder
  useEffect(() => {
    if (!connection) return;

    // EVENTO: Clicou em "Próximo" ou "Concluído"
    connection.on('clickedNext', () => {
      if (currentStep === 1) {
        // Validação do Passo 1
        if (config.targetJourneyId) {
          setCurrentStep(2);
          connection.trigger('nextStep'); // Avisa o JB para avançar visualmente (muda botão p/ Done)
        } else {
          connection.trigger('ready'); // Mantém janela aberta
          // Idealmente usar um Toast, aqui um alert simples para demo
          alert('Por favor, selecione uma jornada.'); 
        }
      } else {
        // Passo 2: Salvar e Fechar
        saveConfiguration();
      }
    });

    // EVENTO: Clicou em "Voltar"
    connection.on('clickedBack', () => {
      if (currentStep === 2) {
        setCurrentStep(1);
        connection.trigger('prevStep'); // Avisa o JB para voltar o botão para "Next"
      } else {
        // Se estiver no step 1 e clicar voltar, o JB fecha o modal normalmente
        connection.trigger('prevStep'); 
      }
    });

  }, [connection, currentStep, config]); // Re-executa se o step ou config mudar

  // Função Final de Save
  const saveConfiguration = () => {
    const inArguments = [
      { targetJourneyId: config.targetJourneyId },
      { targetJourneyName: config.targetJourneyName },
      { contactKey: "{{Contact.Key}}" } // Exemplo de injeção de variável do SFMC
    ];

    updateActivity({
      arguments: {
        execute: {
          inArguments: inArguments,
          url: payload.arguments?.execute?.url
        }
      },
      metaData: {
        isConfigured: true
      }
    });
    
    // Força o fechamento sinalizando sucesso
    connection.trigger('updateActivity', payload); 
  };

  return (
    <div className="slds-scope slds-p-around_medium">
      {/* Indicador visual simples de passos (Opcional, mas ajuda UX) */}
      <div className="slds-progress slds-progress_shade slds-m-bottom_large">
        <ol className="slds-progress__list">
          <li className={`slds-progress__item ${currentStep >= 1 ? 'slds-is-active' : ''}`}>
            <button className={`slds-button slds-progress__marker ${currentStep >= 1 ? 'slds-button_icon-brand' : ''}`}>
              <span className="slds-assistive-text">Passo 1</span>
            </button>
          </li>
          <li className={`slds-progress__item ${currentStep === 2 ? 'slds-is-active' : ''}`}>
            <button className={`slds-button slds-progress__marker ${currentStep === 2 ? 'slds-button_icon-brand' : ''}`}>
              <span className="slds-assistive-text">Passo 2</span>
            </button>
          </li>
        </ol>
        <div className="slds-progress-bar slds-progress-bar_x-small" aria-valuemin="0" aria-valuemax="100" aria-valuenow={currentStep === 1 ? '0' : '100'} role="progressbar">
          <span className="slds-progress-bar__value" style={{ width: currentStep === 1 ? '0%' : '100%' }}>
            <span className="slds-assistive-text">Progress: {currentStep === 1 ? '0%' : '100%'}</span>
          </span>
        </div>
      </div>

      {/* Renderização Condicional das Telas */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <div className="slds-text-heading_medium slds-m-bottom_medium">Selecione o Destino</div>
          <JourneySelector 
            initialValue={config.targetJourneyId}
            onSelect={(journey) => {
              setConfig({
                targetJourneyId: journey.id,
                targetJourneyName: journey.label
              });
            }} 
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="animate-fade-in">
          <div className="slds-text-heading_medium slds-m-bottom_medium">Confirmação</div>
          <Step2Summary selectedJourneyName={config.targetJourneyName} />
        </div>
      )}
    </div>
  );
}

export default App;