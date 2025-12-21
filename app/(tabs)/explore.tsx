import React from 'react';
import { StyleSheet, View, FlatList, Dimensions, ImageBackground, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const pages = [
  {
    key: '1',
    title: 'Welcome to Arogyadhatha',
    subtitle: 'Your personal health companion, here to guide you on your wellness journey.',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
  },
  {
    key: '2',
    title: 'Track Your Health Seamlessly',
    subtitle: 'Monitor your symptoms, get personalized insights, and take control of your health.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
  },
  {
    key: '3',
    title: 'Connect with Experts',
    subtitle: 'Easily get in touch with healthcare professionals for advice and consultations.',
    image: 'https://images.unsplash.com/photo-1551192426-5a4f914b4347?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
  },
];

export default function ExploreScreen() {
  const renderItem = ({ item }: { item: typeof pages[0] }) => (
    <ImageBackground source={{ uri: item.image }} style={styles.page}>
      <View style={styles.textContainer}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={50} tint="dark" style={styles.glassmorphism}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
          </BlurView>
        ) : (
          <View style={[styles.glassmorphism, styles.androidGlassmorphism]}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{item.subtitle}</ThemedText>
          </View>
        )}
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassmorphism: {
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  androidGlassmorphism: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#E0F2F1',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
