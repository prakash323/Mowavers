import { GoogleGenAI } from "@google/genai";
// Corrected import path for types
import { Patient, Vital, TimelineEvent } from "../types";

// This is a placeholder for a secure way to access the API key.
// In a real application, this would be handled by a backend service or secure environment variables.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

const formatVitals = (vitals: Vital[]): string => {
    return vitals.map(v => `${v.type}: ${v.value} ${v.unit} (Status: ${v.status}, Trend: ${v.trend})`).join('\n');
};

export const sendMessageToBot = async (message: string, patient: Patient, vitals: Vital[]): Promise<string> => {
    const vitalsString = formatVitals(vitals);
    const patientContext = `The user is a patient named ${patient.name}. Their known conditions are ${patient.conditions?.join(', ') || 'none'}. Their current vitals are:\n${vitalsString}.`;
    
    const contents = `${patientContext}\n\nPatient question: "${message}"\n\nAI Assistant response:`;
    const systemInstruction = "You are a helpful AI assistant for a health monitoring app called MOWAERS. Your name is the MOWAERS AI Assistant. You must not provide any medical advice. You can answer general health questions or questions about the patient's current (provided) vital signs. Be friendly and concise.";

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.5,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 150,
            },
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API error in sendMessageToBot:', error);
        return "I'm sorry, I encountered an error while processing your request.";
    }
};

export const summarizeVoiceNote = async (transcription: string): Promise<string> => {
    const contents = `Please summarize the following patient voice note transcription into a concise, one-sentence summary for a doctor's quick review. Extract the key symptoms mentioned.\n\nTranscription: "${transcription}"\n\nSummary:`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                maxOutputTokens: 60,
                temperature: 0.2,
            }
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API error in summarizeVoiceNote:', error);
        return "Could not generate summary.";
    }
};

export const getLifestyleSuggestion = async (conditions: string[]): Promise<string> => {
    const contents = `Provide a single, simple, actionable lifestyle tip (like a diet, exercise, or mindfulness suggestion) for a patient with the following conditions: ${conditions.join(', ')}. The suggestion should be general and not constitute medical advice.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                maxOutputTokens: 80,
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API error in getLifestyleSuggestion:', error);
        return "Keep focusing on your health goals and stay hydrated today.";
    }
};

export const generateDoctorSummary = async (patient: Patient, vitals: Vital[], timeline: TimelineEvent[]): Promise<string> => {
    const vitalsString = formatVitals(vitals);
    
    const timelineSummary = timeline
        .slice(0, 5) // last 5 events
        .map(e => {
            const date = e.timestamp.toLocaleDateString();
            switch(e.eventType) {
                case 'alert': return `${date} - Alert: ${e.message}`;
                case 'vital': return `${date} - Vital Reading: ${e.type} was ${e.value} ${e.unit} (${e.status})`;
                case 'mood': return `${date} - Mood Log: Feeling ${e.mood}, Stress: ${e.stress}.`;
                case 'medication': return `${date} - Medication: ${e.medicationName} marked as ${e.status}.`;
                case 'note': return `${date} - Note from ${e.authorRole} ${e.authorName}: ${e.note}`;
                case 'voice': return `${date} - Voice Note Summary: ${e.summary}`;
            }
        }).filter(Boolean).join('\n');

    const contents = `
        **Patient:** ${patient.name} | **DOB:** ${patient.dob} | **Conditions:** ${patient.conditions?.join(', ') || 'N/A'}

        **Current Vitals:**
        ${vitalsString}

        **Recent Timeline Events:**
        ${timelineSummary || 'No recent events.'}

        ---
        Based *only* on the data above, provide a concise clinical summary for a doctor. Structure your response into three sections using markdown: "### Key Observations", "### Potential Risks", and "### Recommended Actions". Do not diagnose. Focus on data-driven insights.
    `;

    const systemInstruction = "You are a clinical AI assistant. Your role is to analyze patient data and provide a clear, concise summary for a healthcare professional. Do not provide a diagnosis. Focus on highlighting trends, risks, and actionable insights from the provided data. Use markdown for formatting.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents,
            config: { 
                systemInstruction,
                temperature: 0.3,
            },
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API error in generateDoctorSummary:', error);
        return "Error generating summary. Please review patient data manually.";
    }
};