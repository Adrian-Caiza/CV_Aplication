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
import { DatePickerField } from "../components/DatePickerField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import { useForm, Controller, FieldErrors } from "react-hook-form";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Omit<Experience, "id">>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const startDateValue = watch("startDate");

  const onSubmit = (data: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...data,
    };

    addExperience(newExperience);
    Alert.alert("Éxito", "Experiencia agregada correctamente");
    reset();
  };

  const onError = (errors: FieldErrors<Omit<Experience, "id">>) => {
    const firstError = Object.values(errors)[0];
    const message = (firstError as any)?.message;
    if (message) {
      Alert.alert("Error", message);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  const today = new Date();

  // Helper para convertir string "mes año" a objeto Date
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const [month, year] = dateString.split(" ");
      const date = new Date(`${month} 1, ${year}`);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  return (
    <ScrollView className="flex-1 bg-lightGray" contentContainerStyle={{ padding: 20 }}>
      <View>
        <Text className="text-xl font-bold text-darkText mb-4">Agregar Nueva Experiencia</Text>

        <Controller
          control={control}
          name="company"
          rules={{
            required: "La empresa es obligatoria",
            minLength: { value: 2, message: "El nombre de la empresa es muy corto (mínimo 2 caracteres)" },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField label="Empresa *" placeholder="Nombre de la empresa" value={value} onChangeText={onChange} error={errors.company?.message} />
          )}
        />

        <Controller
          control={control}
          name="position"
          rules={{
            required: "El cargo es obligatorio",
            minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField label="Cargo *" placeholder="Tu posición" value={value} onChangeText={onChange} error={errors.position?.message} />
          )}
        />

        <Controller
          control={control}
          name="startDate"
          rules={{ required: "La fecha de inicio es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField label="Fecha de Inicio *" value={value} onChange={onChange} placeholder="Ej: Enero 2020" required maximumDate={today} error={errors.startDate?.message} />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          rules={{
            validate: (value) => {
              if (!value || value === "Actual") return true;
              const start = parseDate(startDateValue);
              const end = parseDate(value);
              if (start && end && end < start) return "La fecha de fin no puede ser anterior a la fecha de inicio";
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField label="Fecha de Fin" value={value} onChange={onChange} placeholder="Ej: Diciembre 2023" maximumDate={today} minimumDate={parseDate(startDateValue)} showCurrentOption error={errors.endDate?.message} />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            validate: (value) => {
              if (!value) return true;
              if (value.trim() === "") return true;
              if (value.length < 10) return "La descripción es muy corta (mínimo 10 caracteres)";
              if (value.length > 500) return "La descripción es muy larga (máximo 500 caracteres)";
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField label="Descripción" placeholder="Describe tus responsabilidades y logros..." value={value} onChangeText={onChange} multiline numberOfLines={4} error={errors.description?.message} />
          )}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit, onError)} />

        {cvData.experiences.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-darkText mt-6 mb-3">Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} className="bg-white rounded-lg p-4 mb-3 flex-row shadow-sm">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-darkText mb-1">{exp.position}</Text>
                  <Text className="text-sm text-gray-600">{exp.company}</Text>
                  <Text className="text-xs text-gray-400">{exp.startDate} - {exp.endDate || "Actual"}</Text>
                </View>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-danger items-center justify-center" onPress={() => handleDelete(exp.id)}>
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

