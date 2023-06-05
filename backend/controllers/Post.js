import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
   try {
      const doc = new PostModel({
         title: req.body.title,
         text: req.body.text,
         imageUrl: req.body.imageUrl,
         tags: req.body.tags.split(","),
         user: req.userId,
      });

      const post = await doc.save();

      res.json(post);
   } catch (error) {
      res.status(500).json({ message: "Не вдалось створити статтю" });
   }
};

export const getTags = async (req, res) => {
   try {
      const posts = await PostModel.find().limit(5).exec();

      const tags = posts
         .map((obj) => obj.tags)
         .flat()
         .slice(0, 5);

      res.json(tags);
   } catch (error) {
      res.status(500).json({ message: "Не вдалось отримати теги" });
   }
};

export const getAll = async (req, res) => {
   try {
      const posts = await PostModel.find().populate("user").exec();

      res.json(posts);
   } catch (error) {
      res.status(500).json({ message: "Не вдалось отримати статтi" });
   }
};

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id;

      PostModel.findOneAndUpdate(
         {
            _id: postId,
         },
         {
            $inc: { viewsCount: 1 },
         },
         {
            returnDocument: "after",
         },
         (err, doc) => {
            if (err) {
               return res
                  .status(500)
                  .json({ message: "Не вдалось повернути статтю" });
            }

            if (!doc) {
               return res.status(404).json({ message: "Статтю не знайдено" });
            }

            res.json(doc);
         }
      ).populate("user");
   } catch (error) {
      res.status(500).json({ message: "Не вдалось отримати статтi" });
   }
};

export const deletePost = async (req, res) => {
   try {
      const postId = req.params.id;

      PostModel.findOneAndDelete(
         {
            _id: postId,
         },
         (err, doc) => {
            if (err) {
               return res
                  .status(500)
                  .json({ message: "Не вдалось видалити статтю" });
            }

            if (!doc) {
               return res.status(404).json({ message: "Статтю не знайдено" });
            }

            res.json({ success: true });
         }
      );
   } catch (error) {
      res.status(500).json({ message: "Не вдалось отримати статтi" });
   }
};

export const updatePost = async (req, res) => {
   try {
      const postId = req.params.id;

      await PostModel.updateOne(
         {
            _id: postId,
         },
         {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            user: req.userId,
         }
      );

      res.json({ success: true });
   } catch (error) {
      res.status(500).json({ message: "Не вдалось обновити статтю" });
   }
};
