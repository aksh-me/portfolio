import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllPortfolioData } from "@/lib/content-db";

export async function GET() {
  try {
    const data = await getAllPortfolioData();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are not configured yet.",
        },
        { status: 400 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || data === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing section or data payload" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("portfolio_content").upsert({
      section,
      data,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Section '${section}' updated successfully!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
