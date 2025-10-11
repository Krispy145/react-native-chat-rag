import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, Text, Button, TextInput } from 'react-native';
import { useAuthStore } from './store/authStore';

function ChatScreen() {
  const [q, setQ] = React.useState('');
  const [answer, setAnswer] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const ask = async () => {
    setLoading(true);
    try {
      const { api } = await import('./shared/api');
      const { data } = await api.post('/rag/query', { query: q });
      setAnswer(data?.answer ?? 'No answer');
    } catch (e: any) {
      setAnswer(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>RAG Chat</Text>
        <TextInput placeholder="Ask something..." value={q} onChangeText={setQ}
          style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
        <Button title={loading ? 'Asking...' : 'Ask'} onPress={ask} disabled={loading} />
        <View style={{ height: 12 }} />
        <Text selectable>{answer}</Text>
      </View>
    </SafeAreaView>
  );
}

function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Sign in</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail}
          autoCapitalize="none" keyboardType="email-address"
          style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword}
          secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
        <Button title="Sign in" onPress={async () => {
          const ok = await login({ email, password });
          if (ok) navigation.replace('Chat');
        }} />
      </View>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const isAuthed = useAuthStore((s) => !!s.accessToken);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthed ? (
          <Stack.Screen name="Chat" component={ChatScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}