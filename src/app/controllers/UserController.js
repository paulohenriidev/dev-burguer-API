import User from "../models/User";
import { v4 } from "uuid";
import * as Yup from "yup";

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required().min(3),
      email: Yup.string().required().email(),
      password: Yup.string().min(8).required(),
      admin: Yup.boolean(),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { name, email, password, admin } = req.body;
    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });

    return res.status(201).json({
      id: user.id,
      name,
      email,
      admin,
    });
  }
}

export default new UserController();
