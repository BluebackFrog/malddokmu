# 말똑무

말똑무는 어르신과 이야기를 나누는 AI 말동무를 목표로 만드는 Android·iOS 앱입니다. 현재 첫 화면에 호담이의 인사말이 표시됩니다. 첫 화면은 `App.tsx`에서 수정합니다.

Mac에서 새 터미널을 열고 다음 명령을 실행합니다.

```sh
cd ~/Downloads/sw/mobile
npm start
```

- **아이폰 시뮬레이터** — 터미널에서 `i`를 누릅니다.
- **안드로이드 에뮬레이터** — 터미널에서 `a`를 누릅니다. 기기를 고르는 화면이 나오면 `Maldongmu_Pixel_8`을 선택합니다.
- **실제 안드로이드폰** — Mac과 휴대폰을 같은 Wi-Fi에 연결한 뒤 [SDK 58용 Expo Go](https://expo.dev/go)에서 QR 코드를 엽니다.
- **실제 아이폰** — 이 프로젝트는 Expo SDK 58을 사용합니다. 실제 아이폰에는 Xcode에서 Apple 계정으로 서명한 개발용 앱을 설치하는 방법이 있습니다. [실기기 개발 빌드 안내](https://docs.expo.dev/develop/development-builds/introduction/) · [Expo Go 버전 안내](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)
- **종료** — 터미널에서 `Ctrl+C`를 누릅니다. 다음에 이 Mac에서 다시 시작할 때도 위 두 줄을 사용합니다.

## 다른 컴퓨터에서 이어서 작업하기

Git과 Node.js 24를 설치한 뒤, 프로젝트를 둘 폴더에서 다음 명령을 실행합니다.

```sh
git clone https://github.com/BluebackFrog/malddokmu.git
cd malddokmu
npm ci
npm start
```

Windows에서는 Android Studio로 안드로이드 에뮬레이터를 만들거나 실제 안드로이드폰을 사용합니다. 아이폰 시뮬레이터는 Mac에서 실행합니다.

각 컴퓨터에서 처음 커밋하기 전에 `git config user.name`과 `git config user.email`을 확인합니다. GitHub 계정에 커밋이 연결되려면 해당 계정의 **Settings → Emails**에 표시된 인증 이메일이나 GitHub 제공 비공개 이메일을 사용하세요. 이 저장소의 설정만 바꾸려면 `git config --local user.email "해당 이메일"`을 실행합니다.

작업을 시작할 때는 저장소 폴더에서 `git pull --ff-only`로 최신 변경을 받습니다. 한 가지 변경을 완성하고 확인하면 `git status`와 `git diff`로 내용을 살펴보고, 수정한 파일을 골라 커밋한 뒤 푸시합니다. 아래는 첫 화면 문구를 실제로 수정했을 때의 예시입니다.

```sh
git add App.tsx
git commit -m "호담이의 첫 인사 문구 수정"
git push
```
