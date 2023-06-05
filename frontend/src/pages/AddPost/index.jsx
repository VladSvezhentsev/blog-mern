import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import axios from "../../axios";

export const AddPost = () => {
   const { id } = useParams();
   const isEditing = Boolean(id);
   const isAuth = useSelector(selectIsAuth);
   const [isLoading, setIsLoading] = useState(false);
   const [text, setText] = useState("");
   const [title, setTitle] = useState("");
   const [tags, setTags] = useState("");
   const [imageUrl, setImageUrl] = useState("");
   const inputFileRef = useRef(null);
   const navigate = useNavigate();

   const handleChangeFile = async (e) => {
      try {
         const formData = new FormData();
         const file = e.target.files[0];
         formData.append("image", file);
         const { data } = await axios.post("/upload", formData);
         setImageUrl(data.url);
      } catch (error) {
         alert("Помилка при завантаженнi файлу");
      }
   };

   const onClickRemoveImage = () => setImageUrl("");

   const onChange = useCallback((value) => {
      setText(value);
   }, []);

   const onSubmit = async () => {
      try {
         setIsLoading(true);

         const fields = { text, title, tags, imageUrl };

         const { data } = isEditing
            ? await axios.patch(`/posts/${id}`, fields)
            : await axios.post("/posts", fields);

         const _id = isEditing ? id : data._id;

         navigate(`/posts/${_id}`);
      } catch (error) {
         console.log(error);
         alert("Помилка при створеннi статтi");
      }
   };

   useEffect(() => {
      if (id) {
         axios.get(`/posts/${id}`).then(({ data }) => {
            setTitle(data.title);
            setText(data.text);
            setTags(data.tags);
            setImageUrl(data.imageUrl);
         });
      }
   }, []);

   const options = useMemo(
      () => ({
         spellChecker: false,
         maxHeight: "400px",
         autofocus: true,
         placeholder: "Введiть текст...",
         status: false,
         autosave: {
            enabled: true,
            delay: 1000,
         },
      }),
      []
   );

   if (!window.localStorage.getItem("token") && !isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <Paper style={{ padding: 30 }}>
         <Button
            variant="outlined"
            size="large"
            onClick={() => inputFileRef.current.click()}
         >
            Завантажити зображення
         </Button>
         <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
         />
         {imageUrl && (
            <>
               <Button
                  variant="contained"
                  color="error"
                  onClick={onClickRemoveImage}
               >
                  Видалити
               </Button>
               <img
                  className={styles.image}
                  src={`http://localhost:4444${imageUrl}`}
                  alt="Uploaded"
               />
            </>
         )}

         <br />
         <br />
         <TextField
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Заголовок статтi..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
         />
         <TextField
            classes={{ root: styles.tags }}
            variant="standard"
            placeholder="Теги"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
         />
         <SimpleMDE
            className={styles.editor}
            value={text}
            onChange={onChange}
            options={options}
         />
         <div className={styles.buttons}>
            <Button onClick={onSubmit} size="large" variant="contained">
               {isEditing ? "Зберегти" : "Опублiкувати"}
            </Button>
            <Link to="/">
               <Button size="large">Вiдмiнити</Button>
            </Link>
         </div>
      </Paper>
   );
};
