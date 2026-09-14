export type NativeLanguage = "ko" | "ja";

// Typographic apostrophes and spacing differ between datasets, so keys are matched loosely.
const normalize = (text: string) =>
  text.replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ").trim();

const TRANSLATIONS: Record<string, Record<NativeLanguage, string>> = {
  "Grammar: 'about you're finding' → 'about finding someone'. Remove unnecessary pronoun.": {
    ko: "문법: 'about you're finding' → 'about finding someone'. 불필요한 대명사를 빼야 합니다.",
    ja: "文法: 'about you're finding' → 'about finding someone'。不要な代名詞を削除しましょう。",
  },
  "Grammar: 'depends on product' → 'depends on the product'. Missing definite article.": {
    ko: "문법: 'depends on product' → 'depends on the product'. 정관사 the가 빠졌습니다.",
    ja: "文法: 'depends on product' → 'depends on the product'。定冠詞 the が抜けています。",
  },
  "Grammar: 'high price product' → 'high-priced products'. Use compound adjective form with '-ed'.": {
    ko: "문법: 'high price product' → 'high-priced products'. '-ed'를 붙인 복합 형용사 형태를 쓰세요.",
    ja: "文法: 'high price product' → 'high-priced products'。'-ed' を付けた複合形容詞を使いましょう。",
  },
  "Grammar: 'followers influencer' → 'an influencer with many followers'. Incorrect word order.": {
    ko: "문법: 'followers influencer' → 'an influencer with many followers'. 어순이 잘못되었습니다.",
    ja: "文法: 'followers influencer' → 'an influencer with many followers'。語順が正しくありません。",
  },
  "Pronunciation: 'rent alignment' → should be 'brand alignment'. Misread the vocabulary word.": {
    ko: "발음: 'rent alignment' → 'brand alignment'가 맞습니다. 단어를 잘못 읽었습니다.",
    ja: "発音: 'rent alignment' → 正しくは 'brand alignment' です。単語を読み間違えています。",
  },
  "Grammar: 'sometimes company pay' → 'sometimes companies pay'. Missing plural form.": {
    ko: "문법: 'sometimes company pay' → 'sometimes companies pay'. 복수형이 빠졌습니다.",
    ja: "文法: 'sometimes company pay' → 'sometimes companies pay'。複数形が抜けています。",
  },
  "Grammar: 'more like product itself' → 'more about the product itself'. Missing article.": {
    ko: "문법: 'more like product itself' → 'more about the product itself'. 관사가 빠졌습니다.",
    ja: "文法: 'more like product itself' → 'more about the product itself'。冠詞が抜けています。",
  },
  "Vocabulary: 'how many people they actually find' → 'how many people actually buy/purchase'. Wrong verb.": {
    ko: "어휘: 'how many people they actually find' → 'how many people actually buy/purchase'. 동사 선택이 잘못되었습니다.",
    ja: "語彙: 'how many people they actually find' → 'how many people actually buy/purchase'。動詞の選択が誤っています。",
  },
  "Pronunciation: Hesitated on 'personalities'. Practice: /ˌpɜː.səˈnæl.ə.tiz/.": {
    ko: "발음: 'personalities'에서 머뭇거렸습니다. /ˌpɜː.səˈnæl.ə.tiz/로 연습하세요.",
    ja: "発音: 'personalities' で言いよどみました。/ˌpɜː.səˈnæl.ə.tiz/ で練習しましょう。",
  },
  "Grammar: 'which make their recommendations' → 'which makes'. Subject-verb agreement.": {
    ko: "문법: 'which make their recommendations' → 'which makes'. 주어와 동사의 수 일치가 필요합니다.",
    ja: "文法: 'which make their recommendations' → 'which makes'。主語と動詞の一致が必要です。",
  },
  "Grammar: 'the biggest influencer always have' → 'the biggest influencers always have'. Use plural.": {
    ko: "문법: 'the biggest influencer always have' → 'the biggest influencers always have'. 복수형을 사용하세요.",
    ja: "文法: 'the biggest influencer always have' → 'the biggest influencers always have'。複数形を使いましょう。",
  },
  "Vocabulary: 'from company to view' → 'from a company's point of view'. Incorrect phrasing.": {
    ko: "어휘: 'from company to view' → 'from a company's point of view'. 표현이 어색합니다.",
    ja: "語彙: 'from company to view' → 'from a company's point of view'。表現が不自然です。",
  },
  "Grammar: 'there's no influencer can do any kind of topic' → 'no single influencer can cover every topic'.": {
    ko: "문법: 'there's no influencer can do any kind of topic' → 'no single influencer can cover every topic'으로 고치세요.",
    ja: "文法: 'there's no influencer can do any kind of topic' → 'no single influencer can cover every topic' に直しましょう。",
  },
  "Vocabulary: 'depends on what vision' → 'depends on the perspective/angle'. Awkward word choice.": {
    ko: "어휘: 'depends on what vision' → 'depends on the perspective/angle'. 단어 선택이 어색합니다.",
    ja: "語彙: 'depends on what vision' → 'depends on the perspective/angle'。語の選択が不自然です。",
  },
  "Grammar: 'their followers is between' → 'their follower count is between'. Subject-verb agreement.": {
    ko: "문법: 'their followers is between' → 'their follower count is between'. 주어와 동사의 수 일치가 필요합니다.",
    ja: "文法: 'their followers is between' → 'their follower count is between'。主語と動詞の一致が必要です。",
  },
  "Vocabulary: 'the explore of your product' → 'the exposure of your product'. Used verb instead of correct noun.": {
    ko: "어휘: 'the explore of your product' → 'the exposure of your product'. 명사 자리에 동사를 썼습니다.",
    ja: "語彙: 'the explore of your product' → 'the exposure of your product'。名詞の代わりに動詞を使っています。",
  },
  "Vocabulary: 'the friend style' → 'the brand ambassador's style/image'. Unclear reference.": {
    ko: "어휘: 'the friend style' → 'the brand ambassador's style/image'. 가리키는 대상이 불분명합니다.",
    ja: "語彙: 'the friend style' → 'the brand ambassador's style/image'。指す対象が不明確です。",
  },
  "Pronunciation: 'Perfectority' is not a word. Possibly meant 'authority' or 'priority'. Unclear pronunciation.": {
    ko: "발음: 'Perfectority'는 없는 단어입니다. 'authority' 또는 'priority'를 말하려던 것으로 보입니다. 발음이 불명확합니다.",
    ja: "発音: 'Perfectority' は存在しない単語です。'authority' か 'priority' の言い間違いと思われます。発音が不明瞭です。",
  },
  "Grammar: 'it have one more added in factor' → 'it has one additional factor'. Subject-verb agreement.": {
    ko: "문법: 'it have one more added in factor' → 'it has one additional factor'. 주어와 동사의 수 일치가 필요합니다.",
    ja: "文法: 'it have one more added in factor' → 'it has one additional factor'。主語と動詞の一致が必要です。",
  },
  "Grammar: 'added in factor' → 'additional factor'. Remove unnecessary preposition.": {
    ko: "문법: 'added in factor' → 'additional factor'. 불필요한 전치사를 빼세요.",
    ja: "文法: 'added in factor' → 'additional factor'。不要な前置詞を削除しましょう。",
  },
  "Vocabulary: 'the search people' → 'a third-party person / intermediary'. Incorrect word choice.": {
    ko: "어휘: 'the search people' → 'a third-party person / intermediary'. 단어 선택이 잘못되었습니다.",
    ja: "語彙: 'the search people' → 'a third-party person / intermediary'。語の選択が誤っています。",
  },
  "Grammar: 'if he do something' → 'if he does something'. Subject-verb agreement.": {
    ko: "문법: 'if he do something' → 'if he does something'. 주어와 동사의 수 일치가 필요합니다.",
    ja: "文法: 'if he do something' → 'if he does something'。主語と動詞の一致が必要です。",
  },
  "Grammar: Repeated — 'if he do something bad' → 'if he does something bad'.": {
    ko: "문법: 반복된 오류 — 'if he do something bad' → 'if he does something bad'.",
    ja: "文法: 繰り返しの誤り — 'if he do something bad' → 'if he does something bad'。",
  },
  "Grammar: 'The AI is logic' → 'AI is logical'. Use adjective form, not noun.": {
    ko: "문법: 'The AI is logic' → 'AI is logical'. 명사가 아니라 형용사 형태를 쓰세요.",
    ja: "文法: 'The AI is logic' → 'AI is logical'。名詞ではなく形容詞を使いましょう。",
  },
  "Grammar: 'won't get paid for company' → 'won't get paid by a company'. Wrong preposition.": {
    ko: "문법: 'won't get paid for company' → 'won't get paid by a company'. 전치사가 잘못되었습니다.",
    ja: "文法: 'won't get paid for company' → 'won't get paid by a company'。前置詞が誤っています。",
  },
  "Vocabulary: 'most middle person' → 'more of a middleman / intermediary'. Incorrect superlative.": {
    ko: "어휘: 'most middle person' → 'more of a middleman / intermediary'. 최상급을 잘못 사용했습니다.",
    ja: "語彙: 'most middle person' → 'more of a middleman / intermediary'。最上級の使い方が誤っています。",
  },
  "Fluency: 'people, they will have, people will also search' — self-correction. Try: 'people will search using AI'.": {
    ko: "유창성: 'people, they will have, people will also search' — 말을 고쳐 말했습니다. 'people will search using AI'처럼 한 번에 말해보세요.",
    ja: "流暢さ: 'people, they will have, people will also search' — 言い直しがありました。'people will search using AI' のように一度で話してみましょう。",
  },
  "Grammar: 'the AI have your personal data' → 'AI has your personal data'. Subject-verb agreement.": {
    ko: "문법: 'the AI have your personal data' → 'AI has your personal data'. 주어와 동사의 수 일치가 필요합니다.",
    ja: "文法: 'the AI have your personal data' → 'AI has your personal data'。主語と動詞の一致が必要です。",
  },
  "Grammar: 'he know about you' → 'it knows about you'. Subject-verb agreement + pronoun.": {
    ko: "문법: 'he know about you' → 'it knows about you'. 수 일치와 대명사를 함께 고쳐야 합니다.",
    ja: "文法: 'he know about you' → 'it knows about you'。一致と代名詞の両方を直しましょう。",
  },
  "Vocabulary: 'more personal wise' → 'more personalized'. Use correct adjective form.": {
    ko: "어휘: 'more personal wise' → 'more personalized'. 올바른 형용사 형태를 쓰세요.",
    ja: "語彙: 'more personal wise' → 'more personalized'。正しい形容詞の形を使いましょう。",
  },

  // Learning report summaries
  "Struggles with multi-syllable words ('personalities'). Mispronounced 'brand' as 'rent'. Unintelligible attempt ('Perfectority') suggests limited phonetic awareness for unfamiliar words.": {
    ko: "다음절 단어('personalities')를 어려워합니다. 'brand'를 'rent'로 잘못 발음했습니다. 알아듣기 어려운 'Perfectority' 발화로 보아 익숙하지 않은 단어의 소리에 대한 이해가 부족합니다.",
    ja: "多音節の単語（'personalities'）に苦戦しています。'brand' を 'rent' と発音し間違えました。聞き取れない 'Perfectority' という発話から、なじみのない単語の音への理解が不足していることがうかがえます。",
  },
  "Frequent self-corrections and repetitions ('people, they will have, people will also search'). Uses fillers like 'I think', 'like', 'for me' heavily. Ideas are generally expressed but lack smooth delivery.": {
    ko: "말을 고쳐 말하거나 반복하는 경우가 잦습니다('people, they will have, people will also search'). 'I think', 'like', 'for me' 같은 군더더기 표현을 많이 씁니다. 내용 전달은 되지만 매끄럽지 않습니다.",
    ja: "言い直しや繰り返しが頻繁です（'people, they will have, people will also search'）。'I think'、'like'、'for me' などのつなぎ表現を多用しています。内容は伝わりますが、話の流れが滑らかではありません。",
  },
  "Uses 'explore' instead of 'exposure', 'search people' instead of 'intermediary', 'personal wise' instead of 'personalized'. Limited business vocabulary despite the topic.": {
    ko: "'exposure' 대신 'explore', 'intermediary' 대신 'search people', 'personalized' 대신 'personal wise'를 사용했습니다. 주제에 비해 비즈니스 어휘가 부족합니다.",
    ja: "'exposure' の代わりに 'explore'、'intermediary' の代わりに 'search people'、'personalized' の代わりに 'personal wise' を使っています。テーマの割にビジネス語彙が不足しています。",
  },
  "Consistent subject-verb agreement errors ('it have', 'he do', 'he know', 'AI have'). Missing articles ('depends on product'). Incorrect prepositions ('paid for company' → 'paid by').": {
    ko: "주어와 동사의 수 일치 오류가 반복됩니다('it have', 'he do', 'he know', 'AI have'). 관사 누락('depends on product')과 전치사 오류('paid for company' → 'paid by')도 있습니다.",
    ja: "主語と動詞の一致の誤りが繰り返されています（'it have'、'he do'、'he know'、'AI have'）。冠詞の欠落（'depends on product'）や前置詞の誤り（'paid for company' → 'paid by'）も見られます。",
  },
  "Generally appropriate rising intonation for questions. However, tends to be flat during longer explanations, reducing engagement and clarity.": {
    ko: "질문할 때의 올림 억양은 대체로 적절합니다. 다만 긴 설명에서는 억양이 평탄해져 전달력과 집중도가 떨어집니다.",
    ja: "質問の際の上昇イントネーションはおおむね適切です。ただし長い説明では平板になりがちで、伝わりやすさと聞き手の集中を保つ力が弱まります。",
  },
  "Over-relies on 'I think', 'because', 'so'. Needs more varied connectors like 'however', 'in addition', 'on the other hand' for a business discussion context.": {
    ko: "'I think', 'because', 'so'에 지나치게 의존합니다. 비즈니스 토론에서는 'however', 'in addition', 'on the other hand' 같은 다양한 연결 표현이 필요합니다.",
    ja: "'I think'、'because'、'so' に頼りすぎています。ビジネスの議論では 'however'、'in addition'、'on the other hand' など多様なつなぎ表現が必要です。",
  },

  // Skill-up recommendation reasons
  "Misread 'brand' as 'rent'. Focus on the /br/ consonant cluster at word onset.": {
    ko: "'brand'를 'rent'로 잘못 읽었습니다. 단어 첫머리의 /br/ 자음 결합을 집중적으로 연습하세요.",
    ja: "'brand' を 'rent' と読み間違えました。語頭の /br/ の子音連結を重点的に練習しましょう。",
  },
  "Used verb 'explore' instead of noun 'exposure'. Learn the noun form for marketing contexts.": {
    ko: "명사 'exposure' 대신 동사 'explore'를 썼습니다. 마케팅 맥락에서 쓰는 명사형을 익히세요.",
    ja: "名詞 'exposure' の代わりに動詞 'explore' を使いました。マーケティング文脈で使う名詞形を覚えましょう。",
  },
  "Subject-verb agreement: third-person singular requires 'has' and 'knows'. Use 'it' for non-human subjects.": {
    ko: "주어와 동사의 수 일치: 3인칭 단수에는 'has'와 'knows'를 씁니다. 사람이 아닌 주어에는 'it'을 사용하세요.",
    ja: "主語と動詞の一致: 三人称単数では 'has' と 'knows' を使います。人以外の主語には 'it' を使いましょう。",
  },
  "Use 'middleman' or 'intermediary' instead of 'middle person'. Also 'most' → 'more of a'.": {
    ko: "'middle person' 대신 'middleman'이나 'intermediary'를 쓰세요. 'most'도 'more of a'로 고쳐야 합니다.",
    ja: "'middle person' ではなく 'middleman' か 'intermediary' を使いましょう。'most' も 'more of a' に直します。",
  },
  "Third-person singular requires 'does'. Use 'affect' (verb) instead of 'influence' for more precise expression.": {
    ko: "3인칭 단수에는 'does'를 씁니다. 더 정확한 표현을 위해 'influence' 대신 동사 'affect'를 사용하세요.",
    ja: "三人称単数では 'does' を使います。より正確に表現するには 'influence' ではなく動詞 'affect' を使いましょう。",
  },
  "Avoid self-corrections mid-sentence. Plan the full thought before speaking.": {
    ko: "문장 중간에 말을 고쳐 말하지 않도록 하세요. 말하기 전에 하고 싶은 말을 끝까지 정리하세요.",
    ja: "文の途中での言い直しは避けましょう。話す前に内容を最後までまとめてから話しましょう。",
  },
  "Use 'perspective' or 'angle' instead of 'vision'. Add articles before countable nouns.": {
    ko: "'vision' 대신 'perspective'나 'angle'을 쓰세요. 가산명사 앞에는 관사를 붙여야 합니다.",
    ja: "'vision' ではなく 'perspective' か 'angle' を使いましょう。可算名詞の前には冠詞を付けます。",
  },
  // --- Growth Report: Daily ---
  "You built several complete future-tense sentences on your own today — great progress!": {
    ko: "오늘 스스로 미래 시제 문장을 여러 개 완성했어요 — 정말 좋은 진전입니다!",
    ja: "今日は自分で未来形の文をいくつも完成させました — 素晴らしい進歩です！",
  },
  "Your grasp of the future tense basics is solid. Irregular verbs are still tripping you up sometimes, but that's a normal part of learning — a little daily practice will make it click.": {
    ko: "미래 시제의 기본 개념은 잘 잡혀 있습니다. 불규칙 동사에서는 아직 종종 헷갈리지만, 이는 학습 과정에서 자연스러운 부분이에요 — 매일 조금씩 연습하면 곧 익숙해질 거예요.",
    ja: "未来形の基本はしっかり理解できています。不規則動詞ではまだ時々つまずきますが、それは学習の自然な一部です — 毎日少し練習すればすぐに慣れますよ。",
  },
  "Tonight, try writing 3 sentences about your weekend plans using 'will' + an irregular verb.": {
    ko: "오늘 밤, 'will' + 불규칙 동사를 사용해서 주말 계획에 대한 문장 3개를 써보세요.",
    ja: "今夜、'will' + 不規則動詞を使って週末の予定について3つの文を書いてみましょう。",
  },
  // --- Growth Report: Weekly ---
  "You're building real momentum — your sentences are flowing more naturally and you're speaking with more confidence than last week. Grammar accuracy is catching up nicely too.": {
    ko: "정말 좋은 흐름을 만들어가고 있어요 — 문장이 더 자연스럽게 이어지고, 지난주보다 더 자신감 있게 말하고 있습니다. 문법 정확도도 잘 따라오고 있어요.",
    ja: "本当に良い勢いがついてきています — 文がより自然に流れ、先週より自信を持って話せています。文法の正確さもしっかり追いついてきています。",
  },
  "Next week, slow down slightly when linking ideas together — this will help your sentences connect more smoothly.": {
    ko: "다음 주에는 생각을 이어갈 때 조금만 속도를 늦춰보세요 — 문장이 더 매끄럽게 연결될 거예요.",
    ja: "来週は考えをつなぐときに少しペースを落としてみましょう — 文がもっと滑らかにつながるはずです。",
  },
  // --- Growth Report: Monthly ---
  "This month marks a real turning point — everyday conversation now feels natural, and you're handling more complex grammar with growing accuracy. Your consistency is really paying off.": {
    ko: "이번 달은 정말 중요한 전환점이었어요 — 일상 대화가 이제 자연스럽게 느껴지고, 더 복잡한 문법도 점점 정확하게 다루고 있습니다. 꾸준함이 확실히 결과로 나타나고 있어요.",
    ja: "今月は本当に大きな転換点でした — 日常会話が自然に感じられるようになり、より複雑な文法も徐々に正確に扱えるようになっています。継続してきた努力が確実に結果につながっています。",
  },
  "Milestone reached: you've grown from B1 to B2 this month!": {
    ko: "마일스톤 달성: 이번 달에 B1에서 B2로 성장했어요!",
    ja: "マイルストーン達成：今月B1からB2に成長しました！",
  },
  "Next month, focus on smoothing transitions between sentences in your writing — try connector words like 'however' and 'therefore'.": {
    ko: "다음 달에는 글쓰기에서 문장 간 전환을 매끄럽게 하는 데 집중해보세요 — 'however', 'therefore' 같은 연결어를 사용해보세요.",
    ja: "来月は文章の中で文と文のつながりを滑らかにすることに集中しましょう — 'however' や 'therefore' のような接続語を使ってみましょう。",
  },
  // --- Growth Report: Finals ---
  "You've come an incredible distance — from your very first lesson to confidently discussing complex ideas at a C1 level. Your discipline, curiosity, and consistent effort made this possible.": {
    ko: "정말 놀라운 여정을 걸어왔어요 — 첫 수업부터 지금은 C1 레벨로 복잡한 주제를 자신 있게 이야기할 수 있게 되었습니다. 꾸준한 노력과 호기심, 그리고 성실함이 이 모든 걸 가능하게 했어요.",
    ja: "本当に素晴らしい道のりを歩んできました — 最初のレッスンから、今ではC1レベルで複雑な話題について自信を持って話せるようになりました。あなたの努力、好奇心、そして継続した取り組みがこれを可能にしました。",
  },
  "Keep the momentum going — our Advanced Business English track is a great next step to keep sharpening your skills.": {
    ko: "이 흐름을 계속 이어가세요 — Advanced Business English 과정이 실력을 한층 더 다듬을 수 있는 좋은 다음 단계가 될 거예요.",
    ja: "この勢いを続けましょう — Advanced Business English コースは、さらにスキルを磨くための素晴らしい次のステップです。",
  },
};

const LOOKUP = new Map(
  Object.entries(TRANSLATIONS).map(([english, translations]) => [normalize(english), translations])
);

export const getTranslation = (
  text: string | undefined,
  language: NativeLanguage | undefined
): string | undefined => {
  if (!text || !language) return undefined;
  return LOOKUP.get(normalize(text))?.[language];
};
