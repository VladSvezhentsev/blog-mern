import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import styles from "./Header.module.scss";

export const Header = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();

   const onClickLogout = () => {
      if (window.confirm("Ви справдi хочете вийти?")) {
         dispatch(logout());
         window.localStorage.removeItem("token");
      }
   };

   return (
      <div className={styles.root}>
         <Container maxWidth="lg">
            <div className={styles.inner}>
               <Link className={styles.logo} to="/">
                  <div>React Blog</div>
               </Link>
               <div className={styles.buttons}>
                  {isAuth ? (
                     <>
                        <Link to="/add-post">
                           <Button variant="contained">Написати статтю</Button>
                        </Link>
                        <Button
                           onClick={onClickLogout}
                           variant="contained"
                           color="error"
                        >
                           Вийти
                        </Button>
                     </>
                  ) : (
                     <>
                        <Link to="/login">
                           <Button variant="outlined">Увiйти</Button>
                        </Link>
                        <Link to="/register">
                           <Button variant="contained">Створити аккаунт</Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
};
