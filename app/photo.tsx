import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";

export default function PhotoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    cvData.personalInfo.profileImage
  );

  // Solicitar permisos y tomar foto con la cámara
  const takePhoto = async () => {
    try {
      // Solicitar permisos de cámara
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!cameraPermission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Necesitamos acceso a tu cámara para tomar fotos."
        );
        return;
      }

      // Abrir la cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Aspecto cuadrado
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
      console.error(error);
    }
  };

  // Seleccionar foto de la galería
  const pickImage = async () => {
    try {
      // Solicitar permisos de galería
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!galleryPermission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Necesitamos acceso a tu galería para seleccionar fotos."
        );
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la galería");
      console.error(error);
    }
  };

  // Guardar la foto
  const handleSave = () => {
    updatePersonalInfo({
      ...cvData.personalInfo,
      profileImage: selectedImage,
    });
    Alert.alert("Éxito", "Foto guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // Eliminar foto
  const handleRemove = () => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar la foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setSelectedImage(undefined);
          updatePersonalInfo({
            ...cvData.personalInfo,
            profileImage: undefined,
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 p-5 bg-lightGray items-center">
      <Text className="text-xl font-bold text-darkText mb-5 text-center">Foto de Perfil</Text>

      <View className="items-center mb-6">
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} className="w-48 h-48 rounded-full border-4 border-primary mb-4" />
        ) : (
          <View className="w-48 h-48 rounded-full bg-gray-300 items-center justify-center mb-4">
            <Text className="text-gray-600">Sin foto</Text>
          </View>
        )}

        <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mb-3" onPress={takePhoto}>
          <Text className="text-white font-semibold">📷 Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mb-3" onPress={pickImage}>
          <Text className="text-white font-semibold">🖼️ Seleccionar de Galería</Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity className="bg-danger py-3 px-6 rounded-lg" onPress={handleRemove}>
            <Text className="text-white font-semibold">🗑️ Eliminar Foto</Text>
          </TouchableOpacity>
        )}
      </View>

      <NavigationButton title="Guardar" onPress={handleSave} />
      <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary" className="mt-4" />
    </View>
  );
}