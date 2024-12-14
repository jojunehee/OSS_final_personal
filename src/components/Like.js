import React, { useEffect, useState } from "react";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newReview, setNewReview] = useState("");
  const apiUrl = "https://67582d5860576a194d0f3163.mockapi.io/book";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setNewReview(book.review || "");
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setNewReview("");
  };

  const handleSaveReview = async () => {
    if (selectedBook) {
      try {
        const updatedBook = { ...selectedBook, review: newReview };
        const response = await fetch(`${apiUrl}/${selectedBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook),
        });

        if (response.ok) {
          const updatedBooks = books.map((book) =>
            book.id === selectedBook.id ? updatedBook : book
          );
          setBooks(updatedBooks);
          alert("리뷰가 저장되었습니다.");
          handleCloseModal();
        } else {
          alert("리뷰 저장 실패");
        }
      } catch (error) {
        console.error("Error saving review:", error);
      }
    }
  };

  const toggleFavorite = async (book) => {
    try {
      if (book.check) {
        const response = await fetch(`${apiUrl}/${book.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setBooks((prevBooks) =>
            prevBooks.filter((b) => b.id !== book.id)
          );
          alert(`${book.title}이(가) MockAPI에서 삭제되었습니다.`);
        } else {
          alert("MockAPI에서 삭제 실패");
        }
      } else {
        const updatedBook = { ...book, check: true };
        const response = await fetch(`${apiUrl}/${book.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook),
        });

        if (response.ok) {
          const updatedBooks = books.map((b) =>
            b.id === book.id ? updatedBook : b
          );
          setBooks(updatedBooks);
          alert(`${book.title}이(가) 선호작에 등록되었습니다.`);
        } else {
          alert("선호작 등록 실패");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold">선호작 모음</h1>
      <div className="d-flex flex-column gap-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="d-flex p-3 border rounded shadow-sm"
          >
            {/* 이미지 */}
            <img
              src={book.imageDownloadUrl || "/usagi_no_image.png"}
              alt={book.title || "이미지 없음"}
              className="me-3 rounded"
              style={{ width: "150px", height: "auto" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/usagi_no_image.png";
              }}
            />

            {/* 내용 및 버튼 */}
            <div className="d-flex flex-column flex-grow-1">
              <h5 className="fw-bold">{book.title}</h5>
              <p className="text-muted mb-3">{book.review || "리뷰 없음"}</p>
              <div className="mt-auto d-flex justify-content-end gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleOpenModal(book)}
                >
                  수정하기
                </button>
                <button
                  className={`btn btn-sm ${
                    book.check ? "btn-danger" : "btn-success"
                  }`}
                  onClick={() => toggleFavorite(book)}
                >
                  {book.check ? "삭제" : "등록"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {selectedBook && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedBook.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="리뷰를 입력하세요..."
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleSaveReview}
                >
                  저장
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPage;
