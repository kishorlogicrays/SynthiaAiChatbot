import axios from 'axios';

const openAiApiKey = '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';

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dallEUrl = 'https://api.openai.com/v1/images/generations';

export const getChatGPTResponse = async (inputText: any) => {
  try {
    const response = await axios.post(
      chatgptUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: inputText}],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
      },
    );
    return response.data.choices[0]?.message.content.trim();
  } catch (error: any) {
    console.error(
      'Error fetching ChatGPT response:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const imageArtGeneration = async (inputText: any) => {
  try {
    const response = await axios.post(
      dallEUrl,
      {
        model: 'dall-e-2',
        prompt: inputText,
        n: 1,
        size: '256x256',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
      },
    );
    return response?.data;
  } catch (error: any) {
    console.error(
      'Error fetching ChatGPT response:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
