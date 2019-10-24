
## 동네플러스
![enter image description here](https://lh3.googleusercontent.com/XVz5zp6ZlEkbmeeY7NkxfwmuDN_ns1oxiYgXB8Se-q98ugiRMdupvvQEhhr6I1weG3_s9mLrf34)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]

**'동네플러스'** 프로젝트는 지역 생활 정보를 보여주는 어플리케이션이다.

**'동네플러스'** 는 지역 정보에 관심이 있는 사용자들을 대상으로 한다. 
**편의 시설 위치 표시, 인기 트윗 정보**를 표시하여 사용자에게 동네에 대한 정보들을 쉽게 얻을 수 있다.
**광고 배너**를 배치하여 동네 상권 업자들이 홍보 수단으로 활용할 수 있도록 한다. 
편의 시설 정보 어플을 만든 **회사들과 서비스를 연계**하여 수익을 쌓을 수 있도록 한다.

필요한 정보를 쉽고 빠르게 확인할 수 있다는 것이 강점이다.

<br>
<br>

## 팀원 (Teammates)
일병 안재형
<br>

## 권장 사양 (Prerequisites)
chrome  브라우저
<br>

## 설치 안내 (Installation Process)

 - Node.js 설치를 진행한다. [https://nodejs.org/ko/](https://nodejs.org/ko/)
 - 터미널 창을 열고 `git clone https://github.com/osam2019/WEB_dongneplus_solo.git`를 입력한다.
 - 설치 폴더로 이동하고 터미널에서 `npm install` 을 입력한다.

## 사용법 (Getting Started)

 - [http://apis.map.kakao.com/web/](http://apis.map.kakao.com/web/) 사이트에서 발급받은 Api Key를 입력한다.
 - /public/index.html 파일을 연다.
 - `<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=여기에 키를 입력하세요&libraries=services,clusterer,drawing"></script>`
 - 터미널을 열고, `npm run serve`를 입력한다.

## 파일 정보 및 목록 (File Manifest)
```
.
├── public
├── src
|   ├── assets 이미지 파일들이 있다
|   ├── components 컴포넌트 뷰파일들이 있다
|	├── router 라우터 js파일이 있다
|	├── views 
|	├── App.vue 이 뷰파일에서 모든 컴포넌트를 관리한다
|	└── main.js	이 js파일에서 플러그인 등록, vuex를 관리한다
├── package.json
├── README.md
└── index.html
```


## 개발자의 연락처 정보 (Contact Information)
moulawola@gmail.com
