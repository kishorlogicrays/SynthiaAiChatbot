import axios from 'axios';

const openAiApiKey = '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';

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const getChatGPTResponse = async (inputText: any) => {
  try {
    const response = await axios.post(
      chatgptUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: inputText}],
        max_tokens: 1,
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
