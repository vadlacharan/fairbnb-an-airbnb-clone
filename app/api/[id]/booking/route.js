import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req,{params}) {

    const ListingId = (await params).id
    const data = await req.json()
    const session = await auth()

    const checkIndate = new Date(data.checkIn)
    const checkOutdate = new Date(data.checkOut)
    

    if(!session?.user){
        return NextResponse.json({"message":"unauthorized"},{status:401})
    }

    const userId = session?.user?.id
    const guestCount = data.guestCount


    try{
        const Booking = await prisma.booking.create({
            data:{
                listingId: ListingId,
                startDate: checkIndate,
                endDate:checkOutdate,
                guestId: session?.user?.id,
                guestCount:parseInt(guestCount),
                paymentStatus:"Success",
                status:"Confirmed"                
            }
        })
    }catch(err){
        console.log(err.stack)
    }

    return NextResponse.json({"message":"HelloWorld"})
    
}