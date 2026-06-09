import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useMission } from '../../context/MissionContext';
import { useState, useEffect } from 'react';

const LARGURA = Dimensions.get('window').width - 32;

function MetricaCard({ icone, label, valor, unidade, cor, descricao }) {
    return (
        <View style={[styles.metricaCard, { borderTopColor: cor }]}>
            <Text style={styles.metricaIcone}>{icone}</Text>
            <Text style={styles.metricaLabel}>{label}</Text>
            <Text style={[styles.metricaValor, { color: cor }]}>{valor}<Text style={styles.metricaUnidade}> {unidade}</Text></Text>
            <Text style={styles.metricaDescricao}>{descricao}</Text>
        </View>
    );
}

function StatusLinha({ label, ativo }) {
    return (
        <View style={styles.statusLinha}>
            <View style={[styles.statusDot, { backgroundColor: ativo ? '#00ff88' : '#ff4444' }]} />
            <Text style={styles.statusLinhaLabel}>{label}</Text>
            <Text style={[styles.statusLinhaValor, { color: ativo ? '#00ff88' : '#ff4444' }]}>
                {ativo ? 'ONLINE' : 'OFFLINE'}
            </Text>
        </View>
    );
}

export default function Comunicacao() {
    const { missionData } = useMission();
    const [historicoSinal, setHistoricoSinal] = useState([94, 94, 94, 94, 94]);
    const [historicoLatencia, setHistoricoLatencia] = useState([120, 120, 120, 120, 120]);

    useEffect(() => {
        setHistoricoSinal(prev => [...prev.slice(-4), missionData.sinal]);
        setHistoricoLatencia(prev => [...prev.slice(-4), missionData.latencia]);
    }, [missionData]);

    const getQualidade = (sinal) => {
        if (sinal >= 80) return { texto: 'EXCELENTE', cor: '#00ff88' };
        if (sinal >= 60) return { texto: 'BOA', cor: '#ffe66d' };
        if (sinal >= 30) return { texto: 'FRACA', cor: '#ffaa00' };
        return { texto: 'CRÍTICA', cor: '#ff4444' };
    };

    const qualidade = getQualidade(missionData.sinal);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.titulo}>📶 COMUNICAÇÃO</Text>
            <Text style={styles.subtitulo}>Link de telemetria</Text>

            {/* Status geral do link */}
            <View style={[styles.linkStatus, { borderColor: qualidade.cor }]}>
                <Text style={styles.linkLabel}>QUALIDADE DO LINK</Text>
                <Text style={[styles.linkValor, { color: qualidade.cor }]}>{qualidade.texto}</Text>
                <Text style={styles.linkSinal}>{missionData.sinal}% de sinal</Text>
            </View>

            {/* Métricas */}
            <View style={styles.grid}>
                <MetricaCard
                    icone="📡" label="Sinal" valor={missionData.sinal} unidade="%"
                    cor="#4ecdc4" descricao={missionData.sinal >= 60 ? '✅ Estável' : '⚠️ Instável'}
                />
                <MetricaCard
                    icone="⏱️" label="Latência" valor={missionData.latencia} unidade="ms"
                    cor="#a29bfe" descricao={missionData.latencia < 200 ? '✅ Normal' : '⚠️ Alta'}
                />
                <MetricaCard
                    icone="📦" label="Pkt. Perdidos" valor={missionData.pacotesPerdidos} unidade="%"
                    cor="#ff6b6b" descricao={missionData.pacotesPerdidos < 5 ? '✅ Normal' : '⚠️ Alto'}
                />
            </View>

            {/* Gráfico de sinal */}
            <View style={styles.graficoContainer}>
                <Text style={styles.graficoTitulo}>📶 Qualidade do Sinal (%)</Text>
                <LineChart
                    data={{ labels: ['', '', '', '', ''], datasets: [{ data: historicoSinal }] }}
                    width={LARGURA}
                    height={160}
                    chartConfig={{
                        backgroundGradientFrom: '#111128',
                        backgroundGradientTo: '#111128',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                        labelColor: () => '#555577',
                        propsForDots: { r: '4', strokeWidth: '2', stroke: '#4ecdc4' },
                        propsForBackgroundLines: { stroke: '#1a1a3a' },
                    }}
                    bezier
                    style={styles.grafico}
                    withInnerLines={true}
                    withOuterLines={false}
                />
            </View>

            {/* Gráfico de latência */}
            <View style={styles.graficoContainer}>
                <Text style={styles.graficoTitulo}>⏱️ Latência (ms)</Text>
                <LineChart
                    data={{ labels: ['', '', '', '', ''], datasets: [{ data: historicoLatencia }] }}
                    width={LARGURA}
                    height={160}
                    chartConfig={{
                        backgroundGradientFrom: '#111128',
                        backgroundGradientTo: '#111128',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(162, 155, 254, ${opacity})`,
                        labelColor: () => '#555577',
                        propsForDots: { r: '4', strokeWidth: '2', stroke: '#a29bfe' },
                        propsForBackgroundLines: { stroke: '#1a1a3a' },
                    }}
                    bezier
                    style={styles.grafico}
                    withInnerLines={true}
                    withOuterLines={false}
                />
            </View>

            {/* Status dos canais */}
            <View style={styles.canaisContainer}>
                <Text style={styles.canaisTitulo}>CANAIS DE COMUNICAÇÃO</Text>
                <StatusLinha label="🛰️ Canal Principal" ativo={missionData.sinal > 20} />
                <StatusLinha label="📻 Canal Backup" ativo={missionData.sinal > 10} />
                <StatusLinha label="🔊 Telemetria de Voz" ativo={missionData.sinal > 50} />
                <StatusLinha label="📊 Transmissão de Dados" ativo={missionData.pacotesPerdidos < 10} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    content: { padding: 16, paddingBottom: 40 },
    titulo: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', letterSpacing: 3, marginTop: 50, textAlign: 'center' },
    subtitulo: { color: '#555577', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    linkStatus: { backgroundColor: '#111128', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1 },
    linkLabel: { color: '#555577', fontSize: 11, letterSpacing: 2, marginBottom: 8 },
    linkValor: { fontSize: 32, fontWeight: 'bold' },
    linkSinal: { color: '#aaaaaa', fontSize: 13, marginTop: 6 },
    grid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    metricaCard: { flex: 1, backgroundColor: '#111128', borderTopWidth: 3, borderRadius: 8, padding: 12, alignItems: 'center' },
    metricaIcone: { fontSize: 22, marginBottom: 4 },
    metricaLabel: { color: '#555577', fontSize: 11 },
    metricaValor: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    metricaUnidade: { fontSize: 11, fontWeight: 'normal' },
    metricaDescricao: { color: '#888899', fontSize: 10, marginTop: 4, textAlign: 'center' },
    graficoContainer: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    graficoTitulo: { color: '#aaaaaa', fontSize: 13, marginBottom: 10 },
    grafico: { borderRadius: 8, marginLeft: -10 },
    canaisContainer: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    canaisTitulo: { color: '#555577', fontSize: 11, letterSpacing: 2, marginBottom: 14 },
    statusLinha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a3a' },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
    statusLinhaLabel: { flex: 1, color: '#aaaaaa', fontSize: 13 },
    statusLinhaValor: { fontSize: 12, fontWeight: 'bold' },
});