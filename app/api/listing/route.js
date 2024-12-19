import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req,res){


    const data = await req.json()

    

    const session = await auth()

    if( !session?.user){
        return NextResponse.json({"message": "UnAuthorized"},{status: 401})
    }

    const listing = {
        title: data.title,
        hostId: session?.user?.id
    }
     await prisma.listing.create({
        data: listing
    })

    
    
    return NextResponse.json({ "listing" : "succesfull"})


}