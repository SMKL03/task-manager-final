import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Kunci Supabase Hilang" }, { status: 500 });
    }

    const supabase = createClient(url, key);
    const path = `${session.user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    
    const { data, error } = await supabase.storage
      .from("attachments")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}