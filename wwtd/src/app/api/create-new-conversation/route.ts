import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId: "cm4opixsl0000s04ixa3chfe0",
      },
    });
    console.log("New conversation created:", conversation);
    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}