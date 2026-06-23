import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

import authService from '../../services/authService';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const enviarCodigo = async () => {
    try {
      setLoading(true);

      await authService.forgotPassword({
        email,
      });

      setCodigoEnviado(true);

      Alert.alert(
        'Sucesso',
        'Código enviado para seu e-mail.'
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.response?.data?.message ||
          'Não foi possível enviar o código.'
      );
    } finally {
      setLoading(false);
    }
  };

  const redefinirSenha = async () => {
    try {
      setLoading(true);

      await authService.resetPassword({
        email,
        codigo,
        novaSenha,
      });

      Alert.alert(
        'Sucesso',
        'Senha alterada com sucesso!'
      );

      setEmail('');
      setCodigo('');
      setNovaSenha('');
      setCodigoEnviado(false);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.response?.data?.message ||
          'Não foi possível alterar a senha.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Recuperar Senha
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {!codigoEnviado ? (
        <TouchableOpacity
          style={styles.button}
          onPress={enviarCodigo}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Enviando...'
              : 'Enviar Código'}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Código recebido"
            value={codigo}
            onChangeText={setCodigo}
          />

          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={redefinirSenha}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? 'Alterando...'
                : 'Alterar Senha'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;