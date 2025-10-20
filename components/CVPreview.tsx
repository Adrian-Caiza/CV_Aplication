import React from "react";
import { View, Text, Image } from "react-native";
import { CVData } from "../types/cv.types";

interface Props {
  cvData: CVData;
}

export const CVPreview: React.FC<Props> = ({ cvData }) => {
  const { personalInfo, experiences, education, skills } = cvData;

  return (
    <View className="bg-white rounded-xl p-4">
      {/* Foto y nombre */}
      <View className="items-center mb-4">
        {personalInfo.profileImage ? (
          <Image source={{ uri: personalInfo.profileImage }} className="w-24 h-24 rounded-full mb-3" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-300 mb-3 items-center justify-center">
            <Text className="text-gray-600 text-sm">Sin foto</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-darkText">{personalInfo.fullName}</Text>
        {personalInfo.location && <Text className="text-gray-600">{personalInfo.location}</Text>}
      </View>

      {/* Contacto */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-darkText mb-1">Contacto</Text>
        <Text className="text-gray-700">📧 {personalInfo.email}</Text>
        {personalInfo.phone && <Text className="text-gray-700">📞 {personalInfo.phone}</Text>}
      </View>

      {/* Resumen */}
      {personalInfo.summary && (
        <View className="mb-4">
          <Text className="text-lg font-semibold text-darkText mb-1">Resumen</Text>
          <Text className="text-gray-700">{personalInfo.summary}</Text>
        </View>
      )}

      {/* Experiencia */}
      {experiences.length > 0 && (
        <View className="mb-4">
          <Text className="text-lg font-semibold text-darkText mb-2">Experiencia</Text>
          {experiences.map((exp) => (
            <View key={exp.id} className="mb-3">
              <Text className="font-semibold text-darkText">{exp.position}</Text>
              <Text className="text-gray-600">{exp.company}</Text>
              <Text className="text-gray-400 text-xs">{exp.startDate} - {exp.endDate || "Actual"}</Text>
              {exp.description ? <Text className="text-gray-700 mt-1">{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* Educación */}
      {education.length > 0 && (
        <View className="mb-4">
          <Text className="text-lg font-semibold text-darkText mb-2">Educación</Text>
          {education.map((edu) => (
            <View key={edu.id} className="mb-3">
              <Text className="font-semibold text-darkText">{edu.degree}</Text>
              <Text className="text-gray-600">{edu.institution}</Text>
              <Text className="text-gray-400 text-xs">{edu.graduationYear}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Habilidades */}
      {skills.length > 0 && (
        <View>
          <Text className="text-lg font-semibold text-darkText mb-2">Habilidades</Text>
          <View className="flex-row flex-wrap">
            {skills.map((skill) => (
              <View key={skill.id} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-gray-700 text-sm">
                  {skill.name} ({skill.level})
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
