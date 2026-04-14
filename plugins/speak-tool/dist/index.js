/**
 * 🔊 Speak Tool — Voicebox TTS Plugin for OpenClaw
 *
 * Native tool for generating speech using Voicebox API (Paul's cloned voice)
 * and playing it back locally via ffplay.
 *
 * Usage:
 *   speak({text: "Good morning Paul"})
 *   speak({text: "Hello", profile_id: "custom-profile-id"})
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
// Default configuration
const DEFAULT_CONFIG = {
    voiceboxUrl: "http://127.0.0.1:17493",
    profileId: "8202f4c4-5866-4065-8280-cf5421e3135a", // Paul V
    pollIntervalMs: 2000,
    maxPollAttempts: 30,
};
// Plugin registration
export default {
    id: "speak-tool",
    name: "Speak",
    description: "Generate speech from text using Voicebox TTS (Paul's cloned voice) and play locally",
    register(api) {
        // Register the speak tool
        api.registerTool({
            name: "speak",
            description: "Generate speech from text using Voicebox TTS and play it locally. Returns success/failure status.",
            parameters: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "Text to convert to speech",
                        minLength: 1,
                        maxLength: 5000,
                    },
                    profile_id: {
                        type: "string",
                        description: "Voicebox profile ID (default: Paul's cloned voice)",
                        default: DEFAULT_CONFIG.profileId,
                    },
                    auto_play: {
                        type: "boolean",
                        description: "Automatically play audio after generation (default: true)",
                        default: true,
                    },
                    save_path: {
                        type: "string",
                        description: "Optional path to save audio file",
                    },
                },
                required: ["text"],
            },
            async execute(_id, params, context) {
                const config = {
                    ...DEFAULT_CONFIG,
                    ...context.config,
                };
                const { text, profile_id = config.profileId, auto_play = true, save_path } = params;
                try {
                    // Step 1: Generate speech
                    const generationResult = await generateSpeech(text, profile_id, config.voiceboxUrl, config.pollIntervalMs, config.maxPollAttempts);
                    // Step 2: Download audio
                    const audioPath = save_path || generationResult.audioPath;
                    await downloadAudio(generationResult.generationId, audioPath, config.voiceboxUrl);
                    // Step 3: Play audio (if requested)
                    if (auto_play) {
                        await playAudio(audioPath);
                    }
                    // Return success response
                    return {
                        content: [
                            {
                                type: "text",
                                text: `✅ Speech generated and played successfully\n` +
                                    `   Duration: ${generationResult.duration}s\n` +
                                    `   File: ${audioPath}\n` +
                                    `   Size: ${(fs.statSync(audioPath).size / 1024).toFixed(2)} KB`,
                            },
                        ],
                    };
                }
                catch (error) {
                    // Return error response
                    return {
                        content: [
                            {
                                type: "text",
                                text: `❌ Speech generation failed: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
            },
        });
    },
};
/**
 * Generate speech via Voicebox API
 */
async function generateSpeech(text, profileId, voiceboxUrl, pollIntervalMs, maxPollAttempts) {
    const timestamp = Date.now();
    const jsonPath = path.join("/tmp", `voicebox-request-${timestamp}.json`);
    const audioPath = path.join("/tmp", `jarvis-voicebox-${timestamp}.wav`);
    // Write JSON payload
    const payload = {
        profile_id: profileId,
        text: text,
        language: "en",
        normalize: true,
    };
    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
    try {
        // Generate speech (async)
        const generateCmd = `curl -s -X POST "${voiceboxUrl}/generate" -H "Content-Type: application/json" -d @${jsonPath}`;
        const generateResult = execSync(generateCmd, { encoding: "utf8" });
        const generateData = JSON.parse(generateResult);
        const generationId = generateData.id;
        if (!generationId) {
            throw new Error(`Generation failed: ${generateData.error || "Unknown error"}`);
        }
        // Poll status until complete
        let status = generateData.status;
        let attempts = 0;
        let duration = 0;
        // Initial delay - Voicebox needs ~5 seconds to start generating
        await sleep(5000);
        while (status === "generating" && attempts < maxPollAttempts) {
            attempts++;
            // Increased timeout from 10s to 30s to handle slower generation
            const statusCmd = `curl -s --max-time 30 "${voiceboxUrl}/generate/${generationId}/status"`;
            const statusResult = execSync(statusCmd, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
            // Parse SSE format (data: {...})
            const jsonMatch = statusResult.match(/\{[^}]+\}/);
            if (jsonMatch) {
                const statusData = JSON.parse(jsonMatch[0]);
                status = statusData.status;
                duration = statusData.duration || 0;
            }
            if (status === "generating") {
                await sleep(pollIntervalMs);
            }
        }
        if (status !== "completed") {
            throw new Error(`Generation did not complete (status: ${status}, attempts: ${attempts}/${maxPollAttempts})`);
        }
        return { generationId, duration, audioPath };
    }
    finally {
        // Cleanup JSON payload
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
        }
    }
}
/**
 * Download audio from Voicebox API
 */
async function downloadAudio(generationId, audioPath, voiceboxUrl) {
    const downloadCmd = `curl -s --max-time 30 "${voiceboxUrl}/audio/${generationId}" -o "${audioPath}"`;
    execSync(downloadCmd);
    // Verify download
    const stats = fs.statSync(audioPath);
    if (stats.size < 1000) {
        throw new Error(`Download failed: file too small (${stats.size} bytes)`);
    }
}
/**
 * Play audio file via ffplay
 */
async function playAudio(audioPath) {
    try {
        execSync(`ffplay -nodisp -autoexit "${audioPath}" 2>&1`, {
            stdio: "inherit",
        });
    }
    catch (error) {
        // Non-fatal: audio generated but playback failed
        console.warn(`Playback warning: ${error.message}`);
    }
}
/**
 * Sleep helper
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map