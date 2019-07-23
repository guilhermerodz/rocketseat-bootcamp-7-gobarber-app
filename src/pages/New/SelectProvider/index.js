import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Background from '~/components/Background';

import {
  Container,
  ProvidersList,
  Provider,
  EmptyProvider,
  Avatar,
  Name,
} from './styles';

const numColumns = 2;

export default function SelectProvider({ navigation }) {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('providers');

      /** Fill remaining providers */
      const remainingProvidersToRow = response.data.length % numColumns;
      if (remainingProvidersToRow > 0)
        await [...Array(numColumns)].forEach((_, i) => {
          response.data.push({
            id: `empty${i}`,
            empty: true,
          });
        });

      setProviders(
        response.data.reduce((list, item) => {
          list.push(item);
          return list;
        }, [])
      );
    }

    loadProviders();
  }, []);

  return (
    <Background>
      <Container>
        <ProvidersList
          numColumns={numColumns}
          data={providers}
          keyExtractor={provider => String(provider.id)}
          renderItem={({ item: provider }) => (
            <>
              {!provider.empty ? (
                <Provider
                  onPress={() =>
                    navigation.navigate('SelectDateTime', { provider })
                  }
                >
                  <Avatar
                    source={{
                      uri: provider.avatar
                        ? provider.avatar.url.replace(
                            'localhost',
                            '192.168.15.10'
                          )
                        : `https://api.adorable.io/avatar/50/${provider.name}.png`,
                    }}
                  />
                  <Name>{provider.name}</Name>
                </Provider>
              ) : (
                <EmptyProvider />
              )}
            </>
          )}
        />
      </Container>
    </Background>
  );
}

SelectProvider.navigationOptions = ({ navigation }) => ({
  title: 'Selecione o prestador',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
