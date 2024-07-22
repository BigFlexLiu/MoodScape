const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project: 'atomic-parity-429901-v3', location: 'us-central1' });
const model = 'gemini-1.5-flash-001';

const system_instruction = {
  text: `Prompt:
    \"Given a description provided by the user, generate a list of keywords that can be used to search for suitable images for creating a moodboard. The keywords should accurately reflect the key elements, themes, and emotions described. Ensure the keywords cover aspects such as color scheme, style, mood, objects, and any specific details mentioned. The list should be comprehensive enough to yield relevant and diverse image results. Give the keywords and nothing else.\"
    Example Description:
    \"A cozy living room with a rustic farmhouse style, featuring warm earthy tones, a large fireplace, wooden furniture, and soft lighting. The mood should be inviting and comfortable, ideal for relaxation and family gatherings.\"
    Generated Keywords:
    Cozy living room, Rustic farmhouse style, Warm earthy tones, Large fireplace, Wooden furniture, Soft lighting, Inviting and comfortable, Relaxation, Family gatherings`};

// Instantiate the models
const vertex_model = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 512,
    'temperature': 1,
    'topP': 0.95,
  },
  systemInstruction: {
    parts: [system_instruction]
  },
});

exports.keywords = async (req, res) => {
  const api_req = {
    contents: [
      { role: 'user', parts: [{ text: req.text }] }
    ],
  };

  const streamingResp = await vertex_model.generateContentStream(api_req);

  const aggregatedResponse = [];

  for await (const item of streamingResp.stream) {
    aggregatedResponse.push(item);
  }

  res.json({
    aggregated_response: await streamingResp.response,
    stream_chunks: aggregatedResponse
  });
};


exports.getData = (req, res) => {
  res.json({ message: 'GET request received' });
};

exports.postData = (req, res) => {
  const data = req.body;
  res.json({ message: 'POST request received', data });
};
