import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfo>({
    defaultValues: cvData.personalInfo,
  });

  // Mantener datos al regresar
  useEffect(() => {
    reset(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    Alert.alert("Éxito", "Información guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const onError = (formErrors: any) => {
  const firstError = (Object.values(formErrors ?? {})[0] as any)?.message;
    if (firstError) {
      Alert.alert("Error", firstError);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Nombre Completo */}
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: "El nombre completo es obligatorio",
            minLength: { value: 8, message: "El nombre es muy corto (mínimo 8 caracteres)" },
            validate: (value) =>
              value.trim().includes(" ") ||
              "Por favor, ingresa tu nombre y apellido",
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Nombre Completo *"
              placeholder="Adrian Caiza"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "El formato del email es inválido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Email *"
              placeholder="adrian@email.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        {/* Teléfono */}
        <Controller
          control={control}
          name="phone"
          rules={{
            pattern: {
              value: /^\+?[0-9\s\-()]{7,15}$/,
              message: "El formato del teléfono es inválido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
              error={errors.phone?.message}
            />
          )}
        />

        {/* Ubicación */}
        <Controller
          control={control}
          name="location"
          rules={{
            validate: (value) =>
              value.trim() === "" || value.length >= 6 || "La ubicación es muy corta (minimo 6 caracteres)",
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Ubicación"
              placeholder="Quito, Ecuador"
              value={value}
              onChangeText={onChange}
              error={errors.location?.message}
            />
          )}
        />

        {/* Resumen Profesional */}
        <Controller
          control={control}
          name="summary"
          rules={{
            validate: (value) => {
              if (value.trim() === "") return true;
              if (value.length < 20) return "El resumen es muy corto (mínimo 20 caracteres)";
              if (value.length > 500) return "El resumen es muy largo (máximo 500 caracteres)";
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Resumen Profesional"
              placeholder="Describe brevemente tu perfil profesional..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
              error={errors.summary?.message}
            />
          )}
        />

        <NavigationButton
          title="Guardar Información"
          onPress={handleSubmit(onSubmit, onError)}
        />

        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
});
