import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Alert } from 'react-native';
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
export default function App() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  async function buscarPublicacoes() {
    setCarregando(true);
    setErro('');

    try {
      // 1. Realiza a requisição HTTP GET
      const resposta = await fetch(API_URL);
      // 2. Verifica se a resposta foi bem-sucedida
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      // 3. Converte o JSON recebido em dados JavaScript
      const dados = await resposta.json();
      // 4. Guarda os dados para exibição na tela
      setPublicacoes(dados.slice(0, 10));
    } catch (error) {
      setErro(
        'Não foi possível carregar os dados. Verifique a conexão e tente novamente.'
      );
      console.error('Falha na API:', error);
    } finally {
      // Executado havendo sucesso ou erro
      setCarregando(false);
    }
  }
  const publicacoesFiltradas = publicacoes.filter((item) =>
    item.title.toLowerCase().includes(busca.toLowerCase())
  );


  function renderizarPublicacao({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.id}>PUBLICAÇÃO #{item.id}</Text>
        <Text style={styles.titulo}>
          {item.title}
        </Text>
        <Text style={styles.conteudo}>
          {item.body}
        </Text>
        {<Pressable style={[
          styles.botaoDetalhes,
          carregando && styles.botaoDesabilitado,
        ]}
          onPress={() => Alert.alert(item.title, item.body)}
          disabled={carregando}>
          <Text style={styles.textoDetalhes}>
            {carregando ? 'Consultando...' : 'Exibir detalhes'}
          </Text>
        </Pressable>}

      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.cabecalho}>
        <Text style={styles.etiqueta}>AULA PRÁTICA • API REST</Text>
        <Text style={styles.tituloPrincipal}>
          Dados na Nuvem
        </Text>
        <Text style={styles.subtitulo}>
          Consulte publicações de um serviço remoto usando HTTP e JSON.
        </Text>
      </View>
      <Pressable
        style={[
          styles.botao,
          carregando && styles.botaoDesabilitado,
        ]}
        onPress={buscarPublicacoes}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Consultando...' : 'Buscar publicações'}
        </Text>
      </Pressable>
      {carregando && (
        <View style={styles.estado}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.textoEstado}>
            Buscando dados na nuvem...
          </Text>
        </View>
      )}
      {!!erro && !carregando && (
        <View style={styles.erroBox}>
          <Text style={styles.textoErro}>{erro}</Text>
          <Pressable onPress={buscarPublicacoes}>
            <Text style={styles.tentarNovamente}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      )}
      {!carregando && !erro && publicacoes.length === 0 && (
        <View style={styles.estado}>
          <Text style={styles.iconeNuvem}> </Text>
          <Text style={styles.textoEstado}>
            Toque no botão para carregar os dados da API.
          </Text>
        </View>
      )}
      {!carregando && !erro && publicacoes.length > 0 && (
        <Text style={styles.contador}>
          {publicacoes.length} publicações recebidas

        </Text>
      )}
      <TextInput
        style={styles.botaoBusca}
        placeholder="Pesquisar pelo título..."
        value={busca}
        onChangeText={setBusca}
      />
      <FlatList

        data={publicacoesFiltradas}
        renderItem={renderizarPublicacao}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: 12,
  },
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  etiqueta: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tituloPrincipal: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitulo: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  botao: {
    backgroundColor: '#2563EB',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoDetalhes: {
    backgroundColor: '#2563EB',
    marginHorizontal: 50,
    padding: 10,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoBusca: {
    backgroundColor: '#e4ecfdff',
    marginHorizontal: 25,
    padding: 10,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textoDetalhes: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  estado: {
    alignItems: 'center',
    padding: 24,
  },
  iconeNuvem: {
    fontSize: 42,
    marginBottom: 8,
  },
  textoEstado: {
    color: '#475569',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  contador: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  lista: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  id: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },
  titulo: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  conteudo: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 21,
  },
  erroBox: {
    backgroundColor: '#FEE2E2',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  textoErro: {
    color: '#991B1B',
    fontSize: 14,
  },
  tentarNovamente: {
    color: '#1D4ED8',
    fontWeight: '700',
    marginTop: 12,
  },
});