const { VertexAI } = require('@google-cloud/vertexai');
const axios = require('axios');

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'atomic-parity-429901-v3';
const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
const vertex_ai = new VertexAI({ project: projectId, location: location });
const model = 'gemini-1.5-flash-001';
const pexelsApiKey = 'cOG0WZ8PH8Fc39U9CJdJBKBwNQwXhNqvLYg7KctvC23NWbtsB80oBlVq';

const system_instruction = {
  text: `Prompt:
    "Given a description provided by the user, generate a list of keywords (starting with the overall theme that groups the keywords together) that can be used to search for suitable images for creating a moodboard. The keywords should accurately reflect the key elements, themes, and emotions described. Ensure the keywords cover aspects such as color scheme, style, mood, objects, and any specific details mentioned. The list should be comprehensive enough to yield relevant and diverse image results. The first element in the list of keywords should be the overall theme. Give the keywords and nothing else."
    Example Description:
    "A cozy living room with a rustic farmhouse style, featuring warm earthy tones, a large fireplace, wooden furniture, and soft lighting. The mood should be inviting and comfortable, ideal for relaxation and family gatherings."
    Generated Keywords:
    Cozy Interior, Cozy living room, Rustic farmhouse style, Warm earthy tones, Large fireplace, Wooden furniture, Soft lighting, Inviting and comfortable, Relaxation, Family gatherings`
};

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
      { role: 'user', parts: [{ text: req.body.text }] }
    ],
  };

  try {
    console.log('Starting keyword generation with Vertex AI...');
    console.log('Requesting Vertex AI with:', api_req);

    const streamingResp = await vertex_model.generateContentStream(api_req);
    console.log('Vertex AI response received.');

    let keywords = '';
    for await (const item of streamingResp.stream) {
      const contentPart = item.candidates[0].content.parts[0].text;
      keywords += contentPart;
    }

    keywords = keywords.trim().replace(/\s+/g, ' ').replace(/,\s*$/, '');
    console.log('Generated Keywords:', keywords);

    console.log('Fetching images from Pexels...');
    const images = await fetchImagesFromPexels(keywords);
    console.log('Images fetched from Pexels:', images);

    res.json({
      keywords,
      images
    });
  } catch (error) {
    console.error('Error generating keywords or fetching images:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

const fetchImagesFromPexels = async (keywords) => {
  const keywordArray = keywords.split(',').map(keyword => keyword.trim());

  // requesting an image for each keyword
  const imagePromises = keywordArray.map(keyword => 
    axios.get('https://api.pexels.com/v1/search', {
      params: { query: keyword, per_page: 1 }, 
      headers: { Authorization: pexelsApiKey }
    }).then(response => ({
      keyword,
      photos: response.data.photos
    }))
  );
  
  // displaying image details
  try {
    const results = await Promise.all(imagePromises);
    const images = results.flatMap(result => 
      result.photos.map(photo => ({
        keyword: result.keyword,
        src: photo.src.medium,
        description: photo.alt || ''
      }))
    );

    console.log('Pexels API Responses:', images);
    return images;
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    return [];
  }
};

exports.getData = (req, res) => {
  res.json({ message: 'GET request received' });
};

exports.postData = (req, res) => {
  const data = req.body;
  res.json({ message: 'POST request received', data });
};