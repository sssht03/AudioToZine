const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export default async function audioToText(formData: FormData): Promise<string> {
  console.log('--- Audio to Text ---');
  try {
    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('transcribed data: ', data);
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return '';
  }
}
