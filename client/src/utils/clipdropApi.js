// Clipdrop API utility for image generation

const CLIPDROP_API_KEY = import.meta.env.VITE_CLIPDROP_API_KEY;

/**
 * Generate an image using Clipdrop's text-to-image API
 * @param {string} prompt - The text prompt to generate image from
 * @returns {Promise<string>} - Returns the generated image as a blob URL
 */
export const generateImage = async (prompt) => {
  try {
    const form = new FormData();
    form.append('prompt', prompt);

    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': CLIPDROP_API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], { type: 'image/png' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

/**
 * Generate images for career categories
 * @param {string} category - Category name
 * @returns {Promise<string>} - Returns the generated image URL
 */
export const generateCategoryImage = async (category) => {
  const prompts = {
    'Generative AI': 'modern abstract AI neural network, futuristic technology, digital art, vibrant colors, high quality',
    'IT Certifications': 'professional IT certification badge, modern tech symbols, clean design, corporate style',
    'Data Science': 'data visualization charts and graphs, analytics dashboard, modern design, purple and blue tones',
    'Gemini AI': 'Google Gemini AI interface, modern AI technology, sleek design, gradient colors',
  };

  const prompt = prompts[category] || `${category} professional illustration`;
  return await generateImage(prompt);
};
