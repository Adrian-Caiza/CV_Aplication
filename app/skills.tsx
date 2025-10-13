import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Skill } from "../types/cv.types";
import { useForm, Controller, FieldErrors } from "react-hook-form";

export default function SkillsScreen() {
    const router = useRouter();
    const { cvData, addSkill, deleteSkill } = useCVContext();

    const levels: Skill["level"][] = ["Basico", "Intermedio", "Avanzado", "Experto"];

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Omit<Skill, "id">>({
        defaultValues: {
        name: "",
        level: "Basico",
        },
});

const selectedLevel = watch("level");

    const onSubmit = (data: Omit<Skill, "id">) => {
        const newSkill: Skill = {
        id: Date.now().toString(),
        ...data,
        };

        addSkill(newSkill);
        Alert.alert("Éxito", "Habilidad agregada correctamente");
        reset();
};

    const onError = (errors: FieldErrors<Omit<Skill, "id">>) => {
        const firstError = Object.values(errors)[0];
        const message = (firstError as any)?.message;
        if (message) {
        Alert.alert("Error", message);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert("Confirmar", "¿Eliminar esta habilidad?", [
        { text: "Cancelar", style: "cancel" },
        {
            text: "Eliminar",
            style: "destructive",
            onPress: () => deleteSkill(id),
        },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.sectionTitle}>Agregar Nueva Habilidad</Text>

            {/* Campo de habilidad */}
            <Controller
            control={control}
            name="name"
            rules={{
                required: "La habilidad es obligatoria",
                minLength: {
                value: 2,
                message: "El nombre de la habilidad es muy corto (mínimo 2 caracteres)",
                },
                maxLength: {
                value: 50,
                message: "El nombre de la habilidad es demasiado largo (máximo 50 caracteres)",
                },
            }}
            render={({ field: { onChange, value } }) => (
                <InputField
                label="Habilidad *"
                placeholder="Ej: JavaScript, React Native..."
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                />
            )}
            />

            {/* Nivel de habilidad */}
            <Text style={styles.label}>Nivel *</Text>
            <Controller
            control={control}
            name="level"
            rules={{
                required: "Selecciona un nivel de habilidad",
                validate: (value) =>
                levels.includes(value as Skill["level"]) ||
                "Selecciona un nivel válido",
            }}
            render={({ field: { onChange, value } }) => (
                <View style={styles.levelContainer}>
                {levels.map((lvl) => (
                    <TouchableOpacity
                    key={lvl}
                    style={[
                        styles.levelButton,
                        value === lvl && styles.levelSelected,
                    ]}
                    onPress={() => onChange(lvl)}
                    >
                    <Text
                        style={[
                        styles.levelText,
                        value === lvl && styles.levelTextSelected,
                        ]}
                    >
                        {lvl}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            />
            {errors.level && (
            <Text style={{ color: "red", fontSize: 12, marginBottom: 8 }}>
                {errors.level.message}
            </Text>
            )}

            <NavigationButton
            title="Agregar Habilidad"
            onPress={handleSubmit(onSubmit, onError)}
            />

            {/* Lista de habilidades agregadas */}
            {cvData.skills.length > 0 && (
            <>
                <Text style={styles.listTitle}>Habilidades Agregadas</Text>
                {cvData.skills.map((s) => (
                <View key={s.id} style={styles.card}>
                    <View>
                    <Text style={styles.cardTitle}>{s.name}</Text>
                    <Text style={styles.cardSubtitle}>{s.level}</Text>
                    </View>
                    <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(s.id)}
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
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 8,
    },
    levelContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
    levelButton: {
        borderWidth: 1,
        borderColor: "#3498db",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    levelSelected: { backgroundColor: "#3498db" },
    levelText: { color: "#3498db", fontWeight: "500" },
    levelTextSelected: { color: "#fff" },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 24,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardTitle: { fontSize: 16, fontWeight: "600" },
    cardSubtitle: { fontSize: 14, color: "#7f8c8d" },
    deleteButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#e74c3c",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    });
