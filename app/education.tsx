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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        {/* Institución */}
        <Controller
          control={control}
          name="institution"
          rules={{
            required: "La institución es obligatoria",
            minLength: {
              value: 5,
              message: "El nombre es muy corto (mínimo 5 caracteres)",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad/institución"
              value={value}
              onChangeText={onChange}
              error={errors.institution?.message}
            />
          )}
        />

        {/* Título/Grado */}
        <Controller
          control={control}
          name="degree"
          rules={{
            required: "El título/grado es obligatorio",
            minLength: {
              value: 2,
              message: "El título es muy corto (mínimo 2 caracteres)",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Licenciatura, Maestría"
              value={value}
              onChangeText={onChange}
              error={errors.degree?.message}
            />
          )}
        />

        {/* Área de estudio */}
        <Controller
          control={control}
          name="field"
          rules={{
            validate: (value) =>
              value === "" || value.length >= 3 || "El área de estudio es muy corta (mínimo 3 caracteres)",
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={onChange}
              error={errors.field?.message}
            />
          )}
        />

        {/* Año de graduación */}
        <Controller
          control={control}
          name="graduationYear"
          rules={{
            required: "El año de graduación es obligatorio",
          }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Año de Graduación *"
              placeholder="Selecciona el año"
              value={value}
              formatType="year"
              maximumDate={today}
              minimumDate={minDate}
              onChange={(selectedYear) => onChange(selectedYear)}
              error={errors.graduationYear?.message}
            />
          )}
        />

        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit(onSubmit, onError)}
        />

        {/* Lista de educación agregada */}
        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
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
  cardInstitution: { fontSize: 14, color: "#95a5a6", marginBottom: 2 },
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
