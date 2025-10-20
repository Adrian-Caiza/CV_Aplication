import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "@/components/CVPreview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

export default function PreviewScreen() {
  const { cvData } = useCVContext();

  // Convierte imagen local a Base64
  const convertImageToBase64 = async (uri?: string) => {
    if (!uri) return null;
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        console.warn("⚠️ La imagen no existe en la ruta:", uri);
        return null;
      }
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error al convertir imagen:", error);
      return null;
    }
  };

  // Genera HTML para PDF
  const generateHTML = async () => {
    const { personalInfo, experiences, education, skills } = cvData;
    const imageBase64 = await convertImageToBase64(personalInfo.profileImage);

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px 25px;
              color: #2c3e50;
              background-color: #f9fafb;
              font-size: 13px;
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              margin: 8px 0 2px 0;
            }
            h2 {
              font-size: 16px;
              font-weight: 600;
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              display: inline-block;
              margin-bottom: 6px;
            }
            p {
              margin: 3px 0;
            }
            .header {
              text-align: center;
              margin-bottom: 18px;
              background-color: #ffffff;
              border-radius: 10px;
              padding: 16px 10px;
            }
            .photo {
              width: 95px;
              height: 95px;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid #3498db;
              margin-bottom: 10px;
            }
            .contact {
              color: #555;
              font-size: 12px;
              margin-top: 2px;
            }
            .section {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 14px 16px;
              margin-bottom: 12px;
            }
            .item {
              margin-bottom: 6px;
            }
            .item strong {
              font-size: 13px;
            }
            .date {
              color: #7f8c8d;
              font-size: 12px;
            }
            .skill {
              display: inline-block;
              background-color: #ecf6fd;
              color: #2c3e50;
              margin: 3px 5px 3px 0;
              padding: 5px 10px;
              border-radius: 20px;
              border: 1px solid #3498db;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              imageBase64
                ? `<img src="${imageBase64}" class="photo" />`
                : `<div style="width:95px;height:95px;border-radius:50%;background:#ddd;text-align:center;line-height:95px;color:#888;margin:auto;font-size:12px;">Sin foto</div>`
            }
            <h1>${personalInfo.fullName || "Nombre Completo"}</h1>
            ${personalInfo.email ? `<p class="contact">📧 ${personalInfo.email}</p>` : ""}
            ${personalInfo.phone ? `<p class="contact">📱 ${personalInfo.phone}</p>` : ""}
            ${personalInfo.location ? `<p class="contact">📍 ${personalInfo.location}</p>` : ""}
          </div>

          ${
            personalInfo.summary
              ? `<div class="section">
                  <h2>Resumen Profesional</h2>
                  <p>${personalInfo.summary}</p>
                </div>`
              : ""
          }

          ${
            experiences.length > 0
              ? `<div class="section">
                  <h2>Experiencia Laboral</h2>
                  ${experiences
                    .map(
                      (exp) => `
                      <div class="item">
                        <strong>${exp.position}</strong> - ${exp.company}<br/>
                        <span class="date">${exp.startDate} - ${exp.endDate || "Actual"}</span>
                        ${exp.description ? `<p>${exp.description}</p>` : ""}
                      </div>`
                    )
                    .join("")}
                </div>`
              : ""
          }

          ${
            education.length > 0
              ? `<div class="section">
                  <h2>Educación</h2>
                  ${education
                    .map(
                      (edu) => `
                      <div class="item">
                        <strong>${edu.degree}</strong> - ${edu.institution}<br/>
                        <span class="date">${edu.field || ""} ${
                      edu.graduationYear ? `(${edu.graduationYear})` : ""
                    }</span>
                      </div>`
                    )
                    .join("")}
                </div>`
              : ""
          }

          ${
            skills && skills.length > 0
              ? `<div class="section">
                  <h2>Habilidades</h2>
                  ${skills
                    .map(
                      (skill) =>
                        `<span class="skill">${skill.name} - ${skill.level}</span>`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </body>
      </html>
    `;
  };

  // Exportar PDF
  const handleExportPDF = async () => {
    try {
      const html = await generateHTML();
      const { uri } = await Print.printToFileAsync({ html });

      Alert.alert("PDF generado", "¿Deseas compartir el CV?", [
        {
          text: "Compartir",
          onPress: async () => {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(uri);
            } else {
              Alert.alert(
                "No disponible",
                "La función de compartir no está disponible en este dispositivo."
              );
            }
          },
        },
        { text: "Cerrar", style: "cancel" },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <CVPreview cvData={cvData} />
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center mt-4"
          onPress={handleExportPDF}
        >
          <Text className="text-white text-base font-semibold">
            📄 Exportar CV a PDF
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
