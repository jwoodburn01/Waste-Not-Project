import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Contact from "../components/contact";
import { useParams } from "react-router-dom";
function Messages() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div className="messagePage">
      <Contact id={id} />
    </div>
  );
}
export default Messages;
