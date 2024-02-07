import axios from 'axios';

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dallEUrl = 'https://api.openai.com/v1/images/generations';

export const getChatGPTResponse = async (
  openAiApiKey: string,
  type: string,
  inputText: any,
  firstLanguage?: string,
  secondLanguage?: string,
) => {
  try {
    const messageMap: any = {
      Code: 'Generate optimized code snippet for the following task: ',
      Booking: 'Book a travel itinerary based on the details: ',
      Content: 'Compose a compelling blog post on the topic: ',
      Health:
        firstLanguage && secondLanguage
          ? `Provide practical health/medicine detail in convert ${firstLanguage} to ${secondLanguage}: `
          : secondLanguage
          ? `Provide practical health/medicine detail in ${secondLanguage}: `
          : 'Provide practical health tips for a healthy lifestyle: ',
      Translate:
        firstLanguage && secondLanguage
          ? `Translate the sentence into ${firstLanguage} to ${secondLanguage}: `
          : secondLanguage
          ? `Translate the following sentence into ${secondLanguage} language: `
          : `Translate the following sentence into another language: `,
      Music: 'Create lyrics for a song inspired by: ',
      Movies: 'Recommend must-watch movies related to: ',
    };

    const maxTokensMap: any = {
      Code: 200,
      Booking: 350,
      Content: 625,
      Health: 200,
      Translate: 300,
      Music: 200,
      Movies: 150,
    };

    const response = await axios.post(
      chatgptUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: type ? `${messageMap[type]} : ${inputText}` : inputText,
          },
        ],
        // max_tokens: maxTokensMap[type] || 150,
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
