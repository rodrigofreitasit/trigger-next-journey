import React, { useState, useEffect } from 'react';

// Mock de dados (em um cenário real, isso viria de um useEffect chamando uma API)
const AVAILABLE_JOURNEYS = [
  { id: 'journey_001', label: 'Jornada de Boas-vindas' },
  { id: 'journey_002', label: 'Jornada de Recuperação de Carrinho' },
  { id: 'journey_003', label: 'Jornada de Aniversário' },
  { id: 'journey_004', label: 'Jornada de Win-back (Churn)' },
  { id: 'journey_005', label: 'Oferta Black Friday' },
];

export const JourneySelector = ({ onSelect, initialValue }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState(null);
  
  // Filtra as opções baseado no que o usuário digita
  const filteredJourneys = AVAILABLE_JOURNEYS.filter(j => 
    j.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Recupera valor inicial se houver (edição da atividade)
  useEffect(() => {
    if (initialValue) {
      const found = AVAILABLE_JOURNEYS.find(j => j.id === initialValue);
      if (found) {
        setSelectedJourney(found);
        setSearchTerm(found.label);
      }
    }
  }, [initialValue]);

  const handleSelect = (journey) => {
    setSelectedJourney(journey);
    setSearchTerm(journey.label);
    setIsOpen(false);
    onSelect(journey); // Envia para o componente Pai
  };

  return (
    <div className="slds-form-element">
      <label className="slds-form-element__label" htmlFor="journey-combobox">
        Selecione a Próxima Jornada
      </label>
      <div className="slds-form-element__control">
        <div className={`slds-combobox_container ${isOpen ? 'slds-has-input-focus' : ''}`}>
          <div 
            className={`slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ${isOpen ? 'slds-is-open' : ''}`} 
            aria-expanded={isOpen} 
            aria-haspopup="listbox" 
            role="combobox"
          >
            <div className="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right" role="none">
              <input 
                type="text" 
                className="slds-input slds-combobox__input" 
                id="journey-combobox" 
                aria-autocomplete="list" 
                aria-controls="listbox-id-1" 
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                  setSelectedJourney(null); // Reseta seleção ao digitar
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay para permitir o clique na lista
              />
              <span className="slds-icon_container slds-icon-utility-search slds-input__icon slds-input__icon_right">
                {/* Ícone de Lupa SVG (padrão SLDS) ou use um span vazio se não tiver o SVG importado */}
                <svg className="slds-icon slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">
                   <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                </svg>
              </span>
            </div>
            
            {/* Lista Dropdown */}
            <div id="listbox-id-1" className="slds-dropdown slds-dropdown_length-5 slds-dropdown_fluid" role="listbox">
              <ul className="slds-listbox slds-listbox_vertical" role="presentation">
                {filteredJourneys.map((journey) => (
                  <li role="presentation" key={journey.id} className="slds-listbox__item">
                    <div 
                      className={`slds-media slds-listbox__option slds-listbox__option_plain slds-media_small ${selectedJourney?.id === journey.id ? 'slds-is-selected' : ''}`} 
                      role="option"
                      onClick={() => handleSelect(journey)}
                    >
                      <span className="slds-media__figure slds-listbox__option-icon"></span>
                      <span className="slds-media__body">
                        <span className="slds-truncate" title={journey.label}>
                          {journey.label}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
                {filteredJourneys.length === 0 && (
                  <li className="slds-listbox__item">
                    <div className="slds-listbox__option slds-listbox__option_plain slds-media_small" role="option">
                      <span className="slds-media__body">
                        <span className="slds-truncate">Nenhuma jornada encontrada.</span>
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};