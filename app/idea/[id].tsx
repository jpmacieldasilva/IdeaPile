import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Card, Button } from '../../src/components';
import { ideaPileService } from '../../src/services';
import { Idea } from '../../src/types';
import { formatFullDate } from '../../src/utils';

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    loadIdea();
  }, [id]);

  const loadIdea = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedIdea = await ideaPileService.getIdeaById(id!);
      
      if (!fetchedIdea) {
        setError('Ideia não encontrada');
        return;
      }
      
      setIdea(fetchedIdea);
    } catch (err) {
      console.error('Error loading idea:', err);
      setError('Erro ao carregar ideia');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!idea) return;

    try {
      await ideaPileService.toggleFavorite(idea.id);
      setIdea({
        ...idea,
        isFavorite: !idea.isFavorite,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar favorito');
    }
  };

  const handleDelete = async () => {
    if (!idea) return;

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
              await ideaPileService.deleteIdea(idea.id);
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a ideia');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-muted-foreground mt-4">
          Carregando ideia...
        </Text>
      </View>
    );
  }

  if (error || !idea) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-red-500 text-center mb-4">
          {error || 'Ideia não encontrada'}
        </Text>
        <Button onPress={() => router.back()}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1 px-6 py-4">
        {/* Main Content Card */}
        <Card variant="outlined" padding="lg" className="mb-6">
          {/* Content */}
          <Text className="text-lg text-foreground leading-6 mb-6">
            {idea.content}
          </Text>

          {/* Metadata */}
          <View className="border-t border-border pt-4">
            <Text className="text-sm text-muted-foreground mb-2">
              {formatFullDate(idea.timestamp)}
            </Text>

            {/* Tags */}
            {idea.tags.length > 0 && (
              <View className="flex-row flex-wrap mb-4">
                <Text className="text-sm text-muted-foreground mr-2">
                  Tags:
                </Text>
                {idea.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-accent px-2 py-1 rounded-md mr-2 mb-1"
                  >
                    <Text className="text-xs text-accent-foreground">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Connections */}
            {idea.connections && idea.connections.length > 0 && (
              <Text className="text-sm text-muted-foreground mb-2">
                🔗 {idea.connections.length} conexões
              </Text>
            )}

            {/* AI Expansions */}
            {idea.aiExpansions && idea.aiExpansions.length > 0 && (
              <Text className="text-sm text-muted-foreground">
                🧠 {idea.aiExpansions.length} expansões de IA
              </Text>
            )}
          </View>
        </Card>

        {/* AI Expansions */}
        {idea.aiExpansions && idea.aiExpansions.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Expansões de IA
            </Text>
            {idea.aiExpansions.map((expansion) => (
              <Card 
                key={expansion.id} 
                variant="outlined" 
                padding="md" 
                className="mb-3"
              >
                <View className="flex-row items-center mb-2">
                  <View className="bg-blue-100 px-2 py-1 rounded mr-2">
                    <Text className="text-xs text-blue-700 capitalize">
                      {expansion.type}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted-foreground">
                    {formatFullDate(expansion.timestamp)}
                  </Text>
                </View>
                <Text className="text-base text-foreground leading-5">
                  {expansion.content}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* Actions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Ações
          </Text>
          
          <View className="space-y-3">
            <Button
              variant="outline"
              onPress={handleToggleFavorite}
              className="mb-3"
            >
              {idea.isFavorite ? '⭐ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
            </Button>

            <Button
              variant="outline"
              onPress={() => {
                // TODO: Implementar funcionalidades de IA
                Alert.alert('Em breve', 'Funcionalidades de IA em desenvolvimento');
              }}
              className="mb-3"
            >
              🧠 Expandir com IA
            </Button>

            <Button
              variant="danger"
              onPress={handleDelete}
            >
              🗑️ Deletar ideia
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
