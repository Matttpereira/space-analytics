import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0a0a1a',
                    borderTopColor: '#1a1a3a',
                    borderTopWidth: 1,
                },
                tabBarActiveTintColor: '#00ff88',
                tabBarInactiveTintColor: '#555577',
                tabBarLabelStyle: { fontSize: 11 },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Missão',
                    tabBarIcon: ({ color, size }) => <Ionicons name="rocket" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="sensores"
                options={{
                    title: 'Sensores',
                    tabBarIcon: ({ color, size }) => <Ionicons name="radio" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="energia"
                options={{
                    title: 'Energia',
                    tabBarIcon: ({ color, size }) => <Ionicons name="flash" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="comunicacao"
                options={{
                    title: 'Comunicação',
                    tabBarIcon: ({ color, size }) => <Ionicons name="wifi" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="alertas"
                options={{
                    title: 'Alertas',
                    tabBarIcon: ({ color, size }) => <Ionicons name="warning" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="configuracoes"
                options={{
                    title: 'Config',
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}