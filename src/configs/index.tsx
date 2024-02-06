import axios from 'axios';

// const openAiApiKey = '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';

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dallEUrl = 'https://api.openai.com/v1/images/generations';

export const getChatGPTResponse = async (
  openAiApiKey: string,
  type: string,
  inputText: any,
) => {
  try {
    const response = await axios.post(
      chatgptUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content:
              type === undefined
                ? inputText
                : type === 'Code'
                ? `Give me code : ${inputText}`
                : type === 'Booking'
                ? `Traveling/Booking details : ${inputText}`
                : type === 'Content'
                ? `Write the blog post : ${inputText}`
                : type === 'Health'
                ? `Give health tips : ${inputText}`
                : type === 'Translate'
                ? `Translate the sentence : ${inputText}`
                : type === 'Music'
                ? `Write song on : ${inputText}`
                : type === 'Movies'
                ? `Suggest movies : ${inputText}`
                : inputText,
          },
        ],
        max_tokens:
          type === undefined
            ? 150
            : type === 'Code'
            ? 200
            : type === 'Booking'
            ? 350
            : type === 'Content'
            ? 625
            : type === 'Health'
            ? 200
            : type === 'Translate'
            ? 300
            : type === 'Music'
            ? 200
            : type === 'Movies'
            ? 150
            : 150,
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

export const imageArtGeneration = async (
  openAiApiKey: string,
  inputText: any,
) => {
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
