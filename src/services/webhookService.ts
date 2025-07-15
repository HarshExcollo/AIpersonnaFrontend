// Webhook service for integrating with n8n persona workflows
const WEBHOOK_URL =
  "https://n8n-excollo.azurewebsites.net/webhook/e17df12a-2bfc-4270-8756-0c20442a4b9f";

import { getSessionId } from "../utils/session";

export interface WebhookMessage {
  message: string;
  persona_id: string;
  persona_name: string;
  user_id?: string;
  session_id: string;
  timestamp: string;
}

export interface WebhookResponse {
  response: string;
  status: string;
}

interface GenericResponse {
  message?: string;
  output?: string;
  [key: string]: unknown;
}

export const sendToWebhook = async (
  message: string,
  personaId: string,
  personaName: string
): Promise<string> => {
  try {
    // Get or create session ID for this persona
    const sessionId = getSessionId(personaId);

    const payload: WebhookMessage = {
      message: message,
      persona_id: personaId,
      persona_name: personaName,
      user_id: "current_user", // You can extend this to get actual user ID
      session_id: sessionId,
      timestamp: new Date().toISOString(),
    };

    console.log("🚀 Sending to webhook:", WEBHOOK_URL);
    console.log("👤 Persona:", personaName, `(ID: ${personaId})`);
    console.log("🔑 Session ID:", sessionId);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Webhook error response:", errorText);

      // Handle specific n8n webhook errors
      if (response.status === 404 && errorText.includes("not registered")) {
        return "🔧 The AI workflow is not currently active. Please activate the n8n workflow and try again.";
      }

      throw new Error(
        `Webhook request failed: ${response.status} - ${errorText}`
      );
    }

    const responseText = await response.text();
    console.log("✅ Raw response:", responseText);

    // Try to parse as JSON
    let data: WebhookResponse | GenericResponse;
    try {
      data = JSON.parse(responseText);
      console.log("✅ Parsed response:", data);
    } catch {
      console.log("⚠️ Response is not JSON, using as plain text");
      return responseText || "I've processed your payment query.";
    }

    const aiResponse =
      (data as WebhookResponse).response ||
      (data as GenericResponse).output ||
      (data as GenericResponse).message ||
      responseText ||
      "I've processed your payment query.";

    // Clean up the response text
    return aiResponse.replace(/^"(.*)"$/, "$1").trim();
  } catch (error) {
    console.error("❌ Error calling payment webhook:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    // Fallback response for AI queries
    return "I'm experiencing some technical difficulties accessing the AI systems. Please try again in a moment, or contact support if the issue persists.";
  }
};

export const isWebhookPersona = (personaId: string): boolean => {
  return personaId === "1" || personaId === "2"; // Ethan Carter (Head of Payment) & David Lee (Product Manager)
};

// Test function to check if webhook is active
export const testWebhookConnection = async (): Promise<boolean> => {
  try {
    // Get or create session ID
    const sessionId = getSessionId();

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test: "connection_check",
        session_id: sessionId,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Webhook connection test failed:", error);
    return false;
  }
};
