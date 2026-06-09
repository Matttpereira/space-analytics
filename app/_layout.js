import { Stack } from 'expo-router';
import { MissionProvider } from '../context/MissionContext';

export default function RootLayout() {
    return (
        <MissionProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </MissionProvider>
    );
}