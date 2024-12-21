import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json();

  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
  }

  const listing = {
    title: data.title,
    hostId: session?.user?.id,
  };
  await prisma.listing.create({
    data: listing,
  });

  return NextResponse.json({ listing: "succesfull" });
}

export async function GET(req, res) {
  const searchParams = req.nextUrl.searchParams;

  const start = searchParams.get("start");
  const city = searchParams.get("city");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const filters = {};

  if (city) {
    filters.city = city;
  }
  if (minPrice && maxPrice) {
    filters.price = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }
  if (checkIn && checkOut) {
    const checkIndate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    try {
      const listings = await prisma.listing.findMany({
        where: {
          city: city,
          price: { lte: parseFloat(maxPrice), gte: parseFloat(minPrice) },
          bookings: {
            none: {
              startDate: { lt: checkIndate },
              endDate: { gt: checkOutDate },
            },
          },
        },
        skip:parseInt(start),
        take:10
      });

      return NextResponse.json({ listings: listings });
    } catch (err) {
      console.log(err.stack);
    }
  }

  try {
    const listings = await prisma.listing.findMany({
      where: filters,
      skip: parseInt(start),
      take:10
    });
    return NextResponse.json({ listings: listings });
  } catch (err) {
    return NextResponse.json({ error: "error while fetching" });
  }
}
