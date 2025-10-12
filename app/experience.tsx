// app/experience.tsx

import React, { useState, useEffect } from "react";
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

const useDatePicker = (initialStartDate = "", initialEndDate = "") => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const getStartDateAsDate = (): Date | undefined => {
    if (!startDate) return undefined;
    
    try {
      // Convertir string de fecha a Date object (formato: "enero 2020")
      const [month, year] = startDate.split(' ');
      const date = new Date(`${month} 1, ${year}`);
      
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
    
    return undefined;
  };

  const resetDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    getStartDateAsDate,
    resetDates,
  };
};


export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    getStartDateAsDate,
    resetDates,
  } = useDatePicker();

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  }, [startDate, endDate]);

  const handleAdd = () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      Alert.alert(
        "Error",
        "Por favor completa al menos empresa, cargo y fecha de inicio"
      );
      return;
    }

    const newExperience: Experience = {
      id: Date.now().toString(),
      ...formData,
    };

    addExperience(newExperience);

    // Limpiar formulario
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    Alert.alert("Éxito", "Experiencia agregada correctamente");
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <InputField
          label="Empresa *"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChangeText={(text) => {
              setFormData({ ...formData, company: text });
              if (text.trim() === "") {
                setErrors({ ...errors, company: "La empresa es obligatoria" });
              } else if (text.length < 2) {
                setErrors({...errors, company: "El nombre de la empresa es muy corto"});
              } else {
                  setErrors({ ...errors, company: "" }); 
              }       
          } }
        />
        {errors.company ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {errors.company}
          </Text>
        ) : null}

        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) => {
              setFormData({ ...formData, position: text });
              if (text.trim() === "") {
                setErrors({ ...errors, position: "El cargo es obligatorio" });
              } else if (text.length < 2) {
                setErrors({ ...errors, position: "Debe tener al menos 2 caracteres" });
              } else {
                setErrors({ ...errors, position: "" });
              }
          } }
        />
        {errors.company ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {errors.position}
          </Text>
        ) : null}

        <DatePickerField
          label="Fecha de Inicio"
          value={startDate}
          onChange={setStartDate}
          placeholder="Ej: Enero 2020"
          required={true}
          maximumDate={new Date()}
        />

        <DatePickerField
          label="Fecha de Fin"
          value={endDate}
          onChange={setEndDate}
          placeholder="Ej: Diciembre 2023"
          maximumDate={new Date()}
          minimumDate={getStartDateAsDate()}
          showCurrentOption={true}
        />

        <InputField
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleAdd} />

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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
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
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
