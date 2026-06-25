import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import rechargeService, { FormaPagamento } from '../../services/rechargeService';

const VALORES_RAPIDOS = [10, 20, 50, 100];

const FORMAS_PAGAMENTO: { label: string; value: FormaPagamento; icon: string }[] = [
  { label: 'Pix', value: 'PIX', icon: '💎' },
  { label: 'Cartão de Crédito', value: 'CARTAO_CREDITO', icon: '💳' },
  { label: 'Cartão de Débito', value: 'CARTAO_DEBITO', icon: '🏦' },
];

const RechargeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [valorSelecionado, setValorSelecionado] = useState<number | null>(null);
  const [valorCustom, setValorCustom] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null);
  const [loading, setLoading] = useState(false);

  const valorFinal = (): number | null => {
    if (valorCustom) {
      const parsed = parseFloat(valorCustom.replace(',', '.'));
      return isNaN(parsed) ? null : parsed;
    }
    return valorSelecionado;
  };

  const handleConfirmar = async () => {
    const valor = valorFinal();

    if (!valor || valor <= 0) {
      Alert.alert('Atenção', 'Escolha ou digite um valor válido para a recarga.');
      return;
    }

    if (!formaPagamento) {
      Alert.alert('Atenção', 'Escolha uma forma de pagamento.');
      return;
    }

    setLoading(true);

    try {
      const resultado = await rechargeService.recharge({
        valor,
        formaPagamento,
      });

      Alert.alert(
        'Recarga confirmada!',
        `Seu novo saldo é ${resultado.saldo.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
      );
    } catch (error: any) {
      const mensagem = error.response?.data?.mensagem || 'Não foi possível concluir a recarga.';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recarregar</Text>
        <Text style={styles.subtitle}>Seu saldo cai na hora em pagamentos via Pix ou Cartão.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputCard}>
          <Text style={styles.sectionLabel}>Valor da Recarga</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currency}>R$</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              placeholderTextColor="#5e8278"
              keyboardType="numeric"
              value={valorCustom || (valorSelecionado ? valorSelecionado.toString() : '')}
              onChangeText={(text) => {
                setValorCustom(text);
                setValorSelecionado(null);
              }}
            />
          </View>
        </View>

        <View style={styles.valoresGrid}>
          {VALORES_RAPIDOS.map((valor) => (
            <TouchableOpacity
              key={valor}
              style={[
                styles.valorChip,
                valorSelecionado === valor && styles.valorChipSelected,
              ]}
              onPress={() => {
                setValorSelecionado(valor);
                setValorCustom('');
              }}
            >
              <Text
                style={[
                  styles.valorChipText,
                  valorSelecionado === valor && styles.valorChipTextSelected,
                ]}
              >
                + R$ {valor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Forma de pagamento</Text>
        <View style={styles.pagamentoList}>
          {FORMAS_PAGAMENTO.map((forma) => (
            <TouchableOpacity
              key={forma.value}
              style={[
                styles.pagamentoItem,
                formaPagamento === forma.value && styles.pagamentoItemSelected,
              ]}
              onPress={() => setFormaPagamento(forma.value)}
            >
              <Text style={styles.methodIcon}>{forma.icon}</Text>
              <Text
                style={[
                  styles.pagamentoText,
                  formaPagamento === forma.value && styles.pagamentoTextSelected,
                ]}
              >
                {forma.label}
              </Text>
              {formaPagamento === forma.value && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0D1B1E" />
          ) : (
            <Text style={styles.confirmButtonText}>CONFIRMAR RECARGA</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B1E',
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F2F4F7',
  },
  subtitle: {
    fontSize: 14,
    color: '#5DCAA5',
    marginTop: 8,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  inputCard: {
    backgroundColor: '#0c2b27',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1d4a42',
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#5DCAA5',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    color: '#F2F4F7',
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    color: '#F2F4F7',
    fontSize: 40,
    fontWeight: 'bold',
    flex: 1,
  },
  valoresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  valorChip: {
    backgroundColor: 'rgba(93, 202, 165, 0.05)',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: '23%',
    alignItems: 'center',
  },
  valorChipSelected: {
    backgroundColor: '#0DB39E',
    borderColor: '#0DB39E',
  },
  valorChipText: {
    color: '#5DCAA5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  valorChipTextSelected: {
    color: '#0D1B1E',
  },
  sectionTitle: {
    color: '#F2F4F7',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pagamentoList: {
    gap: 12,
  },
  pagamentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c2b27',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 16,
    padding: 16,
  },
  pagamentoItemSelected: {
    borderColor: '#0DB39E',
    backgroundColor: '#103d36',
  },
  methodIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  pagamentoText: {
    color: '#F2F4F7',
    fontSize: 15,
    flex: 1,
  },
  pagamentoTextSelected: {
    color: '#0DB39E',
    fontWeight: 'bold',
  },
  checkIcon: {
    color: '#0DB39E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#0DB39E',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#0D1B1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RechargeScreen;
