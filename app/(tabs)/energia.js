import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useMission } from '../../context/MissionContext';
import { useState, useEffect } from 'react';

const LARGURA = Dimensions.get('window').width - 32;

function GaugeBar({ label, valor, max, cor, unidade }) {
    const percentual = Math.min(100, (valor / max) * 100);
    return (
        <View style={styles.gaugeContainer}>
            <View style={styles.gaugeHeader}>
                <Text style={styles.gaugeLabel}>{label}</Text>
                <Text style={[styles.gaugeValor, { color: cor }]}>{valor} {unidade}</Text>
            </View>
            <View style={styles.gaugeTrack}>
                <View style={[styles.gaugeFill, { width: `${percentual}%`, backgroundColor: cor }]} />
            </View>
            <Text style={styles.gaugeMax}>Máx: {max} {unidade}</Text>
        </View>
    );
}

export default function Energia() {
    const { missionData } = useMission();
    const [historicoConsumo, setHistoricoConsumo] = useState([340, 340, 340, 340, 340, 340]);

    useEffect(() => {
        setHistoricoConsumo(prev => [...prev.slice(-5), missionData.consumo]);
    }, [missionData]);

    const balanco = (missionData.painelSolar / 100 * 500) - missionData.consumo;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.titulo}>⚡ ENERGIA</Text>
            <Text style={styles.subtitulo}>Monitoramento de potência</Text>

            {/* Card de balanço energético */}
            <View style={[styles.balanco, { borderColor: balanco >= 0 ? '#00ff88' : '#ff4444' }]}>
                <Text style={styles.balancoLabel}>BALANÇO ENERGÉTICO</Text>
                <Text style={[styles.balancoValor, { color: balanco >= 0 ? '#00ff88' : '#ff4444' }]}>
                    {balanco >= 0 ? '+' : ''}{balanco.toFixed(0)} W
                </Text>
                <Text style={styles.balancoSub}>
                    {balanco >= 0 ? '✅ Geração suficiente' : '⚠️ Consumo excede geração'}
                </Text>
            </View>

            {/* Gauges */}
            <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>NÍVEIS ATUAIS</Text>
                <GaugeBar label="☀️ Painel Solar" valor={missionData.painelSolar} max={100} cor="#ffe66d" unidade="%" />
                <GaugeBar label="🔋 Bateria" valor={missionData.bateria} max={100} cor={missionData.bateria < 20 ? '#ff4444' : '#00ff88'} unidade="%" />
                <GaugeBar label="⚡ Consumo" valor={missionData.consumo} max={600} cor="#a29bfe" unidade="W" />
            </View>

            {/* Gráfico de barras - histórico de consumo */}
            <View style={styles.graficoContainer}>
                <Text style={styles.graficoTitulo}>📊 Histórico de Consumo (W)</Text>
                <BarChart
                    data={{
                        labels: ['-5', '-4', '-3', '-2', '-1', 'Now'],
                        datasets: [{ data: historicoConsumo }],
                    }}
                    width={LARGURA}
                    height={200}
                    chartConfig={{
                        backgroundGradientFrom: '#111128',
                        backgroundGradientTo: '#111128',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(162, 155, 254, ${opacity})`,
                        labelColor: () => '#555577',
                        propsForBackgroundLines: { stroke: '#1a1a3a' },
                    }}
                    style={styles.grafico}
                    withInnerLines={true}
                    showValuesOnTopOfBars={true}
                />
            </View>

            {/* Info cards */}
            <View style={styles.grid}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcone}>☀️</Text>
                    <Text style={styles.infoLabel}>Geração Solar</Text>
                    <Text style={[styles.infoValor, { color: '#ffe66d' }]}>
                        {(missionData.painelSolar / 100 * 500).toFixed(0)} W
                    </Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcone}>🔋</Text>
                    <Text style={styles.infoLabel}>Autonomia</Text>
                    <Text style={[styles.infoValor, { color: '#00ff88' }]}>
                        {(missionData.bateria / 100 * 10).toFixed(1)} h
                    </Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcone}>⚡</Text>
                    <Text style={styles.infoLabel}>Eficiência</Text>
                    <Text style={[styles.infoValor, { color: '#a29bfe' }]}>
                        {Math.min(100, (missionData.painelSolar * 0.85)).toFixed(1)}%
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    content: { padding: 16, paddingBottom: 40 },
    titulo: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', letterSpacing: 3, marginTop: 50, textAlign: 'center' },
    subtitulo: { color: '#555577', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    balanco: { backgroundColor: '#111128', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1 },
    balancoLabel: { color: '#555577', fontSize: 11, letterSpacing: 2, marginBottom: 8 },
    balancoValor: { fontSize: 36, fontWeight: 'bold' },
    balancoSub: { color: '#aaaaaa', fontSize: 13, marginTop: 6 },
    secao: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    secaoTitulo: { color: '#555577', fontSize: 11, letterSpacing: 2, marginBottom: 14 },
    gaugeContainer: { marginBottom: 16 },
    gaugeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    gaugeLabel: { color: '#aaaaaa', fontSize: 13 },
    gaugeValor: { fontSize: 13, fontWeight: 'bold' },
    gaugeTrack: { height: 8, backgroundColor: '#1a1a3a', borderRadius: 4, overflow: 'hidden' },
    gaugeFill: { height: 8, borderRadius: 4 },
    gaugeMax: { color: '#333355', fontSize: 10, marginTop: 3, textAlign: 'right' },
    graficoContainer: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    graficoTitulo: { color: '#aaaaaa', fontSize: 13, marginBottom: 10 },
    grafico: { borderRadius: 8, marginLeft: -10 },
    grid: { flexDirection: 'row', gap: 10 },
    infoCard: { flex: 1, backgroundColor: '#111128', borderRadius: 8, padding: 12, alignItems: 'center' },
    infoIcone: { fontSize: 24, marginBottom: 6 },
    infoLabel: { color: '#555577', fontSize: 11, textAlign: 'center' },
    infoValor: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
});