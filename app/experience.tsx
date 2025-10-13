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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        {/* Empresa */}
        <Controller
          control={control}
          name="company"
          rules={{
            required: "La empresa es obligatoria",
            minLength: {
              value: 2,
              message: "El nombre de la empresa es muy corto (mínimo 2 caracteres)",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
              error={errors.company?.message}
            />
          )}
        />

        {/* Cargo */}
        <Controller
          control={control}
          name="position"
          rules={{
            required: "El cargo es obligatorio",
            minLength: {
              value: 2,
              message: "Debe tener al menos 2 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
              error={errors.position?.message}
            />
          )}
        />

        {/* Fecha de inicio */}
        <Controller
          control={control}
          name="startDate"
          rules={{
            required: "La fecha de inicio es obligatoria",
          }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Inicio *"
              value={value}
              onChange={onChange}
              placeholder="Ej: Enero 2020"
              required={true}
              maximumDate={today}
              error={errors.startDate?.message}
            />
          )}
        />

        {/* Fecha de fin */}
        <Controller
          control={control}
          name="endDate"
          rules={{
            validate: (value) => {
              if (!value) return true;
              if (value === "Actual") return true;
              const start = parseDate(startDateValue);
              const end = parseDate(value);
              if (start && end && end < start) {
                return "La fecha de fin no puede ser anterior a la fecha de inicio";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Fin"
              value={value}
              onChange={onChange}
              placeholder="Ej: Diciembre 2023"
              maximumDate={today}
              minimumDate={parseDate(startDateValue)}
              showCurrentOption={true}
              error={errors.endDate?.message}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          control={control}
          name="description"
          rules={{
            validate: (value) => {
              if (value.trim() === "") return true;
              if (value.length < 10)
                return "La descripción es muy corta (mínimo 10 caracteres)";
              if (value.length > 500)
                return "La descripción es muy larga (máximo 500 caracteres)";
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades y logros..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
              error={errors.description?.message}
            />
          )}
        />

        <NavigationButton
          title="Agregar Experiencia"
          onPress={handleSubmit(onSubmit, onError)}
        />

        {/* Lista de experiencias */}
        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#2c3e50", marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: "#7f8c8d", marginBottom: 4 },
  cardDate: { fontSize: 12, color: "#95a5a6" },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
