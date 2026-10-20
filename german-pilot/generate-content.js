const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GROK_API_KEY || 'g2a_60e38c9a8980_uL5H6bDW_UOLNoktT3OcwfSDeTrUHvhJ';
const API_URL = 'https://api.nexusapi.co/v1/chat/completions';
const MODEL = process.env.GROK_MODEL || 'grok-4.7-build-fast';

const DATA_DIR = path.join(__dirname, 'data');
const GEN_DIR = path.join(DATA_DIR, 'generated');
if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR, { recursive: true });

const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));

function callGrok(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are Germany\'s top technical coffee machine repair engineer, hydraulic technician, and master editor. Write exhaustive, authoritative, deeply technical content in professional German. Output strictly valid JSON without markdown wrapping.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });

    const req = https.request(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 120000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API returned status ${res.statusCode}: ${data}`));
        }
        try {
          const parsed = JSON.parse(data);
          let rawContent = parsed.choices[0].message.content.trim();
          // Clean possible markdown code fences
          if (rawContent.startsWith('```json')) rawContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          else if (rawContent.startsWith('```')) rawContent = rawContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
          const jsonContent = JSON.parse(rawContent);
          resolve({ json: jsonContent, usage: parsed.usage });
        } catch (e) {
          reject(new Error(`Failed to parse JSON response: ${e.message}\nRaw: ${data.slice(0, 300)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 120s'));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function buildPrompt(p) {
  return `
Write an exhaustive, authoritative, 1000+ word technical guide in German for:
Product: ${p.brand} ${p.model} - ${p.partName}
ASIN: ${p.asin}
Brand: ${p.brand}
Model: ${p.model}
Category: ${p.category}

Output strictly a JSON object with this exact structure:
{
  "page_title": "Professional German SEO Title (approx 65 chars)",
  "meta_description": "Compelling German meta description with technical keywords (approx 155 chars)",
  "word_count_check": 1150,
  "engineering_breakdown": "Exhaustive breakdown of the mechanical/hydraulic/electronic design, material composition (e.g. POM, VMQ/EPDM, 1.4310 stainless, brass, PTFE), operating tolerances, pressure thresholds (bar/flow rate), and common mechanical failure points in German (minimum 250 words)",
  "symptoms_and_causes": "Detailed analysis in German of failure symptoms, noise patterns, error messages, and root causes (minimum 200 words)",
  "diy_step_by_step": [
    {"step": 1, "title": "German Step Title", "action": "Clear step instructions"},
    {"step": 2, "title": "German Step Title", "action": "Clear step instructions"},
    {"step": 3, "title": "German Step Title", "action": "Clear step instructions"},
    {"step": 4, "title": "German Step Title", "action": "Clear step instructions"},
    {"step": 5, "title": "German Step Title", "action": "Clear step instructions"}
  ],
  "step_by_step_narrative": "Exhaustive step-by-step DIY installation and replacement narrative in German explaining tools needed (Torx TX20, TX10, OKS 1110 grease, etc.), safety disconnect, disassembly, seal replacement, lubrication, calibration, and leak test (minimum 250 words)",
  "compatibility_matrix": {
    "fits": ["Exact compatible model 1", "Compatible model 2", "Compatible model 3", "Compatible model 4"],
    "incompatible": ["Mechanically incompatible model A", "Incompatible model B"]
  },
  "maintenance_schedule": [
    {"frequency": "Wöchentlich", "task": "Maintenance task in German"},
    {"frequency": "Monatlich", "task": "Maintenance task in German"},
    {"frequency": "Alle 6-12 Monate", "task": "Maintenance task in German"}
  ],
  "troubleshooting_table": [
    {"error": "German symptom / error code", "cause": "Technical root cause", "fix": "Actionable repair procedure"},
    {"error": "German symptom / error code", "cause": "Technical root cause", "fix": "Actionable repair procedure"},
    {"error": "German symptom / error code", "cause": "Technical root cause", "fix": "Actionable repair procedure"}
  ],
  "faq": [
    {"q": "Technical German question 1?", "a": "Thorough German answer (70+ words)"},
    {"q": "Technical German question 2?", "a": "Thorough German answer (70+ words)"},
    {"q": "Technical German question 3?", "a": "Thorough German answer (70+ words)"}
  ]
}
`;
}

async function run() {
  console.log(`☕ Starting Grok 4.7 Technical Content Generator for German Coffee Pilot (${products.length} products)...`);
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const targetFile = path.join(GEN_DIR, `${p.id}.json`);
    
    if (fs.existsSync(targetFile)) {
      console.log(`[${i + 1}/${products.length}] ⏩ Cached: ${p.id}`);
      continue;
    }

    console.log(`[${i + 1}/${products.length}] 🧠 Generating via Grok 4.7: ${p.brand} ${p.model} - ${p.partName}...`);
    try {
      const prompt = buildPrompt(p);
      const start = Date.now();
      const res = await callGrok(prompt);
      const duration = ((Date.now() - start) / 1000).toFixed(1);
      
      fs.writeFileSync(targetFile, JSON.stringify(res.json, null, 2), 'utf8');
      console.log(`   ✅ Success in ${duration}s! (Completion Tokens: ${res.usage.completion_tokens}, Total: ${res.usage.total_tokens})`);
      
      // Gentle pause to respect rate limits
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`   ❌ Failed for ${p.id}: ${err.message}`);
      // Retry once if error
      console.log(`   🔁 Retrying ${p.id}...`);
      try {
        await new Promise(r => setTimeout(r, 5000));
        const res = await callGrok(buildPrompt(p));
        fs.writeFileSync(targetFile, JSON.stringify(res.json, null, 2), 'utf8');
        console.log(`   ✅ Retry Succeeded for ${p.id}!`);
      } catch (retryErr) {
        console.error(`   ❌ Retry also failed: ${retryErr.message}`);
      }
    }
  }

  console.log('🎉 Generation Run Finished!');
}

run();
