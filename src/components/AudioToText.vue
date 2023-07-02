<template>
  <h2 class="mb-4 mt-8 text-3xl font-bold">音声ファイルから文字起こし</h2>

  <label class="mb-2 flex items-center justify-center" for="file_input">
    <ProgressSpinner
      v-if="loadState === 'OnTranscribing' || loadState === 'OnFormatting'"
    />
    <CheckMark v-else-if="loadState === 'Completed'" class="mr-2 h-6 w-6" />
    <p class="text-left">{{ stateText }}</p>
  </label>

  <input
    class="mb-4 block w-full cursor-pointer rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-600"
    id="file_input"
    type="file"
    accept=".mp3,.m4a,.aac,.wav,.flac"
    @change="audioFileInputHandler"
  />

  <textarea
    v-model="formattedText"
    id="transcribedText"
    rows="20"
    class="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    placeholder="ここに文字起こし結果が入ります"
  ></textarea>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProgressSpinner from './ProgressSpinner.vue';
import CheckMark from './CheckMark.vue';
import chatWithGpt from '../utils/chatWithGpt';
import { splitString } from '../utils/splitString';
import audioToText from '../utils/audioToText';

const emits = defineEmits<{
  (e: 'transcribed-text', value: string): void;
}>();

type LoadState =
  | 'NotSelected'
  | 'OnTranscribing'
  | 'OnFormatting'
  | 'Completed';
let loadState: LoadState = 'NotSelected';

const stateText = ref('音声ファイルを選択してください');
const formattedText = ref('');

const audioFileInputHandler = async (event: any) => {
  const audioFile = event.target.files[0];

  if (!audioFile) {
    console.error('No audio file provided');
    return;
  }

  // check if the size is less than 25MB
  if (audioFile.size > 25 * 1024 * 1024) {
    alert('Please upload an audio file less than 25MB');
    return;
  }

  // 音声ファイルのセット
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('language', 'ja');
  formData.append('model', 'whisper-1');

  loadState = 'OnFormatting';
  stateText.value = '文字起こし中です';

  // ファイル生成時の簡易タイムスタンプ
  const now = new Date();
  const timestamp = `${
    now.getMonth() + 1
  }${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  const filename = 'transcribed_raw_text_' + timestamp;

  // Whisper で文字起こしされた生のフルテキスト
  const transcribedRawText: string = await audioToText(formData);

  downloadAsTextFile(transcribedRawText, `${filename}_full`);

  // 1000文字ごとに分割しファイルダウンロード
  const splitNum = Math.round(transcribedRawText.length / 1000);
  const splitText = splitString(transcribedRawText, splitNum);
  splitText.forEach((text, index) => {
    downloadAsTextFile(text, `${filename}_${index}`);
  });

  loadState = 'OnTranscribing';
  stateText.value = '文章を自然な文法に修正中です';

  // 分割ごとに要約
  let summaryList = [];
  for (const text of splitText) {
    console.log('summary: ', text);
    const summary = await summaryText(text);
    summaryList.push(summary);
  }

  formattedText.value = summaryList.join('');
  console.log('summary list ', formattedText.value);

  emits('transcribed-text', formattedText.value);

  loadState = 'Completed';
  stateText.value = '文字起こしが完了しました。';
};

function downloadAsTextFile(text: string, filename: string): void {
  // テキストをBlobとして作成
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });

  // ダウンロードするURLを作成
  const url = URL.createObjectURL(blob);

  // ダウンロードリンクを作成してクリック
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none'; // リンクをページ上に表示させない

  document.body.appendChild(link);
  link.click(); // リンクをクリックしてダウンロードを開始

  // リンクをページから削除
  document.body.removeChild(link);
}

async function summaryText(inputText: string): Promise<string> {
  // 自然な日本語になるように修正するプロンプト
  const formatTextPrompt: string =
    'この文章を文法的に正しく、そして自然に聞こえるように日本語で体言止めや接続詞を適宜使いながら修正してください。';

  // 修正プロンプトと文字起こしテキストをGPTに渡す
  const formatInputData: string = formatTextPrompt + '\n' + inputText;
  return await chatWithGpt(formatInputData, 'gpt-3.5-turbo');
}
</script>

<style scoped></style>
