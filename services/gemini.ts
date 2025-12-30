
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Book, Chapter, GenerationConfig, AIActionType } from '../types';

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Update model names to recommended Gemini 3 and 2.5 series
const MODEL_FAST = 'gemini-3-flash-preview';
const MODEL_CREATIVE = 'gemini-3-pro-preview'; 
const MODEL_IMAGE = 'gemini-2.5-flash-image';
const MODEL_TTS = 'gemini-2.5-flash-preview-tts';

export const GeminiService = {
  /**
   * Generates a list of chapter titles based on book details.
   */
  async generateOutline(book: Partial<Book>): Promise<any[]> {
    const ai = getClient();
    const prompt = `
      You are a Legendary Publishing Mogul. You do not create average books. You create "Crore-Rupee Assets" (₹10 Million+ Value).
      
      Details:
      Title: ${book.title}
      Author: ${book.author}
      Genre: ${book.genre}
      Tone: ${book.tone}
      Target Audience: ${book.targetAudience}
      Description: ${book.description}
      Primary Language: ${book.language || 'English'}

      IMPORTANT: The outline titles and summaries MUST be written in ${book.language || 'English'}.
      
      Strategy for 1 Crore Valuation:
      - Titles must be "Viral Hooks" (High Click-Through Rate).
      - Structure must create an "Addiction Loop" (Reader cannot stop).
      - Each chapter must deliver "Life-Changing Value" or "Heart-Stopping Suspense".

      Return a JSON array of chapter objects. Each object should have a "title" and a brief "summary".
      The response must be a JSON array.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["title", "summary"]
          }
        }
      }
    });

    try {
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error("Failed to parse outline", e);
        return [];
    }
  },

  /**
   * Translates an existing outline to a new language while maintaining structure.
   */
  async translateOutline(chapters: any[], targetLanguage: string): Promise<any[]> {
    const ai = getClient();
    const prompt = `
      Translate the following book chapter titles and summaries into ${targetLanguage}.
      Maintain the same JSON structure. Ensure the tone is preserved and the translations are high-quality and professional.

      Outline to Translate:
      ${JSON.stringify(chapters)}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["title", "summary"]
          }
        }
      }
    });

    try {
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error("Failed to parse translated outline", e);
        return chapters; // Return original if failed
    }
  },

  /**
   * Extracts an outline from an uploaded PDF.
   */
  async extractOutlineFromPdf(base64Data: string, mimeType: string): Promise<any[]> {
    const ai = getClient();
    
    const prompt = `
      You are an expert editor. Analyze the attached PDF document.
      Extract the Table of Contents or infer the chapter structure if no explicit TOC exists.
      
      Return a JSON array of chapter objects. Each object MUST have a "title" and a brief "summary" (if available in the text, otherwise imply it from the title).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: {
        parts: [
          {
             inlineData: {
               data: base64Data,
               mimeType: mimeType
             }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["title", "summary"]
          }
        }
      }
    });

    try {
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error("Failed to parse PDF outline", e);
        return [];
    }
  },

  /**
   * Generates a brief summary for a chapter.
   */
  async generateChapterSummary(content: string, language?: string): Promise<string> {
    const ai = getClient();
    const prompt = `
      Read the following chapter content and provide a concise summary (max 3 sentences) that captures the main plot points or goals accomplished.
      The summary must be written in ${language || 'English'}.

      Chapter Content:
      ${content.substring(0, 10000)}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    return response.text || "";
  },

  /**
   * Writes content for a specific chapter.
   */
  async writeChapter(
    book: Book, 
    chapter: Chapter, 
    instructions: string, 
    config: GenerationConfig,
    isWholeChapter: boolean = false
  ): Promise<string> {
    const ai = getClient();
    
    // Context building
    const previousChapters = book.chapters
      .filter(c => c.id !== chapter.id && book.chapters.indexOf(c) < book.chapters.indexOf(chapter))
      .slice(-2) // Last 2 chapters for immediate context
      .map(c => `Summary of Chapter "${c.title}": ${c.summary || 'No summary available.'}`)
      .join('\n\n');

    let taskDescription = `Write the content for the chapter titled "${chapter.title}".`;
    if (isWholeChapter) {
        taskDescription = `
        WRITE THE COMPLETE CHAPTER "${chapter.title}" FROM START TO FINISH.
        
        Requirements for EPIC SCALE:
        1. Write an EXTREMELY LONG, MASSIVE, and COMPREHENSIVE chapter.
        2. Aim for the MAXIMUM possible length allowed (Push for 5,000 to 10,000+ words).
        3. Do not summarize or rush. EXPAND every single scene, dialogue, and thought process.
        4. Include intricate details, deep philosophical musings (if non-fiction) or intense sensory immersion (if fiction).
        5. Ensure it flows logically from start to end with a strong opening hook and a meaningful conclusion.
        6. Chapter Summary/Goal: ${chapter.summary || 'Progress the narrative logically.'}
        `;
    } else {
        taskDescription += `\nChapter Goal/Summary: ${chapter.summary || 'Follow the story progression.'}`;
    }

    const prompt = `
      You are the "Crore Rupee Ghostwriter". You have written books that have sold millions of copies.
      Your writing is hypnotic, psychologically deep, and commercially perfect.
      
      Book Info:
      Title: ${book.title}
      Genre: ${book.genre}
      Author: ${book.author}
      Target Audience: ${book.targetAudience}
      Primary Language: ${book.language || 'English'}
      
      Writing Style Config:
      Tone: ${config.tone}
      Perspective: ${config.perspective}
      
      IMPORTANT TONE INSTRUCTION: 
      If the Tone above specifies a MIX of percentages (e.g. "70% Engaging, 30% Dark"), you MUST blend these styles accordingly.
      - Dominant tone should control the overall structure and voice.
      - Secondary tone should influence specific word choices, metaphors, or character nuances.
      
      Context (Previous Chapters):
      ${previousChapters}
      
      Task:
      ${taskDescription}
      
      Specific Instructions from User:
      ${instructions}
      
      CRORE-LEVEL WRITING RULES:
      1. HOOKS EVERYWHERE: Every paragraph must compel the reader to the next.
      2. SENSORY IMMERSION: Don't describe; transport the reader.
      3. DEEP PSYCHOLOGY: For fiction, explore the darkest/deepest emotions. For non-fiction, provide paradigm-shifting insights, not just tips.
      4. NO FLUFF: Every word must earn its place. If it's boring, cut it.
      5. The output MUST be in ${book.language || 'English'}.
      
      IMPORTANT: Output ONLY the story content formatted in Markdown. 
      Do not include the chapter title at the top.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_CREATIVE,
      contents: prompt,
      config: {
        temperature: config.creativity,
      }
    });

    return response.text || "";
  },

  /**
   * Continues writing from the current text.
   */
  async continueWriting(
    book: Book,
    chapter: Chapter,
    currentContent: string,
    config: GenerationConfig
  ): Promise<string> {
    const ai = getClient();
    
    // Take the last 2000 characters to maintain continuity without overloading context
    const recentContext = currentContent.slice(-2000);

    const prompt = `
      Act as a Legendary Author (Crore Club Member). Continue the story seamlessly from the following text.
      The continuation MUST be written in ${book.language || 'English'} and maintain elite literary standards.
      
      Context:
      ...${recentContext}
      
      Guidelines:
      - Maintain the existing tone: ${config.tone}
      - Perspective: ${config.perspective}
      - Genre: ${book.genre}
      - Avoid generic AI phrasing. Be creative, specific, and impactful.
      
      Write about 500-1000 words continuing the scene.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        temperature: config.creativity,
      }
    });

    return response.text || "";
  },

  /**
   * Refines or rewrites selected text.
   */
  async refineText(selection: string, instruction: string): Promise<string> {
    const ai = getClient();
    const prompt = `
      Act as the Editor-in-Chief of the world's top publishing house. Rewrite the following text to increase its quality to "Bestseller Status".
      Maintain the original language of the text.
      
      Original Text:
      "${selection}"
      
      Instruction:
      ${instruction}
      
      Return ONLY the rewritten text.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    return response.text || selection;
  },

  /**
   * Translates the given text to the target language.
   */
  async translateText(text: string, targetLanguage: string): Promise<string> {
    const ai = getClient();
    const prompt = `
      You are a professional literary translator. Translate the Markdown text below into ${targetLanguage}.
      
      Guidelines:
      1. PRESERVE all Markdown formatting (bold, italic, headers, lists).
      2. Maintain the original tone, style, and voice.
      3. Adapt idioms and cultural references appropriately for the target language.
      4. Output ONLY the translated Markdown text. Do not add introductions or explanations.
      
      [START_TEXT]
      ${text}
      [END_TEXT]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    return response.text || text;
  },

  /**
   * Generates a book cover image.
   */
  async generateCoverImage(book: Partial<Book>): Promise<string | null> {
    const ai = getClient();
    
    const prompt = `
      A professional, visually striking book cover for a book titled "${book.title}".
      Genre: ${book.genre}
      Tone: ${book.tone}
      Description: ${book.description}
      
      The image should be high resolution, artistic, and suitable for a digital bestseller. 
      Do not include text on the image.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_IMAGE,
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "3:4" // Standard book portrait ratio
                }
            }
        });

        // Extract image from response - iterate through parts as per guidelines
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                     return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
    } catch (e) {
        console.error("Failed to generate cover image", e);
    }
    return null;
  },

  /**
   * Generates audio from text (TTS)
   */
  async generateSpeech(text: string): Promise<string | null> {
    const ai = getClient();
    try {
      // Use clean text for TTS, removing heavy markdown if necessary
      const response = await ai.models.generateContent({
        model: MODEL_TTS,
        contents: {
          parts: [{ text: text }]
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      // Returns Base64 string of audio data - iterate through parts
      if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                  return part.inlineData.data;
              }
          }
      }
      return null;

    } catch (e) {
      console.error("TTS Generation Error", e);
      return null;
    }
  },

  /**
   * Chat for the Book Thinker interface with deep logic.
   */
  async chatWithThinker(
      history: {role: 'user'|'model', text: string}[], 
      userInput: string, 
      mode: 'brainstorm' | 'market' | 'critic' | 'muse' = 'brainstorm'
  ): Promise<{response: string, extractedConcept?: {title: string, description: string}}> {
    const ai = getClient();
    
    // Construct chat history text
    const chatText = history.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');

    let modeInstruction = "";
    switch(mode) {
        case 'market':
            modeInstruction = "Your persona is 'The Empire Builder'. Focus on SCALING. How does this book generate 1 Crore Rupees? Discuss back-end sales, high-ticket consulting, licensing, and international rights. Ignore small thinking.";
            break;
        case 'critic':
            modeInstruction = "Your persona is 'The Shark Tank Investor'. Destroy weak ideas. Demand 'Unfair Advantages'. Ask: 'Why will 1 million people buy this?'. Be brutal but valuable.";
            break;
        case 'muse':
            modeInstruction = "Your persona is 'The Visionary'. Think massive. Netflix adaptations, global movements, paradigm shifts. Push the user to think 10x bigger.";
            break;
        case 'brainstorm':
        default:
            modeInstruction = "Your persona is 'The Master Architect'. Help structure a 'Legacy Book'. A book that will be read for 50 years. Combine commercial appeal with deep substance.";
            break;
    }

    const prompt = `
      You are the "AI Book Thinker", a specialized consultant for authors who want to write 1 Crore Rupee (₹10 Million+) Books.
      
      Current Mode: ${mode.toUpperCase()}
      Mode Instruction: ${modeInstruction}
      
      Conversation History:
      ${chatText}
      
      User Input:
      ${userInput}
      
      Instructions:
      1. Respond primarily based on your current Mode Instruction.
      2. If the user has a solid idea or problem, suggest a book title and a 1-sentence description/solution.
      3. At the end of your response, if you have identified a clear Book Title and Description, format it exactly like this block (hidden from user view, I will parse it):
      
      |||CONCEPT_START|||
      TITLE: [Proposed Title]
      DESC: [Proposed Description]
      |||CONCEPT_END|||
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    const fullText = response.text || "";
    
    // Parse out concept if present
    const conceptRegex = /\|\|\|CONCEPT_START\|\|\|[\s\S]*?TITLE:\s*(.*?)[\r\n]+DESC:\s*(.*?)[\r\n]*\|\|\|CONCEPT_END\|\|\|/;
    const match = fullText.match(conceptRegex);
    
    let extractedConcept;
    let cleanText = fullText;

    if (match) {
        extractedConcept = {
            title: match[1].trim(),
            description: match[2].trim()
        };
        // Remove the meta block from the visible response
        cleanText = fullText.replace(match[0], '').trim();
    }

    return {
        response: cleanText,
        extractedConcept
    };
  },

  /**
   * Generates a High-Converting Amazon Book Description (Sales Copy).
   */
  async generateAmazonDescription(book: Book, pdfBase64?: string, pdfMimeType?: string): Promise<string> {
    const ai = getClient();
    
    const context = pdfBase64 
        ? "User has provided the full manuscript (PDF) attached below. Analyze it to create the description." 
        : `Context (Chapters & Summaries):\n${book.chapters.map(c => `- ${c.title}: ${c.summary}`).join('\n')}\n\nCore Description: ${book.description}`;

    const promptText = `
    You are a Copywriting Genius specializing in Amazon KDP Bestsellers.
    Your goal is to write a book description that converts browsers into buyers instantly.
    The book is valued at ₹1 Crore (High Ticket/High Value).

    Structure the description using the "Hook-Story-Offer" framework:
    1. **Headline**: A 1-line punchy hook (Bold, Caps).
    2. **The Pain/Problem**: Agitate the reader's current situation.
    3. **The Solution (The Book)**: Introduce the book as the ultimate guide.
    4. **Bullets**: 5-7 fascinating bullet points on what they will learn (Use "How to...", "The secret to...", "Why...").
    5. **Social Proof/Authority**: Why the author is the expert.
    6. **Call to Action**: Urgent command to buy now.

    Book Details:
    Title: ${book.title}
    Author: ${book.author}
    Genre: ${book.genre}
    ${context}

    Generate the description in Markdown.
    `;

    const parts: any[] = [{ text: promptText }];
    if (pdfBase64 && pdfMimeType) {
        parts.unshift({
            inlineData: {
                data: pdfBase64,
                mimeType: pdfMimeType
            }
        });
    }

    const response = await ai.models.generateContent({
        model: MODEL_CREATIVE,
        contents: { parts: parts },
    });

    return response.text || "Failed to generate description.";
  },

  /**
   * Versatile handler for 2026 Features
   */
  async runSpecializedTask(
      action: AIActionType,
      book: Book,
      chapter: Chapter | null,
      customInput: string
  ): Promise<string> {
      const ai = getClient();
      let prompt = '';
      let isImage = false;
      let model = MODEL_FAST;

      // Default context (current chapter)
      let context = chapter ? `Current Chapter: ${chapter.title}\nContent:\n${chapter.content.slice(0, 10000)}...` : `Book Context: ${book.description}`;

      // Specialized Context for Plot Checks
      if (action === AIActionType.PLOT_HOLE_CHECK) {
          context = `
          Book Title: ${book.title}
          Genre: ${book.genre}
          Description: ${book.description}
          Primary Language: ${book.language || 'English'}
          
          Full Chapter Outline & Summaries:
          ${book.chapters.map((c, i) => `Chapter ${i+1} (${c.title}): ${c.summary || 'No summary'} ${c.content ? '[Has Content]' : '[Empty]'}`).join('\n')}
          `;
      }

      const langInstr = `IMPORTANT: Provide the response/analysis in ${book.language || 'English'}.`;

      switch(action) {
          case AIActionType.CHARACTER_PROFILE:
              prompt = `Generate a deep, complex character profile for: "${customInput}". Include visual description, flaws, backstory, voice, and internal conflict. Make them feel real and "expensive" (high quality). Context: ${book.genre}. ${langInstr}`;
              break;
          case AIActionType.WORLD_LORE:
              prompt = `
              Act as an expert world-builder for the book "${book.title}" (${book.genre}).
              Create a detailed Wiki Entry for the concept/location: "${customInput}".
              ${langInstr}
              
              Context from Book: ${book.description}

              Please structure the response with the following sections (use Markdown headers):
              # ${customInput}
              
              ## Overview
              [Brief summary]

              ## Geography & Environment
              [Physical description, climate, location details]

              ## History & Origins
              [Key historical events, timeline, founding]

              ## Culture & Society
              [Customs, beliefs, demographics, social structure]

              ## Conflicts & Politics
              [Current tensions, wars, political issues, or threats]

              ## Relevance to Story
              [Why this element matters to the plot]
              `;
              break;
          case AIActionType.STORYBOARD_SCENE:
              prompt = `A cinematic storyboard sketch for the following scene: "${customInput || chapter?.title}". Style: Comic book, noir, detailed lines.`;
              isImage = true;
              model = MODEL_IMAGE;
              break;
          case AIActionType.PLOT_HOLE_CHECK:
              prompt = `
              Act as a ruthless developmental editor for a Bestselling Novel. Analyze the provided book outline and chapter summaries for plot holes, logical inconsistencies, pacing issues, or contradictions.
              ${langInstr}
              
              Identify:
              1. Major Plot Holes (Impossible events, dropped plotlines)
              2. Character Inconsistencies (Actions betraying established traits)
              3. Pacing Issues (Drags or rushed sections)
              
              Context:
              ${context}
              
              Provide a bulleted list of issues and suggested fixes to ensure high commercial viability.
              `;
              break;
          case AIActionType.PACING_HEATMAP:
              prompt = `Analyze the pacing of the following text. Break it down by scene and rate tension/action from 1-10. Output as a list. Text: ${context}`;
              break;
          case AIActionType.DIALOGUE_DOCTOR:
              prompt = `Analyze the dialogue in this text. does it sound natural? distinctive? Rewrite the weak dialogue lines to be punchier and full of subtext (Show, don't tell). Text: ${context}. ${langInstr}`;
              break;
          case AIActionType.SENSORY_ENHANCER:
              prompt = `Rewrite the following paragraph to include more sensory details (smell, touch, sound, taste). Make it immersive and vivid. Text: "${customInput || chapter?.content.slice(0, 500)}". ${langInstr}`;
              break;
          case AIActionType.SHOW_DONT_TELL:
              prompt = `Identify instances of "telling" in this text and rewrite them to "show" instead. Use action and sensory details. Text: "${customInput || chapter?.content.slice(0, 500)}". ${langInstr}`;
              break;
          case AIActionType.STYLE_MIMIC:
              prompt = `Rewrite this text in the style of: ${customInput}. Text: "${chapter?.content.slice(0, 1000)}". ${langInstr}`;
              break;
          case AIActionType.BETA_READER_SIM:
              prompt = `Act as a beta reader who is: ${customInput || 'A critical genre fan'}. Read this chapter and give honest feedback on where you were bored, confused, or excited. Be specific. ${langInstr}`;
              break;
          case AIActionType.VOICE_SWITCHER:
              prompt = `Rewrite the following text from ${customInput} perspective (e.g. switch First Person to Third Person). Text: "${chapter?.content.slice(0, 1000)}". ${langInstr}`;
              break;
          case AIActionType.TITLE_GEN_PRO:
              prompt = `Generate 10 bestselling titles for this book based on the summary: ${book.description}. Use A/B testing logic for different markets. High click-through rate style. ${langInstr}`;
              break;
          case AIActionType.CLIFFHANGER_GEN:
              prompt = `Suggest 3 gripping cliffhangers to end the current scene: "${chapter?.content.slice(-500)}". Make the reader desperate to turn the page. ${langInstr}`;
              break;
          case AIActionType.EMOTION_ARC:
              prompt = `Map the emotional arc of the main character in this chapter. List the shifts in emotion. ${langInstr}`;
              break;
          case AIActionType.FACT_CHECKER:
              prompt = `Verify the historical/scientific accuracy of this text: "${customInput}". ${langInstr}`;
              model = MODEL_FAST; 
              break;
          case AIActionType.THEME_WEAVER:
              prompt = `Suggest ways to weave the theme of "${customInput}" more deeply into the current chapter without being preachy. ${langInstr}`;
              break;
          case AIActionType.SYNOPSIS_GEN:
              prompt = `Write a professional 1-page synopsis of the book so far, suitable for sending to a literary agent. ${langInstr}`;
              break;
          case AIActionType.AUDIO_DRAMA_SCRIPT:
              prompt = `Convert the current scene into an Audio Drama Script with sound FX cues and character tags. ${langInstr}`;
              break;
          case AIActionType.TRANSLATION_PREVIEW:
              prompt = `Translate the first paragraph of this chapter into ${customInput || 'Spanish'} to preview localization feel.`;
              break;
          case AIActionType.MARKETING_BLURB:
              prompt = `Write 3 variations of a high-converting marketing blurb for this book: 1) Instagram Caption, 2) Amazon Description, 3) Tweet. ${langInstr}`;
              break;
          case AIActionType.READABILITY_ANALYZER:
              prompt = `
              Analyze the text for flow, clarity, and readability.
              
              Calculate and provide:
              - Estimated Flesch-Kincaid Reading Grade Level.
              
              Identify issues:
              1. Complex/Run-on sentences (Quote them).
              2. Passive voice misuse.
              3. Choppy transitions.
              
              Suggestions:
              - Provide explicit suggestions to simplify the complex sentences identified above.
              - Suggest better word choices for clarity.
              - Break down long paragraphs.
              
              Text Segment:
              ${chapter?.content.slice(0, 2000)}
              
              ${langInstr}
              `;
              break;
          default:
              return "Feature not implemented yet.";
      }

      if (isImage) {
          try {
             const response = await ai.models.generateContent({
                model: model,
                contents: { parts: [{ text: prompt }] },
                config: { imageConfig: { aspectRatio: "16:9" } }
             });
             // Return image data URI - iterate through parts
             if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
                 for (const part of response.candidates[0].content.parts) {
                     if (part.inlineData && part.inlineData.data) {
                         return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                     }
                 }
             }
             return "Failed to generate image.";
          } catch(e) {
              return "Image generation error.";
          }
      }

      // For PLOT_HOLE_CHECK, build the context explicitly
      const finalPrompt = action === AIActionType.PLOT_HOLE_CHECK ? prompt : prompt + (isImage ? '' : `\n\nContext: ${context}`);

      const response = await ai.models.generateContent({
          model: model,
          contents: finalPrompt
      });

      return response.text || "No response generated.";
  }
};
