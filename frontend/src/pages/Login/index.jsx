import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();
   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm({
      defaultValues: { email: "vlad@gmail.com", password: "44444" },
      mode: "onChange",
   });

   const onSubmit = async (values) => {
      const data = await dispatch(fetchAuth(values));

      if (!data.payload) {
         return alert("Не вдалось авторизуватись!");
      }

      if ("token" in data.payload) {
         window.localStorage.setItem("token", data.payload.token);
      }
   };

   if (isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Вхiд в аккаунт
         </Typography>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label="E-Mail"
               type="email"
               error={Boolean(errors.email?.message)}
               helperText={errors.email?.message}
               {...register("email", { required: "Вкажiть пошту" })}
               fullWidth
            />
            <TextField
               className={styles.field}
               label="Пароль"
               type="password"
               error={Boolean(errors.password?.message)}
               helperText={errors.password?.message}
               {...register("password", { required: "Вкажiть пароль" })}
               fullWidth
            />
            <Button
               disabled={!isValid}
               type="submit"
               size="large"
               variant="contained"
               fullWidth
            >
               Увiйти
            </Button>
         </form>
      </Paper>
   );
};
