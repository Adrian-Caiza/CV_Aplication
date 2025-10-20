import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { DatePickerField } from "../components/DatePickerField";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { useForm, Controller } from "react-hook-form";
import { FieldErrors } from "react-hook-form";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Education, "id">>({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    },
  });

  const onSubmit = (data: Omit<Education, "id">) => {
    const newEducation: Education = {
      id: Date.now().toString(),
      ...data,
    };

    addEducation(newEducation);
    Alert.alert("Éxito", "Educación agregada correctamente");

    // Limpiar formulario
    reset();
  };

  const onError = (errors: FieldErrors<Omit<Education, "id">>) => {
  const firstError = Object.values(errors)[0];
  const message = (firstError as any)?.message; 
  if (message) {
    Alert.alert("Error", message);
  }
};

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 30);
  const currentYear = new Date().getFullYear();


  return (
    <ScrollView className="flex-1 bg-lightGray" contentContainerStyle={{ padding: 20 }}>
      <View>
        <Text className="text-xl font-bold text-darkText mb-4">Agregar Educación</Text>

        <Controller control={control} name="degree" rules={{ required: "El título es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <InputField label="Título *" placeholder="Ej: Ingeniero en Sistemas" value={value} onChangeText={onChange} error={errors.degree?.message} />
          )} />

        <Controller control={control} name="field"
          render={({ field: { onChange, value } }) => (
            <InputField label="Campo de Estudio" placeholder="Ej: Desarrollo de Software" value={value} onChangeText={onChange} error={errors.field?.message} />
          )} />

        <Controller control={control} name="institution" rules={{ required: "La institución es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <InputField label="Institución *" placeholder="Nombre de la universidad o instituto" value={value} onChangeText={onChange} error={errors.institution?.message} />
          )} />

        <Controller control={control} name="graduationYear"
          rules={{
            required: "El año de graduación es obligatorio",
            validate: (val) => {
              const num = parseInt(val);
              if (isNaN(num)) return "Debe ser un número";
              if (num > currentYear) return "No puede ser un año futuro";
              if (num < 1950) return "Año no válido";
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField label="Año de Graduación *" placeholder="Ej: 2023" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.graduationYear?.message} />
          )} />

        <NavigationButton title="Agregar Educación" onPress={handleSubmit(onSubmit, onError)} />

        {cvData.education.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-darkText mt-6 mb-3">Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} className="bg-white rounded-lg p-4 mb-3 flex-row shadow-sm">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-darkText mb-1">{edu.degree}</Text>
                  <Text className="text-sm text-gray-600">{edu.field || "—"}</Text>
                  <Text className="text-sm text-gray-500">{edu.institution}</Text>
                  <Text className="text-xs text-gray-400">{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-danger items-center justify-center" onPress={() => handleDelete(edu.id)}>
                  <Text className="text-white text-lg font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton title="Volver" onPress={() => router.back()} variant="secondary" className="mt-4" />
      </View>
    </ScrollView>
  );
}

