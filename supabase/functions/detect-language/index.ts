import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    console.log('Language detection request, textLength:', text?.length);

    if (!text?.trim()) {
      throw new Error("Text is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a language detection system. Analyze the text and determine if it's primarily in English or Malayalam.
Return ONLY one word: either "english" or "malayalam". No explanations, just the language name in lowercase.`;

    const userPrompt = `Detect the language of this text:\n\n${text.substring(0, 500)}`;

    console.log('Calling Lovable AI for language detection...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const detectedLanguage = data.choices?.[0]?.message?.content?.trim().toLowerCase();

    console.log('Detected language:', detectedLanguage);

    // Validate response
    const language = detectedLanguage === "malayalam" ? "malayalam" : "english";

    return new Response(
      JSON.stringify({ language }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Language detection error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Language detection failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
