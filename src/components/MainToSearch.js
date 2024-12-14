import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookList from "./BookList"; // 검색 결과를 렌더링할 컴포넌트

const SearchBook = () => {
    const location = useLocation(); // 현재 URL 정보 가져오기
    const queryParams = new URLSearchParams(location.search); // URLSearchParams를 사용하여 쿼리 파라미터 읽기
    const searchTerm = queryParams.get("query"); // 'query'라는 이름의 검색어 추출

    const [items, setItems] = useState([]); // 검색 결과 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        const fetchBooks = async () => {
            if (!searchTerm) return; // 검색어가 없으면 아무 작업도 하지 않음
            try {
                const targetUrl = `/openapi/search/bookAndWebtoonList?prvKey=c9c9eeedd12fc5ce4602648e80e4a337&title=${encodeURIComponent(
                    searchTerm
                )}&viewItemCnt=100&pageNo=1`;

                const response = await fetch(targetUrl);
                const data = await response.json();

                if (data.result?.resultState === "success" && data.itemList) {
                    setItems(data.itemList); // 검색 결과 저장
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("검색 중 오류 발생:", error);
                setItems([]);
            } finally {
                setLoading(false); // 로딩 상태 업데이트
            }
        };

        fetchBooks();
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>로딩 중...</p>
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="text-center py-5">
                <p className="text-danger fw-bold">검색 결과가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4 fw-bold">검색 결과</h1>
            <BookList books={items} /> {/* BookList 컴포넌트에 검색 결과 전달 */}
        </div>
    );
};

export default SearchBook;
