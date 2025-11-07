
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Patient, Vital } from "./types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

const chatSessions: Record<string, Chat> = {};

const getChat = (sessionId: string) => {
    if (!chatSessions[sessionId]) {
        chatSessions[sessionId] = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are "MOWAERS AI Assistant", a helpful and friendly AI assistant for a health monitoring application.
                Your primary role is to answer general questions, explain health concepts in simple terms, and provide non-medical support.
                IMPORTANT: You MUST NOT provide any medical advice, diagnosis, or treatment.
                If a user asks for medical advice (e.g., "Should I take this medicine?", "Is this heart rate dangerous?"), you must decline politely and firmly, and advise them to consult a qualified healthcare professional.
                Example refusal: "As an AI assistant, I am not qualified to provide medical advice. It's very important that you speak with a doctor or another qualified healthcare provider about any medical concerns you have."
                Be empathetic, clear, and concise. Your goal is to be a helpful guide for the application, not a medical expert.`,
            }
        });
    }
    return chatSessions[sessionId];
}


export const sendMessageToBot = async (message: string, patient: Patient, vitals: Vital[]): Promise<string> => {
    if (!apiKey) return "API Key is not configured.";

    try {
        const chat = getChat(patient.id);
        const vitalString = vitals.map(v => `${v.type}: ${v.value} ${v.unit} (${v.status})`).join(', ');
        const fullMessage = `
            User question: "${message}"
            
            Current patient context (for your information only, do not share specific values unless the user asks):
            - Conditions: ${patient.conditions?.join(', ') || 'None'}
            - Recent Vitals: ${vitalString}
            
            Based on this context, provide a safe, non-diagnostic answer.
        `;
        const response: GenerateContentResponse = await chat.sendMessage({ message: fullMessage });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Sorry, I encountered an error. Please try again later.";
    }
};

export const summarizeVoiceNote = async (transcription: string): Promise<string> => {
    if (!apiKey) return "API Key not configured.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please summarize the following patient's voice note into a concise, clinically relevant sentence for a doctor's review. Focus on symptoms and patient sentiment. Transcription: "${transcription}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Could not generate summary.";
    }
};

export const generateDoctorSummary = async (patient: Patient, vitals: Vital[], timeline: any[]): Promise<string> => {
    if (!apiKey) return "API Key not configured.";
    try {
        const prompt = `
            Generate a brief AI summary for Dr. Reed about patient ${patient.name}.
            Patient Conditions: ${patient.conditions?.join(', ') || 'N/A'}.
            Current Vitals: ${vitals.map(v => `${v.type}: ${v.value} (${v.status})`).join('; ')}.
            Recent Events on Timeline (last 24 hours): ${timeline.slice(0, 5).map(e => `${e.type}: ${e.message || e.mood || e.note || e.summary}`).join('; ')}.

            Based on this data, provide:
            1. A one-sentence overview of the patient's current status.
            2. Key trends or recent alerts of note.
            3. A suggested follow-up action (e.g., "Routine follow-up recommended," "Consider medication adjustment review," "Urgent review of vitals suggested").
        `;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Could not generate AI summary.";
    }
};


export const getLifestyleSuggestion = async (conditions: string[]): Promise<string> => {
     if (!apiKey) return "API Key not configured.";
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a safe, general, non-diagnostic lifestyle tip (related to diet, hydration, or light activity) for a person with the following conditions: ${conditions.join(', ')}. The tip must be universally safe and not contradict standard medical advice. Frame it as a gentle suggestion.`,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Could not generate suggestion at this time.";
    }
}
