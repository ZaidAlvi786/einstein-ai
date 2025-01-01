import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { Readable } from "stream";

export async function POST(req, res) {
  const data = await req.json();
  //const filename = req.query;
  const DUMMY_URL =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

    const file = data.data

  // use axios to get a Readable stream response
  const response = await fetch(`${file}`);
  if (response.ok) {
    return new Response(response.body, {
      headers: {
        ...response.headers, // copy the previous headers
        "content-type": "application/octet-stream",
        "content-disposition": `attachment; filename="aaa.png"`,
      },
    });
  }
  return new NextResponse("", { status: 404, statusText: "Image not found" });

  // res.setHeader("content-disposition", `attachment; filename="${filename}"`);
  // data.pipe(res);
}