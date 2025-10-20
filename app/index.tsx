import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
    const hasExperience = cvData.experiences.length > 0;
    const hasEducation = cvData.education.length > 0;
    const hasPhoto = !!cvData.personalInfo.profileImage;

  return (
    <ScrollView className="flex-1 bg-lightGray" contentContainerStyle={{ padding: 20 }}>
      <Text className="text-2xl font-bold mb-5 text-darkText text-center">Crea tu CV Profesional</Text>

      {/* Foto */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-darkText">Foto de Perfil</Text>
            <Text className="text-sm text-green-600">{hasPhoto ? "✓ Agregada" : "Opcional"}</Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image source={{ uri: cvData.personalInfo.profileImage }} className="w-12 h-12 rounded-full border-2 border-primary" />
          )}
        </View>

        <TouchableOpacity className="bg-primary py-4 rounded-lg items-center" onPress={() => router.push("/photo")}>
          <Text className="text-white font-semibold text-base">{hasPhoto ? "Cambiar Foto" : "Subir Foto"}</Text>
        </TouchableOpacity>
      </View>

      {/* Info Personal */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-darkText">1. Información Personal</Text>
        <Text className="text-sm text-green-600 mb-3">{isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}</Text>
        <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => router.push("/personal-info")}>
          <Text className="text-white font-semibold">Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Experiencia */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-darkText">2. Experiencia</Text>
        <Text className="text-sm text-green-600 mb-3">{hasExperience ? `✓ ${cvData.experiences.length} agregada(s)` : "Pendiente"}</Text>
        <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => router.push("/experience")}>
          <Text className="text-white font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Educación */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-darkText">3. Educación</Text>
        <Text className="text-sm text-green-600 mb-3">{hasEducation ? `✓ ${cvData.education.length} agregada(s)` : "Pendiente"}</Text>
        <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => router.push("/education")}>
          <Text className="text-white font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Habilidades */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-darkText">4. Habilidades</Text>
        <Text className="text-sm text-green-600 mb-3">{cvData.skills.length > 0 ? `✓ ${cvData.skills.length} agregada(s)` : "Pendiente"}</Text>
        <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => router.push("/skills")}>
          <Text className="text-white font-semibold">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <View className="mt-4 mb-6">
        <TouchableOpacity className="bg-accent py-5 rounded-xl items-center shadow" onPress={() => router.push("/preview")}>
          <Text className="text-white font-bold text-lg">👁️ Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}

