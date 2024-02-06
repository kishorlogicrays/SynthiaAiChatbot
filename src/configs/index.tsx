import axios from 'axios';

const openAiApiKey = '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';

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dallEUrl = 'https://api.openai.com/v1/images/generations';

export const getChatGPTResponse = async (
  inputText: any,
  sizeOfResponse: number,
) => {
  try {
    const response = await axios.post(
      chatgptUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: inputText}],
        max_tokens: sizeOfResponse,
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
