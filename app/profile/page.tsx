import { authConfig } from "../../configs/auth";
import { getServerSession } from "next-auth/next";
import {Hidden, Paper} from "@mui/material";
import {Profile} from "../_components/Profile/Profile";
import {Logout} from "../_components/Logout";
import {profilePaperSx} from "../../styles/styles";

type ISession = {
    user?: any
}

export default async function ProfilePage() {
  const session: ISession = await getServerSession<any>(authConfig);

  return <>
      <Profile session={session}/>
      <Hidden mdUp><Paper sx={profilePaperSx}><Logout/></Paper></Hidden>
  </>;
}

