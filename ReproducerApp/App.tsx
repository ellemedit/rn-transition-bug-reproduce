import {Button, StyleSheet, Text, View} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from '@tanstack/react-query';
import React, {Suspense, useState, useTransition} from 'react';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Suspense fallback={<Text>loading ...</Text>}>
          <Test />
        </Suspense>
        <Text>test</Text>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Test() {
  const [id, setId] = useState(0);
  const [isPending, startTransition] = useTransition();
  const userIdQuery = useSuspenseQuery({
    queryKey: ['test', id],
    queryFn: () => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(id);
        }, 1500);
      });
    },
  });

  return (
    <View>
      <Text>{isPending ? 'pending' : 'idle'}</Text>
      <Text>{id}</Text>
      <Text>{userIdQuery.data}</Text>
      <Button
        title="urgent"
        onPress={() => {
          setId(id => id + 1);
        }}
      />
      <Button
        title="transition"
        onPress={() => {
          startTransition(() => {
            setId(id => id + 1);
          });
        }}
      />
    </View>
  );
}
