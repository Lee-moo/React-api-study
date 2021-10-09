import { useReducer, useEffect } from "react";

// state는 컴포넌트에서 사용할 수 있는 상태
// dispatch는 액션을 발생시키는 함수
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false,
  });

  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({ type: "ERROR" });
    }
  };

  useEffect(() => {
    if (skip) {
      return;
    }
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;

// reducer는 현재 상태와 액션 객체를 파라미터로 받아와서 새로운 상태를 반환해주는 함수

/*
useEffect
- 첫번째 파라미터에는 함수, 두번째 파라미터에는 의존값이 들어있는 배열을
넣는다.
- deps 배열을 비우게 되면, 컴포넌트가 처음 나타날때에만 useEffect에 등록한
함수가 호출된다.

useEffect에서는 함수를 반환할 수 있는데, 이를 cleanup 함수라 한다.
deps가 비어있는 경우는 컴포넌트가 사라질 때 cleanup 함수가 홏루

deps에 특정 값을 넣게 되면, 컴포넌트가 처음 마운트 될 때에도
호출이 되고, 지정한 값이 바뀔 때에도 호출이 된다.
그리고 deps안에 특정 값이 잇다면 언마운트시에도 호출이 된다면, 
값이 바뀌기 직전에도 호출이 된다.
*/
