import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';
import ScreenWrapper from '../../components/ScreenWrapper';
import { Theme } from '../../styles/theme';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login({ email, senha });
      await AsyncStorage.setItem('@mobiliza:token', data.token);
      await AsyncStorage.setItem('@mobiliza:email', data.email);
      navigation.replace('Main');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Email ou senha incorretos.';
      Alert.alert('Erro no Login', msg);
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
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo_mobiliza.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.form}>
            <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
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
                placeholder="Digite sua senha"
                placeholderTextColor={Theme.dark.textQuaternary}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Theme.dark.bgPrimary} />
              ) : (
                <Text style={styles.loginButtonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 120,
  },
  form: {
    width: '100%',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.dark.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Space Grotesk' : 'sans-serif',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: Theme.dark.brand,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: Theme.dark.textQuaternary,
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Theme.dark.brand,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: Theme.dark.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: Theme.dark.bgPrimary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: Theme.dark.textQuaternary,
    fontSize: 14,
  },
  signUpText: {
    color: Theme.dark.brand,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
