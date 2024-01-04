# Medi-City Admin Manage
- 본 프로젝트는 한국 서비스(Medi-City) 및 인도네시아 서비스(K-Medi)의 관리자 페이지이다.

링크 : [dev-admin.medi-city.co.kr](https://dev-admin.medi-city.co.kr/)

## 특징
- 한국의 Medi-City 서비스 및 인도네시아의 K-Medi 서비스의 관리를 하는 관리자 사이트이다.
- 전반적으로 모든 medi-city 사이트의 관리를 수행 함.
- erp 전산 관리 시스템.

## 개발 환경 및 사용 툴
- 백엔드 : JAVA
- 백엔드 프레임워크 : Springboot
- 프론트엔드 : Javascript ES6
- 프론트엔드 프레임워크 : ReactJS, Vite (컴파일러)
- Server : Linux (CentOS)(dev), AWS EC2(product) + Apache(dev) + nginx(product)
- 상태관리 라이브러리 : Recoil
- 외부연동 : Kakao Map API Geolocation

## 작업기간
- 2023.06 ~

## 구현 설명
- REST API를 이용하여 Back-End와 통신.
- 사용성과 사용범위를 넓히기 위하여 module화를 진행하였고, 그 결과 확장성이 용이 함.
- Component의 재활용과 module의 재사용으로 프로젝트 진행 시간 최소화.
- Kakao Map Geolocation API를 활용하여 주소 입력 시 위 경도 값 추출.
- MUI 템플릿 활용.
- Autocomplete module화 진행.

## 느낀점
- Front-End의 로직 구현에 대한 다양한 방법의 시도 필요.
- Network 및 하드웨어 cost를 최소화 하기 위해 더욱 다양한 방법과 로직 구현 필요.
- 사용자 페이지보다 더욱 많은 REST통신과 로직이 필요.
