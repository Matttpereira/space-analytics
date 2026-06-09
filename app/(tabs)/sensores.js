import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useMission } from '../../context/MissionContext';
import { useState, useEffect } from 'react';

const LARGURA = Dimensions.get('window').width - 32;

export default function Sensores() {
    const { missionData } = useMission();

    const [historicoTemp, setHistoricoTemp] = useState([22, 22, 22, 22, 22]);
    const [historicoPressao, setHistoricoPressao] = useState([101, 101, 101, 101, 101]);
    const [historicoRadiacao, setHistoricoRadiacao] = useState([0.3, 0.3, 0.3, 0.3, 0.3]);

    useEffect(() => {
        setHistoricoTemp(prev => [...prev.slice(-4), missionData.temperatura]);
        setHistoricoPressao(prev => [...prev.slice(-4), missionData.pressao]);
        setHistoricoRadiacao(prev => [...prev.slice(-4), missionData.radiacao]);
    }, [missionData]);

    const chartConfig = {
        backgroundGradientFrom: '#111128',
        backgroundGradientTo: '#111128',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
        labelColor: () => '#555577',
        propsForDots: { r: '4', strokeWidth: '2', stroke: '#00ff88' },
        propsForBackgroundLines: { stroke: '#1a1a3a' },
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.titulo}>📡 SENSORES</Text>
            <Text style={styles.subtitulo}>Leituras em tempo real simulado</Text>

            {/* Cards de valor atual */}
            <View style={styles.grid}>
                <View style={[styles.card, { borderLeftColor: '#ff6b6b' }]}>
                    <Text style={styles.cardLabel}>🌡️ Temperatura</Text>
                    <Text style={[styles.cardValor, { color: '#ff6b6b' }]}>{missionData.temperatura}°C</Text>
                    <Text style={styles.cardStatus}>
                        {missionData.temperatura > 35 ? '⚠️ CRÍTICO' : missionData.temperatura > 28 ? '⚡ AVISO' : '✅ Normal'}
                    </Text>
                </View>
                <View style={[styles.card, { borderLeftColor: '#4ecdc4' }]}>
                    <Text style={styles.cardLabel}>⏲️ Pressão</Text>
                    <Text style={[styles.cardValor, { color: '#4ecdc4' }]}>{missionData.pressao} kPa</Text>
                    <Text style={styles.cardStatus}>
                        {missionData.pressao < 90 || missionData.pressao > 115 ? '⚠️ CRÍTICO' : '✅ Normal'}
                    </Text>
                </View>
                <View style={[styles.card, { borderLeftColor: '#ffe66d' }]}>
                    <Text style={styles.cardLabel}>☢️ Radiação</Text>
                    <Text style={[styles.cardValor, { color: '#ffe66d' }]}>{missionData.radiacao} mSv</Text>
                    <Text style={styles.cardStatus}>
                        {missionData.radiacao > 1.5 ? '⚠️ CRÍTICO' : missionData.radiacao > 1.0 ? '⚡ AVISO' : '✅ Normal'}
                    </Text>
                </View>
            </View>

            {/* Gráfico Temperatura */}
            <View style={styles.graficoContainer}>
                <Text style={styles.graficoTitulo}>🌡️ Temperatura (°C)</Text>
                <LineChart
                    data={{ labels: ['', '', '', '', ''], datasets: [{ data: historicoTemp }] }}
                    width={LARGURA}
                    height={160}
                    chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, propsForDots: { r: '4', strokeWidth: '2', stroke: '#ff6b6b' } }}
                    bezier
                    style={styles.grafico}
                    withInnerLines={true}
                    withOuterLines={false}
                />
            </View>

            {/* Gráfico Pressão */}
            <View style={styles.graficoContainer}>
                <Text style={styles.graficoTitulo}>⏲️ Pressão (kPa)</Text>
                <LineChart
                    data={{ labels: ['', '', '', '', ''], datasets: [{ data: historicoPressao }] }}
                    width={LARGURA}
                    height={160}
                    chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`, propsForDots: { r: '4', strokeWidth: '2', stroke: '#4ecdc4' } }}
                    bezier
                    style={styles.grafico}
                    withInnerLines={true}
                    withOuterLines={false}
                />
            </View>

            {/* Gráfico Radiação */}
            <View style={styles.graficoContainer}>
                <Text style={styles.graficoTitulo}>☢️ Radiação (mSv)</Text>
                <LineChart
                    data={{ labels: ['', '', '', '', ''], datasets: [{ data: historicoRadiacao }] }}
                    width={LARGURA}
                    height={160}
                    chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(255, 230, 109, ${opacity})`, propsForDots: { r: '4', strokeWidth: '2', stroke: '#ffe66d' } }}
                    bezier
                    style={styles.grafico}
                    withInnerLines={true}
                    withOuterLines={false}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    content: { padding: 16, paddingBottom: 40 },
    titulo: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', letterSpacing: 3, marginTop: 50, textAlign: 'center' },
    subtitulo: { color: '#555577', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    grid: { gap: 10, marginBottom: 16 },
    card: { backgroundColor: '#111128', borderLeftWidth: 3, borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardLabel: { color: '#888899', fontSize: 13, flex: 1 },
    cardValor: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    cardStatus: { color: '#aaaaaa', fontSize: 12, flex: 1, textAlign: 'right' },
    graficoContainer: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    graficoTitulo: { color: '#aaaaaa', fontSize: 13, marginBottom: 10 },
    grafico: { borderRadius: 8, marginLeft: -10 },
});