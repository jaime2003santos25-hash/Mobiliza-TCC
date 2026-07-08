import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import authService from '../../services/authService';
import ScreenWrapper from '../../components/ScreenWrapper';
import { Theme } from '../../styles/theme';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      await authService.signUp({ nome, email, senha });
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Erro ao criar conta.';
      Alert.alert('Erro no Cadastro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Junte-se ao Mobiliza e facilite suas viagens.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor={Theme.dark.textQuaternary}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                placeholderTextColor={Theme.dark.textQuaternary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={Theme.dark.textQuaternary}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Repita sua senha"
                placeholderTextColor={Theme.dark.textQuaternary}
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Theme.dark.bgPrimary} />
              ) : (
                <Text style={styles.signUpButtonText}>CRIAR CONTA</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Já tenho uma conta. <Text style={{color: Theme.dark.brand, fontWeight: 'bold'}}>Entrar</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.dark.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.dark.brand,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: Theme.dark.brand,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Theme.dark.bgCard,
    borderWidth: 1,
    borderColor: Theme.dark.borderPrimary,
    borderRadius: 16,
    padding: 16,
    color: Theme.dark.textPrimary,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: Theme.dark.brand,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    // Sombras para iOS
    shadowColor: Theme.dark.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Sombra para Android
    elevation: 4,
  },
  signUpButtonText: {
    color: Theme.dark.bgPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  backButtonText: {
    color: Theme.dark.textQuaternary,
    fontSize: 14,
  },
});

export default SignUpScreen;
