###### <i>Likelion Front-end Bootcamp Final Project</i>

# 🌞 5늘

### 📚 프로젝트 개요
**오늘뭐입지** 는 날씨에 알맞는 옷차림 추천 서비스를 제공합니다.

### 📆 프로젝트 기간
2025년 9월 24일(수) ~ 2025년 10월 29일(수)

### 🛠 기술 스택
| 분류         | 기술 스택                 |
| ------------ | --------------------------|
| 언어         |  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind-CSS&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=black"/> |
| OS          | <img src="https://img.shields.io/badge/Windows-1572B6?style=flat-square&logo=windows&logoColor=white"/> <img src="https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white"/> |
| 개발환경     | <img src="https://img.shields.io/badge/Visual Studio Code-00B2E3?style=flat-square&logo=vscode&logoColor=white"/> <img src="https://img.shields.io/badge/Bun-000000?style=flat-square&logo=Bun&logoColor=white"/> |
| 디자인       | <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white"/> |
| 버전관리     | <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/> <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/> |
| 커뮤니케이션 | <img src="https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white"/> <img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion&logoColor=white"/> |
| 서버 서비스  | <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=Supabase&logoColor=white"/> |
| 배포        | <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white"/> |

### 🔗 배포사이트
[<img width="234" height="163" alt="image" src="https://github.com/user-attachments/assets/0a73d419-c646-4428-b1e7-be3a003ff1d7" />
](https://final-project-team-5-ten.vercel.app/)

### 🔰 프로젝트 팀원 소개
| 김민지 | 안동원 | 윤정화 | 👑조석근 | 
| ------ | ----- | ------ | ----- | 
| <div align="center">ESFJ</div> | <div align="center">ISFP</div> | <div align="center">ENFP</div> | <div align="center">INFP<div> | 
| <div align="center">개발자</div> | <div align="center">개발자</div> | <div align="center">개발자</div> | <div align="center">개발자</div> |
| <div align="center">[<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>](https://github.com/minji-kim0524)</div> | <div align="center">[<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>](https://github.com/dongwonAhn)</div> | <div align="center">[<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>](https://github.com/gomteang2)</div> | <div align="center">[<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>](https://github.com/IceJack)</div> | 

### 📂 프로젝트 폴더 구조
**App Router 방식 적용**
<details> 
<summary>폴더 구조 보기</summary>

```
🌞 5늘
├── 📁 .next
├── 📁 .vscode
│   ├── extention.json
│   └── settings.json
├── 📁 node_modules
├── 🌐 public
│   ├── 📁 codi
│   ├── 📁 email
│   ├── 📁 hanger
│   └── 📁 weather
├── 📁 src
│   ├── 📁 @types
│   │   └── global.d.ts
│   ├── 📁 app
│   │   ├── 📁 account
│   │   │   │   └── page.tsx
│   │   ├── 📁 api
│   │   │   ├── 📁 account
│   │   │   │   └── route.ts
│   │   │   ├── 📁 location
│   │   │   │   └── route.ts
│   │   │   └── 📁 search
│   │   │       └── route.ts
│   │   ├── 📁 auth
│   │   │   ├── 📁 callback
│   │   │   │   └── route.ts
│   │   │   ├── 📁 reset
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 setup
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 signin
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 singup
│   │   │   │   └── page.tsx
│   │   │   └── 📁 update
│   │   │       └── page.tsx
│   │   ├── 📁 main
│   │   │   └── 📁 cloth
│   │   │       └── page.tsx
│   │   ├── 📁 profile
│   │   │   └── page.tsx
│   │   ├── 📁 weather
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components
│   │   ├── 📁 ui
│   │   │   ├── BackButton.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── CodiList.tsx
│   │   │   ├── FavoriteCodiList.tsx
│   │   │   ├── FilterButton.tsx
│   │   │   ├── Frame.tsx
│   │   │   ├── ImageForm.tsx
│   │   │   ├── ImageList.tsx
│   │   │   ├── ImageModal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── KeywordList.tsx
│   │   │   ├── LocationTemp.tsx
│   │   │   ├── MainCarousel.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── MyCodiList.tsx
│   │   │   ├── NavigationBar.tsx
│   │   │   ├── Notification.tsx
│   │   │   ├── OnboardingModal.tsx
│   │   │   ├── ProfileSheet.tsx
│   │   │   ├── ProfileTab.tsx
│   │   │   ├── SnsButton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── WeatherDashboard.tsx
│   │   │   ├── WeatherSimpleBar.tsx
│   │   │   └── WeatherWeekly.tsx
│   │   └── index.ts
│   ├── 📁 hooks
│   │   ├── useGeoLocation.ts
│   │   ├── useLocationData.ts
│   │   └── useLocationName.ts
│   ├── 📁 libs
│   │   ├── 📁 store
│   │   │   └── weatherStore.ts
│   │   ├── 📁 supabase
│   │   │   ├── client.ts
│   │   │   ├── codistore.ts
│   │   │   ├── database.types.ts
│   │   │   └── server.ts
│   │   ├── getLocation.ts
│   │   ├── getWeather.ts
│   │   └── loadSearch.ts
│   ├── 📁 styles
│   │   └── main.css
│   ├── 📁 utils
│   │   ├── getWeatherCondition.ts
│   │   ├── index.ts
│   │   └── tw.ts
├── (.env.local)
├── .gitignore
├── .prettierrc
├── bun.lock
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── pull_request_template.md
├── README.md   
└── tsconfig.json
```
</details>

### 💻 프로젝트 Flow Chart
<img width="1231" height="279" alt="Image" src="https://github.com/user-attachments/assets/be0a2e54-c3bb-4495-8ff8-25df645b07fc" />

### 🖼 프로젝트 와이어 프레임
<div align="center"><img width="800" height="500" alt="Image" src="https://github.com/user-attachments/assets/a7de242b-ccac-4f1d-a115-2474ac568dcd" /></div>

### 🎨 프로젝트 디자인 초안
| <img width="150" height="296" alt="image" src="https://github.com/user-attachments/assets/f8474b70-0305-4c78-aef9-369e5c749a13" />| <img width="532" height="296" alt="image" src="https://github.com/user-attachments/assets/6b67c7dc-20af-407c-9ac5-50097c7d2028" />| 
| ------ | ----- |

| <img width="712" height="396" alt="image" src="https://github.com/user-attachments/assets/cedf1ef3-8c04-4ec8-8a31-0382b04be273" />| <img width="694" height="396" alt="image" src="https://github.com/user-attachments/assets/48c12542-b097-4252-87f2-7ba4cc71bf44" />|
| ------ | ----- | 

### 🛢 프로젝트 DB구조
<div align="center"><img width="750" height="500" alt="Image" src="https://github.com/user-attachments/assets/244b5220-2d84-4c5a-a675-7b7de8499925" /></div>

### 📖 관련 문서 바로가기
 - [GitHub Wiki 보기](https://github.com/FRONTENDBOOTCAMP-14th/Final-Project-Team-5/wiki)
 - [Figma 시안 보기](https://www.figma.com/design/lh07M4GQXyWqSh0JeTDNl4/weather-clothing?node-id=0-1&t=Rvx5ZngmZiR7lG9H-0)
 - [Notion 보기](https://www.notion.so/5-27773873401a809f900fdb8997538b3e?source=copy_link)
