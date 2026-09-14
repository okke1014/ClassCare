// Mock vocabulary data for the student Vocab Books feature.
// Words are the ones a student saved while practicing in class.
import type { NativeLanguage } from "@/lib/analysisTranslations";

export interface VocabDefinition {
  pos: string;
  text: string;
  translation: Record<NativeLanguage, string>;
}

export interface VocabExample {
  text: string;
  translation: Record<NativeLanguage, string>;
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: { uk: string; us: string };
  /** Short gloss used as the answer choice in the reading (meaning) test. */
  meaning: string;
  definitions: VocabDefinition[];
  examples: VocabExample[];
  addedAt: string;
}

export const VOCAB_WORDS: VocabWord[] = [
  {
    id: "conceive",
    word: "conceive",
    phonetic: { uk: "kən'si:v", us: "kən'siv" },
    meaning: "to form an idea or a plan in your mind",
    definitions: [
      {
        pos: "v",
        text: "to form an idea, a plan, etc. in your mind; to imagine sth",
        translation: {
          ko: "생각이나 계획 등을 마음속에 형성하다; 상상하다",
          ja: "考えや計画などを心の中で形成する。想像する",
        },
      },
      {
        pos: "v",
        text: "when a woman conceives, she becomes pregnant",
        translation: {
          ko: "여성이 임신하게 되다",
          ja: "女性が妊娠する",
        },
      },
    ],
    examples: [
      {
        text: "He conceived the idea of transforming the old power station into an arts centre.",
        translation: { ko: "그는 낡은 발전소를 예술 센터로 바꾸겠다는 아이디어를 떠올렸다.", ja: "彼は古い発電所をアートセンターに変えるという考えを思いついた。" },
      },
      {
        text: "God is often conceived of as male.",
        translation: { ko: "신은 흔히 남성으로 여겨진다.", ja: "神はしばしば男性として捉えられる。" },
      },
    ],
    addedAt: "2026-09-14",
  },
  {
    id: "beneath",
    word: "beneath",
    phonetic: { uk: "bɪ'ni:θ", us: "bɪ'ni:θ" },
    meaning: "in or to a lower position than something; under",
    definitions: [
      {
        pos: "prep",
        text: "in or to a lower position than sb/sth; under sb/sth",
        translation: { ko: "누군가/무언가보다 낮은 위치에; ~아래에", ja: "誰か・何かより低い位置に;〜の下に" },
      },
      {
        pos: "prep",
        text: "not good enough for sb",
        translation: { ko: "누군가에게 어울리지 않을 만큼 부족한", ja: "誰かにふさわしくないほど劣った" },
      },
    ],
    examples: [
      {
        text: "They found the body buried beneath a pile of leaves.",
        translation: { ko: "그들은 낙엽 더미 아래 묻힌 시신을 발견했다.", ja: "彼らは落ち葉の山の下に埋められた遺体を発見した。" },
      },
      {
        text: "The boat sank beneath the waves.",
        translation: { ko: "배는 파도 아래로 가라앉았다.", ja: "船は波の下に沈んだ。" },
      },
    ],
    addedAt: "2026-09-13",
  },
  {
    id: "relentless",
    word: "relentless",
    phonetic: { uk: "rɪ'lentləs", us: "rɪ'lentləs" },
    meaning: "continuing without ever stopping or becoming weaker",
    definitions: [
      {
        pos: "adj",
        text: "not stopping or getting less strong",
        translation: { ko: "멈추지 않거나 약해지지 않는", ja: "止まったり弱まったりしない" },
      },
      {
        pos: "adj",
        text: "refusing to give up, especially in a harsh way",
        translation: { ko: "특히 가혹할 정도로 포기하지 않는", ja: "特に厳しいほど諦めない" },
      },
    ],
    examples: [
      {
        text: "Her relentless pursuit of excellence finally paid off.",
        translation: { ko: "그녀의 끈질긴 완벽 추구는 마침내 결실을 맺었다.", ja: "彼女の絶え間ない完璧の追求はついに実を結んだ。" },
      },
      {
        text: "The relentless heat made outdoor work impossible.",
        translation: { ko: "끊임없는 더위 때문에 야외 작업이 불가능했다.", ja: "容赦ない暑さのせいで屋外作業は不可能だった。" },
      },
    ],
    addedAt: "2026-09-12",
  },
  {
    id: "ritual",
    word: "ritual",
    phonetic: { uk: "'rɪtʃuəl", us: "'rɪtʃuəl" },
    meaning: "a series of actions always performed in the same way",
    definitions: [
      {
        pos: "n",
        text: "a series of actions always performed in the same way, especially in a ceremony",
        translation: { ko: "항상 같은 방식으로 행해지는 일련의 행동, 특히 의식에서", ja: "常に同じ方法で行われる一連の行動。特に儀式において" },
      },
      {
        pos: "n",
        text: "something done regularly and always in the same way",
        translation: { ko: "정기적으로 항상 같은 방식으로 하는 일", ja: "定期的にいつも同じ方法で行うこと" },
      },
    ],
    examples: [
      {
        text: "A cup of coffee in the morning is part of my daily ritual.",
        translation: { ko: "아침에 마시는 커피 한 잔은 나의 일상 의식의 일부다.", ja: "朝の一杯のコーヒーは私の日課の一部だ。" },
      },
      {
        text: "The ceremony followed an ancient ritual.",
        translation: { ko: "그 의식은 고대의 의례를 따랐다.", ja: "その式典は古代の儀式に従って行われた。" },
      },
    ],
    addedAt: "2026-09-11",
  },
  {
    id: "arcane",
    word: "arcane",
    phonetic: { uk: "ɑ:'keɪn", us: "ɑr'keɪn" },
    meaning: "secret and mysterious, understood by only a few people",
    definitions: [
      {
        pos: "adj",
        text: "secret and mysterious and therefore difficult to understand",
        translation: { ko: "비밀스럽고 신비로워서 이해하기 어려운", ja: "秘密めいて神秘的で理解しにくい" },
      },
      {
        pos: "adj",
        text: "known or understood by very few people",
        translation: { ko: "극소수의 사람들만 알거나 이해하는", ja: "ごく少数の人だけが知っている、または理解している" },
      },
    ],
    examples: [
      {
        text: "The arcane rules of the game confused every newcomer.",
        translation: { ko: "그 게임의 난해한 규칙은 모든 신참을 혼란스럽게 했다.", ja: "そのゲームの難解なルールは新参者を混乱させた。" },
      },
      {
        text: "He had an arcane knowledge of medieval maps.",
        translation: { ko: "그는 중세 지도에 대한 난해한 지식을 가지고 있었다.", ja: "彼は中世の地図についての難解な知識を持っていた。" },
      },
    ],
    addedAt: "2026-09-10",
  },
  {
    id: "exposure",
    word: "exposure",
    phonetic: { uk: "ɪk'spəʊʒə", us: "ɪk'spoʊʒər" },
    meaning: "public attention or the state of being seen by many people",
    definitions: [
      {
        pos: "n",
        text: "the attention that sb/sth gets from newspapers, television, etc.",
        translation: { ko: "신문, 텔레비전 등에서 받는 관심", ja: "新聞やテレビなどから受ける注目" },
      },
      {
        pos: "n",
        text: "the state of experiencing sth or being affected by it",
        translation: { ko: "어떤 것을 경험하거나 그것에 영향을 받는 상태", ja: "何かを経験したり、それに影響を受けたりする状態" },
      },
    ],
    examples: [
      {
        text: "The brand gained huge exposure through the influencer campaign.",
        translation: { ko: "그 브랜드는 인플루언서 캠페인을 통해 큰 노출을 얻었다.", ja: "そのブランドはインフルエンサーキャンペーンを通じて大きな露出を得た。" },
      },
      {
        text: "Repeated exposure to the language helps you learn much faster.",
        translation: { ko: "언어에 반복적으로 노출되면 훨씬 빨리 배우는 데 도움이 된다.", ja: "その言語に繰り返し触れることで、はるかに早く習得できる。" },
      },
    ],
    addedAt: "2026-09-09",
  },
  {
    id: "intermediary",
    word: "intermediary",
    phonetic: { uk: "ˌɪntə'mi:diəri", us: "ˌɪntər'mi:dieri" },
    meaning: "a person who helps two sides reach an agreement",
    definitions: [
      {
        pos: "n",
        text: "a person or an organization that helps two sides communicate or reach an agreement",
        translation: { ko: "양측이 소통하거나 합의에 이르도록 돕는 사람 또는 조직", ja: "双方のコミュニケーションや合意形成を助ける人物または組織" },
      },
    ],
    examples: [
      {
        text: "She acted as an intermediary between the two companies.",
        translation: { ko: "그녀는 두 회사 사이의 중개자 역할을 했다.", ja: "彼女は2つの会社の間の仲介者として行動した。" },
      },
      {
        text: "The deal was finally made through an intermediary.",
        translation: { ko: "그 거래는 결국 중개자를 통해 성사되었다.", ja: "その取引は最終的に仲介者を通じて成立した。" },
      },
    ],
    addedAt: "2026-09-08",
  },
  {
    id: "endorsement",
    word: "endorsement",
    phonetic: { uk: "ɪn'dɔ:smənt", us: "ɪn'dɔrsmənt" },
    meaning: "a public statement of support or approval",
    definitions: [
      {
        pos: "n",
        text: "a public statement that you support or approve of sb/sth",
        translation: { ko: "누군가/무언가를 지지하거나 승인한다는 공개적인 발언", ja: "誰か・何かを支持または承認するという公の発言" },
      },
      {
        pos: "n",
        text: "the act of a famous person recommending a product in advertising",
        translation: { ko: "유명인이 광고에서 제품을 추천하는 행위", ja: "有名人が広告で製品を推薦する行為" },
      },
    ],
    examples: [
      {
        text: "The product received a celebrity endorsement last month.",
        translation: { ko: "그 제품은 지난달 유명인의 광고 추천을 받았다.", ja: "その製品は先月、有名人の推薦広告を受けた。" },
      },
      {
        text: "The plan won the full endorsement of the board.",
        translation: { ko: "그 계획은 이사회의 전폭적인 지지를 받았다.", ja: "その計画は取締役会の全面的な支持を得た。" },
      },
    ],
    addedAt: "2026-09-07",
  },
];

const normalizeWord = (text: string) => text.trim().toLowerCase().replace(/[^a-z']/g, "");

/** Looks up a curated word by surface text (case-insensitive, punctuation-agnostic). */
export const findVocabWordByText = (text: string): VocabWord | undefined => {
  const key = normalizeWord(text);
  if (!key) return undefined;
  return VOCAB_WORDS.find((w) => w.word.toLowerCase() === key);
};
