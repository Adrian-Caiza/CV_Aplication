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
        <ScrollView className="flex-1 bg-lightGray" contentContainerStyle={{ padding: 20 }}>
        <View>
            <Text className="text-xl font-bold text-darkText mb-4">Agregar Habilidades</Text>

            <Controller control={control} name="name"
            rules={{ required: "El nombre es obligatorio", minLength: { value: 2, message: "Debe tener al menos 2 caracteres" } }}
            render={({ field: { onChange, value } }) => (
                <InputField label="Habilidad *" placeholder="Ej: JavaScript, Python..." value={value} onChangeText={onChange} error={errors.name?.message} />
            )} />
            {/* Nivel de habilidad */}
            <Text className="text-base font-semibold text-darkText mb-2">Nivel *</Text>

            <Controller
            control={control}
            name="level"
            rules={{
                required: "Selecciona un nivel de habilidad",
                validate: (value) =>
                levels.includes(value as Skill["level"]) || "Selecciona un nivel válido",
            }}
            render={({ field: { onChange, value } }) => (
                <View className="flex-row justify-between mb-4">
                {levels.map((lvl) => (
                    <TouchableOpacity
                    key={lvl}
                    onPress={() => onChange(lvl)}
                    className={`flex-1 mx-1 py-3 rounded-lg border ${
                        value === lvl
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                    >
                    <Text
                        className={`text-center text-sm font-medium ${
                        value === lvl ? "text-white" : "text-darkText"
                        }`}
                    >
                        {lvl}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
            />

            {errors.level && (
            <Text className="text-red-500 text-xs mb-2">
                {errors.level.message}
            </Text>
            )}

            <NavigationButton title="Agregar Habilidad" onPress={handleSubmit(onSubmit, onError)} />

            {cvData.skills.length > 0 && (
            <>
                <Text className="text-lg font-semibold text-darkText mt-6 mb-3">Habilidades Agregadas</Text>

                {cvData.skills.map((skill) => (
                    <View key={skill.id} className="bg-white rounded-lg p-4 mb-3 flex-row shadow-sm">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-darkText">{skill.name}</Text>
                        <Text className="text-sm text-gray-500">{skill.level}</Text>
                    </View>
                    <TouchableOpacity className="w-8 h-8 rounded-full bg-danger items-center justify-center" onPress={() => handleDelete(skill.id)}>
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

    