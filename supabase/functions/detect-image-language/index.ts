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
    const formData = await req.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error("Image file is required");
    }

    console.log('Image language detection request, fileName:', imageFile.name, 'size:', imageFile.size);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(bytes)));
    const mimeType = imageFile.type || 'image/png';

    const systemPrompt = `You are a language detection system for document images. Analyze the image and determine if the text in it is primarily in English or Malayalam.
Return ONLY one word: either "english" or "malayalam". No explanations, just the language name in lowercase.
If there is no readable text, return "english" as default.`;

    const userPrompt = `Detect the language of the text in this image. Return only "english" or "malayalam".`;

    console.log('Calling Lovable AI for image language detection...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { 
                type: "image_url", 
                image_url: { 
                  url: `data:${mimeType};base64,${base64Image}` 
                } 
              }
            ]
          }
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

    console.log('Detected language from image:', detectedLanguage);

    // Validate response
    const language = detectedLanguage === "malayalam" ? "malayalam" : "english";

    return new Response(
      JSON.stringify({ language }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Image language detection error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Image language detection failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
