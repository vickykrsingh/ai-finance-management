"use client";

import React, { useState } from "react";
import { Drawer,DrawerTrigger,DrawerContent,DrawerHeader,DrawerTitle } from "./ui/drawer";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { accountSchema } from "@/app/lib/schema";
function CreateAccountDrawer({children}) {
    const [open,setOpen] = useState(false);
    useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false
        }
    })

  return (
    <Drawer open={open} onOpenChange={setOpen} >
      <DrawerTrigger asChild >{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div>
            <form>

            </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateAccountDrawer;
