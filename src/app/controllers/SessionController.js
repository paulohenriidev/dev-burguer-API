import * as Yup from "yup";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().required().email(),
      password: Yup.string().required().min(8),
    });

    const isValid = await schema.isValid(req.body);
    const emailOrPasswordIncorrect = () => {
      return res.status(401).json({ error: "Make sure your email or password are correct" });
    };
    if (!isValid) {
      emailOrPasswordIncorrect();
    }

    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      emailOrPasswordIncorrect();
    }

    const isSamePassword = await user.checkPassword(password);
    if(!isSamePassword){
      emailOrPasswordIncorrect();
    }

    return res.status(201).json({ id: user.id, name: user.name, email, admin: user.admin });
  }
}

export default new SessionController();
