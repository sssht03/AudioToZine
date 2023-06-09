<template>
  <h2 class="mt-12 text-2xl font-semibold">音声ファイルから文字起こし</h2>

  <label class="flex items-center justify-center" for="file_input">
    <ProgressSpinner
      v-if="loadState === 'OnTranscribing' || loadState === 'OnFormatting'"
    />
    <CheckMark v-else-if="loadState === 'Completed'" />
    <p>{{ stateText }}</p>
  </label>

  <input
    class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
    id="file_input"
    type="file"
    accept=".mp3,.m4a,.aac,.wav,.flac"
    @change="audioFileInputHandler"
  />

  <textarea
    v-model="formattedText"
    id="transcribedText"
    rows="4"
    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    placeholder="ここに文字起こし結果が入ります"
  ></textarea>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import ProgressSpinner from './ProgressSpinner.vue';
import CheckMark from './CheckMark.vue';
import chatWithGpt from '../utils/chatWithGpt';
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

const stateText = ref('ファイルを選択してください。');
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

  // Whisper で文字起こしされた生のフルテキスト
  const transcribedRawText: string = await audioToText(formData);
  // const transcribedRawText: string =
  //   '昔ね 昔ね 80年代くらい なんでだ あれなんでだろ あれなんでだ あのね 教授とか遊びに来ても なんか暗いんですよ 目が暗いんですよ 小のせい遊びに来たんだ 行ったの? 目ずらしいなそれ なぜかって言うとね 来てるの? 僕はいつも来てた訳じゃないけど たまたまそういう時あったのかもしんないけど あのね ワーカホリックだったから 仕事しないとなんか 落ち着かなくなっちゃうのよね 不安になってたのその時 芸能人みんなそう見た 芸能人だったのかな 今全然平気だよ 一生仕事しなくてもいい 今日も明るいもんね まあそうでもないけど 正月は大丈夫 昔は細野さんはあそこで 入口ドアを 村井さんがね ある朝 昼頃かな 開けたら細野さんが床に倒れて寝てた 寝てた 寝てた びっくりして村井さんが倒れたんだと思ったらしくて 急遽ホテルを取ってね それで細野を救えっていう命令が 当時レコードが一瞬 全然覚えてない寝てたから 出たな だって最後までさ 発売日決まってんのにミックスしないから 一晩で10曲とかやってんだミックス あの頃ね一人でやってたんだけど 時々誰かが見に行くんだよ 例えばね 誰だっけ 山下達郎くんが見に来て 一言も話さないで じっと見て それ困るな 肩無事に見てるだけ 幽霊じゃない かえちゃん 幽霊だよ かえちゃん 幽霊だったんじゃない あと誰だ ビルワイマンが来たよ 息子連れて それでサイジャンペパーズって焼肉屋行ったんでしょ そうそう 幽霊の話 ひどいよねそれね 嫌がらせとしか思えないよね あの新春スペシャルということでね スペシャルね 新スペ 細野晴海さんと高橋佑介さんを迎えしてお送りしております でね2007年はね いろいろありましたよね この3人ではね ありました まずはCMですね キリンラバーの そうそう あれはでも撮ったのは2006年だっけ だったかもしれませんね そうですね 晩週ですね もう足掛け2年 死んじゃうよねこんなに速いとスピードが 死にそう 早すぎるちょっと ねえ MOがCMに出るって騒がれてたな つい3ヶ月くらい前のイメージなんですけど だよね まずそれがあって タイディンを作って 790なんだね 何て言ったかなこの人に会ったら 芸者の格好してとか ああ格好が僕たちの 元禄時代のあれね ああ 撮る人もいるんだ 持ってる人もいるみたいだね あれはね沖縄の昔のね 芸人の感じそっくり 特に細野さんがその感じ 細野さんの撫で方がね 出てましたよね シャミセ持つとバッチリな感じ 三振 撫で方なんだよな すごい撫で方だよね ジェレミー林局のね 配達員になれないんだよ 怒っちゃうね ジェレミー林の逆なんだよ どういう発想だそれ ジェレミー林の撫で方なんだよ じゃあイルポスティーノにはなれないんですね そうそうそう';

  // 自然な日本語になるように修正するプロンプト
  const formatTextPrompt: string =
    'この文章を文法的に正しく、そして自然に聞こえるように日本語で体言止めや接続詞を適宜使いながら修正してください。';

  // 修正プロンプトと文字起こしテキストをGPTに渡す
  const formatInputData: string = formatTextPrompt + '\n' + transcribedRawText;

  loadState = 'OnTranscribing';
  stateText.value = '文章を自然な文法に修正中です';

  formattedText.value = await chatWithGpt(formatInputData, 'gpt-3.5-turbo');
  // formattedText.value =
  //   '昔、80年代くらいの話だけど、教授が遊びに来ても、なんか暗いんですよ。目が暗いんですよ。小のせいで遊びに来たんだけど、行ったの？目ずらしいな。なぜかっていうと、来てるの？僕はいつも来てたわけじゃないけど、たまたまそういう時あったのかもしれないけど、ワーカホリックだったから、仕事しないとなんか落ち着かなくなっちゃうのよね。その時、芸能人たちもそう見えたんだ。芸能人だったのかな？今は全然平気だよ。一生仕事しなくてもいい。今日も明るいもんね。まあ、そうでもないけど、正月は大丈夫。昔は、細野さんがあそこで入口ドアを開けたら、村井さんがある朝、昼頃かな、細野さんが床に倒れて寝てた。寝てた。寝てた。びっくりして、村井さんが倒れたんだと思ったらしくて、急遽ホテルを取って、それで細野を救えっていう命令が出たんだよ。当時レコードが一瞬出た。全然覚えてない。寝てたから。だって最後までさ、発売日決まってんのにミックスしないから、一晩で10曲とかやってんだミックス。あの頃ね、一人でやってたんだけど、時々誰かが見に行くんだよ。例えば、誰だっけ、山下達郎くんが見に来て、一言も話さないで、じっと見て。それが困るな、肩無事に見てるだけ。幽霊じゃない、かえちゃん。幽霊だよ、かえちゃん。幽霊だったんじゃない。あと誰だ？ビルワイマンが来たよ、息子連れて。それでサイジャンペパーズって焼肉屋行ったんでしょ。そうそう、幽霊の話、ひどいよね。嫌がらせとしか思えないよね。あの新春スペシャルということで、スペシャルね。新スペ。細野晴海さんと高橋佑介さんを迎えてお送りしております。で、2007年は、いろいろありましたね。この3人では、ありました。まずはCMですね。キリンラバーの、そうそう、あれはでも撮ったのは2006年だったかもしれませんね。そうですね、晩週ですね。もう足掛け2年、死んじゃうよね。こんなに速いとスピードが、死にそう。早すぎるちょっと。ねえ、MOがCMに出るって騒がれてたな。つい3ヶ月くらい前のイメージなんですけど。だよね。まずそれがあって、タイディンを作って、790なんだね。何て言ったかな、この人に会ったら、芸者の格好してとか、ああ、格好が僕たちの元禄時代のあれね。ああ、撮る人もいるんだ、持ってる人もいるみたいだね。あれは、沖縄の昔の芸人の感じそっくり。特に細野さんがその感じ、細野さんの撫で方が出てましたよね。シャミセ持つとバッチリな感じ。三振、撫で方なんだよな、すごい撫で方だよね。ジェレミー林局の、配達員になれないんだよ、怒っちゃうね。ジェレミー林の逆なんだよ、どういう発想だそれ、ジェレミー林の撫で方なんだよ、じゃあイルポスティーノにはなれないんですね、そうそうそう。';
  emits('transcribed-text', formattedText.value);

  loadState = 'Completed';
  stateText.value = '文字起こしが完了しました。';
};
</script>

<style scoped></style>
