import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>🚀 Space Analytics</Text>
            <Text style={styles.sub}>Missão iniciada com sucesso!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#00ff88',
        fontSize: 28,
        fontWeight: 'bold',
    },
    sub: {
        color: '#aaaaaa',
        fontSize: 16,
        marginTop: 10,
    },
});