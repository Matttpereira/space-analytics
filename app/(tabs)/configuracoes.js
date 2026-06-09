import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_CONFIG = 'space_analytics_config';

const configPadrao = {
    nomeOperador: '',
    nomeMissao: 'Alpha-1',
    tempMaxima: '35',
    tempMinima: '0',
    bateriaMinima: '20',
    sinalMinimo: '30',
    radiacaoMaxima: '1.5',
    intervaloAtualizacao: '3',
};

function CampoInput({ label, valor, onChange, unidade, descricao, teclado = 'default' }) {
    return (
        <View style={styles.campoContainer}>
            <Text style={styles.campoLabel}>{label}</Text>
            {descricao && <Text style={styles.campoDescricao}>{descricao}</Text>}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={valor}
                    onChangeText={onChange}
                    keyboardType={teclado}
                    placeholderTextColor="#333355"
                    selectionColor="#00ff88"
                />
                {unidade && <Text style={styles.inputUnidade}>{unidade}</Text>}
            </View>
        </View>
    );
}

export default function Configuracoes() {
    const [config, setConfig] = useState(configPadrao);
    const [erros, setErros] = useState({});
    const [salvo, setSalvo] = useState(false);
    const [carregando, setCarregando] = useState(true);

    // Carrega configurações salvas ao abrir a tela
    useEffect(() => {
        const carregarConfig = async () => {
            try {
                const dados = await AsyncStorage.getItem(CHAVE_CONFIG);
                if (dados) {
                    setConfig(JSON.parse(dados));
                }
            } catch (e) {
                console.log('Erro ao carregar config:', e);
            } finally {
                setCarregando(false);
            }
        };
        carregarConfig();
    }, []);

    const atualizar = (campo, valor) => {
        setConfig(prev => ({ ...prev, [campo]: valor }));
        if (erros[campo]) setErros(prev => ({ ...prev, [campo]: null }));
        setSalvo(false);
    };

    const validar = () => {
        const novosErros = {};

        if (!config.nomeOperador.trim()) novosErros.nomeOperador = 'Nome do operador é obrigatório';
        if (!config.nomeMissao.trim()) novosErros.nomeMissao = 'Nome da missão é obrigatório';

        const numericos = ['tempMaxima', 'tempMinima', 'bateriaMinima', 'sinalMinimo', 'radiacaoMaxima', 'intervaloAtualizacao'];
        numericos.forEach(campo => {
            if (!config[campo] || isNaN(Number(config[campo]))) {
                novosErros[campo] = 'Deve ser um número válido';
            }
        });

        if (!novosErros.tempMaxima && !novosErros.tempMinima) {
            if (Number(config.tempMaxima) <= Number(config.tempMinima)) {
                novosErros.tempMaxima = 'Temp. máxima deve ser maior que a mínima';
            }
        }

        if (!novosErros.bateriaMinima && (Number(config.bateriaMinima) < 0 || Number(config.bateriaMinima) > 100)) {
            novosErros.bateriaMinima = 'Deve ser entre 0 e 100';
        }

        if (!novosErros.sinalMinimo && (Number(config.sinalMinimo) < 0 || Number(config.sinalMinimo) > 100)) {
            novosErros.sinalMinimo = 'Deve ser entre 0 e 100';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const salvar = async () => {
        if (!validar()) return;
        try {
            await AsyncStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
            setSalvo(true);
            Alert.alert('✅ Configurações salvas', 'As configurações da missão foram salvas com sucesso.');
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível salvar as configurações.');
        }
    };

    const restaurarPadrao = () => {
        Alert.alert(
            'Restaurar padrões',
            'Tem certeza que deseja restaurar as configurações padrão?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Restaurar', style: 'destructive', onPress: () => { setConfig(configPadrao); setErros({}); setSalvo(false); } },
            ]
        );
    };

    if (carregando) {
        return (
            <View style={styles.carregando}>
                <Text style={styles.carregandoTexto}>Carregando configurações...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.titulo}>⚙️ CONFIGURAÇÕES</Text>
            <Text style={styles.subtitulo}>Parâmetros da missão</Text>

            {/* Identificação */}
            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>👤 IDENTIFICAÇÃO</Text>
                <CampoInput
                    label="Nome do Operador *"
                    valor={config.nomeOperador}
                    onChange={v => atualizar('nomeOperador', v)}
                    descricao="Seu nome completo"
                />
                {erros.nomeOperador && <Text style={styles.erro}>⚠️ {erros.nomeOperador}</Text>}

                <CampoInput
                    label="Nome da Missão *"
                    valor={config.nomeMissao}
                    onChange={v => atualizar('nomeMissao', v)}
                    descricao="Identificador da missão atual"
                />
                {erros.nomeMissao && <Text style={styles.erro}>⚠️ {erros.nomeMissao}</Text>}
            </View>

            {/* Limiares de alerta */}
            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>🌡️ LIMIARES DE TEMPERATURA</Text>
                <CampoInput label="Temperatura Máxima *" valor={config.tempMaxima} onChange={v => atualizar('tempMaxima', v)} unidade="°C" teclado="numeric" />
                {erros.tempMaxima && <Text style={styles.erro}>⚠️ {erros.tempMaxima}</Text>}
                <CampoInput label="Temperatura Mínima *" valor={config.tempMinima} onChange={v => atualizar('tempMinima', v)} unidade="°C" teclado="numeric" />
                {erros.tempMinima && <Text style={styles.erro}>⚠️ {erros.tempMinima}</Text>}
            </View>

            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>⚡ LIMIARES DE ENERGIA E SINAL</Text>
                <CampoInput label="Bateria Mínima *" valor={config.bateriaMinima} onChange={v => atualizar('bateriaMinima', v)} unidade="%" teclado="numeric" />
                {erros.bateriaMinima && <Text style={styles.erro}>⚠️ {erros.bateriaMinima}</Text>}
                <CampoInput label="Sinal Mínimo *" valor={config.sinalMinimo} onChange={v => atualizar('sinalMinimo', v)} unidade="%" teclado="numeric" />
                {erros.sinalMinimo && <Text style={styles.erro}>⚠️ {erros.sinalMinimo}</Text>}
                <CampoInput label="Radiação Máxima *" valor={config.radiacaoMaxima} onChange={v => atualizar('radiacaoMaxima', v)} unidade="mSv" teclado="numeric" />
                {erros.radiacaoMaxima && <Text style={styles.erro}>⚠️ {erros.radiacaoMaxima}</Text>}
            </View>

            {/* Botões */}
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
                <Text style={styles.botaoSalvarTexto}>{salvo ? '✅ Configurações Salvas!' : '💾 Salvar Configurações'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoRestaurar} onPress={restaurarPadrao}>
                <Text style={styles.botaoRestaurarTexto}>🔄 Restaurar Padrões</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    content: { padding: 16, paddingBottom: 60 },
    carregando: { flex: 1, backgroundColor: '#0a0a1a', alignItems: 'center', justifyContent: 'center' },
    carregandoTexto: { color: '#555577', fontSize: 14 },
    titulo: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', letterSpacing: 3, marginTop: 50, textAlign: 'center' },
    subtitulo: { color: '#555577', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    secao: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    secaoTitulo: { color: '#555577', fontSize: 11, letterSpacing: 2, marginBottom: 14 },
    campoContainer: { marginBottom: 14 },
    campoLabel: { color: '#aaaaaa', fontSize: 13, marginBottom: 4 },
    campoDescricao: { color: '#333355', fontSize: 11, marginBottom: 6 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a1a', borderRadius: 6, borderWidth: 1, borderColor: '#1a1a3a' },
    input: { flex: 1, color: '#ffffff', fontSize: 15, padding: 10 },
    inputUnidade: { color: '#555577', fontSize: 13, paddingRight: 12 },
    erro: { color: '#ff4444', fontSize: 12, marginTop: -8, marginBottom: 8 },
    botaoSalvar: { backgroundColor: '#00ff88', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
    botaoSalvarTexto: { color: '#0a0a1a', fontSize: 15, fontWeight: 'bold' },
    botaoRestaurar: { backgroundColor: '#1a1a3a', borderRadius: 8, padding: 14, alignItems: 'center' },
    botaoRestaurarTexto: { color: '#aaaaaa', fontSize: 14 },
});