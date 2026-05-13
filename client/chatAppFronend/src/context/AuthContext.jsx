import { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 add this

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("FRONTEND USER 👉", JSON.parse(localStorage.getItem("user")));
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);