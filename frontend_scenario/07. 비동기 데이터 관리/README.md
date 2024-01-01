# **Part 07. UX 개선을 위한 효율적인 데이터 관리**

- [01. part overview](#01-part-overview)
- [02. 비동기 데이터 관리의 필요성](#02-비동기-데이터-관리의-필요성)
  - [1) 로딩 성능에 따른 사용자 경험](#1-로딩-성능에-따른-사용자-경험)
  - [2) 로딩 성능 개선 방법](#2-로딩-성능-개선-방법)
- [03. 속도 향상을 위한 효율적인 비동기 처리](#03-속도-향상을-위한-효율적인-비동기-처리)
  - [1) Data loading시에 사용될 수 있는 loading 상태 관리](#1-data-loading시에-사용될-수-있는-loading-상태-관리)
  - [2) UX를 저하하는 API 응답 대기 공백 화면에 Skeleton Component 도입](#2-ux를-저하하는-api-응답-대기-공백-화면에-skeleton-component-도입)

# 01. part overview

- 비동기 호출의 응답지연 문제: 발생 가능한 문제 상황에 대한 설명
- 효율적인 비동기 처리 방법: 데이터 로딩 상태 관리
- UX 사용성 개선: Skeleton Component 구성
- 데이터 로드 분산: Pagination, infinite scrolling
- SSR을 이용한 로딩 개선: 서버에서의 데이터 fetching을 통한 퍼포먼스 개선
- Caching을 이용한 로딩 개선: 클라이언트 캐싱을 이용한 로딩 개선

<br />

# 02. 비동기 데이터 관리의 필요성

## 1) 로딩 성능에 따른 사용자 경험

- Page Load Time 1s -> 3s: 이탈률 32% 증가
- 40% 유저: 3초를 안기다림
- 페이지 로드 성능 요인: 이미지, 비디오 등 미디어 콘텐츠 어셋, js, api 호출, 스크린 대비 거대한 페이지, css 스타일 및 폰트 등

<br />

## 2) 로딩 성능 개선 방법

### ✏️ 심리적 개선

- 어떤 타입의 로딩을 대응하느냐에 따라 로딩 시간에 대한 인지와 감정적인 대응이 다름.
- Skeleton vs Spinner vs Blank

  - 인지된 로딩 시간: Skeleton이 가장 적음  
    <img src="https://github.com/seohyun319/Lecture/assets/76686872/3f297bc6-6602-419f-a618-10c11855efe9" width="480" />

  - 감정 수준: 0 행복 ~ 4 좌절. Skeleton이 가장 우수  
    <img src="https://github.com/seohyun319/Lecture/assets/76686872/fb377227-3596-4f54-a807-598581aaf00d" width="480" />

### ✏️ 기술적 개선

- 이미지 크기 리사이징 및 보이지 않는 영역의 이미지는 나중에 그리는 lazy loading
- 자바스크립트 코드 최적화 및 번들 사이즈 최적화, 번들 청크를 작게 나누기
  - dynamic loading을 사용해 실제 스크립트가 필요한 때 로딩
- 자바스크립트 실행시간 최소화
- 텍스트 압축 및 이미지 포맷 변경
- 웹폰트 로드 기간 동안 텍스트 표시
- 대규모 레이아웃 변경 피하기
- third party resources는 lazy-loading으로
- 리소스 제공 서버 변경
- SSG, SSR을 이용한 초기 페이지 로딩 속도 향상
- 웹워커를 활용한 동시에 여러 자바스크립트 동작 수행

<br />

# 03. 속도 향상을 위한 효율적인 비동기 처리

## 1) Data loading시에 사용될 수 있는 loading 상태 관리

### ✏️ Data loading 상태 관리

- API 호출 시작 → 사용자의 페이지 로딩 인지 → API 호출 지연 → 페이지 오류로 착각한 사옹자의 이탈 발생
- 이를 방지하기 위해 로딩 상태를 명시적 안내. 사용자에게 로딩중임을 인지시키며 애니메이션을 통해 로딩 체감을 짧게 함.
- useLoading 훅 사용

  1. products 받아오기

     - pages/products.tsx

       ```tsx
       import { Product } from "@/types/type";
       import axios from "axios";
       import { useEffect, useState } from "react";

       const Products: React.FC = () => {
         const [loading, setLoading] = useState(false);
         const [products, setProducts] = useState<Product[]>([]);

         const loadProducts = async () => {
           setLoading(true);
           const response = await axios.get<Product[]>("/api/products");
           setProducts(response.data);
           setLoading(false);
         };

         useEffect(() => {
           loadProducts();
         }, []);

         return (
           <div>
             {!loading &&
               products.map((product) => (
                 <div key={product.id}>{product.name}</div>
               ))}
             {loading && <div>{"loading..."}</div>}
           </div>
         );
       };

       export default Products;
       ```

     - types/type.ts
       ```tsx
       export type Product = {
         id: number;
         name: string;
         originalPrice: number;
         description: string;
       };
       ```

  2. useLoading 함수를 이용한 로딩 분리

     - pages/products.tsx - useLoading을 이용한 로딩 분리

       ```tsx
       import { Product } from "@/types/type";
       import axios from "axios";
       import { useEffect, useState } from "react";

       const useLoading = (url: string) => {
         const [loading, setLoading] = useState(false);
         const [products, setProducts] = useState<Product[]>([]);

         const loadData = async () => {
           setLoading(true);
           const response = await axios.get<Product[]>(url);
           setProducts(response.data);
           setLoading(false);
         };
         useEffect(() => {
           void loadData();
         }, []);

         return [loading, products];
       };

       const Products: React.FC = () => {
         const [loading, products] = useLoading("/api/products");

         return (
           <div>
             {!loading &&
               products.map((product) => (
                 <div key={product.id}>{product.name}</div>
               ))}
             {loading && <div>{"loading..."}</div>}
           </div>
         );
       };

       export default Products;
       ```

  3. useLoading 훅으로 분리 - 타입까지 다 정의됨

     - hooks/useLoading.ts

       ```tsx
       import { useState } from "react";

       type ReturnType<T> = [boolean, T | null];

       type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | string;

       const useLoading = <T,>(
         url: RequestInfo | URL,
         data: Record<string, unknown> = {},
         method: HttpMethod = "GET"
       ): ReturnType<T> => {
         const [isLoading, setIsLoading] = useState(true);
         const [res, setRes] = useState<T | null>(null);
         fetch(url, {
           method: method,
           body: JSON.stringify(data),
         })
           .then((res) => res.json())
           .then((result) => {
             setRes(result);
             setIsLoading(false);
             return result as T;
           });

         return [isLoading, res];
       };

       export default useLoading;
       ```

     - pages/products-fianl.tsx

       ```tsx
       import useLoading from "@/hooks/useLoading";
       import { Product } from "@/types/type";

       const Products: React.FC = () => {
         const [loading, products] = useLoading<Product[]>("/api/products");
         return (
           <div>
             {!loading &&
               products?.map((product) => (
                 <div key={product.id}>{product.name}</div>
               ))}
             {loading && <div>{"loading..."}</div>}
           </div>
         );
       };

       export default Products;
       ```

<br />

### ✏️ 라이브러리를 이용한 로딩 상태 관리

- Data fetcing 영역 라이브러리 사용량 2022
  - axios 및 기본 라이브러리 (fetch) 사용이 많음
    - 이를 이용할 경우 상태관리에 별도의 cost가 필요
  - FE에서의 data fetching은 react-query / SWR 사용
    - 단순한 data fetching에서의 역할 뿐만 아니라,
      추가적인 API 요청과 관련된 기능들을 하는 라이브러리 이용
      ![image](https://github.com/seohyun319/Lecture/assets/76686872/6a83149f-4f41-498c-8303-34d5d43e0fca)
- react-query
  - react 이외의 여러 프레임워크를 지원하며 TanSatck Query로 변경
  - fetching / caching / 서버 데이터와의 동기화를 지원
  - Component가 component 그 자체에 집중할 수 있도록 지원
  - API 요청에 대한 의존성을 react-query 로 분리하여, 보다 코드를 유려하게 구성
    - 로딩 상태 관리
    - 캐싱 관리
    - 클라이언트 /서버 상태간의 동기화
    - 페이지네이션 지원
    - refetching on Focus 지원
- react-query 설치

  - React 16.8+ 버전 필요
  - NPM package 설치
  - ESLint 플러그인 설치 권장

    ```bash
    npm i @tanstack/react-query
    pnpm add @tanstack/react-query
    yarn add @tanstack/react-query

    npm i -D @tanstack/eslint-plugin-query
    pnpm add -D @tanstack/eslint-plugin-query
    yarn add -D @tanstack/eslint-plugin-query
    ```

  - app.tsx 내 queryClient 생성, Component를 QueryClientProvider로 wrapping

    ```tsx
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

    const queryClient = new QueryClient();

    export default function App({ Component, pageProps }: AppProps) {
      return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      );
    }
    ```

- react-query 사용

  - Component 내에서 useQuery로 request
    - param으로 queryKey, queryFunction
      - queryKey: 변경 시 refetch
      - queryFunction: 실제 data를 받아오는 로직
        (axios/fetch 등 사용)
      - option의 enabled에 값을 넣으면 그 값이 true일 경우에만 useQuery 실행
  - isLoading, error, data, isFetching을 받아와서 component 내 사용

  ```tsx
  const Example: React.FC = () => {
    const { isLoading, error, data, isFetching } = useQuery<
      GithubAPIResponse,
      GithubAPIError
    >({
      queryKey: ["repoData"],
      queryFn: () =>
        axios
          .get("https://api.github.com/repos/tannerlinsley/react-query")
          .then((res) => res.data),
    });

    if (isLoading) return "Loading...";

    if (error) return `An error has occurred: ${error.message}`;

    return (
      <div>
        <h1>{data.name}</h1>
        <p>{data.description}</p>
        <strong>👀 {data.subscribers_count}</strong>{" "}
        <strong>✨ {data.stargazers_count}</strong>{" "}
        <strong>🍴 {data.forks_count}</strong>
        <div>{isFetching ? "Updating..." : ""}</div>
      </div>
    );
  };

  export default Example;
  ```

- react-query 상태
  - **isLoading**
    - 로딩중인 경우 && 캐시된 데이터가 없을 때
    - `status` 관리: data의 존재 여부
    - enabled 값이 false 이면 isLoading이 계속 true. 쿼리 보내지 않았으니 캐시된 데이터 존재하지 않기 때문.
  - **isFetching**
    - 로딩중인 경우 (데이터 패칭 함수 수행 중)
    - `fetchStatus` 관리: queryFn의 실행 여부
  - **isInitialLoading**
    - isLoading && isFetching. 캐시된 데이터 없는 쿼리 요청 중
  - **Stale While Revalidate**: 데이터를 캐싱한 이후, 데이터가 Outdated된 경우(Stale)라도 해당 데이터 제공
    - 없는 것 보다는 낫다. 느리다는 사용자 경험에서 벗어나기 위함
    - 오래된 데이터를 표시하는 동시에 **background refetch**를 수행하여 데이터를 재검증함.
      - status === success 인 상황
        - 데이터 캐싱되어 있는 상황, isLoading이 false 이어야 하고
        - fetching은 background에서 수행 중이거나 idle 인 상황
      - 즉 loading 상태와 별개로 실제 데이터를 받는 상황인 fetchStatus에 대한 감지가 필요
- query key

  - Array 형태 (v3까지는 하나인 경우 string 가능했었음) - serializable 해야함
  - query 데이터에 대해서 unique 해야
  - 내부적으로 데이터 캐싱하는데 도움
  - 자동으로 refetch 시에 의존성
  - 쿼리키 이용해
    - mutate 이후 데이터 업데이트
    - 일부 쿼리에 대해서 수동으로 갱신
  - 주의사항

    1. array 안의 object의 경우 key 순서는 무시되고, 동일한 query key로 인식됨

       ```tsx
       // 전부 'todos'와 object로 인식되는 두 개의 쿼리키 가졌다 취급됨.
       useQuery({ queryKey: ['todos', { status, page }], ...})
       useQuery({ queryKey: ['todos', { page, status }], ...})
       useQuery({ queryKey: ['todos', { page, status, other: undefined }], ...})

       // array item의 순서에 따라 서로 다른 query key로 인식
       useQuery({ queryKey: ['todos', status, page], ...})
       useQuery({ queryKey: ['todos', page, status], ...})
       useQuery({ queryKey: ['todos', undefined, page, status}], ...})
       ```

    2. query key는 반드시 유니크해야

       ```tsx
       useQuery({
         queryKey: ["todos"],
         queryFn: fetchTodos,
       });

       // 🚨 동일한 쿼리키인 todos를 사용하고 있어 동작 안 함
       useInfiniteQuery({
         queryKey: ["todos"],
         queryFn: fetchInfiniteTodos,
       });

       // ✅ 다른 쿼리키를 선택할 경우 정상 동작
       useInfiniteQuery({
         queryKey: ["infiniteTodos"],
         queryFn: fetchInfiniteTodos,
       });
       ```

    3. 자동 Refetching

       - refetch는 동일한 parameter에 대해서 fetching하기 때문에 필터 기능처럼 버튼을 클릭했을 때 다른 데이터를 패칭해오기 바랄 경우
       - 데이터를 변경시키는 state를 쿼리키에 넣고, 해당 state의 setter를 이용해 쿼리키를 갱신

       ```tsx
       function Component() {
         const [filters, setFilters] = React.useState();
         const { data } = useQuery({
           querykey: ["todos", filters],
           queryFn: () => fetchTodos(filters),
         });

         // local state를 변경시켜 쿼리 갱신
         return <Filters onApply={setFilters} />;
       }
       ```

<br />

## 2) UX를 저하하는 API 응답 대기 공백 화면에 Skeleton Component 도입

### ✏️ Skeleton Component

웹페이지가 로딩시에, 실제 페이지가 보여지기 이전 사용자에게 보여지는 placeholder

- Content placeholder: 실제 레이아웃 사용
- Colour placeholder: 이미지 로드되는 동안 로딩중인 이미지의 기본 색상 표시
- Animated placeholder: 애니메이션 사용해 체감 속도 줄임

### ✏️ 기본 구조

```tsx
export const Skeleton: React.FC = () => {
	const isLoading = ...

	// 로딩 중에는 스켈레톤 보여줌
	if (isLoading) return <Skeleton />
	// 로딩 중 아니면 실제 컴포넌트 보여줌
	return <Component />
}
```

### ✏️ 구현

1. Material UI 이용
2. react-loading-skeleton 이용: 단순, 가벼운 라이브러리
3. react-content-loader: 복잡하고 다양한 SVG 기반의 스켈레톤 컴포넌트 구현
4. 기본 css 이용
