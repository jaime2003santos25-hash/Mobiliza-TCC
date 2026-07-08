import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Home,
  CreditCard,
  History as HistoryIcon,
  User,
  Bell,
  Plus,
  ChevronRight,
  Wifi,
  Clock,
  Wallet
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import CardsView from '../../components/CardsView';
import HistoryView from '../../components/HistoryView';
import ProfileView from '../../components/ProfileView';
import NfcValidator from '../../components/NfcValidator';
import RechargeModal from '../../components/RechargeModal';
import { Theme } from '../../styles/theme';
import { UserProfile, CardItem, TripItem } from '../../types';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'cartao' | 'nfc' | 'historico' | 'perfil'>('inicio');
  const [isRecharging, setIsRecharging] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jayme',
    balance: 45.30,
    notificationOn: true,
    biometricOn: true
  });

  const [cards, setCards] = useState<CardItem[]>([
    { id: '1', name: 'Bilhete Único SP', number: '•••• •••• •••• 5320', balance: 45.30, color: 'emerald', active: true, type: 'virtual', expiryDate: '12/30' }
  ]);

  const [trips, setTrips] = useState<TripItem[]>([
    { id: 't1', title: 'Metrô - Estação Sé', date: '25/06/2026', price: 4.40, type: 'metro' },
    { id: 't2', title: 'Recarga Pix', date: '24/06/2026', price: 50.00, type: 'recharge' },
    { id: 't3', title: 'Ônibus - Linha 2101', date: '23/06/2026', price: 4.40, type: 'bus' }
  ]);

  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      const cachedProfile = await AsyncStorage.getItem('@mobiliza:profile');
      if (cachedProfile) setProfile(JSON.parse(cachedProfile));
    } catch (e) {
      console.error('Erro ao carregar cache', e);
    }
  };

  const activeCard = cards.find(c => c.active) || cards[0];

  const renderContent = () => {
    switch (currentTab) {
      case 'cartao': return <CardsView cards={cards} activeCardId={activeCard.id} onSetActive={()=>{}} onAddCard={()=>{}} onDeleteCard={()=>{}} />;
      case 'historico': return <HistoryView trips={trips} />;
      case 'perfil': return <ProfileView profile={profile} onUpdateProfile={(u) => setProfile(p => ({...p, ...u}))} tripCount={trips.length} onLogout={()=>{}} />;
      case 'nfc': return (
        <NfcValidator
          onBack={() => setCurrentTab('inicio')}
          balance={activeCard.balance}
          activeCardName={activeCard.name}
          isOnline={true}
        />
      );
      default: return renderHome();
    }
  };

  const renderHome = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingSmall}>Olá,</Text>
          <Text style={styles.greetingLarge}>{profile.name}</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Bell size={22} color="#FFF" />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>SALDO ATUAL</Text>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ATIVO</Text>
          </View>
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>R$ {activeCard.balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.plusBtn} onPress={() => setIsRecharging(true)}>
            <Plus size={24} color="#0D1317" strokeWidth={4} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cardInfoRow} onPress={() => setCurrentTab('cartao')}>
          <View style={styles.cardIconSmall}>
             <CreditCard size={14} color="#7fa89e" />
          </View>
          <Text style={styles.cardOwnerText}>{profile.name.toUpperCase()}</Text>
          <ChevronRight size={18} color="#7fa89e" />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsRecharging(true)}>
          <View style={styles.actionIcon}><Wallet size={20} color="#00b87c" /></View>
          <Text style={styles.actionLabel}>Recarga Pix</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setCurrentTab('cartao')}>
          <View style={styles.actionIcon}><CreditCard size={20} color="#00b87c" /></View>
          <Text style={styles.actionLabel}>Minha Carteira</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mainNfcBtn} onPress={() => setCurrentTab('nfc')}>
        <View style={styles.nfcWavesCircle}>
          <Wifi size={24} color="#0D1317" style={{ transform: [{ rotate: '90deg' }] }} />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.nfcBtnTitle}>Validar Passagem</Text>
          <Text style={styles.nfcBtnSub}>Toque para ativar o sensor NFC</Text>
        </View>
        <ChevronRight size={24} color="#0D1317" opacity={0.5} />
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Atividades recentes</Text>
        <TouchableOpacity onPress={() => setCurrentTab('historico')}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {trips.slice(0, 3).map(trip => (
        <View key={trip.id} style={styles.tripItem}>
          <View style={styles.tripIconBox}>
             <Clock size={16} color="#7fa89e" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <Text style={styles.tripDate}>{trip.date}</Text>
          </View>
          <Text style={[styles.tripPrice, { color: trip.type === 'recharge' ? '#00b87c' : '#FFF' }]}>
            {trip.type === 'recharge' ? '+' : '-'} R$ {trip.price.toFixed(2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <ScreenWrapper backgroundColor="#090e11">
      <View style={{flex: 1}}>
        {renderContent()}

        {currentTab !== 'nfc' && (
          <View style={styles.tabBar}>
            <TabItem icon={Home} label="Início" active={currentTab === 'inicio'} onPress={() => setCurrentTab('inicio')} />
            <TabItem icon={CreditCard} label="Cartões" active={currentTab === 'cartao'} onPress={() => setCurrentTab('cartao')} />

            <View style={styles.centerTab}>
               <TouchableOpacity style={styles.nfcCircle} onPress={() => setCurrentTab('nfc')}>
                 <Wifi size={28} color="#0D1317" style={{ transform: [{ rotate: '90deg' }] }} />
               </TouchableOpacity>
               <Text style={styles.nfcTabLabel}>NFC</Text>
            </View>

            <TabItem icon={HistoryIcon} label="Histórico" active={currentTab === 'historico'} onPress={() => setCurrentTab('historico')} />
            <TabItem icon={User} label="Perfil" active={currentTab === 'perfil'} onPress={() => setCurrentTab('perfil')} />
          </View>
        )}

        <RechargeModal
          isOpen={isRecharging}
          onClose={() => setIsRecharging(false)}
          cards={cards}
          activeCardId={activeCard.id}
          onRechargeSuccess={() => setIsRecharging(false)}
        />
      </View>
    </ScreenWrapper>
  );
};

const TabItem = ({ icon: Icon, label, active, onPress }: any) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Icon size={24} color={active ? '#00b87c' : '#FFF'} style={{ opacity: active ? 1 : 0.4 }} />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 140 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greetingSmall: { color: '#7fa89e', fontSize: 14, fontWeight: '500' },
  greetingLarge: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginTop: 2 },
  bellBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1A2227', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2D373D' },
  dot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#00b87c', borderWidth: 2, borderColor: '#1A2227' },

  balanceCard: { backgroundColor: '#14251F', borderRadius: 32, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0,184,124,0.1)' },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceLabel: { color: '#7fa89e', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5 },
  activeBadge: { backgroundColor: 'rgba(0,184,124,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeBadgeText: { color: '#00b87c', fontSize: 9, fontWeight: 'bold' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  balanceValue: { color: '#FFF', fontSize: 40, fontWeight: 'bold' },
  plusBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00b87c', justifyContent: 'center', alignItems: 'center' },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  cardIconSmall: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  cardOwnerText: { color: '#7fa89e', fontSize: 12, fontWeight: 'bold', flex: 1, letterSpacing: 1 },

  quickActions: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  actionBtn: { flex: 1, backgroundColor: '#1A2227', padding: 22, borderRadius: 28, borderWidth: 1, borderColor: '#2D373D' },
  actionIcon: { width: 36, height: 36, backgroundColor: 'rgba(0,184,124,0.05)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  actionLabel: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  mainNfcBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00b87c', padding: 22, borderRadius: 32, marginBottom: 32 },
  nfcWavesCircle: { width: 52, height: 52, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  nfcBtnTitle: { color: '#0D1317', fontSize: 17, fontWeight: 'bold' },
  nfcBtnSub: { color: 'rgba(13,19,23,0.6)', fontSize: 12, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  seeAll: { color: '#00b87c', fontSize: 14, fontWeight: 'bold' },

  tripItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2227', padding: 18, borderRadius: 28, marginBottom: 12, borderWidth: 1, borderColor: '#2D373D' },
  tripIconBox: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  tripTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  tripDate: { color: '#7fa89e', fontSize: 11, marginTop: 4 },
  tripPrice: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  tabBar: {
    height: Platform.OS === 'ios' ? 100 : 85,
    backgroundColor: '#0D1317',
    borderTopWidth: 1,
    borderColor: '#1A2227',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#7fa89e', marginTop: 6, fontWeight: 'bold' },
  tabLabelActive: { color: '#00b87c' },
  centerTab: { flex: 1, alignItems: 'center', marginTop: -45 },
  nfcCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00b87c',
    borderWidth: 6,
    borderColor: '#0D1317',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00b87c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10
  },
  nfcTabLabel: { fontSize: 10, color: '#7fa89e', fontWeight: 'bold', marginTop: 4 }
});

export default HomeScreen;
