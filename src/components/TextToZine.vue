<template>
  <h2 class="mt-12 text-2xl font-semibold">テキストから記事生成</h2>

  <p class="">目安の文字数を設定</p>

  <div class="flex justify-center gap-4">
    <div class="my-4 flex items-center gap-2">
      <label
        for="SummaryCharacters"
        class="block text-sm font-medium text-gray-900 dark:text-white"
        >要約文字数</label
      >
      <input
        v-model="summaryCharacters"
        type="number"
        id="SummaryCharacters"
        class="block h-8 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder=""
        required
      />
    </div>

    <div class="my-4 flex items-center gap-2">
      <label
        for="titleCharacters"
        class="block text-sm font-medium text-gray-900 dark:text-white"
        >タイトル文字数</label
      >
      <input
        v-model="titleCharacters"
        type="number"
        id="titleCharacters"
        class="block h-8 w-16 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder=""
        required
      />
    </div>
  </div>

  <div class="mb-4 text-left">
    <label
      for="imageStyle"
      class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
      >生成する画像のスタイル</label
    >
    <input
      v-model="imageStylePrompt"
      type="text"
      id="imageStyle"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      placeholder="John"
      required
    />
  </div>

  <button
    type="button"
    class="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    @click="clickSummaryButtonHandler"
  >
    <SmallProgressSpinner v-if="loadState === 'OnGenerating'" />
    <CheckMark v-else-if="loadState === 'Completed'" />
    <span>{{ stateText }}</span>
  </button>
  <ol
    class="relative border-l border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
  >
    <li class="mb-10 ml-6">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900"
      >
        <SmallProgressSpinner v-if="summaryState === 'OnSummaryzing'" />
        <CheckMark v-else-if="summaryState === 'SummaryCompleted'" />
        <span v-else>1</span>
      </span>

      <h3 class="text-xl font-bold">Text to Summary</h3>

      <label for="inputText">要約したいテキストを入力</label>
      <textarea
        v-model="props.transcribedText"
        id="inputText"
        rows="4"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="要約したい文章を入力してください"
      ></textarea>

      <label for="summarizedText">要約結果の出力</label>
      <textarea
        v-model="summarizedText"
        id="summarizedText"
        rows="4"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="ここに要約結果が入ります"
      ></textarea>
    </li>

    <li class="mb-10 ml-6">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900"
      >
        <SmallProgressSpinner v-if="titleState === 'OnTitleGenerating'" />
        <CheckMark v-else-if="titleState === 'TitleCompleted'" />
        <span v-else>2</span>
      </span>
      <h3 class="text-xl font-bold">Summary to Title</h3>

      <label for="titleText">生成されたタイトルの出力</label>
      <textarea
        v-model="titleText"
        id="titleText"
        rows="1"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="ここに生成されたタイトルが入ります"
      ></textarea>
    </li>

    <li class="mb-10 ml-6">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white dark:bg-gray-700 dark:ring-gray-900"
      >
        <SmallProgressSpinner v-if="imageState === 'OnImageGenerating'" />
        <CheckMark v-else-if="imageState === 'ImageCompleted'" />
        <span v-else>3</span>
      </span>
      <h3 class="text-xl font-bold">Title to Image</h3>
      <GeneratedImageList :image-urls="generatedImageUrls" />
    </li>
  </ol>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
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

// 要約
const summaryCharacters = ref(300);
const summarizedText = ref('');
type SummaryState = 'NotStarted' | 'OnSummaryzing' | 'SummaryCompleted';
let summaryState: SummaryState = 'NotStarted';

// タイトル
const titleCharacters = ref(15);
const titleText = ref('');
type TitleState = 'NotStarted' | 'OnTitleGenerating' | 'TitleCompleted';
let titleState: TitleState = 'NotStarted';

// 画像
const imageStylePrompt = ref('雑誌の表紙のイラスト');
const generatedImageUrls = ref(['']);
type ImageState = 'NotStarted' | 'OnImageGenerating' | 'ImageCompleted';
let imageState: ImageState = 'NotStarted';

const clickSummaryButtonHandler = async () => {
  loadState = 'OnGenerating';
  stateText.value = '生成中...';

  // 要約ステップ
  summaryState = 'OnSummaryzing';
  const summaryPrompt = `この文章を、重要な箇所を抽出しながら${summaryCharacters.value}文字以内で要約してください。`;
  const summaryInputData = summaryPrompt + '\n' + props.transcribedText;
  console.log('summaryInputData: ', summaryInputData);
  summarizedText.value = await chatWithGpt(summaryInputData, 'gpt-4');
  // await sleep(2000);
  // summarizedText.value =
  //   '300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！300文字くらいで要約された文章です！';
  summaryState = 'SummaryCompleted';

  // タイトル生成ステップ
  titleState = 'OnTitleGenerating';
  const titlePrompt = `この文章から${summaryCharacters.value}文字程度の記事タイトルを出力してください。`;
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
