import { applySession } from "next-iron-session";
import handler from "../../../../apiHandlers/handler";
import { client, q } from "../../../../lib/fauna";
import { NEXT_IRON_SESSION_CONFIG } from "../../../../utils/constants";

export default handler.get(async (req, res) => {
  await applySession(req, res, NEXT_IRON_SESSION_CONFIG);
  const user = (req as any).session.get("user");
  if (user.role === "admin") {
    try {
      const { data }: any = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("search_by_verified"), "pending")),
          q.Lambda("ref", q.Get(q.Var("ref")))
        )
      );
      const dataArray = data.map((data: any) => {
        data.id = data.ref.id;
        delete data.ref;
        return data;
      });
      return res.status(200).json(dataArray);
    } catch (e) {
      console.log(e);
      return res.status(422).send("Failed");
    }
  }
  return res.status(403).end("Lol, You are not admin 😇 😈 😏 ");
});