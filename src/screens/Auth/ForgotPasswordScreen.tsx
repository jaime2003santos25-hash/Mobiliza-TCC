import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import authService from '../../services/authService';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const enviarCodigo = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, digite seu e-mail.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.forgotPassword({ email });
      setCodigoEnviado(true);
      Alert.alert('Sucesso', response.mensagem || 'Código enviado para seu e-mail.');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Não foi possível enviar o código. Verifique sua conexão.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const redefinirSenha = async () => {
    if (!codigo || !novaSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword({
        email,
        codigo,
        novaSenha,
      });

      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Erro ao alterar senha.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            {!codigoEnviado
              ? 'Informe seu e-mail cadastrado para receber o código de validação.'
              : 'Digite o código de 6 dígitos enviado e sua nova senha.'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, codigoEnviado && styles.inputDisabled]}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#5e8278"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!codigoEnviado}
            />
          </View>

          {!codigoEnviado ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={enviarCodigo}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0D1B1E" />
              ) : (
                <Text style={styles.actionButtonText}>ENVIAR CÓDIGO</Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Código de Verificação</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor="#5e8278"
                  keyboardType="number-pad"
                  value={codigo}
                  onChangeText={setCodigo}
                  maxLength={6}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#5e8278"
                  secureTextEntry
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={redefinirSenha}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0D1B1E" />
                ) : (
                  <Text style={styles.actionButtonText}>ALTERAR SENHA</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCodigoEnviado(false)}
              >
                <Text style={styles.backButtonText}>Não recebi o código. Tentar novamente</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B1E',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F2F4F7',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#5DCAA5',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#5DCAA5',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0c2b27',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 12,
    padding: 16,
    color: '#F2F4F7',
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: '#051211',
  },
  actionButton: {
    backgroundColor: '#0DB39E',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  actionButtonText: {
    color: '#0D1B1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0DB39E',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7fa89e',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
