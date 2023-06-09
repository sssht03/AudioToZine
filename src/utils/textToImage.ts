const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export default async function textToImages(
  prompt: string,
  numImages: number = 4,
  imageSize: string = '512x512'
) {
  console.log('--- Text to Image ---');

  const requestBody = {
    prompt: prompt,
    n: numImages,
    size: imageSize,
  };

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (response.ok) {
    const data = await response.json();
    const generatedImages = data.data.map((image: any) => image.url);
    return generatedImages;
  } else {
    console.error('Error while generating images:', response.statusText);
    return null;
  }
}