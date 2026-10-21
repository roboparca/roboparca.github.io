const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GROK_API_KEY || 'g2a_60e38c9a8980_uL5H6bDW_UOLNoktT3OcwfSDeTrUHvhJ';
const API_URL = 'https://api.nexusapi.co/v1/chat/completions';
const MODEL = 'grok-4.7-build-fast';

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
          content: 'You are Germany\'s top master coffee machine mechatronics technician and editorial author. Write exhaustive, authentic, Google-researched technical guides in professional German. Output strictly valid JSON without any markdown code fences.'
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
          return reject(new Error(`API ${res.statusCode}: ${data.slice(0, 200)}`));
        }
        try {
          const parsed = JSON.parse(data);
          let raw = parsed.choices[0].message.content.trim();
          if (raw.startsWith('```json')) raw = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          else if (raw.startsWith('```')) raw = raw.replace(/^```\s*/, '').replace(/\s*```$/, '');
          const jsonContent = JSON.parse(raw);
          resolve({ json: jsonContent, usage: parsed.usage });
        } catch (e) {
          reject(new Error(`JSON parse err: ${e.message}\nRaw: ${data.slice(0, 150)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
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
OEM Number: ${p.oem || 'N/A'}
Brand: ${p.brand}
Model: ${p.model}
Category: ${p.category}
Key Specs: ${(p.specs || []).join(', ')}

Output strictly a JSON object with this exact structure:
{
  "page_title": "Professional German SEO Title (60-70 chars)",
  "meta_description": "Compelling German meta description with exact part and model specifications (145-160 chars)",
  "word_count_check": 1200,
  "engineering_breakdown": "Deep mechatronic breakdown in German explaining internal mechanisms, tolerances (bar, mm), material science (POM Delrin, VMQ, brass, stainless 1.4310), flow dynamics, and root cause failure mechanisms (minimum 250 words, formatted as clean informative paragraphs)",
  "symptoms_and_causes": "Detailed analysis in German covering audio cues (grinding, humming, ticking), pressure drop symptoms, wet coffee pucks in drip tray, error codes, and electrical/hydraulic root causes (minimum 200 words)",
  "diy_step_by_step": [
    {"step": 1, "title": "German Step Title", "action": "Clear detailed action instruction in German with tool mention"},
    {"step": 2, "title": "German Step Title", "action": "Clear detailed action instruction in German"},
    {"step": 3, "title": "German Step Title", "action": "Clear detailed action instruction in German"},
    {"step": 4, "title": "German Step Title", "action": "Clear detailed action instruction in German"},
    {"step": 5, "title": "German Step Title", "action": "Clear detailed action instruction in German"}
  ],
  "step_by_step_narrative": "Comprehensive narrative guide in German walking through tools (Torx TX10/20, food-grade silicone grease OKS 1110), safety procedures (disconnect 230V mains), disassembly, replacement, seal seating, calibration, and pressure test (minimum 250 words)",
  "compatibility_matrix": {
    "fits": ["Exact Model Variant 1", "Variant 2", "Variant 3", "Variant 4"],
    "incompatible": ["Incompatible Model Variant A", "Variant B"]
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
    {"q": "Technical German question 1?", "a": "Thorough German answer (60+ words)"},
    {"q": "Technical German question 2?", "a": "Thorough German answer (60+ words)"},
    {"q": "Technical German question 3?", "a": "Thorough German answer (60+ words)"}
  ]
}
`;
}

// Concurrency queue
async function runBatch(concurrency = 4) {
  console.log(`🚀 Starting Grok 4.7 batch generator for ${products.length} products (Concurrency: ${concurrency})...`);
  
  const pending = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const targetFile = path.join(GEN_DIR, `${p.id}.json`);
    if (!fs.existsSync(targetFile)) {
      pending.push({ index: i, product: p, targetFile });
    }
  }

  console.log(`📋 Total products: ${products.length} | Already cached: ${products.length - pending.length} | To generate: ${pending.length}`);

  let completed = 0;
  let activeWorkers = 0;
  let itemIdx = 0;

  async function worker() {
    while (itemIdx < pending.length) {
      const current = pending[itemIdx++];
      const { index, product: p, targetFile } = current;
      
      console.log(`[Worker] Generating (${index + 1}/${products.length}): ${p.brand} ${p.model} - ${p.partName}...`);
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          const res = await callGrok(buildPrompt(p));
          fs.writeFileSync(targetFile, JSON.stringify(res.json, null, 2), 'utf8');
          completed++;
          console.log(`   ✅ [${completed}/${pending.length}] Saved: ${p.id} (${res.usage.total_tokens} tokens)`);
          success = true;
        } catch (err) {
          console.error(`   ⚠️ Attempt ${attempts} failed for ${p.id}: ${err.message}`);
          await new Promise(r => setTimeout(r, 2000 * attempts));
        }
      }
      // Small rest between worker iterations
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  console.log(`🎉 All Grok 4.7 content generation completed! Generated ${completed} new files.`);
}

runBatch(4);
