import { Image } from 'expo-image';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput,
  useWindowDimensions, View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { answer, exampleInput, friends, startTopic, type FriendId, type Topic } from './conversation';
import { colors, styles } from './styles';
import { Icon } from './Icons';
import { SceneArtwork } from './SceneArtwork';

function TopicButton({ topic, selected, onSelect }: { topic: Topic; selected: boolean; onSelect: (topic: Topic) => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={() => onSelect(topic)}
      style={({ pressed }) => [styles.topic, selected && styles.selectedTopic, pressed && styles.pressed]}>
      <Text style={[styles.topicLabel, selected && styles.selectedLabel]}>{topic}</Text>
    </Pressable>
  );
}

type Panel = 'friends' | 'keyboard' | null;
const friendIds = Object.keys(friends) as FriendId[];

export function ConversationScreen() {
  const [friend, setFriend] = useState<FriendId>('hodam');
  const [turn, setTurn] = useState(() => startTopic('hodam', '말동무'));
  const [panel, setPanel] = useState<Panel>(null);
  const [draft, setDraft] = useState('');
  const [practice, setPractice] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speechId = useRef(0);
  const { fontScale } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const companion = friends[friend];
  const text = practice ? '“' + exampleInput(turn) + '”' : turn.text;

  useEffect(() => {
    return () => {
      speechId.current++;
      void Speech.stop();
    };
  }, []);

  function stopReading() {
    speechId.current++;
    setSpeaking(false);
    void Speech.stop();
  }

  function readBubble() {
    if (speaking) {
      stopReading();
      return;
    }
    const id = speechId.current + 1;
    speechId.current = id;
    function finished() {
      if (speechId.current === id) setSpeaking(false);
    }
    setSpeaking(true);
    Speech.speak(text, {
      language: 'ko-KR', onDone: finished, onStopped: finished,
      onError: () => {
        if (speechId.current !== id) return;
        setSpeaking(false);
        Alert.alert('읽어주기를 실행할 수 없어요', '기기의 한국어 음성 설정을 확인해 주세요.');
      },
    });
  }

  function selectTopic(topic: Topic) {
    stopReading();
    setPractice(false);
    setTurn(startTopic(friend, topic));
  }

  function selectFriend(id: FriendId) {
    stopReading();
    setFriend(id);
    setPractice(false);
    setTurn({ ...startTopic(id, '말동무'), text: friends[id].hello, pose: 'wave' });
    setPanel(null);
  }

  function send(message: string) {
    const clean = message.trim();
    if (!clean) return;
    stopReading();
    setTurn(answer(friend, turn, clean));
    setPractice(false);
    setPanel(null);
  }

  function submitDraft() {
    send(draft);
    setDraft('');
  }

  function openPanel(which: Exclude<Panel, null>) {
    stopReading();
    setPractice(false);
    setPanel(which);
  }

  function pressMic() {
    if (practice) {
      send(exampleInput(turn));
      return;
    }
    stopReading();
    setPractice(true);
  }

  function topicButton(topic: Topic) {
    return <TopicButton topic={topic} selected={turn.topic === topic} onSelect={selectTopic} />;
  }

  return (
    <SafeAreaView style={styles.page} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Image
            source={require('../assets/brand-grandparents.webp')}
            style={styles.brandMark}
            contentFit="cover"
            accessible={false}
          />
          <Text accessibilityRole="header" accessibilityLabel="말똑무" style={styles.logo}>
            말<Text style={styles.logoAccent}>똑</Text>무
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={companion.name + ', 말동무 선택'} onPress={() => openPanel('friends')}
          style={({ pressed }) => [styles.friendPicker, pressed && styles.pressed]}>
          <Image source={companion.portrait} style={styles.smallPortrait} contentFit="contain" />
          <Text style={styles.pickerLabel}>{companion.name}</Text>
          <Icon name="down" size={16} color={colors.green} />
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={[styles.scene, { minHeight: 490 * Math.max(1, fontScale) + bottom }]}>
          <SceneArtwork friend={friend} pose={practice ? 'listen' : turn.pose} />
          <View style={styles.bubbleArea}>
            <View style={styles.bubbleTail} />
            <View style={styles.bubble}>
              <View style={styles.bubbleCopy} accessibilityLiveRegion="polite">
                {practice ? <Text style={styles.caption}>말하기 연습 · 예시</Text>
                  : turn.sent && <Text numberOfLines={2} style={styles.caption}>나 · {turn.sent}</Text>}
                <Text style={styles.quote}>{text}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={speaking ? '읽기 중지' : '말풍선 읽어주기'} onPress={readBubble}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <Icon name={speaking ? 'stop' : 'speaker'} color={colors.green} />
              </Pressable>
            </View>
          </View>
          <View style={[styles.dock, { marginBottom: Math.max(14, bottom + 4) }]}>
            <View style={styles.controls}>
              <View style={styles.column}>{topicButton('말동무')}{topicButton('끝말잇기')}</View>
              <Pressable accessibilityRole="button" accessibilityLabel={practice ? '예시 답변 보기' : '눌러서 말하기, 음성 대화 연습'}
                onPress={pressMic} style={({ pressed }) => [styles.mic, practice && styles.micActive, pressed && styles.pressed]}>
                <Icon name={practice ? 'check' : 'mic'} color="#fff" size={31} />
                <Text style={styles.micLabel}>{practice ? '예시 답변' : '눌러서 말하기'}</Text>
              </Pressable>
              <View style={styles.column}>{topicButton('건강정보')}{topicButton('유머')}</View>
            </View>
            <Pressable accessibilityRole="button" onPress={() => openPanel('keyboard')}
              style={({ pressed }) => [styles.keyboardButton, pressed && styles.pressed]}>
              <Icon name="keyboard" size={19} color={colors.green} />
              <Text style={styles.keyboardLabel}>글자로 쓰기</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Modal visible={panel !== null} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
        <KeyboardAvoidingView style={[styles.overlay, panel === 'keyboard' && styles.composerOverlay]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable accessible={false} style={styles.backdrop} onPress={() => setPanel(null)} />
          <View style={[styles.sheet, panel === 'keyboard' ? styles.composer : { paddingBottom: Math.max(bottom, 16) }]}>
            <View style={styles.sheetHeader}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>{panel === 'friends' ? '말동무 선택' : '글자로 쓰기'}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={() => setPanel(null)} style={styles.iconButton}>
                <Icon name="close" color={colors.ink} />
              </Pressable>
            </View>
            {panel === 'friends' ? <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
              {friendIds.map(id => (
                <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: id === friend }}
                  onPress={() => selectFriend(id)} style={({ pressed }) => [styles.friendRow, pressed && styles.pressed]}>
                  <Image source={friends[id].portrait} style={styles.portrait} contentFit="contain" />
                  <View style={styles.friendText}><Text style={styles.friendName}>{friends[id].name}</Text>
                    <Text style={styles.friendDescription}>{friends[id].description}</Text></View>
                  {id === friend && <Icon name="check" color={colors.green} />}
                </Pressable>
              ))}
            </ScrollView> : panel === 'keyboard' && <>
              <TextInput accessibilityLabel="보낼 이야기" autoFocus multiline maxLength={160} value={draft} onChangeText={setDraft}
                placeholder={turn.topic === '끝말잇기' ? '‘' + turn.word.slice(-1) + '’로 시작하는 단어' : '하고 싶은 이야기를 써 주세요.'}
                placeholderTextColor="#75796e" style={styles.input} />
              <Pressable accessibilityRole="button" disabled={!draft.trim()} accessibilityState={{ disabled: !draft.trim() }}
                onPress={submitDraft} style={({ pressed }) => [styles.submit, !draft.trim() && styles.disabled, pressed && styles.pressed]}>
                <Text style={styles.submitLabel}>보내기</Text>
              </Pressable>
            </>}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
