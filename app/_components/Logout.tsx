"use client";

import {signOut} from "next-auth/react";
import {ROUTES} from "../../configs/routs";
import {Button} from "@mui/material";

export const Logout = () => {

  return  <Button variant={'outlined'} onClick={() => signOut({ callbackUrl: ROUTES.main.path })}>выйти</Button>

};
