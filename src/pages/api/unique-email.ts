import handler from "../../apiHandlers/handler";
import { getUserByIndex } from "../../lib/fauna";

export default handler.post(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(422).end();
  }
  try {
    await getUserByIndex(email, "search_by_email");
    // Email Found
    return res.status(200).json({
      msg: "Email already been taken",
    });
  } catch (e) {
    // Email Not Found
    return res.status(200).json({ msg: "Unique Email" });
  }
});
