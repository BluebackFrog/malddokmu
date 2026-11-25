import { StyleSheet } from 'react-native';

export const colors = {
  paper: '#fffcf7', ink: '#30332e', green: '#49654d', accent: '#378044', line: '#d6dcc6',
};

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 6, borderBottomWidth: 1, borderColor: '#e2e4d5',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  brandMark: { width: 48, height: 30 },
  logo: { fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: -1 },
  logoAccent: { color: colors.accent },
  friendPicker: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  smallPortrait: { width: 30, height: 32 },
  pickerLabel: { fontSize: 17, color: colors.ink, fontWeight: '600' },
  scroll: { flex: 1, backgroundColor: '#efe7d5' },
  scrollContent: { flexGrow: 1 },
  scene: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  bubbleArea: { width: '94%', maxWidth: 570, marginTop: 16 },
  bubble: {
    backgroundColor: 'rgba(255,252,247,0.97)', borderWidth: 1, borderColor: '#ded6c4',
    borderRadius: 22, paddingLeft: 18, paddingRight: 8, paddingVertical: 13,
    flexDirection: 'row', alignItems: 'flex-start', gap: 4,
  },
  bubbleTail: {
    position: 'absolute', bottom: -7, left: 36, width: 17, height: 17, transform: [{ rotate: '45deg' }],
    borderColor: '#ded6c4', borderRightWidth: 1, borderBottomWidth: 1, backgroundColor: colors.paper,
  },
  bubbleCopy: { flex: 1, alignSelf: 'center' },
  quote: { color: colors.ink, fontWeight: '600', fontSize: 23, lineHeight: 33, letterSpacing: -0.5 },
  caption: { color: '#5f695b', fontSize: 15, lineHeight: 22, marginBottom: 5 },
  iconButton: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  dock: {
    width: '94%', maxWidth: 570, padding: 10, gap: 6, borderRadius: 18, borderWidth: 1,
    borderColor: '#fffcf7', backgroundColor: 'rgba(255,252,247,0.87)', marginTop: 16,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  column: { flex: 1, gap: 7 },
  topic: {
    minHeight: 46, paddingVertical: 6, paddingHorizontal: 2, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,253,247,0.92)', borderWidth: 1, borderRadius: 12, borderColor: colors.line,
  },
  topicLabel: { color: '#485641', fontSize: 17, fontWeight: '500', textAlign: 'center' },
  selectedTopic: { backgroundColor: '#e6ecd7', borderColor: '#899b74' },
  selectedLabel: { color: '#384b36', fontWeight: '700' },
  mic: {
    width: 108, minHeight: 108, borderRadius: 54, padding: 6, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.green, borderColor: '#bed0af', borderWidth: 3, gap: 5,
  },
  micActive: { backgroundColor: '#35533b', borderColor: '#93aa78' },
  micLabel: { color: '#fff', fontWeight: '600', fontSize: 14, textAlign: 'center' },
  keyboardButton: {
    alignSelf: 'center', minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingHorizontal: 13, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fffdf7d9',
  },
  keyboardLabel: { color: '#46553e', fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.68 },
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  composerOverlay: { justifyContent: 'center', paddingHorizontal: 16 },
  composer: { borderRadius: 24, paddingBottom: 16 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(25,35,27,0.42)' },
  sheet: {
    width: '100%', maxWidth: 600, maxHeight: '88%', backgroundColor: colors.paper,
    paddingHorizontal: 20, paddingTop: 12, borderTopRightRadius: 24, borderTopLeftRadius: 24,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sheetTitle: { color: colors.ink, fontSize: 22, fontWeight: '700' },
  friendRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line,
  },
  portrait: { width: 48, height: 50 },
  friendText: { flex: 1, gap: 2 },
  friendName: { fontSize: 19, fontWeight: '600', color: colors.ink },
  friendDescription: { fontSize: 15, color: '#66705d' },
  input: {
    minHeight: 88, maxHeight: 148, padding: 12, borderWidth: 1, borderColor: '#8d9e76',
    borderRadius: 12, fontSize: 20, color: colors.ink, backgroundColor: '#fff', textAlignVertical: 'top',
  },
  submit: { backgroundColor: colors.green, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, marginTop: 10 },
  submitLabel: { color: '#fff', fontSize: 18, fontWeight: '600' },
  disabled: { backgroundColor: '#737c6e' },
});
