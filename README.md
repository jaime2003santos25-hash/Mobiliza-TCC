# Mobiliza - Tecnologia para Mobilidade Urbana 🚇🚌

O **Mobiliza** é uma solução moderna e intuitiva desenvolvida como projeto de Trabalho de Conclusão de Curso (TCC), focada em otimizar a experiência do usuário no transporte público. Através da tecnologia NFC e uma interface de alta fidelidade, o aplicativo permite a gestão de saldos, recargas via Pix e validação de passagens de forma rápida e segura.

---

## 🚀 Funcionalidades Principais

- **Validação NFC:** Simulação de validação de passagens em catracas via tecnologia de aproximação.
- **Gestão de Carteira:** Visualização detalhada de cartões virtuais e físicos com interface premium.
- **Recarga Inteligente:** Fluxo de recarga simplificado com suporte a Pix e cartões.
- **Histórico de Viagens:** Monitoramento completo de atividades recentes com filtros por categoria (Metrô, Ônibus, Recarga).
- **Eco-Impacto:** Dashboard que calcula a economia de CO2 e a contribuição ecológica do usuário ao utilizar transporte público.
- **Suporte Offline:** Carregamento instantâneo de dados via cache local (AsyncStorage), garantindo funcionalidade mesmo sem conexão ativa.

---

## 🛠️ Stack Tecnológica

### Frontend (Mobile)
- **Framework:** [React Native](https://reactnative.dev/) (CLI)
- **Linguagem:** TypeScript
- **Ícones:** Lucide Icons
- **Navegação:** React Navigation
- **Persistência Local:** AsyncStorage (Arquitetura Offline-First)
- **Estilização:** StyleSheet com Design System personalizado (Emerald & Cyan).

### Backend (API)
- **Framework:** Spring Boot 3.2.0
- **Linguagem:** Java 17
- **Segurança:** Spring Security com autenticação JWT
- **Banco de Dados:** PostgreSQL (Hospedado no Railway)
- **Serviço de E-mail:** Java Mail Sender (Recuperação de senha via SMTP Gmail)

---

## 📂 Estrutura de Diretórios

O projeto está organizado em uma arquitetura limpa, separando responsabilidades de Frontend e Backend:

### Raiz (Frontend)
- `src/components/`: Componentes reutilizáveis (Ex: `NfcValidator`, `UserTicketCard`, `ScreenWrapper`).
- `src/screens/`: Telas principais da aplicação (Home, Login, Perfil, Histórico).
- `src/services/`: Integração com a API Axios e lógica de autenticação.
- `src/assets/`: Recursos visuais, logos e imagens.
- `android/`: Configurações nativas e scripts de build Gradle para Android.
- `ios/`: Configurações nativas e arquivos de permissão para iOS.

### `mobiliza-backend/` (Servidor)
- `src/main/java/com/mobiliza/controller/`: Endpoints da API REST.
- `src/main/java/com/mobiliza/service/`: Lógica de negócio e regras de validação.
- `src/main/java/com/mobiliza/repository/`: Interfaces de comunicação com o banco de dados.
- `src/main/java/com/mobiliza/model/`: Entidades persistentes (Usuário, Cartão, Viagem, Saldo).
- `src/main/resources/`: Configurações de ambiente (`application.properties`).

---

## 👥 Equipe do Projeto
- **Jayme N. dos Santos**
- **Sandra N. da Silva Santos**
- **Silvana**
- **Jordan**
- **Mateus**
- **Lucas**

**Orientação Acadêmica:** Prof. Denilson Bernardo

---

## 🛠️ Como Executar

### 1. Iniciar o Backend
1. Navegue até `mobiliza-backend`.
2. Execute o comando: `mvn clean spring-boot:run`.
3. Certifique-se de que o servidor iniciou na porta `8080`.

### 2. Iniciar o Mobile
1. Na raiz do projeto, instale as dependências: `npm install`.
2. Inicie o Metro Bundler: `npx react-native start --reset-cache`.
3. Em outro terminal, execute o app no emulador: `npx react-native run-android`.

---

© 2026 Mobiliza App. Desenvolvido para fins acadêmicos e inovação em mobilidade urbana.
