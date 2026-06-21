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

const VALORES_RAPIDOS = [10, 20, 50, 100, 150];

const FORMAS_PAGAMENTO: { label: string; value: FormaPagamento }[] = [
  { label: 'Pix', value: 'PIX' },
  { label: 'Cartão de Crédito', value: 'CARTAO_CREDITO' },
  { label: 'Cartão de Débito', value: 'CARTAO_DEBITO' },
];

const RechargeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [valorSelecionado, setValorSelecionado] = useState<number | null>(null);
  const [valorCustom, setValorCustom] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null);
  const [loading, setLoading] = useState(false);

  const selecionarValorRapido = (valor: number) => {
    setValorSelecionado(valor);
    setValorCustom('');
  };

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
        `Novo saldo: ${resultado.saldo.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
      );
    } catch (error: any) {
      const mensagem =
        error.response?.data?.mensagem ||
        error.response?.data?.message ||
        'Não foi possível concluir a recarga. Tente novamente.';
      Alert.alert('Erro na recarga', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Recarregar saldo</Text>

      <Text style={styles.sectionLabel}>Escolha o valor</Text>
      <View style={styles.valoresGrid}>
        {VALORES_RAPIDOS.map((valor) => (
          <TouchableOpacity
            key={valor}
            style={[
              styles.valorChip,
              valorSelecionado === valor && styles.valorChipSelected,
            ]}
            onPress={() => selecionarValorRapido(valor)}
          >
            <Text
              style={[
                styles.valorChipText,
                valorSelecionado === valor && styles.valorChipTextSelected,
              ]}
            >
              R$ {valor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Ou digite outro valor</Text>
      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        placeholderTextColor="#5e8278"
        keyboardType="numeric"
        value={valorCustom}
        onChangeText={(text) => {
          setValorCustom(text);
          setValorSelecionado(null);
        }}
      />

      <Text style={styles.sectionLabel}>Forma de pagamento</Text>
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
            <Text
              style={[
                styles.pagamentoText,
                formaPagamento === forma.value && styles.pagamentoTextSelected,
              ]}
            >
              {forma.label}
            </Text>
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
          <Text style={styles.confirmButtonText}>Confirmar recarga</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B1E',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F2F4F7',
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#F2F4F7',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  valoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  valorChip: {
    backgroundColor: '#0c2b27',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  valorChipSelected: {
    backgroundColor: '#0DB39E',
    borderColor: '#0DB39E',
  },
  valorChipText: {
    color: '#F2F4F7',
    fontSize: 14,
    fontWeight: '600',
  },
  valorChipTextSelected: {
    color: '#0D1B1E',
  },
  input: {
    backgroundColor: '#0c2b27',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#F2F4F7',
    fontSize: 16,
  },
  pagamentoList: {
    gap: 10,
  },
  pagamentoItem: {
    backgroundColor: '#0c2b27',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pagamentoItemSelected: {
    backgroundColor: '#103d36',
    borderColor: '#0DB39E',
  },
  pagamentoText: {
    color: '#F2F4F7',
    fontSize: 15,
  },
  pagamentoTextSelected: {
    color: '#5DCAA5',
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#0DB39E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  confirmButtonText: {
    color: '#0D1B1E',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RechargeScreen;
