export const friends = {
  hodam: {
    name: '호담이', home: '소나무 숲', description: '어흥보다 수다가 좋은 호랑이',
    hello: '어흥~ 놀라셨슈?\n저 수다 떨러 왔어유.',
    opener: '오늘 뭐 하셨슈?\n산중엔 소문이 늦게 와유.',
    reply: '천천히 말씀하셔유.\n토끼도 오늘은 안 쫓아유.',
    scene: require('../assets/friends/phone-hodam.webp'), portrait: require('../assets/friends/02-hodam-thumb.webp'),
  },
  boksil: {
    name: '복실이', home: '햇살 드는 마당', description: '마당에서 반겨주는 강아지',
    hello: '오셨어요? 오늘 이야기가 궁금해요!',
    opener: '오늘은 어디 다녀오셨어요?\n그 이야기가 궁금해요!',
    reply: '같이 있으면 더 즐겁죠!\n재미난 이야기 해봐요.',
    scene: require('../assets/friends/phone-boksil.webp'), portrait: require('../assets/friends/01-boksil-thumb.webp'),
  },
  dodam: {
    name: '도담이', home: '숲속 정자', description: '이야기보따리를 푸는 도깨비',
    hello: '반가워유. 오늘은 어땠어유?',
    opener: '별일 없던 하루도 좋아유.\n무슨 일이 있었는지 들려줘유.',
    reply: '천천히 말씀하셔유.\n이야기는 서두를 것 없지유.',
    scene: require('../assets/friends/phone-dodam.webp'), portrait: require('../assets/friends/03-dodam-thumb.webp'),
  },
  boksoon: {
    name: '복순 할머니', home: '아늑한 거실', description: '살가운 전라도 이웃',
    hello: '어서 오세요잉. 오늘은 어찌 지내셨어요?',
    opener: '오늘 무슨 일 있으셨어요?\n편하게 들려줘요잉.',
    reply: '이야기 나누면 더 재밌지라.\n우리 하나씩 꺼내볼까요?',
    scene: require('../assets/friends/phone-boksoon.webp'), portrait: require('../assets/friends/05-boksoon-thumb.webp'),
  },
  deoksu: {
    name: '덕수 할아버지', home: '한옥 마루', description: '느긋한 경상도 이야기꾼',
    hello: '어서 오이소. 오늘 하루는 어땠습니꺼?',
    opener: '그 얘기 참 좋네예.\n조금 더 들려줘요.',
    reply: '급할 거 있습니꺼.\n천천히 말씀해 주이소.',
    scene: require('../assets/friends/phone-deoksu.webp'), portrait: require('../assets/friends/06-deoksu-thumb.webp'),
  },
};

export type FriendId = keyof typeof friends;
export type Topic = '말동무' | '끝말잇기' | '건강정보' | '유머';
export type Pose = 'listen' | 'wave' | 'apple' | 'relax';
export type Turn = { topic: Topic; text: string; pose: Pose; word: string; sent?: string };

export function startTopic(friend: FriendId, topic: Topic): Turn {
  const turn: Turn = { topic, text: friends[friend].opener, pose: 'listen', word: '사과' };
  switch (topic) {
    case '끝말잇기': return { ...turn, text: '끝말잇기 해볼까요?\n제가 먼저, 사과!', pose: 'apple' };
    case '건강정보': return { ...turn, text: '오늘은 몸이 좀 어떠세요?\n가볍게 안부부터 나눠요.', pose: 'relax' };
    case '유머': return { ...turn, text: '왕이 넘어지면 뭐라고 할까요?\n한번 맞혀 보세요!', pose: 'wave' };
    case '말동무': return turn;
  }
}

// 끝말잇기는 기기에 담긴 단어로만 이어 간다.
const words: Record<string, string> = {
  과: '과자', 자: '자두', 두: '두부', 부: '부채', 채: '채소', 소: '소나기',
  기: '기차', 차: '차표', 표: '표지', 지: '지도', 도: '도시', 시: '시계',
  계: '계단', 단: '단어', 어: '어부', 일: '일기',
};

export function exampleInput(turn: Turn): string {
  switch (turn.topic) {
    case '끝말잇기': return words[turn.word.slice(-1)] ?? '과자';
    case '유머': return '정답이 뭐예요?';
    case '건강정보': return '오늘은 기분이 좋아요.';
    case '말동무': return '오늘 산책을 다녀왔어요.';
  }
}

export function answer(friend: FriendId, turn: Turn, sent: string): Turn {
  const next: Turn = { ...turn, sent, pose: 'relax', text: friends[friend].reply };
  if (turn.topic === '끝말잇기') {
    const letter = turn.word.slice(-1);
    const word = sent.trim();
    if (!/^[가-힣]{2,}$/.test(word) || !word.startsWith(letter)) {
      return { ...next, pose: 'apple', text: `‘${letter}’로 시작하는 단어를\n두 글자 이상 써 주세요.` };
    }
    const reply = words[word.slice(-1)];
    if (!reply) return { ...next, word: '사과', text: '제가 졌어요! 한 판 더 할까요?\n새 단어는 사과예요.', pose: 'apple' };
    return { ...next, word: reply, text: `저는 ‘${reply}’!\n‘${reply.slice(-1)}’로 이어 주세요.`, pose: 'apple' };
  }
  if (turn.topic === '유머') return { ...next, text: '킹콩!\n왕이 쿵 하고 넘어졌대요.', pose: 'wave' };
  if (turn.topic === '건강정보') return { ...next, text: '들려주셔서 고마워요.\n오늘 내 몸에 해 준 일을 떠올려 볼까요?' };
  return next;
}
