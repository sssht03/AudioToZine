<template>
  <h2 class="mt-16 text-3xl font-bold">テキストから記事生成</h2>

  <div class="mt-4 flex justify-center gap-4">
    <div class="flex items-center gap-2">
      <label
        for="SummaryCharacters"
        class="text-md block font-medium text-gray-900 dark:text-white"
        >要約文字数</label
      >
      <input
        v-model="summaryCharacters"
        type="number"
        id="SummaryCharacters"
        class="block h-7 w-16 rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder=""
        required
      />
    </div>

    <div class="flex items-center gap-2">
      <label
        for="titleCharacters"
        class="text-md block font-medium text-gray-900 dark:text-white"
        >タイトル文字数</label
      >
      <input
        v-model="titleCharacters"
        type="number"
        id="titleCharacters"
        class="block h-7 w-14 rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder=""
        required
      />
    </div>
  </div>

  <div class="mt-2">
    <label
      for="imageStyle"
      class="text-md mb-1 block text-left font-medium text-gray-900 dark:text-white"
      >生成画像のスタイル</label
    >
    <input
      v-model="imageStylePrompt"
      type="text"
      id="imageStyle"
      class="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      placeholder="John"
      required
    />
  </div>

  <div class="mt-4">
    <label
      class="text-md mb-1 block text-left font-medium text-gray-900 dark:text-white"
      for="inputText"
      >要約したいテキストを入力</label
    >
    <textarea
      v-model="inputToSummary"
      id="inputText"
      rows="16"
      class="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      placeholder="要約したい文章を入力してください"
    ></textarea>
  </div>

  <!-- Generate Button -->
  <button
    type="button"
    class="my-12 items-center rounded-md bg-blue-700 px-8 py-4 text-center text-lg font-bold text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    style="width: 200px"
    @click="clickSummaryButtonHandler"
  >
    <span class="flex items-center justify-center">
      <SmallProgressSpinner
        v-if="loadState === 'OnGenerating'"
        class="mr-2 h-6 w-6"
      />
      <CheckMark v-else-if="loadState === 'Completed'" class="mr-2 h-7 w-7" />
      <span>{{ stateText }}</span>
    </span>
  </button>

  <!-- Outputs -->
  <ol
    class="relative border-l border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
  >
    <!-- Text to Summary -->
    <li class="mb-10 ml-6">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900"
      >
        <SmallProgressSpinner v-if="summaryState === 'OnSummaryzing'" />
        <CheckMark v-else-if="summaryState === 'SummaryCompleted'" />
        <span v-else>1</span>
      </span>

      <h3 class="mb-2 ml-2 text-start text-2xl font-bold dark:text-white">
        Text to Summary
      </h3>

      <label
        class="text-md mb-1 block text-left font-medium text-gray-900 dark:text-white"
        for="summarizedText"
        >要約結果の出力</label
      >
      <textarea
        v-model="summarizedText"
        id="summarizedText"
        rows="8"
        class="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="ここに要約結果が入ります"
      ></textarea>
    </li>

    <!-- Summary to Title -->
    <li class="mb-10 ml-6">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900"
      >
        <SmallProgressSpinner v-if="titleState === 'OnTitleGenerating'" />
        <CheckMark v-else-if="titleState === 'TitleCompleted'" />
        <span v-else>2</span>
      </span>

      <h3 class="ml-2 text-start text-2xl font-bold dark:text-white">
        Summary to Title
      </h3>

      <label
        class="text-md mb-1 block text-left font-medium text-gray-900 dark:text-white"
        for="titleText"
        >生成されたタイトルの出力</label
      >
      <textarea
        v-model="titleText"
        id="titleText"
        rows="1"
        class="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="ここに生成されたタイトルが入ります"
      ></textarea>
    </li>

    <!-- Title to Image -->
    <li class="mb-10 ml-6">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900"
      >
        <SmallProgressSpinner v-if="imageState === 'OnImageGenerating'" />
        <CheckMark v-else-if="imageState === 'ImageCompleted'" />
        <span v-else>3</span>
      </span>

      <h3 class="ml-2 text-start text-2xl font-bold dark:text-white">
        Title to Image
      </h3>

      <span
        class="text-md mb-1 block text-left font-medium text-gray-900 dark:text-white"
        >タイトルから生成された画像</span
      >
      <GeneratedImageList :image-urls="generatedImageUrls" />
    </li>
  </ol>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SmallProgressSpinner from './SmallProgressSpinner.vue';
import CheckMark from './CheckMark.vue';
import GeneratedImageList from './GeneratedImageList.vue.vue';
import chatWithGpt from '../utils/chatWithGpt';
import textToImage from '../utils/textToImage';
// import sleep from '../utils/sleep';

const props = defineProps<{
  transcribedText: string;
}>();

// 生成ボタンテキスト
type LoadState = 'NotStarted' | 'OnGenerating' | 'Completed';
let loadState: LoadState = 'NotStarted';
const stateText = ref('記事を生成する');

const inputToSummary = ref(props.transcribedText);

// 要約
const summaryCharacters = ref(300);
const summarizedText = ref('');
type SummaryState = 'NotStarted' | 'OnSummaryzing' | 'SummaryCompleted';
let summaryState: SummaryState = 'NotStarted';

// タイトル
const titleCharacters = ref(10);
const titleText = ref('');
type TitleState = 'NotStarted' | 'OnTitleGenerating' | 'TitleCompleted';
let titleState: TitleState = 'NotStarted';

// 画像
const imageStylePrompt = ref('新聞に記載されるイラスト');
const generatedImageUrls = ref(['']);
type ImageState = 'NotStarted' | 'OnImageGenerating' | 'ImageCompleted';
let imageState: ImageState = 'NotStarted';

const clickSummaryButtonHandler = async () => {
  loadState = 'OnGenerating';
  stateText.value = '生成中...';

  // 要約ステップ
  summaryState = 'OnSummaryzing';
  const summaryPrompt = `# 命題
  講演内容の要約をしようとしています。
  次の要約ステップに沿って文章を要約し、出力してください。
  
  # 要約ステップ
  1. 講演内容から重要な発言を5箇所抽出する
  2. ステップ1で抽出したそれぞれの箇所について、前後の文脈を汲み取りながら説明を付け加える
  3. ステップ2で説明を加えた5箇所を全て結合する
  4. ステップ3で結合した文章を新聞記事のような体裁に${summaryCharacters.value}字程度に要約する

  # 講演内容
  ${inputToSummary.value}

  # 出力
  ここに要約ステップ4の要約内容を出力してください。`;
  const summaryInputData = summaryPrompt + '\n' + inputToSummary.value;
  console.log('summaryInputData: ', summaryInputData);
  summarizedText.value = await chatWithGpt(summaryInputData, 'gpt-4');
  // await sleep(2000);
  // summarizedText.value =
  //   '300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！';
  summaryState = 'SummaryCompleted';

  // タイトル生成ステップ
  titleState = 'OnTitleGenerating';
  const titlePrompt = `この文章から${summaryCharacters.value}文字以下で簡潔に記事タイトルを出力してください。`;
  const titleInputData = titlePrompt + '\n' + summarizedText.value;
  console.log('titleInputData: ', titleInputData);
  titleText.value = await chatWithGpt(titleInputData, 'gpt-4');
  // await sleep(2000);
  // titleText.value = '夜遅くまでプログラムを書いている新卒社会人';
  titleState = 'TitleCompleted';

  // 画像生成ステップ
  imageState = 'OnImageGenerating';
  const imageInputData = imageStylePrompt + '\n' + titleText.value;
  console.log('imageInputData', imageInputData);
  generatedImageUrls.value = await textToImage(imageInputData);
  // await sleep(2000);
  // generatedImageUrls.value = [''];
  imageState = 'ImageCompleted';

  loadState = 'Completed';
  stateText.value = '生成完了';
};
</script>

<style scoped></style>
