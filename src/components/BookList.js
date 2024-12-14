import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // React Router에서 Link 가져오기

const BookList = ({ books }) => {
  const [favoriteBooks, setFavoriteBooks] = useState([]); // 선호작 상태 저장
  const mockApiUrl = "https://67582d5860576a194d0f3163.mockapi.io/book";

  // MockAPI에서 선호작 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(mockApiUrl);
        if (response.ok) {
          const data = await response.json();
          setFavoriteBooks(data);
        } else {
          console.error("Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleAddToFavorites = async (book) => {
    const isFavorite = favoriteBooks.some((fav) => fav.isbn === book.isbn);
    console.log(`Detail Link ISBN: ${book.isbn}`);

    if (isFavorite) {
      // 이미 선호작에 있는 경우 제거
      try {
        const favorite = favoriteBooks.find((fav) => fav.isbn === book.isbn);
        await fetch(`${mockApiUrl}/${favorite.id}`, {
          method: "DELETE",
        });
        setFavoriteBooks((prevFavorites) =>
          prevFavorites.filter((fav) => fav.isbn !== book.isbn)
        );
        alert(`${book.prdctNm}이(가) 선호작에서 제거되었습니다.`);
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      // 선호작에 추가
      try {
        const newFavorite = {
          title: book.prdctNm,
          imageDownloadUrl: book.imageDownloadUrl,
          review: "",
          check: true,
          isbn: book.isbn,
        };

        const response = await fetch(mockApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFavorite),
        });
        if (response.ok) {
          const savedBook = await response.json();
          setFavoriteBooks((prevFavorites) => [...prevFavorites, savedBook]);
          alert(`${book.prdctNm}이(가) 선호작에 추가되었습니다.`);
        } else {
          console.error("Failed to add favorite");
        }
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
  };

  const isFavorite = (isbn) => {
    return favoriteBooks.some((fav) => fav.isbn === isbn);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {books.map((book, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="card h-100 shadow-sm">
              <img
                src={book.imageDownloadUrl || "/usagi_no_image.png"}
                alt={book.title || "이미지 없음"}
                className="card-img-top"
                onError={(e) => {
                  e.target.onerror = null; // 무한 호출 방지
                  e.target.src = "/usagi_no_image.png"; // 대체 이미지 설정
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.prdctNm}</h5>
                <p className="card-text">
                  <small className="text-muted">
                    대표(그림)작가: {book.pictrWritrNm || "정보 없음"}
                    <br />
                    대표(글)작가: {book.sntncWritrNm || "정보 없음"}
                  </small>
                </p>
                <div className="mt-auto d-flex justify-content-between">
                  <Link
                    to={`/detail/${book.isbn || encodeURIComponent(book.prdctNm)}`}
                    className="btn btn-warning btn-sm"
                  >
                    상세 보기
                  </Link>
                  <button
                    onClick={() => handleAddToFavorites(book)}
                    className={`btn btn-sm ${
                      isFavorite(book.isbn) ? "btn-outline-danger" : "btn-outline-secondary"
                    }`}
                  >
                    {isFavorite(book.isbn) ? "⭐" : "❤️"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
