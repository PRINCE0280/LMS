import React, { useState } from 'react';
import { Sparkles, Download, Loader2, Wand2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateImage } from '@/utils/clipdropApi';
import { useCheckSubscriptionStatusQuery } from '@/features/api/subscriptionApi';

const GenerateAI = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const { data: subscriptionStatus } = useCheckSubscriptionStatusQuery('generative-ai');

  const styles = [
    'Realistic',
    'Ghibli style',
    'Anime style',
    'Cartoon style',
    'LifeStyle',
    'Fantasy style',
    'Realistic style',
    '3D style',
    'Portrait style'
  ];

  const examplePrompts = [
    'A futuristic AI robot teaching in a modern classroom',
    'Abstract neural network visualization with vibrant colors',
    'Digital brain with glowing circuits and data streams',
    'Modern tech startup office with AI assistants',
    'Cyberpunk city with flying cars and neon lights',
    'Professional data scientist analyzing graphs on holographic displays'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const finalPrompt = selectedStyle ? `${prompt}, ${selectedStyle}` : prompt;
      const imageUrl = await generateImage(finalPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate image. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wand2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with AI-powered image generation
          </p>
          {subscriptionStatus?.hasActiveSubscription && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Active Subscription</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Enter Your Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the image you want to create..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none transition-all"
                  />
                </div>

                {/* Style Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Style (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {styles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedStyle === style
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Example Prompts */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Example Prompts
                </h3>
                <div className="space-y-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Image Section */}
          <div>
            <Card className="shadow-xl border-0 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generated Image
                  </h3>
                  {generatedImage && (
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden min-h-[500px]">
                  {isGenerating ? (
                    <div className="text-center py-20">
                      <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Creating your image...
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        This may take a few moments
                      </p>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center py-20 px-6">
                      <Wand2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                        No image generated yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Enter a prompt and click "Generate Image" to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 shadow-xl border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tips for Better Results
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <span>Be specific and descriptive in your prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <span>Include style keywords like "photorealistic", "artistic", "modern", etc.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <span>Mention colors, lighting, and mood for better control</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <span>Experiment with different prompts to get the best results</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateAI;
