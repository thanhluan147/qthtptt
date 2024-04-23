import { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Father({ childrend }) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  let Nav = useNavigate();

  const isTokenExpired = (token) => {
    if (!token) {
      // Nếu không có token, coi như đã hết hạn
      return true;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Giải mã phần thân của token
      const expirationTime = decodedToken.exp * 1000; // Đổi giây sang mili giây
      const currentTime = new Date().getTime();

      return currentTime > expirationTime;
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return true; // Nếu có lỗi giải mã, coi như đã hết hạn
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return Nav("/login");
    } else {
      const intervalId = setInterval(() => {
        // Gọi hàm bạn muốn thực hiện sau mỗi 5 giây ở đây
        // Sử dụng

        const storedToken = localStorage.getItem("token");
        const isExpired = isTokenExpired(storedToken);

        if (isExpired) {
          localStorage.clear();
          Nav("/login");
        }
      }, 5000);

      // Cleanup function để clear interval khi component unmount
      return () => clearInterval(intervalId);
    }
  }, []);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            {childrend}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Father;
