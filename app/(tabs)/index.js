import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMission } from '../../context/MissionContext';

function StatusCard({ titulo, valor, unidade, cor, icone }) {
    return (
        <View style={[styles.card, { borderLeftColor: cor }]}>
            <Text style={styles.cardIcone}>{icone}</Text>
            <Text style={styles.cardTitulo}>{titulo}</Text>
            <Text style={[styles.cardValor, { color: cor }]}>
                {valor}<Text style={styles.cardUnidade}> {unidade}</Text>
            </Text>
        </View>
    );
}

function BarraProgresso({ valor, cor }) {
    return (
        <View style={styles.barraContainer}>
            <View style={[styles.barraPreenchimento, { width: `${valor}%`, backgroundColor: cor }]} />
        </View>
    );
}

export default function Home() {
    const { missionData, alertas } = useMission();

    const formatarTempo = (segundos) => {
        const h = Math.floor(segundos / 3600);
        const m = Math.floor((segundos % 3600) / 60);
        const s = segundos % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getStatusCor = () => {
        if (alertas.some(a => a.tipo === 'CRITICO')) return '#ff4444';
        if (alertas.some(a => a.tipo === 'AVISO')) return '#ffaa00';
        return '#00ff88';
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <Text style={styles.titulo}>🚀 SPACE ANALYTICS</Text>
                <Text style={styles.subtitulo}>Missão Alpha-1</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusCor() + '22', borderColor: getStatusCor() }]}>
                    <Text style={[styles.statusTexto, { color: getStatusCor() }]}>
                        ● {alertas.some(a => a.tipo === 'CRITICO') ? 'CRÍTICO' : alertas.some(a => a.tipo === 'AVISO') ? 'AVISO' : 'NOMINAL'}
                    </Text>
                </View>
                <Text style={styles.tempo}>⏱ {formatarTempo(missionData.tempoDeMissao)}</Text>
            </View>

            {/* Cards de status */}
            <Text style={styles.secaoTitulo}>SISTEMAS</Text>
            <View style={styles.grid}>
                <StatusCard titulo="Temperatura" valor={missionData.temperatura} unidade="°C" cor="#ff6b6b" icone="🌡️" />
                <StatusCard titulo="Pressão" valor={missionData.pressao} unidade="kPa" cor="#4ecdc4" icone="⏲️" />
                <StatusCard titulo="Radiação" valor={missionData.radiacao} unidade="mSv" cor="#ffe66d" icone="☢️" />
                <StatusCard titulo="Consumo" valor={missionData.consumo} unidade="W" cor="#a29bfe" icone="⚡" />
            </View>

            {/* Barras de progresso */}
            <Text style={styles.secaoTitulo}>RECURSOS</Text>
            <View style={styles.recursosContainer}>
                <View style={styles.recursoItem}>
                    <View style={styles.recursoHeader}>
                        <Text style={styles.recursoLabel}>☀️ Painel Solar</Text>
                        <Text style={[styles.recursoValor, { color: '#ffe66d' }]}>{missionData.painelSolar}%</Text>
                    </View>
                    <BarraProgresso valor={missionData.painelSolar} cor="#ffe66d" />
                </View>
                <View style={styles.recursoItem}>
                    <View style={styles.recursoHeader}>
                        <Text style={styles.recursoLabel}>🔋 Bateria</Text>
                        <Text style={[styles.recursoValor, { color: missionData.bateria < 20 ? '#ff4444' : '#00ff88' }]}>{missionData.bateria}%</Text>
                    </View>
                    <BarraProgresso valor={missionData.bateria} cor={missionData.bateria < 20 ? '#ff4444' : '#00ff88'} />
                </View>
                <View style={styles.recursoItem}>
                    <View style={styles.recursoHeader}>
                        <Text style={styles.recursoLabel}>📶 Sinal</Text>
                        <Text style={[styles.recursoValor, { color: missionData.sinal < 30 ? '#ff4444' : '#4ecdc4' }]}>{missionData.sinal}%</Text>
                    </View>
                    <BarraProgresso valor={missionData.sinal} cor={missionData.sinal < 30 ? '#ff4444' : '#4ecdc4'} />
                </View>
            </View>

            {/* Últimos alertas */}
            {alertas.length > 0 && (
                <>
                    <Text style={styles.secaoTitulo}>ÚLTIMOS ALERTAS</Text>
                    {alertas.slice(0, 3).map(alerta => (
                        <View key={alerta.id} style={[styles.alertaItem, { borderLeftColor: alerta.tipo === 'CRITICO' ? '#ff4444' : '#ffaa00' }]}>
                            <Text style={styles.alertaMensagem}>{alerta.tipo === 'CRITICO' ? '🔴' : '🟡'} {alerta.mensagem}</Text>
                            <Text style={styles.alertaHora}>{alerta.hora}</Text>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    content: { padding: 16, paddingBottom: 40 },
    header: { alignItems: 'center', marginTop: 50, marginBottom: 24 },
    titulo: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', letterSpacing: 3 },
    subtitulo: { color: '#aaaaaa', fontSize: 14, marginTop: 4 },
    statusBadge: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    statusTexto: { fontSize: 13, fontWeight: 'bold' },
    tempo: { color: '#555577', fontSize: 13, marginTop: 8 },
    secaoTitulo: { color: '#555577', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10, marginTop: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    card: { backgroundColor: '#111128', borderLeftWidth: 3, borderRadius: 8, padding: 12, width: '47%' },
    cardIcone: { fontSize: 20, marginBottom: 4 },
    cardTitulo: { color: '#888899', fontSize: 11 },
    cardValor: { fontSize: 22, fontWeight: 'bold', marginTop: 2 },
    cardUnidade: { fontSize: 12, fontWeight: 'normal' },
    recursosContainer: { backgroundColor: '#111128', borderRadius: 8, padding: 14, marginBottom: 16 },
    recursoItem: { marginBottom: 14 },
    recursoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    recursoLabel: { color: '#aaaaaa', fontSize: 13 },
    recursoValor: { fontSize: 13, fontWeight: 'bold' },
    barraContainer: { height: 6, backgroundColor: '#1a1a3a', borderRadius: 3, overflow: 'hidden' },
    barraPreenchimento: { height: 6, borderRadius: 3 },
    alertaItem: { backgroundColor: '#111128', borderLeftWidth: 3, borderRadius: 8, padding: 10, marginBottom: 8 },
    alertaMensagem: { color: '#ffffff', fontSize: 13 },
    alertaHora: { color: '#555577', fontSize: 11, marginTop: 4 },
});