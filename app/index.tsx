import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { 
  IdeaCard, 
  CaptureInput,
  FloatingActionButton,
  Input,
  Button 
} from '../src/components';
import { useIdeas } from '../src/hooks/useIdeas';
import { Idea } from '../src/types';
import { debounce } from '../src/utils';

export default function HomeScreen() {
  const {
    ideas,
    loading,
    refreshing,
    error,
    addIdea,
    toggleFavorite,
    deleteIdea,
    refreshIdeas,
    searchIdeas,
    retry,
  } = useIdeas();

  const [showCaptureInput, setShowCaptureInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search para não fazer muitas chamadas
  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim()) {
      await searchIdeas(query);
    } else {
      await refreshIdeas();
    }
  }, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleAddIdea = async (content: string, tags: string[]) => {
    try {
      await addIdea(content, tags);
      setShowCaptureInput(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a ideia');
    }
  };

  const handleIdeaPress = (idea: Idea) => {
    router.push(`/idea/${idea.id}`);
  };

  const handleFavorite = async (ideaId: string) => {
    try {
      await toggleFavorite(ideaId);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar favorito');
    }
  };

  const handleDelete = async (ideaId: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente deletar esta ideia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteIdea(ideaId);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a ideia');
            }
          },
        },
      ]
    );
  };

  const handleFABPress = () => {
    setShowCaptureInput(true);
  };

  const handleCancelCapture = () => {
    setShowCaptureInput(false);
  };

  // Loading inicial
  if (loading && ideas.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-muted-foreground mt-4">
          Carregando suas ideias...
        </Text>
      </View>
    );
  }

  // Estado de erro
  if (error && ideas.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-red-500 text-center mb-4">
          {error}
        </Text>
        <Button onPress={retry}>
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-background border-b border-border">
        <Text className="text-2xl font-bold text-foreground">
          IdeaPile
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          {ideas.length} {ideas.length === 1 ? 'ideia' : 'ideias'}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-3">
        <Input
          placeholder="Buscar ideias..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={
            <Text className="text-muted-foreground text-lg">🔍</Text>
          }
        />
      </View>

      {/* Capture Input (Modal) */}
      {showCaptureInput && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50 justify-center">
          <CaptureInput
            onSave={handleAddIdea}
            onCancel={handleCancelCapture}
          />
        </View>
      )}

      {/* Ideas List */}
      {ideas.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">💡</Text>
          <Text className="text-xl font-semibold text-foreground text-center mb-2">
            Nenhuma ideia ainda
          </Text>
          <Text className="text-muted-foreground text-center">
            {searchQuery 
              ? 'Nenhuma ideia encontrada para sua busca.'
              : 'Toque no + para adicionar sua primeira ideia!'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IdeaCard
              idea={item}
              onPress={handleIdeaPress}
              onFavorite={handleFavorite}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{
            padding: 24,
            paddingBottom: 100, // Espaço para o FAB
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshIdeas}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleFABPress}
        position="bottom-right"
      >
        <Text className="text-primary-foreground text-2xl font-light">+</Text>
      </FloatingActionButton>

      <StatusBar style="dark" />
    </View>
  );
}
