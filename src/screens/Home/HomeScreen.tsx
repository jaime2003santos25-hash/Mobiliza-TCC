import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
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
    biometricOn: false
  });

  const [cards, setCards] = useState<CardItem[]>([
    { id: '1', name: 'Bilhete Único SP', number: '•••• 5320', balance: 45.30, color: 'emerald', active: true, type: 'virtual', expiryDate: '08/32' },
    { id: '2', name: 'Cartão Estudante', number: '•••• 1045', balance: 15.00, color: 'blue', active: false, type: 'virtual', expiryDate: '12/29' }
  ]);

  const [trips, setTrips] = useState<TripItem[]>([
    { id: 't1', title: 'Metrô - Estação Sé', date: 'Hoje - 08:15', price: 4.40, type: 'metro' },
    { id: 't2', title: 'Recarga Pix', date: 'Ontem - 17:40', price: 50.00, type: 'recharge' },
    { id: 't3', title: 'Ônibus - Linha 2101', date: '23/06 - 11:20', price: 4.40, type: 'bus' }
  ]);

  const activeCard = cards[0];

  const handleUpdateProfile = (u: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...u }));
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'cartao': return <CardsView cards={cards} activeCardId={activeCard.id} onSetActive={()=>{}} onAddCard={()=>{}} onDeleteCard={()=>{}} />;
      case 'historico': return <HistoryView trips={trips} />;
      case 'perfil': return <ProfileView profile={profile} onUpdateProfile={handleUpdateProfile} tripCount={trips.length} onLogout={()=>{}} />;
      case 'nfc': return <NfcValidator onBack={() => setCurrentTab('inicio')} balance={activeCard.balance} activeCardName={activeCard.name} isOnline={true} />;
      default: return renderHome();
    }
  };

  const renderHome = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Olá, {profile.name}!</Text>
          <Text style={styles.wave}>👋</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Text style={{fontSize: 20}}>🔔</Text>
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Saldo atual</Text>
          <Text style={styles.balanceValue}>R$ {activeCard.balance.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.rechargeBtn} onPress={() => setIsRecharging(true)}>
          <Text style={styles.rechargeBtnText}>Recarregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <ActionItem icon="🕒" label="Histórico de viagens" onPress={() => setCurrentTab('historico')} />
        <ActionItem icon="💳" label="Meus cartões" onPress={() => setCurrentTab('cartao')} />
        <ActionItem icon="📁" label="Recarga" onPress={() => setIsRecharging(true)} />
        <ActionItem icon="⚙️" label="Configurações" onPress={() => setCurrentTab('perfil')} />
      </View>

      <TouchableOpacity style={styles.nfcBanner} onPress={() => setCurrentTab('nfc')}>
        <View style={styles.nfcIconBox}><Text style={{fontSize: 24}}>📱</Text></View>
        <View style={{flex: 1}}>
          <Text style={styles.nfcTitle}>Aproxime e passe</Text>
          <Text style={styles.nfcSub}>Use o NFC para validar sua passagem de forma rápida e segura.</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Últimas viagens</Text>
        <TouchableOpacity onPress={() => setCurrentTab('historico')}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {trips.slice(0, 3).map(trip => (
        <View key={trip.id} style={styles.tripItem}>
          <View style={styles.tripIcon}><Text>{trip.type === 'metro' ? '🚇' : '🚌'}</Text></View>
          <View style={{flex: 1}}>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <Text style={styles.tripDate}>{trip.date}</Text>
          </View>
          <Text style={styles.tripPrice}>R$ {trip.price.toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <ScreenWrapper backgroundColor={Theme.dark.bgPrimary}>
      <View style={{flex: 1}}>
        {renderContent()}

        {currentTab !== 'nfc' && (
          <View style={styles.tabBar}>
            <TabItem icon="🏠" label="Início" active={currentTab === 'inicio'} onPress={() => setCurrentTab('inicio')} />
            <TabItem icon="💳" label="Cartão" active={currentTab === 'cartao'} onPress={() => setCurrentTab('cartao')} />

            <View style={styles.centerTab}>
               <TouchableOpacity style={styles.nfcCircle} onPress={() => setCurrentTab('nfc')}>
                 <Text style={styles.nfcText}>NFC</Text>
               </TouchableOpacity>
            </View>

            <TabItem icon="🕒" label="Histórico" active={currentTab === 'historico'} onPress={() => setCurrentTab('historico')} />
            <TabItem icon="👤" label="Perfil" active={currentTab === 'perfil'} onPress={() => setCurrentTab('perfil')} />
          </View>
        )}

        <RechargeModal
          isOpen={isRecharging}
          onClose={() => setIsRecharging(false)}
          cards={cards}
          activeCardId={activeCard.id}
          onRechargeSuccess={(amt) => {
            const newCards = [...cards];
            newCards[0].balance += amt;
            setCards(newCards);
            setIsRecharging(false);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const ActionItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionIconBg}><Text style={{fontSize: 20}}>{icon}</Text></View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const TabItem = ({ icon, label, active, onPress }: any) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Text style={{fontSize: 20, opacity: active ? 1 : 0.4}}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: Theme.dark.textPrimary },
  wave: { fontSize: 22 },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.dark.bgCard, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Theme.dark.borderPrimary },
  dot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.dark.brand, borderWidth: 2, borderColor: Theme.dark.bgCard },
  balanceCard: { backgroundColor: Theme.dark.bgCard, borderRadius: 28, padding: 24, borderWidth: 1, borderColor: Theme.dark.borderPrimary, marginBottom: 24 },
  balanceLabel: { color: Theme.dark.textTertiary, fontSize: 13, marginBottom: 4 },
  balanceValue: { color: Theme.dark.textPrimary, fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  rechargeBtn: { backgroundColor: Theme.dark.brand, padding: 16, borderRadius: 16, alignItems: 'center' },
  rechargeBtnText: { color: Theme.dark.bgPrimary, fontWeight: 'bold', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionItem: { width: (width - 60) / 2, backgroundColor: Theme.dark.bgCard, padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: Theme.dark.borderPrimary },
  actionIconBg: { width: 44, height: 44, backgroundColor: 'rgba(0,184,124,0.1)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionLabel: { color: Theme.dark.textPrimary, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  nfcBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.dark.bgCard, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: Theme.dark.borderPrimary, marginBottom: 24 },
  nfcIconBox: { width: 50, height: 50, backgroundColor: 'rgba(0,184,124,0.1)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  nfcTitle: { color: Theme.dark.brand, fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  nfcSub: { color: Theme.dark.textTertiary, fontSize: 11, lineHeight: 16 },
  chevron: { color: Theme.dark.textQuaternary, fontSize: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: Theme.dark.textPrimary, fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: Theme.dark.brand, fontSize: 14, fontWeight: 'bold' },
  tripItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.dark.bgCard, padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: Theme.dark.borderPrimary },
  tripIcon: { width: 36, height: 36, backgroundColor: 'rgba(0,184,124,0.1)', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tripTitle: { color: Theme.dark.textSecondary, fontSize: 14, fontWeight: 'bold' },
  tripDate: { color: Theme.dark.textQuaternary, fontSize: 10, marginTop: 2 },
  tripPrice: { color: Theme.dark.textSecondary, fontWeight: 'bold' },
  tabBar: { height: 85, backgroundColor: Theme.dark.bgPrimary, borderTopWidth: 1, borderColor: Theme.dark.borderPrimary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 9, color: Theme.dark.textTertiary, marginTop: 4, fontWeight: 'bold' },
  tabLabelActive: { color: Theme.dark.brand },
  centerTab: { flex: 1, alignItems: 'center', marginTop: -40 },
  nfcCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Theme.dark.brand, borderWidth: 5, borderColor: Theme.dark.bgPrimary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  nfcText: { color: Theme.dark.bgPrimary, fontSize: 12, fontWeight: 'bold' },
});

export default HomeScreen;
