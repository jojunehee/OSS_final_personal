import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { isbnOrTitle } = useParams();
  const [bookDetail, setBookDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const targetUrl = isbnOrTitle.match(/^\d+$/)
          ? `/openapi/search/bookAndWebtoonList?prvKey=c9c9eeedd12fc5ce4602648e80e4a337&isbn=${isbnOrTitle}`
          : `/openapi/search/bookAndWebtoonList?prvKey=c9c9eeedd12fc5ce4602648e80e4a337&title=${encodeURIComponent(
              isbnOrTitle
            )}`;

        const response = await fetch(targetUrl);
        if (!response.ok) {
          throw new Error("데이터를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();

        if (data?.result?.resultState === "success" && data?.itemList?.length > 0) {
          setBookDetail(data.itemList[0]);
        } else {
          setError("책 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
  }, [isbnOrTitle]);

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg mx-auto" style={styles.card}>
        <div className="card-body">
          <h1 className="card-title text-center fw-bold mb-4" style={styles.title}>
            {bookDetail.title || "제목 없음"}
          </h1>
          <div className="text-center mb-4">
            <img
              src={bookDetail.imageDownloadUrl || "/usagi_no_image.png"}
              alt={bookDetail.title || "이미지 없음"}
              className="img-fluid rounded"
              style={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/usagi_no_image.png";
              }}
            />
          </div>
          <table className="table table-bordered">
            <tbody>
              {[
                ["자료 유형", "단행본"],
                ["작품명", bookDetail.prdctNm || "정보 없음"],
                ["제목", bookDetail.title || "정보 없음"],
                ["부제목", bookDetail.subtitl || "정보 없음"],
                ["그림 작가", bookDetail.pictrWritrNm || "정보 없음"],
                ["글 작가", bookDetail.sntncWritrNm || "정보 없음"],
                ["장르", bookDetail.mainGenreCdNm || "정보 없음"],
                ["줄거리", bookDetail.outline || "정보 없음"],
                ["ISBN", bookDetail.isbn || "정보 없음"],
                ["출판사", bookDetail.plscmpnIdNm || "정보 없음"],
                ["연령 등급", bookDetail.ageGradCdNm || "정보 없음"],
              ].map(([key, value], index) => (
                <tr key={index}>
                  <th className="table-primary" style={styles.headerCell}>
                    {key}
                  </th>
                  <td style={styles.cell}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    maxWidth: "900px",
    borderRadius: "10px",
    backgroundColor: "#fef9e7", // 옅은 노랑 배경
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#333",
  },
  image: {
    maxWidth: "250px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  headerCell: {
    backgroundColor: "#ffefc2", // 더 부드러운 노랑
    color: "#333",
    fontWeight: "bold",
    textAlign: "left",
    padding: "16px", // 패딩 증가
    fontSize: "18px", // 글자 크기 증가
  },
  cell: {
    border: "1px solid #ddd",
    padding: "16px", // 패딩 증가
    fontSize: "16px", // 글자 크기 증가
    color: "#555",
    lineHeight: "1.6", // 줄 간격 증가
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
    color: "red",
  },
};

export default DetailPage;
