import { useEffect, useState, useRef } from 'react';
import Postmonger from 'postmonger';

export const usePostmonger = () => {
    const connection = useRef(null);
    const [tokens, setTokens] = useState({});
    const [endpoints, setEndpoints] = useState({});
    const [payload, setPayload] = useState({});

    useEffect(() => {
        // Inicializa a conexão
        connection.current = new Postmonger.Session();

        // Setup dos listeners obrigatórios do Journey Builder
        connection.current.on('initActivity', (data) => {
            if (data) {
                setPayload(data);
                setTokens(data.tokens);
                setEndpoints(data.endpoints);
            }
        });

        // O JB pede para a atividade sinalizar que está pronta
        connection.current.trigger('ready');

        return () => {
            // Cleanup se necessário
            connection.current = null;
        };
    }, []);

    const updateActivity = (newConfig) => {
        // Lógica para mesclar a config atual com os novos dados do form
        // E enviar o 'updateActivity' de volta para o JB
        const newPayload = { ...payload, ...newConfig };
        connection.current.trigger('updateActivity', newPayload);
        setPayload(newPayload);
    };

    return { connection: connection.current, payload, updateActivity };
};