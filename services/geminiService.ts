import { GoogleGenAI, Chat } from "@google/genai";

// Fix: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
// The API key is assumed to be pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

const getChat = (): Chat => {
    if(!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a helpful and friendly AI assistant for a health monitoring application called MOWAERS. 
                Your primary goal is to answer general questions about health, wellness, and the MOWAERS platform. 
                You MUST NOT provide any medical advice, diagnosis, or treatment recommendations. 
                If a user asks for medical advice, you MUST politely decline and strongly advise them to consult a healthcare professional. 
                Keep your answers concise and easy to understand. Start your first response by introducing yourself and stating your purpose and limitations.`,
            },
        });
    }
    return chat;
}

export const sendMessageToBot = async (message: string): Promise<string> => {
    // Fix: Removed check for API key. As per guidelines, assume it is always available.
    try {
        const chatInstance = getChat();
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        // Reset chat on error
        chat = null;
        return "I'm sorry, an error occurred while processing your request. Please try again.";
    }
};
