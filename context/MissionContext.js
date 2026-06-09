import { createContext, useContext, useState, useEffect } from 'react';

// 1. Criamos o contexto
const MissionContext = createContext();

// 2. Criamos o Provider — ele vai "embrulhar" o app inteiro
export function MissionProvider({ children }) {

    // Dados simulados da missão
    const [missionData, setMissionData] = useState({
        // Sensores
        temperatura: 22,
        pressao: 101,
        radiacao: 0.3,
        // Energia
        painelSolar: 87,
        bateria: 72,
        consumo: 340,
        // Comunicação
        sinal: 94,
        latencia: 120,
        pacotesPerdidos: 1,
        // Status geral
        statusMissao: 'NOMINAL',
        tempoDeMissao: 0,
    });

    const [alertas, setAlertas] = useState([]);

    // 3. Simulação: atualiza os dados a cada 3 segundos
    useEffect(() => {
        const intervalo = setInterval(() => {
            setMissionData(prev => {
                const novosDados = {
                    ...prev,
                    temperatura: +(prev.temperatura + (Math.random() * 2 - 1)).toFixed(1),
                    pressao: +(prev.pressao + (Math.random() * 0.4 - 0.2)).toFixed(1),
                    radiacao: +(prev.radiacao + (Math.random() * 0.1 - 0.05)).toFixed(2),
                    painelSolar: +Math.min(100, Math.max(0, prev.painelSolar + (Math.random() * 2 - 1))).toFixed(1),
                    bateria: +Math.min(100, Math.max(0, prev.bateria - 0.1 + (Math.random() * 0.2))).toFixed(1),
                    consumo: +(prev.consumo + (Math.random() * 10 - 5)).toFixed(0),
                    sinal: +Math.min(100, Math.max(0, prev.sinal + (Math.random() * 4 - 2))).toFixed(1),
                    latencia: +(prev.latencia + (Math.random() * 10 - 5)).toFixed(0),
                    pacotesPerdidos: +Math.min(100, Math.max(0, prev.pacotesPerdidos + (Math.random() * 0.5 - 0.2))).toFixed(1),
                    tempoDeMissao: prev.tempoDeMissao + 3,
                };

                // Verifica alertas automaticamente
                const novosAlertas = [];
                if (novosDados.temperatura > 35) novosAlertas.push({ id: Date.now() + 1, tipo: 'CRITICO', mensagem: `Temperatura crítica: ${novosDados.temperatura}°C`, hora: new Date().toLocaleTimeString() });
                if (novosDados.bateria < 20) novosAlertas.push({ id: Date.now() + 2, tipo: 'CRITICO', mensagem: `Bateria baixa: ${novosDados.bateria}%`, hora: new Date().toLocaleTimeString() });
                if (novosDados.sinal < 30) novosAlertas.push({ id: Date.now() + 3, tipo: 'AVISO', mensagem: `Sinal fraco: ${novosDados.sinal}%`, hora: new Date().toLocaleTimeString() });
                if (novosDados.radiacao > 1.5) novosAlertas.push({ id: Date.now() + 4, tipo: 'AVISO', mensagem: `Radiação elevada: ${novosDados.radiacao} mSv`, hora: new Date().toLocaleTimeString() });

                if (novosAlertas.length > 0) {
                    setAlertas(prev => [...novosAlertas, ...prev].slice(0, 20));
                }

                return novosDados;
            });
        }, 3000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <MissionContext.Provider value={{ missionData, alertas, setAlertas }}>
            {children}
        </MissionContext.Provider>
    );
}

// 4. Hook customizado para facilitar o uso nas telas
export function useMission() {
    return useContext(MissionContext);
}