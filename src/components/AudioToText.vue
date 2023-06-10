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
// import audioToText from '../utils/audioToText';
import { splitString } from '../utils/splitString';
// import sleep from '../utils/sleep';

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

  // // ファイルの日付生成
  const now = new Date();
  const timestamp = `${
    now.getMonth() + 1
  }${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  const filename = 'transcribed_raw_text_' + timestamp;

  // Whisper で文字起こしされた生のフルテキスト
  // const transcribedRawText: string = await audioToText(formData);

  // DEMO用の12分文字起こし4,444文字
  const transcribedRawText: string =
    '2のところでまあ僕が少し話をしますけど 一番伝えたいことは多分令和5年度の活動方針の頭に 伝えたいことがあって僕はどちらかと速攻をやりたかったんですけどなるほど なるほどなんですけどあのえっとやっぱり僕は全部いろいろポイントポイントで ボヤっちゃうみたいなちゃうのでそこは今自分局長にやってもらおうというふうにして いますでやろうやってあのやりたいと思っている内容のへとエッセンスをですね ちょっと お伝えすると 画面が何か出しますかそうですかねじゃあえっと 画面共有しますまずえっと シャットにちょっと エキストバカバカって今 入れましたけど画面共有しますねはい えっとこれあのもうえっと リーのメンバーとか事務局にも今日こういうことを考えてえっと 来年度は今年度動くってことを宣言するのでちゃんとドキュメントとしてあの パワポートがにまとめでないしてくれって話を今しているところなんですけども あの まあ今回9期目に当たるのでここでステージ変えるよってことをやりたい シンポジウムですということですであの1期目ったのステージで2つぐらいに分けれるなぁと思っ ていて8位あのファーストステージっていうのが 2015年から15161718 ここはですね実は本当は大々的に立ち上げようというふうに考えていた分はあったんです けど あのまあ話となーくなっちゃうんですが8街側の人たちの盛り上がり いうか東急の日からの提案があって街の方が盛り上がって盛り上がりすぎて 企業が引いちゃってだけどとりあえず作らないと作ろうぜっていうところでギリギリ 入ってちっちゃくんじゃったっていう感じなんです なんでちっちゃくんで大きく育てよねっていう話になりました だけどまあちっちゃくんだっていうこともさることながら エリマネって何って当たり前ですけど新しいことやると地域って当然なんじゃそれ やって話とか知らんよそんなもっていうのがまずあるのでまず自分たちやろうよって いうことでいろいろ 変わっぺりでいろんなことをやったりとかやってる間に なんでそんな団体に一言かけない声かけなきゃいけないのとかいや教えてくださいよ それやってんならみたいなやり取りとか結構そういうことがあったりしましたというの がファストステージですね で次のステージが8法人化を あのもう4年ぐらいやってきていろいろなことも実験とか実証実験とかやってきたので法人に しようということで一般社団法人になりますね あの都市再生推進法人とエリマネの団体はあの取ってるところが多いんですけど あの 次にある都市整備計画 都市再生整備計画ですねそういう 計画をその地域で唯一自治体に提案できるっていう まあそういう団体ですよっていうのを自治体が指定してくれるっていう制度があるんです けど世田谷区ではあの8二子玉川だけですで えっと下北が今頑張ってこれを取ろうというかこういう 資格法人として世田谷からしてもらおうって多分動いている さんじゃあまだまだ全然8そういう団体を作るところまで石あの意思的にもまとまって ないという状態で言うと結構早く作っ作っちゃって後がついて これないっていう状態ぐらいあの結構 これはこれで第1号で唯一オンリーというなっています まあそれを受けてえっと一級化せん で関東地区でですねあの河川 を 8まあオープン化するっていうのはえっと使っみんなが使える状態にしつつ えっとそこをちゃんと運用する専用主体を 普通は世田谷区とかですね行政にそういう専用主体を任せるんですけど それをえっとダイレクトにえっと国交省から エリマネ団体であるたことまわりやマネージメントに音を下してくれたっていうか専用主体を 行政改札に団体に落としているというでは 軽有なマレあの多分今でない ようなおろし方をしてくれているというのがこの河川オープン化と専用主体って ですね その次に奴があの えっと景品河川事務所がと川との関係以外にあそこにはの246のバイパスが上を通って いる関係があって8横浜国道ところ国交省の 株組織になりますけれども横浜国道というところもここには関係しているので 世田谷区と 景品河川事務所川ですねそれと横浜国道 これ道ですねとリアーマネージメントのこの4つの 組織がみんなで水べと道路のボランティアサポートクラブプログラムっていう協定を結んで まあよっ 4つを団体同じテーブルでいろんなことを取り組むことをサポートしたり支援したりしましょうという ような なかなか立ててなかなか行政が縦に割れてて大変な なかなか新制度がめんどくさいんですけどそういうのをできるだけ切り一元化しよう というところまで 昨年度は行きましたということです まあそういう意味でいろんな意味で川特に川を中心にえっと たこ玉川では襟マネがあるよねというところで ある程度認知されるところができたのかなというところかなと思っています まあこれずつ次のやつは若干あの人によってはあの 少しざわつくとこでもあるんですけども一方ではやっぱりこう 川を中心に何かあの何かやるときにはあの 行政に対してもどういう今今と工事とか色やってるんですよね 工事やってるといつからあそこ使えるようになるんでしょうかとかですね あと去年だと花火大会を久しぶりに花火大会もどきを玉川であったんですけど あれをやる前後にえっと結局 水辺ファンベースと言われている あそこのスペースを使えるのか使えないのかとかですね ギリギリまで使わせてくれとかですねまあそういった意味ではいろんなその川を頑張って 使っていこうぜってやってたまあ ええ エリマネ団体なのでどうしても顔をメインに自分たちとその仲間たちが活動している みたいなちょっと言い方いいんですが圧力団体って言ってはいいませんけどそういうふうに 見られる価値になってきてたんじゃないかなとこれあの えっと一生懸命頑張ってるってことが裏返すとそういうとこにもなってた可能性あるよね ということが今まで の 振り返りというとこですまあそういう振り返りの中で次のステップとして我々は考え なきゃいけないことというのは もう ということであの3つフォーライやと方針を僕の方から打ち出していて 川のエリマネから街のリマネになっていきましょうねということ が一つ目の考え方ですね玉川とここはもうすぐ大事な双子玉川にとっての地最大の地域 実産なんですけど今 地区定工事をやっているのもあってここをですね今年また交渉足をこうしようみたいな ことをあの やるタイミングではないのでちょっとここは少し そこにいいかないですよ人物兼ね的には力を入れないで 街を 全体をちょっと見て取り組みましょうということを 伝えしようとしています具体的に言うと商店街とこの触れ合い広く あそこも世田谷区があの 高架下のところ公園として専用しているんですけど 上は横浜あの今度は東京国道さん がえっとの橋脚が あの立っているところの下に世田谷区が公園として利用してるんですがここを なんかもう少しオープン化して使えるようにしていくみたいなことをトライアルにちょっと 力を入れようかっていう話具体的にとそういうことを事務局と話しています それから活動方針の方としては今では自分たちが エリマネっていう団体頑張ってますということで自分たちが動くっていうことをやってきたんです けどもそれがなんかエリマネとその仲間たちみたいな者違うなんかやってるみたいな 組織になっちゃってる部分があるんじゃないかっていうことを言っ まつ指摘していてこれから えっとまたは二お玉学会ではないですけどみんなで考えながらかつへといろんな団体とかこれから 取り組もうとしているプロジェクトとかこういったものを支えていくような組織になって いきましょうねということです なのでえっと まあ自らが計画行動するってことに執着するんじゃなくてできる限り いろんな意見を集約支援して 具体的にですねあの活動資金みたいなものを 内部のえっとオペレーションコストに投下するんではなくて いろんな方たちに逆に支援する まあ還元するっていうようなそういうお金の使い方にしていきましょうねということ に考えています 次はまあえっと組織運営ということですけど誰かがやっているエリマネっていうの から みんなが関わるエリマネにしていきましょうねということで まああのここには皆さんもそうですけどやっぱり得意分野とか専用専門分野を持つ団体 などが えっとエリマネをうまく利活用していくってイメージしていこう いうことでエリマネの誰々がいるからところへはやれるとかっていう話じゃなくて 機能としてエリマネってあるけどそれをうまく他の人たちが利用できる 利用するという形でなんか嫌な言い方になってそれ活用するというかそういうような 機能的なものにできるだけ変えていけるようにしていこうねって話をしています 誰かがいるからっていうことじゃなくてその組織そのものを誰いろんな人が動かす とか使うっていうようなものになるように人につながら人がいるからやれるようなことにはし ないようにしていこうということでここは具体的にはやっぱり 早めに広報したり情報会議したりとかちゃんと内部の決算とかも 出していきましょうねとかあと18中ルールみたいなものとか あの 特にあの街側の人たちっていうのはどうしても人事で言うと変わり変わらなかったりするんです よね 世田谷区とか企業の人は当然何年かしていくと担当が変わったり 移動があったりするんですけど街の人たちは移動するっていうことはないので 方があまり正規化していくのは避けようということも この組織の話としては言っています であとは あのできる限りいろんなようではあまり補助金を使ってうぬんかんぬんみたいなことに対しては あまり まずは自分たちを動こうぜみたいなあの 世界観が強かったのでもうちょっとちゃんとそういうところも逆に受けれるような 企業あの 財務体質とか不正の含めてしっかりできるような仕組みにしていきましょうねということも 合わせていろんなプロジェクトにも手を出してあ 全国のいろんなところから二子玉はここにもこういう取り組みしてるのかっていうのが み言われるようなそういう団体にしていきましょうねそれをするためにも内部に の人たちだけ絶対できないよねっていうことを 伝えようとしていますちょっとなぁがありましけど大きくはこんな方針をえっと頭の 文では僕多分 公園のアウトラインだけを伝えしつつ 挨拶をしするんですけど あの あとはあの 更新のところで事務局長がこれのところを多分話してくれるんじゃないかなというふうに 思いますはい すいませんなおございまし';

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
