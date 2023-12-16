import { authConfig } from "../../configs/auth";
import { getServerSession } from "next-auth/next";

type ISession = {
    user?: any
}

export default async function Profile() {
  const session: ISession = await getServerSession<any>(authConfig);

  return (
    <div>
      <h1>Profile of {session?.user?.name || session?.user?.nickname}</h1>
    </div>
  );
}
