const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

type chatModel = 'gpt-3.5-turbo' | 'gpt-4';

export default async function chatWithGpt(prompt: string, model: chatModel) {
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);
    const data = await response.json();

    if (response.ok) {
      const completion = data.choices[0].message.content;
      console.log(`Completion: ${completion}`);
      return completion;
    } else {
      console.error('Error:', data);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
