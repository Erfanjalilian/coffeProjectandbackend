import { FC } from "react";
import Link from "next/link";

const NotFoundPage: FC = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f3e5d5",
      color: "#4b2e2e",
      fontFamily: "'Arial', sans-serif",
      textAlign: "center",
      padding: "0 20px"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>☕ صفحه آماده نیست!</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
        این صفحه توسط توسعه‌دهنده هنوز ساخته نشده. لطفا به صفحه ی قبلی برگردید
      </p>
    
    </div>
  );
};

export default NotFoundPage;
