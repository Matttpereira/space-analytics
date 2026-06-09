import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useMission } from '../../context/MissionContext';

function AlertaCard({ alerta, onDismiss }) {
    const critico = alerta.tipo === 'CRITICO';
    return (
        <View style={[styles.card, { borderLeftColor: critico ? '#ff4444' : '#ffaa00' }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardIcone}>{critico ? '🔴' : '🟡'}</Text>
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardTipo, { color: critico ? '#ff4444' : '#ffaa00' }]}>
                        {alerta.tipo}
                    </Text>
                    <Text style={styles.cardHora}>{alerta.hora}</Text>
                </View>
                <TouchableOpacity onPress={() => onDismiss(alerta.id)} style={styles.dismissBtn}>
                    <Text style={styles.dismissTexto}>✕</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.cardMensagem}>{alerta.mensagem}</Text>
        </View>
    );
}

export default function Alertas() {
    const { alertas, setAlertas } = useMission();

    const handleDismiss = (id) => {
        setAlertas(prev => prev.filter(a => a.id !== id));
    };

    const handleLimparTodos = () => {
        setAlertas([]);
    };

    const criticos = alertas.filter(a => a.tipo === 'CRITICO');
    const avisos = alertas.filter(a => a.tipo === 'AVISO');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.titulo}>🚨 ALERTAS</Text>
            <Text style={styles.subtitulo}>Monitoramento de anomalias</Text>

            {/* Resumo */}
            <View style={styles.resumo}>
                <View style={styles.resumoItem}>
                    <Text style={[styles.resumoNumero, { color: '#ff4444' }]}>{criticos.length}</Text>
                    <Text style={styles.resumoLabel}>Críticos</Text>
                </View>
                <View style={styles.resumoDivisor} />
                <View style={styles.resumoItem}>
                    <Text style={[styles.resumoNumero, { color: '#ffaa00' }]}>{avisos.length}</Text>
                    <Text style={styles.resumoLabel}>Avisos</Text>
                </View>
                <View style={styles.resumoDivisor} />
                <View style={styles.resumoItem}>
                    <Text style={[styles.resumoNumero, { color: '#00ff88' }]}>{alertas.length}</Text>
                    <Text style={styles.resumoLabel}>Total</Text>
                </View>
            </View>

            {/* Botão limpar */}
            {alertas.length > 0 && (
                <TouchableOpacity style={styles.limparBtn} onPress={handleLimparTodos}>
                    <Text style={styles.limparTexto}>🗑️ Limpar todos os alertas</Text>
                </TouchableOpacity>
            )}

            {/* Lista de alertas */}
            {alertas.length === 0 ? (
                <View style={styles.vazio}>
                    <Text style={styles.vazioBig}>✅</Text>
                    <Text style={styles.vazioTexto}>Nenhum alerta ativo</Text>
                    <Text style={styles.vazioSub}>Todos os sistemas operam normalmente</Text>
                </View>
            ) : (
                <>
                    {criticos.length > 0 && (
                        <>
                            <Text style={styles.secaoTitulo}>🔴 CRÍTICOS</Text>
                            {criticos.map(a => (
                                <AlertaCard key={a.id} alerta={a} onDismiss={handleDismiss} />
                            ))}
                        </>
                    )}
                    {avisos.length > 0 && (
                        <>
                            <Text style={styles.secaoTitulo}>🟡 AVISOS</Text>
                            {avisos.map(a => (
                                <AlertaCard key={a.id} alerta={a} onDismiss={handleDismiss} />
                            ))}
                        </>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a1a' },
    content: { padding: 16, paddingBottom: 40 },
    titulo: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', letterSpacing: 3, marginTop: 50, textAlign: 'center' },
    subtitulo: { color: '#555577', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    resumo: { backgroundColor: '#111128', borderRadius: 12, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
    resumoItem: { alignItems: 'center' },
    resumoNumero: { fontSize: 32, fontWeight: 'bold' },
    resumoLabel: { color: '#555577', fontSize: 12, marginTop: 4 },
    resumoDivisor: { width: 1, height: 40, backgroundColor: '#1a1a3a' },
    limparBtn: { backgroundColor: '#1a1a3a', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 16 },
    limparTexto: { color: '#aaaaaa', fontSize: 13 },
    secaoTitulo: { color: '#555577', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10, marginTop: 8 },
    card: { backgroundColor: '#111128', borderLeftWidth: 3, borderRadius: 8, padding: 14, marginBottom: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    cardIcone: { fontSize: 20, marginRight: 10 },
    cardInfo: { flex: 1 },
    cardTipo: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    cardHora: { color: '#555577', fontSize: 11, marginTop: 2 },
    dismissBtn: { padding: 4 },
    dismissTexto: { color: '#555577', fontSize: 16 },
    cardMensagem: { color: '#dddddd', fontSize: 14 },
    vazio: { alignItems: 'center', marginTop: 60 },
    vazioBig: { fontSize: 60, marginBottom: 16 },
    vazioTexto: { color: '#00ff88', fontSize: 18, fontWeight: 'bold' },
    vazioSub: { color: '#555577', fontSize: 13, marginTop: 8 },
});